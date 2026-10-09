import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 25));
    const region = searchParams.get('region'); // EU, NA, etc.
    const search = searchParams.get('search')?.trim();

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (region && region !== 'all') {
      where.region = region;
    }
    
    if (search) {
      where.OR = [
        { discordUsername: { contains: search, mode: 'insensitive' } },
        { riotGameName: { contains: search, mode: 'insensitive' } },
        { riotTagLine: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [players, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { rating: 'desc' },
        skip,
        take: limit,
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
        },
      }),
      prisma.user.count({ where }),
    ]);

    const playersWithRank = players.map((player, index) => ({
      ...player,
      rank: skip + index + 1,
    }));

    return NextResponse.json({
      players: playersWithRank,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}