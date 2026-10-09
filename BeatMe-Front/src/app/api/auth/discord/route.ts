import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { buildOAuthUrl } from "@/lib/discord";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");

  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, 
    path: "/",
  });

  const url = buildOAuthUrl(state);
  return NextResponse.redirect(url);
}