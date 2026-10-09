import { REST, Routes } from "discord.js";
import { config } from "./config";
import * as playCommand from "./commands/play";
import * as profileCommand from "./commands/profile";
import * as leaderboardCommand from "./commands/leaderboard";

const commands = [
  playCommand.data.toJSON(),
  profileCommand.data.toJSON(),
  leaderboardCommand.data.toJSON(),
];

const rest = new REST().setToken(config.discord.token);

(async () => {
  try {
    console.log(`🔄 Registering ${commands.length} slash commands...`);

    await rest.put(
      Routes.applicationGuildCommands(
        config.discord.applicationId,
        config.discord.guildId
      ),
      { body: commands }
    );

    console.log("✅ Successfully registered slash commands!");
    console.log("   Commands: /play, /profile, /leaderboard");
  } catch (error) {
    console.error("❌ Failed to register commands:", error);
    process.exit(1);
  }
})();