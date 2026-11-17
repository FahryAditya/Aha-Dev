import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import { prisma } from "../prisma.js";

export const ordersCommand = {
  data: new SlashCommandBuilder()
    .setName("orders")
    .setDescription("Menampilkan daftar pesanan website terbaru di Aha Dev")
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("Filter berdasarkan status order")
        .setRequired(false)
        .addChoices(
          { name: "PENDING", value: "PENDING" },
          { name: "UNDER_REVIEW", value: "UNDER_REVIEW" },
          { name: "ACCEPTED", value: "ACCEPTED" },
          { name: "IN_PROGRESS", value: "IN_PROGRESS" },
          { name: "COMPLETED", value: "COMPLETED" },
          { name: "REJECTED", value: "REJECTED" }
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const statusFilter = interaction.options.getString("status") as any;

    try {
      const orders = await prisma.order.findMany({
        where: statusFilter ? { status: statusFilter } : undefined,
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      if (orders.length === 0) {
        await interaction.editReply({
          content: statusFilter
            ? `Tidak ada order dengan status **${statusFilter}**.`
            : "Belum ada order website di database.",
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle("📋 DAFTAR PESANAN WEBSITE — AHA DEV")
        .setColor(0xd91e36)
        .setDescription(
          orders
            .map(
              (o, i) =>
                `**${i + 1}. \`${o.orderNumber}\`** — ${o.clientName}\n• Jenis: \`${
                  o.websiteType
                }\` | Status: **${o.status}**\n• Diajukan: <t:${Math.floor(
                  o.createdAt.getTime() / 1000
                )}:R>`
            )
            .join("\n\n")
        )
        .setFooter({ text: "Gunakan /order [id] untuk melihat detail spesifik" });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply({
        content: `❌ Gagal mengambil daftar order: ${(err as Error).message}`,
      });
    }
  },
};
