import {
  Client,
  GatewayIntentBits,
  Events,
  Interaction,
  ChatInputCommandInteraction,
  ButtonInteraction,
} from "discord.js";
import { config } from "./config";
import { prisma } from "./lib/prisma";

import * as playCommand from "./commands/play";
import * as profileCommand from "./commands/profile";
import * as leaderboardCommand from "./commands/leaderboard";

import { handleMatchButton } from "./interactions/match-buttons";

// ============================================
// إنشاء العميل
// ============================================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ============================================
// خريطة الأوامر
// ============================================
const commands = {
  play: playCommand,
  profile: profileCommand,
  leaderboard: leaderboardCommand,
};

// ============================================
// حدث: البوت جاهز
// ============================================
client.once(Events.ClientReady, (c) => {
  console.log("=".repeat(50));
  console.log(`✅ BeatMe Bot is online!`);
  console.log(`   Logged in as: ${c.user.tag}`);
  console.log(`   ID: ${c.user.id}`);
  console.log(`   Guilds: ${c.guilds.cache.size}`);
  console.log(`   Environment: ${config.nodeEnv}`);
  console.log("=".repeat(50));
});

// ============================================
// حدث: التفاعلات
// ============================================
client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  try {
    // ---- Slash Commands ----
    if (interaction.isChatInputCommand()) {
      return handleChatCommand(interaction);
    }

    // ---- Buttons ----
    if (interaction.isButton()) {
      return handleButton(interaction);
    }
  } catch (error) {
    console.error("❌ Interaction error:", error);

    // محاولة الرد بأمان
    if (interaction.isRepliable() && !interaction.replied) {
      await interaction
        .reply({
          content: "❌ Something went wrong. Please try again.",
          ephemeral: true,
        })
        .catch(() => null);
    }
  }
});

// ============================================
// معالج Slash Commands
// ============================================
async function handleChatCommand(interaction: ChatInputCommandInteraction) {
  const command = commands[interaction.commandName as keyof typeof commands];

  if (!command) {
    return interaction.reply({
      content: "❌ Unknown command.",
      ephemeral: true,
    });
  }

  await command.execute(interaction);
}

// ============================================
// معالج الأزرار
// ============================================
async function handleButton(interaction: ButtonInteraction) {
  // كل الأزرار تبدأ بـ "match_"
  if (interaction.customId.startsWith("match_")) {
    return handleMatchButton(interaction);
  }
}

// ============================================
// بدء التشغيل
// ============================================
async function start() {
  try {
    // تحقق من الاتصال بقاعدة البيانات
    await prisma.$connect();
    console.log("✅ Database connected");

    // ابدأ البوت
    await client.login(config.discord.token);
  } catch (error) {
    console.error("❌ Failed to start bot:", error);
    process.exit(1);
  }
}

// ============================================
// إغلاق نظيف
// ============================================
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down...");
  await prisma.$disconnect();
  client.destroy();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down...");
  await prisma.$disconnect();
  client.destroy();
  process.exit(0);
});

// ============================================
// تشغيل
// ============================================
start();