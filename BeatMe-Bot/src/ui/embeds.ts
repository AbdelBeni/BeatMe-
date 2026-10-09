import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { config } from "../config";

// الألوان الموحّدة
export const COLORS = {
  primary: 0x0fc4c1,   // تركواز (نفس الموقع)
  success: 0x00e5a0,   // أخضر
  danger: 0xff1644,    // أحمر
  warning: 0xffaa00,   // برتقالي
  neutral: 0x1a1d23,   // رمادي داكن
};

/**
 * Embed التحدي (يُنشر في #matches)
 */
export function buildChallengeEmbed(data: {
  matchId: number;
  challengerName: string;
  challengerRating: number;
  opponentName: string;
  opponentRating: number;
}) {
  return new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(`⚔️ Challenge #${data.matchId}`)
    .setDescription(
      `**${data.challengerName}** has challenged **${data.opponentName}**!\n\n` +
      `Waiting for **${data.opponentName}** to respond...`
    )
    .addFields(
      {
        name: "🎯 Challenger",
        value: `${data.challengerName}\n\`${data.challengerRating} PR\``,
        inline: true,
      },
      {
        name: "🛡️ Opponent",
        value: `${data.opponentName}\n\`${data.opponentRating} PR\``,
        inline: true,
      },
      {
        name: "⏱️ Expires in",
        value: "5 minutes",
        inline: false,
      }
    )
    .setFooter({ text: "BeatMe • Competitive Matchmaking" })
    .setTimestamp();
}

/**
 * أزرار القبول والرفض
 */
export function buildAcceptDeclineButtons(matchId: number) {
  const accept = new ButtonBuilder()
    .setCustomId(`match_accept:${matchId}`)
    .setLabel("Accept")
    .setStyle(ButtonStyle.Success)
    .setEmoji("✅");

  const decline = new ButtonBuilder()
    .setCustomId(`match_decline:${matchId}`)
    .setLabel("Decline")
    .setStyle(ButtonStyle.Danger)
    .setEmoji("❌");

  return new ActionRowBuilder<ButtonBuilder>().addComponents(accept, decline);
}

/**
 * أزرار تحديد الفائز (للمشرفين فقط)
 */
export function buildRefereeButtons(
  matchId: number,
  player1Name: string,
  player2Name: string
) {
  const p1Wins = new ButtonBuilder()
    .setCustomId(`match_winner:${matchId}:p1`)
    .setLabel(`${player1Name} wins`)
    .setStyle(ButtonStyle.Primary)
    .setEmoji("🏆");

  const p2Wins = new ButtonBuilder()
    .setCustomId(`match_winner:${matchId}:p2`)
    .setLabel(`${player2Name} wins`)
    .setStyle(ButtonStyle.Primary)
    .setEmoji("🏆");

  return new ActionRowBuilder<ButtonBuilder>().addComponents(p1Wins, p2Wins);
}

/**
 * Embed المباراة الجارية (يُثبَّت في قناة المباراة)
 */
export function buildActiveMatchEmbed(data: {
  matchId: number;
  player1Name: string;
  player1Rating: number;
  player2Name: string;
  player2Rating: number;
  startedAt: Date;
}) {
  return new EmbedBuilder()
    .setColor(COLORS.warning)
    .setTitle(`🎮 MATCH #${data.matchId} — LIVE`)
    .setDescription(
      "**Match in progress**\nUse the buttons below to declare the winner (referees only)."
    )
    .addFields(
      {
        name: "🟢 Player 1",
        value: `**${data.player1Name}**\n\`${data.player1Rating} PR\``,
        inline: true,
      },
      {
        name: "🔴 Player 2",
        value: `**${data.player2Name}**\n\`${data.player2Rating} PR\``,
        inline: true,
      },
      {
        name: "⏱️ Started",
        value: `<t:${Math.floor(data.startedAt.getTime() / 1000)}:R>`,
        inline: false,
      }
    )
    .setFooter({ text: `Match #${data.matchId} • Awaiting referee decision` })
    .setTimestamp();
}

/**
 * Embed نهاية المباراة
 */
export function buildCompletedMatchEmbed(data: {
  matchId: number;
  winnerName: string;
  loserName: string;
  winnerOldRating: number;
  winnerNewRating: number;
  winnerGained: number;
  loserOldRating: number;
  loserNewRating: number;
  loserLost: number;
}) {
  return new EmbedBuilder()
    .setColor(COLORS.success)
    .setTitle(`🏆 MATCH #${data.matchId} — COMPLETED`)
    .setDescription(`**${data.winnerName}** wins!`)
    .addFields(
      {
        name: "🏆 Winner",
        value:
          `**${data.winnerName}**\n` +
          `\`${data.winnerOldRating} PR\` → \`${data.winnerNewRating} PR\`\n` +
          `**+${data.winnerGained}**`,
        inline: true,
      },
      {
        name: "💔 Loser",
        value:
          `**${data.loserName}**\n` +
          `\`${data.loserOldRating} PR\` → \`${data.loserNewRating} PR\`\n` +
          `**-${data.loserLost}**`,
        inline: true,
      }
    )
    .setFooter({ text: `Refereed • BeatMe` })
    .setTimestamp();
}

/**
 * Embed التوجيه للموقع (للـ /profile و /leaderboard)
 */
export function buildRedirectEmbed(
  title: string,
  description: string
) {
  return new EmbedBuilder()
    .setColor(COLORS.primary)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: "BeatMe • Competitive Valorant" });
}

/**
 * زر فتح الموقع
 */
export function buildWebsiteButton(label: string, path: string = "/") {
  const button = new ButtonBuilder()
    .setLabel(label)
    .setStyle(ButtonStyle.Link)
    .setURL(`${config.websiteUrl}${path}`)
    .setEmoji("🔗");

  return new ActionRowBuilder<ButtonBuilder>().addComponents(button);
}