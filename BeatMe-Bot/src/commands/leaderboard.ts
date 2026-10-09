import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { buildRedirectEmbed, buildWebsiteButton } from "../ui/embeds";

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("View the BeatMe leaderboard on the website");

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = buildRedirectEmbed(
    "🏆 BeatMe Leaderboard",
    "See the top players, their ratings, and full rankings on our website.\n\n" +
      "**Click the button below to view the leaderboard.**"
  );

  return interaction.reply({
    embeds: [embed],
    components: [buildWebsiteButton("View Leaderboard", "/")],
    ephemeral: true,
  });
}