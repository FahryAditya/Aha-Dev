import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { FullOrderSubmission } from "@/lib/validation";
import { generateOrderNumber } from "@/lib/validation";

export interface StoredOrder {
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
  status: "PENDING" | "UNDER_REVIEW" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
  statusHistory?: Array<{
    id: string;
    newStatus: string;
    previousStatus: string | null;
    changedBy: string;
    note?: string | null;
    createdAt: Date;
  }>;
}

// In-memory store fallback when PostgreSQL is not yet connected
const memoryOrderStore = new Map<string, StoredOrder>();

// Prepopulate demo order for testing the tracker immediately
const demoOrderNumber = "AHA-2026-DEMO";
memoryOrderStore.set(demoOrderNumber, {
  id: "demo-uuid-001",
  orderNumber: demoOrderNumber,
  clientName: "Rian Pratama",
  email: "rian@example.com",
  contact: "+6281234567890",
  discordUsername: "rian_tech",
  clientType: "Business Owner",
  organizationName: "Nusantara Logistics",
  projectName: "Nusantara Freight Portal",
  websiteType: "Web Application",
  websiteGoal: "Membangun portal pelacakan kargo multi-cabang dengan visual interaktif dan notifikasi otomatis.",
  targetAudience: "B2B client logistik dan tim operasional internal.",
  problemToSolve: "Sistem lama serba manual dan klien sering komplain keterlambatan status update.",
  projectDescription: "Aplikasi web modern dengan dashboard analitik, pelacakan resi instan, dan integrasi WhatsApp / Discord webhook.",
  features: {
    requiresLogin: "Yes",
    requiresAdminDashboard: "Yes",
    requiresDatabase: "Yes",
    requiresPaymentGateway: "No",
    requiresApiIntegration: "Yes",
    techReference: "Next.js, Tailwind CSS, PostgreSQL",
    extraFeatures: "Multi-role RBAC, Export PDF manifest",
  },
  projectExpectations: {
    expectedOutcome: "Desain brutalist pop-art modern, load time sub-second, mudah dipahami tim operasional.",
    primaryPriority: "User Experience",
    designReference: "Queen of Hearts Tactical Comic",
    designStyle: "Futuristic",
    specialRequirements: "PWA support dan dark mode default",
    futureScaling: "Yes",
    notesToDeveloper: "Mohon prioritas estimasi timeline secepatnya.",
  },
  status: "UNDER_REVIEW",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
  updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  statusHistory: [
    {
      id: "hist-1",
      previousStatus: null,
      newStatus: "PENDING",
      changedBy: "system",
      note: "Permintaan website baru diterima melalui situs Aha Dev.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    },
    {
      id: "hist-2",
      previousStatus: "PENDING",
      newStatus: "UNDER_REVIEW",
      changedBy: "Aha Dev Lead",
      note: "Spesifikasi proyek sedang ditinjau oleh developer teknis.",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  ],
});

export async function createOrder(data: FullOrderSubmission): Promise<StoredOrder> {
  const orderNumber = generateOrderNumber();
  const now = new Date();

  const orderData: StoredOrder = {
    id: crypto.randomUUID(),
    orderNumber,
    clientName: data.clientName,
    email: data.email,
    contact: data.contact,
    discordUsername: data.discordUsername || null,
    clientType: data.clientType,
    organizationName: data.organizationName || null,
    projectName: data.projectName,
    websiteType: data.websiteType,
    websiteGoal: data.websiteGoal,
    targetAudience: data.targetAudience,
    problemToSolve: data.problemToSolve,
    projectDescription: data.projectDescription,
    features: data.features as Record<string, unknown>,
    projectExpectations: data.projectExpectations as Record<string, unknown>,
    status: "PENDING",
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      {
        id: crypto.randomUUID(),
        previousStatus: null,
        newStatus: "PENDING",
        changedBy: "system",
        note: "Permintaan website diterima dan masuk ke antrean notifikasi developer.",
        createdAt: now,
      },
    ],
  };

  // Always store in memory cache for instant access
  memoryOrderStore.set(orderNumber, orderData);

  // Attempt database write if PostgreSQL is available
  try {
    const created = await prisma.order.create({
      data: {
        id: orderData.id,
        orderNumber: orderData.orderNumber,
        clientName: orderData.clientName,
        email: orderData.email,
        contact: orderData.contact,
        discordUsername: orderData.discordUsername,
        clientType: orderData.clientType,
        organizationName: orderData.organizationName,
        projectName: orderData.projectName,
        websiteType: orderData.websiteType,
        websiteGoal: orderData.websiteGoal,
        targetAudience: orderData.targetAudience,
        problemToSolve: orderData.problemToSolve,
        projectDescription: orderData.projectDescription,
        features: orderData.features as unknown as Prisma.InputJsonValue,
        projectExpectations: orderData.projectExpectations as unknown as Prisma.InputJsonValue,
        status: "PENDING",
        notifications: {
          create: {
            deliveryStatus: "PENDING",
            retryCount: 0,
          },
        },
        statusHistory: {
          create: {
            previousStatus: null,
            newStatus: "PENDING",
            changedBy: "system",
            note: "Permintaan website baru diterima.",
          },
        },
      },
    });
    return {
      ...orderData,
      id: created.id,
    };
  } catch (error) {
    console.warn("[OrdersService] Database connection unready or offline, stored in memory cache:", error);
    return orderData;
  }
}

export async function findOrderByQuery(query: string): Promise<StoredOrder | null> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return null;

  // 1. Check in-memory store first
  const memoryMatch = Array.from(memoryOrderStore.values()).find(
    (o) =>
      o.orderNumber.toLowerCase() === cleanQuery.toLowerCase() ||
      o.email.toLowerCase() === cleanQuery.toLowerCase() ||
      o.contact.replace(/\D/g, "") === cleanQuery.replace(/\D/g, "")
  );

  if (memoryMatch) return memoryMatch;

  // 2. Query Prisma if available
  try {
    const dbOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: cleanQuery, mode: "insensitive" } },
          { email: { equals: cleanQuery, mode: "insensitive" } },
          { contact: { contains: cleanQuery } },
        ],
      },
      include: {
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (dbOrder) {
      return {
        ...dbOrder,
        features: dbOrder.features as Record<string, unknown>,
        projectExpectations: dbOrder.projectExpectations as Record<string, unknown>,
        statusHistory: dbOrder.statusHistory.map((h) => ({
          id: h.id,
          previousStatus: h.previousStatus,
          newStatus: h.newStatus,
          changedBy: h.changedBy,
          note: h.note,
          createdAt: h.createdAt,
        })),
      };
    }
  } catch (error) {
    console.warn("[OrdersService] Database lookup error, fallback to memory:", error);
  }

  return null;
}
