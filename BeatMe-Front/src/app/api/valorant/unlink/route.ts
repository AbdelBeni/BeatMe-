import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: payload.userId },
    data: {
      riotPuuid: null,
      riotGameName: null,
      riotTagLine: null,
      riotTier: null,
      riotTierIcon: null,
      riotRegion: null,
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
}