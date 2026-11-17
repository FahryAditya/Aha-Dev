import {
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { prisma } from "../prisma.js";
import { config } from "../config.js";

export async function handleButtonInteraction(interaction: ButtonInteraction) {
  const { customId, user } = interaction;

  // Authorization check (if developerUserId is configured)
  if (
    config.discord.developerUserId &&
    user.id !== config.discord.developerUserId
  ) {
    await interaction.reply({
      content: "⛔ Anda tidak memiliki otoritas developer untuk mengubah status order ini.",
      ephemeral: true,
    });
    return;
  }

  // 1. ACCEPT ORDER
  if (customId.startsWith("btn_accept_")) {
    const orderId = customId.replace("btn_accept_", "");
    await interaction.deferUpdate();

    try {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "ACCEPTED",
          statusHistory: {
            create: {
              previousStatus: "PENDING",
              newStatus: "ACCEPTED",
              changedBy: `${user.tag} (Discord ID: ${user.id})`,
              note: "Order telah disetujui dan diterima oleh developer melalui Discord.",
            },
          },
        },
      });

      // Update original embed
      const oldEmbed = interaction.message.embeds[0];
      const newEmbed = EmbedBuilder.from(oldEmbed)
        .setColor(0x10b981) // Emerald Green
        .setDescription(
          `**Nomor Order:** \`${updatedOrder.orderNumber}\`\n**Status:** 🟢 **ACCEPTED**\n**Diterima Oleh:** <@${user.id}> pada <t:${Math.floor(
            Date.now() / 1000
          )}:R>`
        );

      const resolvedRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("btn_status_done")
          .setLabel(`Diterima oleh @${user.username}`)
          .setStyle(ButtonStyle.Success)
          .setDisabled(true)
          .setEmoji("✅")
      );

      await interaction.editReply({
        embeds: [newEmbed],
        components: [resolvedRow],
      });

      await interaction.followUp({
        content: `🎉 **Order Diterima!** Pesanan \`${updatedOrder.orderNumber}\` resmi berstatus **ACCEPTED**. Klien dapat melihat pembaruan ini langsung di portal pelacakan website.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("[ButtonHandler] Error accepting order:", error);
      await interaction.followUp({
        content: `❌ Gagal memperbarui order di database: ${(error as Error).message}`,
        ephemeral: true,
      });
    }
    return;
  }

  // 2. REVIEW ORDER
  if (customId.startsWith("btn_review_")) {
    const orderId = customId.replace("btn_review_", "");
    await interaction.deferUpdate();

    try {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "UNDER_REVIEW",
          statusHistory: {
            create: {
              newStatus: "UNDER_REVIEW",
              changedBy: `${user.tag} (Discord ID: ${user.id})`,
              note: "Order ditandai sedang ditinjau spesifikasinya oleh developer.",
            },
          },
        },
      });

      const oldEmbed = interaction.message.embeds[0];
      const newEmbed = EmbedBuilder.from(oldEmbed)
        .setColor(0x00e5ff) // Cyan
        .setDescription(
          `**Nomor Order:** \`${updatedOrder.orderNumber}\`\n**Status:** 🔍 **UNDER REVIEW**\n**Sedang Ditinjau Oleh:** <@${user.id}>`
        );

      await interaction.editReply({
        embeds: [newEmbed],
      });

      await interaction.followUp({
        content: `🔍 Status order \`${updatedOrder.orderNumber}\` kini ditandai **UNDER REVIEW**.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("[ButtonHandler] Error marking review:", error);
      await interaction.followUp({
        content: `❌ Gagal memperbarui status order: ${(error as Error).message}`,
        ephemeral: true,
      });
    }
    return;
  }

  // 3. REJECT ORDER -> Show Modal for Reason
  if (customId.startsWith("btn_reject_")) {
    const orderId = customId.replace("btn_reject_", "");

    const modal = new ModalBuilder()
      .setCustomId(`modal_reject_${orderId}`)
      .setTitle("Alasan Penolakan Order");

    const reasonInput = new TextInputBuilder()
      .setCustomId("reject_reason")
      .setLabel("Mengapa order ini ditolak?")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Contoh: Jadwal pengerjaan penuh untuk bulan ini / Scope belum sesuai kapasitas...")
      .setMinLength(5)
      .setMaxLength(500)
      .setRequired(true);

    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
    return;
  }
}
