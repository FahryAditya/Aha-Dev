import { Client, TextChannel } from "discord.js";
import { prisma } from "./prisma.js";
import { config } from "./config.js";
import { createOrderEmbed, createOrderActionButtons, OrderData } from "./embed.js";

let isPolling = false;

export async function processNotificationQueue(client: Client) {
  if (isPolling) return;
  isPolling = true;

  try {
    // Find pending notifications
    const pendingNotifications = await prisma.orderNotification.findMany({
      where: {
        deliveryStatus: "PENDING",
        retryCount: { lt: 5 },
      },
      include: {
        order: true,
      },
      take: 10,
    });

    if (pendingNotifications.length === 0) {
      isPolling = false;
      return;
    }

    console.log(
      `[Poller] Ditemukan ${pendingNotifications.length} antrean notifikasi baru.`
    );

    for (const item of pendingNotifications) {
      const order = item.order;
      if (!order) continue;

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
      const actionRow = createOrderActionButtons(order.id);

      try {
        let sentMessage;

        // Option 1: Send to Dedicated Channel if configured
        if (config.discord.channelId) {
          const channel = (await client.channels.fetch(
            config.discord.channelId
          )) as TextChannel | null;
          if (channel && channel.isTextBased()) {
            sentMessage = await channel.send({
              embeds: [embed],
              components: [actionRow],
            });
          }
        }

        // Option 2: Fallback to Direct Message (DM) to Developer
        if (!sentMessage && config.discord.developerUserId) {
          const devUser = await client.users.fetch(config.discord.developerUserId);
          if (devUser) {
            sentMessage = await devUser.send({
              embeds: [embed],
              components: [actionRow],
            });
          }
        }

        if (sentMessage) {
          await prisma.orderNotification.update({
            where: { id: item.id },
            data: {
              deliveryStatus: "SENT",
              discordMessageId: sentMessage.id,
              lastError: null,
            },
          });
          console.log(
            `[Poller] ✅ Notifikasi pesanan ${order.orderNumber} berhasil dikirim ke Discord! (Msg ID: ${sentMessage.id})`
          );
        } else {
          throw new Error(
            "Tidak dapat menemukan channel atau akun developer untuk mengirim notifikasi."
          );
        }
      } catch (err: unknown) {
        const errorMsg = (err as Error).message || String(err);
        console.error(
          `[Poller] ❌ Gagal mengirim notifikasi pesanan ${order.orderNumber}:`,
          errorMsg
        );

        await prisma.orderNotification.update({
          where: { id: item.id },
          data: {
            retryCount: { increment: 1 },
            lastError: errorMsg,
          },
        });
      }
    }
  } catch (err) {
    console.error("[Poller] Error memeriksa antrean notifikasi:", err);
  } finally {
    isPolling = false;
  }
}

export function startNotificationPoller(client: Client) {
  console.log(
    `[Poller] Antrean notifikasi aktif dengan interval ${config.pollIntervalMs}ms.`
  );
  // Initial check
  processNotificationQueue(client);

  // Periodic interval
  setInterval(() => {
    processNotificationQueue(client);
  }, config.pollIntervalMs);
}
