import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { prisma } from "../lib/prisma";
import { buildRedirectEmbed, buildWebsiteButton } from "../ui/embeds";

export const data = new SlashCommandBuilder()
  .setName("profile")
  .setDescription("View your BeatMe profile on the website");

export async function execute(interaction: ChatInputCommandInteraction) {
  const user = await prisma.user.findUnique({
    where: { discordId: interaction.user.id },
    select: { id: true },
  });

  if (!user) {
    // المستخدم غير مسجل — نوجهه للتسجيل
    const embed = buildRedirectEmbed(
      "👤 Not Registered",
      "You need to register on our website first to have a BeatMe profile.\n\n" +
        "**Click the button below to get started.**"
    );
    return interaction.reply({
      embeds: [embed],
      components: [buildWebsiteButton("Register on BeatMe", "/")],
      ephemeral: true,
    });
  }

  // المستخدم مسجل — نوجهه لصفحته
  const embed = buildRedirectEmbed(
    "👤 Your BeatMe Profile",
    "View your full profile, stats, match history, and more on our website.\n\n" +
      "**Click the button below to view your profile.**"
  );

  return interaction.reply({
    embeds: [embed],
    components: [buildWebsiteButton("View Profile", `/player/${user.id}`)],
    ephemeral: true,
  });
}