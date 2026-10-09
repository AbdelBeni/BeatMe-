import { prisma } from "../lib/prisma";
import { applyElo } from "./elo";

/**
 * إنشاء تحدي جديد (pending)
 */
export async function createChallenge(
  challengerDiscordId: string,
  opponentDiscordId: string
) {
  const challenger = await prisma.user.findUnique({
    where: { discordId: challengerDiscordId },
  });

  const opponent = await prisma.user.findUnique({
    where: { discordId: opponentDiscordId },
  });

  if (!challenger || !opponent) {
    throw new Error("Player not found");
  }

  return prisma.match.create({
    data: {
      player1Id: challenger.id,
      player2Id: opponent.id,
      status: "pending",
    },
    include: {
      player1: true,
      player2: true,
    },
  });
}

/**
 * قبول التحدي — تحويل الحالة إلى active
 */
export async function acceptChallenge(matchId: number) {
  return prisma.match.update({
    where: { id: matchId },
    data: { status: "active" },
    include: {
      player1: true,
      player2: true,
    },
  });
}

/**
 * رفض/إلغاء التحدي
 */
export async function cancelChallenge(matchId: number) {
  return prisma.match.update({
    where: { id: matchId },
    data: { status: "cancelled" },
  });
}

export interface CompleteMatchInput {
  matchId: number;
  winnerDiscordId: string;
  refereeDiscordId: string;
}

export interface CompleteMatchResult {
  match: any;
  winner: { username: string; oldRating: number; newRating: number; gained: number };
  loser: { username: string; oldRating: number; newRating: number; lost: number };
}

/**
 * إتمام مباراة — تحديث النقاط + wins/losses + سجل النقاط
 * هذه العملية ذرية (transaction)
 */
export async function completeMatch(
  input: CompleteMatchInput
): Promise<CompleteMatchResult> {
  const { matchId, winnerDiscordId, refereeDiscordId } = input;

  return prisma.$transaction(async (tx) => {
    // 1. جلب المباراة مع اللاعبين
    const match = await tx.match.findUnique({
      where: { id: matchId },
      include: { player1: true, player2: true },
    });

    if (!match) throw new Error("Match not found");
    if (match.status === "completed") throw new Error("Match already completed");
    if (match.status !== "active")
      throw new Error(`Cannot complete match with status: ${match.status}`);

    // 2. تحديد الفائز والخاسر
    const winner = match.player1.discordId === winnerDiscordId
      ? match.player1
      : match.player2.discordId === winnerDiscordId
      ? match.player2
      : null;

    if (!winner) throw new Error("Winner is not part of this match");

    const loser = winner.id === match.player1Id ? match.player2 : match.player1;

    // 3. حساب Elo
    const winnerTotalMatches = winner.wins + winner.losses;
    const elo = applyElo(winner.rating, loser.rating, winnerTotalMatches);

    // 4. تحديث الفائز
    await tx.user.update({
      where: { id: winner.id },
      data: {
        rating: elo.winnerNewRating,
        wins: { increment: 1 },
      },
    });

    // 5. تحديث الخاسر
    await tx.user.update({
      where: { id: loser.id },
      data: {
        rating: elo.loserNewRating,
        losses: { increment: 1 },
      },
    });

    // 6. تحديث المباراة
    const updatedMatch = await tx.match.update({
      where: { id: matchId },
      data: {
        status: "completed",
        winnerId: winner.id,
        refereeDiscordId,
        pointsDelta: elo.winnerGains,
        completedAt: new Date(),
      },
      include: { player1: true, player2: true },
    });

    // 7. سجل النقاط للفائز والخاسر
    await tx.pointHistory.createMany({
      data: [
        {
          userId: winner.id,
          matchId: matchId,
          delta: elo.winnerGains,
          reason: "match_win",
        },
        {
          userId: loser.id,
          matchId: matchId,
          delta: -elo.loserLoses,
          reason: "match_loss",
        },
      ],
    });

    return {
      match: updatedMatch,
      winner: {
        username: winner.discordUsername,
        oldRating: winner.rating,
        newRating: elo.winnerNewRating,
        gained: elo.winnerGains,
      },
      loser: {
        username: loser.discordUsername,
        oldRating: loser.rating,
        newRating: elo.loserNewRating,
        lost: elo.loserLoses,
      },
    };
  });
}

/**
 * حفظ معلومات Discord للقناة المؤقتة والرسالة
 */
export async function saveDiscordContext(
  matchId: number,
  channelId: string,
  messageId: string
) {
  return prisma.match.update({
    where: { id: matchId },
    data: {
      discordChannelId: channelId,
      discordMessageId: messageId,
    },
  });
}