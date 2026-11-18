import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export interface OrderData {
  id: string;
  orderNumber: string;
  clientName: string;
  email: string;
  contact: string;
  discordUsername?: string | null;
  clientType: string;
  organizationName?: string | null;
  projectName: string;
  websiteType: string;
  websiteGoal: string;
  targetAudience: string;
  problemToSolve: string;
  projectDescription: string;
  features: Record<string, unknown>;
  projectExpectations: Record<string, unknown>;
  status: string;
  createdAt: Date;
}

export function createOrderEmbed(order: OrderData) {
  const feat = order.features || {};
  const exp = order.projectExpectations || {};

  const techSummary = [
    `• Login/Auth: **${feat.requiresLogin || "No"}**`,
    `• Admin Panel: **${feat.requiresAdminDashboard || "No"}**`,
    `• Database: **${feat.requiresDatabase || "No"}**`,
    `• Payment Gateway: **${feat.requiresPaymentGateway || "No"}**`,
    `• API Integration: **${feat.requiresApiIntegration || "No"}**`,
  ].join("\n");

  const embed = new EmbedBuilder()
    .setTitle(`👑 AHA DEV — PERMINTAAN WEBSITE BARU`)
    .setDescription(
      `**Nomor Order:** \`${order.orderNumber}\`\n**Status:** 🟡 **${order.status}**\n**Waktu Pengiriman:** <t:${Math.floor(
        order.createdAt.getTime() / 1000,
      )}:F>`,
    )
    .setColor(0xd91e36) // Queen of Hearts Crimson
    .addFields(
      {
        name: "👤 Informasi Klien",
        value: [
          `**Nama:** ${order.clientName}`,
          `**Email:** ${order.email}`,
          `**WhatsApp:** [${order.contact}](https://wa.me/${order.contact.replace(/\D/g, "")})`,
          `**Discord:** ${order.discordUsername ? `\`@${order.discordUsername}\`` : "*-*"}`,
          `**Kategori:** ${order.clientType}${
            order.organizationName ? ` (${order.organizationName})` : ""
          }`,
        ].join("\n"),
        inline: false,
      },
      {
        name: "🌐 Gambaran Proyek",
        value: [
          `**Nama Proyek:** ${order.projectName}`,
          `**Jenis Website:** \`${order.websiteType}\``,
          `**Tujuan:** ${order.websiteGoal}`,
          `**Target Pengguna:** ${order.targetAudience}`,
        ].join("\n"),
        inline: false,
      },
      {
        name: "🎯 Masalah yang Ingin Diselesaikan",
        value: order.problemToSolve || "*-*",
        inline: false,
      },
      {
        name: "📝 Deskripsi Proyek",
        value:
          order.projectDescription.length > 500
            ? `${order.projectDescription.substring(0, 497)}...`
            : order.projectDescription,
        inline: false,
      },
      {
        name: "⚡ Fitur & Kebutuhan Teknis",
        value: techSummary,
        inline: true,
      },

      {
        name: "🎨 Ekspektasi & Desain",
        value: [
          `**Gaya:** \`${exp.designStyle || "Modern"}\``,
          `**Prioritas:** \`${exp.primaryPriority || "Functionality"}\``,
          `**Scaling:** \`${exp.futureScaling || "Yes"}\``,
          exp.designReference ? `**Ref URL:** ${exp.designReference}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
        inline: true,
      },
    )
    .setFooter({
      text: "Aha Dev Website Order Management System",
    })
    .setTimestamp(order.createdAt);

  if (exp.notesToDeveloper) {
    embed.addFields({
      name: "💬 Catatan Khusus untuk Developer",
      value: String(exp.notesToDeveloper),
      inline: false,
    });
  }

  return embed;
}

export function createOrderActionButtons(orderId: string, disabled = false) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`btn_accept_${orderId}`)
      .setLabel("Accept Order")

      .setStyle(ButtonStyle.Success)
      .setEmoji("✅")

      .setDisabled(disabled),

    new ButtonBuilder()

      .setCustomId(`btn_review_${orderId}`)

      .setLabel("Review Order")

      .setStyle(ButtonStyle.Primary)

      .setEmoji("🔍")

      .setDisabled(disabled),

    new ButtonBuilder()

      .setCustomId(`btn_reject_${orderId}`)
      .setLabel("Reject Order")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("❌")
      .setDisabled(disabled),
  );
}
