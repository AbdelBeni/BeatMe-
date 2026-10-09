import {
  ButtonInteraction,
  ChannelType,
  PermissionFlagsBits,
  TextChannel,
} from "discord.js";
import { config } from "../config";
import { prisma } from "../lib/prisma";
import {
  acceptChallenge,
  cancelChallenge,
  completeMatch,
} from "../services/match-service";
import {
  buildActiveMatchEmbed,
  buildRefereeButtons,
  buildCompletedMatchEmbed,
} from "../ui/embeds";

/**
 * نقطة الدخول الموحّدة — تُستدعى من index.ts
 */
export async function handleMatchButton(interaction: ButtonInteraction) {
  const [action, ...args] = interaction.customId.split(":");

  switch (action) {
    case "match_accept":
      return handleAccept(interaction, Number(args[0]));
    case "match_decline":
      return handleDecline(interaction, Number(args[0]));
    case "match_winner":
      return handleWinner(interaction, Number(args[0]), args[1]);
  }
}

// ============================================
// القبول
// ============================================
async function handleAccept(interaction: ButtonInteraction, matchId: number) {
  await interaction.deferUpdate();

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { player1: true, player2: true },
  });

  if (!match) {
    return interaction.followUp({
      content: "❌ Match not found.",
      ephemeral: true,
    });
  }

  if (match.status !== "pending") {
    return interaction.followUp({
      content: `❌ This match is already ${match.status}.`,
      ephemeral: true,
    });
  }

  // التحقق أن الضاغط هو الخصم (player2)
  if (interaction.user.id !== match.player2.discordId) {
    return interaction.followUp({
      content: "❌ Only the challenged player can accept.",
      ephemeral: true,
    });
  }

  // قبول المباراة
  await acceptChallenge(matchId);

  // إنشاء قناة مؤقتة
  const guild = interaction.guild;
  if (!guild) return;

  const channelName = `match-${matchId}-${sanitize(match.player1.discordUsername)}-vs-${sanitize(match.player2.discordUsername)}`;
  const tempChannel = await guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: match.player1.discordId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: match.player2.discordId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: config.discord.refereeRoleId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageMessages,
        ],
      },
    ],
  });

  // نشر embed المباراة مع أزرار المشرفين
  const matchEmbed = buildActiveMatchEmbed({
    matchId,
    player1Name: match.player1.discordUsername,
    player1Rating: match.player1.rating,
    player2Name: match.player2.discordUsername,
    player2Rating: match.player2.rating,
    startedAt: new Date(),
  });

  const refereeButtons = buildRefereeButtons(
    matchId,
    match.player1.discordUsername,
    match.player2.discordUsername
  );

  const matchMessage = await tempChannel.send({
    content:
      `<@${match.player1.discordId}> vs <@${match.player2.discordId}>\n` +
      `Referees: <@&${config.discord.refereeRoleId}>`,
    embeds: [matchEmbed],
    components: [refereeButtons],
  });

  await matchMessage.pin().catch(() => null);

  // حفظ معلومات القناة الجديدة
  await prisma.match.update({
    where: { id: matchId },
    data: {
      discordChannelId: tempChannel.id,
      discordMessageId: matchMessage.id,
    },
  });

  // تحديث الرسالة الأصلية في #matches
  await interaction.editReply({
    content: `✅ Challenge accepted! Match channel created: <#${tempChannel.id}>`,
    embeds: [],
    components: [],
  });
}

// ============================================
// الرفض
// ============================================
async function handleDecline(interaction: ButtonInteraction, matchId: number) {
  await interaction.deferUpdate();

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { player1: true, player2: true },
  });

  if (!match || match.status !== "pending") {
    return interaction.followUp({
      content: "❌ This challenge is no longer available.",
      ephemeral: true,
    });
  }

  // التحقق أن الضاغط هو الخصم
  if (interaction.user.id !== match.player2.discordId) {
    return interaction.followUp({
      content: "❌ Only the challenged player can decline.",
      ephemeral: true,
    });
  }

  await cancelChallenge(matchId);

  await interaction.editReply({
    content: `❌ **${match.player2.discordUsername}** declined the challenge.`,
    embeds: [],
    components: [],
  });
}

// ============================================
// تحديد الفائز (للمشرفين فقط)
// ============================================
async function handleWinner(
  interaction: ButtonInteraction,
  matchId: number,
  side: string
) {
  // فحص أن التفاعل في سيرفر
  if (!interaction.inGuild()) {
    return interaction.reply({
      content: "❌ This action can only be used in the server.",
      ephemeral: true,
    });
  }

  const member = interaction.member;
  if (!member) {
    return interaction.reply({
      content: "❌ Could not identify your member data.",
      ephemeral: true,
    });
  }

  // استخراج الرولات — قد تكون GuildMemberRoleManager أو string[]
  const roles = member.roles;
  const hasRefereeRole = Array.isArray(roles)
    ? roles.includes(config.discord.refereeRoleId)
    : roles.cache.has(config.discord.refereeRoleId);

  if (!hasRefereeRole) {
    return interaction.reply({
      content: "❌ Only referees can declare the winner.",
      ephemeral: true,
    });
  }

  await interaction.deferUpdate();

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { player1: true, player2: true },
  });

  if (!match) {
    return interaction.followUp({
      content: "❌ Match not found.",
      ephemeral: true,
    });
  }

  if (match.status !== "active") {
    return interaction.followUp({
      content: `❌ This match is already ${match.status}.`,
      ephemeral: true,
    });
  }

  // تحديد الفائز
  const winnerUser = side === "p1" ? match.player1 : match.player2;
  const winnerDiscordId = winnerUser.discordId;

  const result = await completeMatch({
    matchId,
    winnerDiscordId,
    refereeDiscordId: interaction.user.id,
  });

  // تحديث الرسالة في القناة
  const completedEmbed = buildCompletedMatchEmbed({
    matchId,
    winnerName: result.winner.username,
    loserName: result.loser.username,
    winnerOldRating: result.winner.oldRating,
    winnerNewRating: result.winner.newRating,
    winnerGained: result.winner.gained,
    loserOldRating: result.loser.oldRating,
    loserNewRating: result.loser.newRating,
    loserLost: result.loser.lost,
  });

  await interaction.editReply({
    content: `Referee <@${interaction.user.id}> declared the winner.`,
    embeds: [completedEmbed],
    components: [],
  });

  // جدولة حذف القناة بعد ساعة
  const channel = interaction.channel;
  if (channel && channel.type === ChannelType.GuildText) {
    const textChannel = channel as TextChannel;
    setTimeout(async () => {
      await textChannel
        .delete("Match completed — auto-cleanup after 1 hour")
        .catch(() => null);
    }, 60 * 60 * 1000);
  }

  // إشعار في #matches
  try {
    const matchesChannel = await interaction.client.channels
      .fetch(config.discord.matchesChannelId)
      .catch(() => null);

    if (
      matchesChannel &&
      matchesChannel.isTextBased() &&
      !matchesChannel.isDMBased()
    ) {
      await matchesChannel.send({
        content:
          `🏆 **Match #${matchId}** — **${result.winner.username}** defeated **${result.loser.username}** ` +
          `(+${result.winner.gained} / -${result.loser.lost} PR)`,
      });
    }
  } catch {
    // تجاهل الأخطاء — ليست حرجة
  }
}

/**
 * تنظيف اسم القناة (Discord يقبل فقط أحرف معينة)
 */
function sanitize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15) || "player";
}