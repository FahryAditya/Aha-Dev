import {
  ModalSubmitInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { prisma } from "../prisma.js";

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
  const { customId, user } = interaction;

  if (customId.startsWith("modal_reject_")) {
    const orderId = customId.replace("modal_reject_", "");
    const reason = interaction.fields.getTextInputValue("reject_reason");

    await interaction.deferUpdate();

    try {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "REJECTED",
          statusHistory: {
            create: {
              newStatus: "REJECTED",
              changedBy: `${user.tag} (Discord ID: ${user.id})`,
              note: `Alasan penolakan: ${reason}`,
            },
          },
        },
      });

      if (interaction.message) {
        const oldEmbed = interaction.message.embeds[0];
        const newEmbed = EmbedBuilder.from(oldEmbed)
          .setColor(0x8c0f22) // Dark Crimson
          .setDescription(
            `**Nomor Order:** \`${updatedOrder.orderNumber}\`\n**Status:** ❌ **REJECTED**\n**Ditolak Oleh:** <@${user.id}>\n**Alasan Penolakan:** *"${reason}"*`
          );

        const resolvedRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("btn_status_rejected")
            .setLabel(`Ditolak oleh @${user.username}`)
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
            .setEmoji("❌")
        );

        await interaction.editReply({
          embeds: [newEmbed],
          components: [resolvedRow],
        });
      }

      await interaction.followUp({
        content: `❌ Order \`${updatedOrder.orderNumber}\` resmi **DITOLAK**. Alasan telah tercatat dalam riwayat database.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("[ModalHandler] Error rejecting order:", error);
      await interaction.followUp({
        content: `❌ Gagal menolak order di database: ${(error as Error).message}`,
        ephemeral: true,
      });
    }
  }
}
