import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import {
  fetchValorantAccount,
  fetchValorantMMR,
  ValorantNotFoundError,
} from "@/lib/valorant";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const gameName = String(body.gameName || "").trim();
    const tagLine = String(body.tagLine || "").trim();

    if (!gameName || !tagLine) {
      return NextResponse.json(
        { error: "Game name and tag line are required" },
        { status: 400 }
      );
    }

    let account;
    try {
      account = await fetchValorantAccount(gameName, tagLine);
    } catch (err) {
      if (err instanceof ValorantNotFoundError) {
        return NextResponse.json(
          { error: "Account not found. Check your Riot ID." },
          { status: 404 }
        );
      }
      throw err;
    }

    const existingLink = await prisma.user.findFirst({
      where: {
        riotPuuid: account.puuid,
        NOT: { id: payload.userId },
      },
    });

    if (existingLink) {
      return NextResponse.json(
        { error: "This Valorant account is already linked to another user" },
        { status: 409 }
      );
    }

    let mmr = null;
    try {
      mmr = await fetchValorantMMR(
        account.region.toLowerCase(),
        account.name,
        account.tag
      );
    } catch (err) {
      console.warn("Could not fetch MMR:", err);
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        riotPuuid: account.puuid,
        riotGameName: account.name,
        riotTagLine: account.tag,
        riotTier: mmr?.currenttierpatched || null,
        riotTierIcon: mmr?.images?.large || null,
        riotRegion: account.region.toUpperCase(),
      },
      select: {
        id: true,
        discordId: true,
        discordUsername: true,
        discordAvatar: true,
        riotGameName: true,
        riotTagLine: true,
        riotTier: true,
        riotTierIcon: true,
        riotRegion: true,
        rating: true,
        wins: true,
        losses: true,
        region: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error("Link error:", err);
    return NextResponse.json(
      { error: "Could not link account. Please try again." },
      { status: 500 }
    );
  }
}