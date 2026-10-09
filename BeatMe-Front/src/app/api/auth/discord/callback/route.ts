import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForToken, fetchDiscordUser, addUserToGuild } from "@/lib/discord";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("oauth_state")?.value;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  if (error) {
    return NextResponse.redirect(`${appUrl}/?error=access_denied`);
  }

  if (!state || state !== savedState) {
    return NextResponse.redirect(`${appUrl}/?error=invalid_state`);
  }

  cookieStore.delete("oauth_state");

  if (!code) {
    return NextResponse.redirect(`${appUrl}/?error=no_code`);
  }

  try {
    const tokenData = await exchangeCodeForToken(code);

    const discordUser = await fetchDiscordUser(tokenData.access_token);

    try {
      await addUserToGuild(discordUser.id, tokenData.access_token);
    } catch (err) {
      console.warn("Guild join failed:", err);
    }

    const user = await prisma.user.upsert({
      where: { discordId: discordUser.id },
      update: {
        discordUsername: discordUser.global_name || discordUser.username,
        discordAvatar: discordUser.avatar,
      },
      create: {
        discordId: discordUser.id,
        discordUsername: discordUser.global_name || discordUser.username,
        discordAvatar: discordUser.avatar,
        rating: 1000,
        wins: 0,
        losses: 0,
        region: "EU",
      },
    });

    const token = await signToken({
      userId: user.id,
      discordId: user.discordId,
    });

    const response = NextResponse.redirect(`${appUrl}/`);
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("OAuth error:", err);
    return NextResponse.redirect(`${appUrl}/?error=oauth_failed`);
  }
}