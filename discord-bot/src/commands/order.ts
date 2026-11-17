import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { prisma } from "../prisma.js";
import { createOrderEmbed, createOrderActionButtons, OrderData } from "../embed.js";

export const orderDetailCommand = {
  data: new SlashCommandBuilder()
    .setName("order")
    .setDescription("Melihat detail pesanan website berdasarkan Nomor Order atau ID")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Nomor Order (e.g. AHA-2026-X8F2) atau ID")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const query = interaction.options.getString("query", true).trim();

    try {
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { orderNumber: { equals: query, mode: "insensitive" } },
            { id: query },
          ],
        },
      });

      if (!order) {
        await interaction.editReply({
          content: `❌ Order dengan pencarian \`${query}\` tidak ditemukan.`,
        });
        return;
      }

      const orderData: OrderData = {
        id: order.id,
        orderNumber: order.orderNumber,
        clientName: order.clientName,
        email: order.email,
        contact: order.contact,
        discordUsername: order.discordUsername,
        clientType: order.clientType,
        organizationName: order.organizationName,
        projectName: order.projectName,
        websiteType: order.websiteType,
        websiteGoal: order.websiteGoal,
        targetAudience: order.targetAudience,
        problemToSolve: order.problemToSolve,
        projectDescription: order.projectDescription,
        features: (order.features as Record<string, unknown>) || {},
        projectExpectations:
          (order.projectExpectations as Record<string, unknown>) || {},
        status: order.status,
        createdAt: order.createdAt,
      };

      const embed = createOrderEmbed(orderData);
      const isResolved =
        order.status === "ACCEPTED" || order.status === "REJECTED";
      const actionRow = createOrderActionButtons(order.id, isResolved);

      await interaction.editReply({
        embeds: [embed],
        components: [actionRow],
      });
    } catch (err) {
      await interaction.editReply({
        content: `❌ Terjadi kesalahan mengambil detail order: ${(err as Error).message}`,
      });
    }
  },
};
