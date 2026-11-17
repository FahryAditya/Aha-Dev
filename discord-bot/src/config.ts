import "dotenv/config";

export const config = {
  discord: {
    token: process.env.DISCORD_BOT_TOKEN || "",
    clientId: process.env.DISCORD_CLIENT_ID || "",
    developerUserId: process.env.DEVELOPER_USER_ID || "",
    channelId: process.env.DISCORD_CHANNEL_ID || "",
  },
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/postgres?schema=public",
  pollIntervalMs: parseInt(process.env.POLL_INTERVAL_MS || "5000", 10),
};

export function validateConfig() {
  const missing: string[] = [];
  if (!config.discord.token) missing.push("DISCORD_BOT_TOKEN");
  if (!config.discord.clientId) missing.push("DISCORD_CLIENT_ID");
  if (!config.discord.developerUserId && !config.discord.channelId) {
    missing.push("DEVELOPER_USER_ID (atau DISCORD_CHANNEL_ID)");
  }

  if (missing.length > 0) {
    console.warn(
      `[Config] Peringatan: Variabel berikut belum diisi pada .env:\n  - ${missing.join("\n  - ")}\nBot dapat berjalan dalam mode standby atau menunggu kredensial dikonfigurasi.`
    );
  }
}
