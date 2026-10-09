import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  User as DiscordUser,
} from "discord.js";
import { config } from "../config";
import { checkPlayerRegistered, canChallenge } from "../services/anti-cheat";
import { createChallenge } from "../services/match-service";
import { buildChallengeEmbed, buildAcceptDeclineButtons } from "../ui/embeds";
import { prisma } from "../lib/prisma";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Challenge another player to a 1v1 match")
  .addUserOption((option) =>
    option
      .setName("opponent")
      .setDescription("The player you want to challenge")
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const challengerDiscordId = interaction.user.id;
  const opponent = interaction.options.getUser("opponent", true) as DiscordUser;

  // لا يمكن تحدي البوتات
  if (opponent.bot) {
    return interaction.reply({
      content: "❌ You cannot challenge a bot.",
      ephemeral: true,
    });
  }

  // لا يمكن تحدي نفسك
  if (opponent.id === challengerDiscordId) {
    return interaction.reply({
      content: "❌ You cannot challenge yourself.",
      ephemeral: true,
    });
  }

  // تأخير الرد (لأننا سنستعلم من DB)
  await interaction.deferReply({ ephemeral: true });

  // 1. فحص المُتحدي
  const challengerCheck = await checkPlayerRegistered(challengerDiscordId);
  if ("error" in challengerCheck) {
    return interaction.editReply({ content: challengerCheck.error });
  }
  const challenger = challengerCheck.user;

  // 2. فحص الخصم
  const opponentCheck = await checkPlayerRegistered(opponent.id);
  if ("error" in opponentCheck) {
    return interaction.editReply({
      content: `❌ ${opponent.username} hasn't registered or linked Valorant yet.`,
    });
  }
  const opponentUser = opponentCheck.user;

  // 3. فحص anti-cheat
  const antiCheat = await canChallenge(challenger.id, opponentUser.id);
  if (!antiCheat.allowed) {
    return interaction.editReply({ content: antiCheat.reason! });
  }

  // 4. إنشاء التحدي في DB
  const match = await createChallenge(challengerDiscordId, opponent.id);

  // 5. نشر الرسالة في #matches
  const channel = await interaction.client.channels
  .fetch(config.discord.matchesChannelId)
  .catch(() => null);

  if (
    !channel ||
    !channel.isTextBased() ||
    channel.isDMBased()
  ) {
    await prisma.match.delete({ where: { id: match.id } });
    return interaction.editReply({
      content: "❌ Could not find the matches channel. Please contact an admin.",
    });
  }

  const embed = buildChallengeEmbed({
    matchId: match.id,
    challengerName: challenger.discordUsername,
    challengerRating: challenger.rating,
    opponentName: opponentUser.discordUsername,
    opponentRating: opponentUser.rating,
  });

  const buttons = buildAcceptDeclineButtons(match.id);

  const message = await channel.send({
    content: `<@${opponent.id}> — you have a challenge!`,
    embeds: [embed],
    components: [buttons],
  });

  // 6. حفظ معلومات الرسالة في DB
  await prisma.match.update({
    where: { id: match.id },
    data: {
      discordChannelId: channel.id,
      discordMessageId: message.id,
    },
  });

  // 7. رد على المستخدم
  await interaction.editReply({
    content: `✅ Challenge sent! Waiting for ${opponent.username} to respond.`,
  });
}