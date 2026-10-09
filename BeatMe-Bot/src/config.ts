import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (!value || !value.trim()) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value.trim();
}

export const config = {
  discord: {
    token: required("DISCORD_TOKEN"),
    applicationId: required("DISCORD_APPLICATION_ID"),
    guildId: required("DISCORD_GUILD_ID"),
    refereeRoleId: required("DISCORD_REFEREE_ROLE_ID"),
    matchesChannelId: required("DISCORD_MATCHES_CHANNEL_ID"),
  },
  websiteUrl: process.env.WEBSITE_URL || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV !== "production",
};