import { prisma } from "../lib/prisma";

/**
 * نتيجة فحص anti-cheat
 */
export interface AntiCheatResult {
  allowed: boolean;
  reason?: string;
}

// إعدادات القواعد
const RULES = {
  /** عدد التحديات المُرسَلة المسموح بها في الساعة */
  MAX_SENT_PER_HOUR: 3,
  /** عدد التحديات المُستقبَلة المسموح بها في الساعة */
  MAX_RECEIVED_PER_HOUR: 10,
  /** عدد المباريات ضد نفس الخصم في اليوم */
  MAX_VS_SAME_OPPONENT_PER_DAY: 2,
  /** مهلة إعادة تحدي نفس الخصم بعد الرفض (بالدقائق) */
  REJECTION_COOLDOWN_MINUTES: 60,
};

/**
 * فحص إذا كان اللاعب مسجلاً وربط Valorant
 */
export async function checkPlayerRegistered(
  discordId: string
): Promise<{ user: any } | { error: string }> {
  const user = await prisma.user.findUnique({
    where: { discordId },
  });

  if (!user) {
    return {
      error:
        "❌ You need to register on our website first.\n" +
        `👉 ${process.env.WEBSITE_URL || "http://localhost:3000"}`,
    };
  }

  if (!user.riotGameName || !user.riotTagLine) {
    return {
      error:
        "❌ You need to link your Valorant account first.\n" +
        `👉 ${process.env.WEBSITE_URL || "http://localhost:3000"}`,
    };
  }

  return { user };
}

/**
 * فحص مكافحة الغش الكامل
 */
export async function canChallenge(
  challengerId: number,
  opponentId: number
): Promise<AntiCheatResult> {
  if (challengerId === opponentId) {
    return { allowed: false, reason: "❌ You cannot challenge yourself." };
  }

  // 1. فحص التحديات المُرسَلة في الساعة الأخيرة
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const sentThisHour = await prisma.match.count({
    where: {
      player1Id: challengerId,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (sentThisHour >= RULES.MAX_SENT_PER_HOUR) {
    return {
      allowed: false,
      reason: `⏱️ You've reached the limit of ${RULES.MAX_SENT_PER_HOUR} challenges per hour. Try again later.`,
    };
  }

  // 2. فحص التحديات المُستقبَلة في الساعة الأخيرة
  const receivedThisHour = await prisma.match.count({
    where: {
      player2Id: challengerId,
      createdAt: { gte: oneHourAgo },
    },
  });

  if (receivedThisHour >= RULES.MAX_RECEIVED_PER_HOUR) {
    return {
      allowed: false,
      reason: `⏱️ You've received too many challenges this hour. Try again later.`,
    };
  }

  // 3. فحص عدد المباريات ضد نفس الخصم اليوم
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const vsOpponentToday = await prisma.match.count({
    where: {
      createdAt: { gte: startOfDay },
      OR: [
        { player1Id: challengerId, player2Id: opponentId },
        { player1Id: opponentId, player2Id: challengerId },
      ],
    },
  });

  if (vsOpponentToday >= RULES.MAX_VS_SAME_OPPONENT_PER_DAY) {
    return {
      allowed: false,
      reason: `🚫 You've already played ${RULES.MAX_VS_SAME_OPPONENT_PER_DAY} matches against this opponent today.`,
    };
  }

  // 4. فحص إذا كان هناك تحدي قائم بالفعل بينهما
  const pendingMatch = await prisma.match.findFirst({
    where: {
      status: { in: ["pending", "active"] },
      OR: [
        { player1Id: challengerId, player2Id: opponentId },
        { player1Id: opponentId, player2Id: challengerId },
      ],
    },
  });

  if (pendingMatch) {
    return {
      allowed: false,
      reason: "⚠️ There's already a pending or active match with this player.",
    };
  }

  // 5. فحص إذا رفض نفس الخصم خلال الساعة الأخيرة
  const oneHourAgoReject = new Date(
    Date.now() - RULES.REJECTION_COOLDOWN_MINUTES * 60 * 1000
  );
  const recentRejection = await prisma.match.findFirst({
    where: {
      player1Id: challengerId,
      player2Id: opponentId,
      status: "cancelled",
      createdAt: { gte: oneHourAgoReject },
    },
  });

  if (recentRejection) {
    return {
      allowed: false,
      reason: `🚫 This player recently declined your challenge. Please wait ${RULES.REJECTION_COOLDOWN_MINUTES} minutes before trying again.`,
    };
  }

  return { allowed: true };
}