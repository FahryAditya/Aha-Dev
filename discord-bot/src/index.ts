import {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  Interaction,
} from "discord.js";
import { config, validateConfig } from "./config.js";
import { registerSlashCommands } from "./commands/register.js";
import { ordersCommand } from "./commands/orders.js";
import { orderDetailCommand } from "./commands/order.js";
import { handleButtonInteraction } from "./handlers/buttonHandler.js";
import { handleModalSubmit } from "./handlers/modalHandler.js";
import { startNotificationPoller } from "./poller.js";

validateConfig();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`\n======================================================`);
  console.log(`👑 AHA DEV DISCORD BOT ONLINE // LOGIN: ${readyClient.user.tag}`);
  console.log(`======================================================\n`);

  // Register commands
  await registerSlashCommands();

  // Start notification queue poller
  startNotificationPoller(readyClient);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  try {
    // 1. Slash Commands
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "orders") {
        await ordersCommand.execute(interaction);
      } else if (interaction.commandName === "order") {
        await orderDetailCommand.execute(interaction);
      }
      return;
    }

    // 2. Button Interactions (Accept / Review / Reject)
    if (interaction.isButton()) {
      await handleButtonInteraction(interaction);
      return;
    }

    // 3. Modal Submission (Reject Reason)
    if (interaction.isModalSubmit()) {
      await handleModalSubmit(interaction);
      return;
    }
  } catch (error) {
    console.error("[Events] Error menangani interaksi:", error);
  }
});

// Start Bot
if (config.discord.token) {
  client.login(config.discord.token).catch((err) => {
    console.error("[Discord] Gagal login ke Discord:", err.message);
  });
} else {
  console.log(
    "[Discord] ⚠️ Token bot belum diisi di .env. Silakan isi DISCORD_BOT_TOKEN untuk menghubungkan bot."
  );
}

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n[Discord] Mematikan bot...");
  client.destroy();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n[Discord] Mematikan bot...");
  client.destroy();
  process.exit(0);
});
