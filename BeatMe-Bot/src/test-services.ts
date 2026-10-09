import { applyElo, getStageInfo, getPlayerStage } from "./services/elo";

function testCase(
  winnerRating: number,
  loserRating: number,
  winnerMatches: number,
  name: string
) {
  const result = applyElo(winnerRating, loserRating, winnerMatches);
  const stage = getStageInfo(result.winnerStage);

  console.log(`\n${name}`);
  console.log(`   Stage: ${stage.emoji} ${stage.label} (${winnerMatches} matches)`);
  console.log(`   Winner: ${winnerRating} → ${result.winnerNewRating} (+${result.winnerGains})`);
  console.log(`   Loser:  ${loserRating} → ${result.loserNewRating} (-${result.loserLoses})`);
}

async function main() {
  console.log("🧪 Testing Elo System\n");
  console.log("=".repeat(50));

  // المرحلة 1: Placement
  console.log("\n🟢 PLACEMENT STAGE (0-9 matches)\n");

  testCase(0, 0, 0, "New vs New");
  testCase(0, 0, 5, "New (5 matches) vs New");
  testCase(0, 0, 9, "New (9 matches) vs New");
  testCase(0, 1000, 0, "New (0 PR) vs Experienced (1000 PR)");

  // المرحلة 2: Calibration
  console.log("\n\n🟡 CALIBRATION STAGE (10-29 matches)\n");

  testCase(250, 250, 10, "Calibrating vs Calibrating");
  testCase(500, 500, 20, "Equal at 500");
  testCase(500, 1000, 15, "Underdog wins");

  // المرحلة 3: Established
  console.log("\n\n🔴 ESTABLISHED STAGE (30+ matches)\n");

  testCase(1000, 1000, 30, "Established vs Established");
  testCase(1000, 1000, 100, "Veteran vs Veteran");
  testCase(1500, 500, 50, "Strong wins vs Weak");
  testCase(500, 1500, 50, "Weak beats Strong");

  console.log("\n" + "=".repeat(50));
  console.log("\n✅ Test complete\n");
}

main().catch(console.error);