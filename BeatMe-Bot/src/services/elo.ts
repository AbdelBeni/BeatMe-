/**
 * نظام Elo مع K متغير حسب خبرة اللاعب
 * 
 * 3 مراحل:
 * - Placement (0-9 مباريات): K = 48 — تصنيف سريع
 * - Calibration (10-29 مباراة): K = 32 — تثبيت
 * - Established (30+ مباراة): K = 20 — استقرار
 */

export type PlayerStage = "placement" | "calibration" | "established";

interface KConfig {
  K: number;
  minChange: number;
  maxChange: number;
}

/**
 * إعدادات كل مرحلة
 */
const STAGES: Record<PlayerStage, KConfig> = {
  placement: {
    K: 48,
    minChange: 5,
    maxChange: 60,
  },
  calibration: {
    K: 32,
    minChange: 5,
    maxChange: 40,
  },
  established: {
    K: 20,
    minChange: 5,
    maxChange: 25,
  },
};

/**
 * تحديد مرحلة اللاعب بناءً على عدد مبارياته الكلية
 */
export function getPlayerStage(totalMatches: number): PlayerStage {
  if (totalMatches < 10) return "placement";
  if (totalMatches < 30) return "calibration";
  return "established";
}

/**
 * احتمالية فوز A على B (0 إلى 1)
 */
export function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * حساب النقاط التي يكسبها الفائز
 * K يُحدَّد بناءً على مرحلة **الفائز** (عدد مبارياته)
 */
export function calculatePoints(
  winnerRating: number,
  loserRating: number,
  winnerTotalMatches: number
): number {
  const stage = getPlayerStage(winnerTotalMatches);
  const { K, minChange, maxChange } = STAGES[stage];

  const expected = expectedScore(winnerRating, loserRating);
  const rawChange = K * (1 - expected);

  const clamped = Math.min(maxChange, Math.max(minChange, rawChange));
  return Math.round(clamped);
}

export interface EloResult {
  winnerGains: number;
  loserLoses: number;
  winnerNewRating: number;
  loserNewRating: number;
  winnerStage: PlayerStage;
}

/**
 * حساب النتيجة الكاملة لمباراة
 * 
 * @param winnerRating النقاط الحالية للفائز
 * @param loserRating النقاط الحالية للخاسر
 * @param winnerTotalMatches عدد مباريات الفائز الكلية (wins + losses)
 */
export function applyElo(
  winnerRating: number,
  loserRating: number,
  winnerTotalMatches: number
): EloResult {
  const winnerGains = calculatePoints(
    winnerRating,
    loserRating,
    winnerTotalMatches
  );

  // الفائز يكسب
  const winnerNewRating = winnerRating + winnerGains;

  // الخاسر يخسر (لكن ليس تحت 0)
  const loserLoses = Math.min(winnerGains, loserRating);
  const loserNewRating = loserRating - loserLoses;

  return {
    winnerGains,
    loserLoses,
    winnerNewRating,
    loserNewRating,
    winnerStage: getPlayerStage(winnerTotalMatches),
  };
}

/**
 * معلومات مفيدة للعرض
 */
export function getStageInfo(stage: PlayerStage): {
  label: string;
  emoji: string;
  description: string;
} {
  switch (stage) {
    case "placement":
      return {
        label: "Placement",
        emoji: "🟢",
        description: "New player — rating adjusts quickly",
      };
    case "calibration":
      return {
        label: "Calibration",
        emoji: "🟡",
        description: "Rating stabilizing",
      };
    case "established":
      return {
        label: "Established",
        emoji: "🔴",
        description: "Stable rating",
      };
  }
}