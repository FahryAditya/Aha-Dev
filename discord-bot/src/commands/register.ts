import { REST, Routes } from "discord.js";
import { config } from "../config.js";
import { ordersCommand } from "./orders.js";
import { orderDetailCommand } from "./order.js";

const commands = [ordersCommand.data.toJSON(), orderDetailCommand.data.toJSON()];

export async function registerSlashCommands() {
  if (!config.discord.token || !config.discord.clientId) {
    console.warn(
      "[Commands] Lewati registrasi slash commands karena token / client ID belum diisi."
    );
    return;
  }

  const rest = new REST({ version: "10" }).setToken(config.discord.token);

  try {
    console.log("[Commands] Memulai pendaftaran global slash commands...");
    await rest.put(Routes.applicationCommands(config.discord.clientId), {
      body: commands,
    });
    console.log("[Commands] ✅ Slash commands (/orders, /order) berhasil didaftarkan!");
  } catch (error) {
    console.error("[Commands] ❌ Gagal mendaftarkan slash commands:", error);
  }
}
