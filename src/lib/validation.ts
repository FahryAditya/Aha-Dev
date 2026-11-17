import { z } from "zod";

export const clientStatusOptions = [
  "Personal / Individual",
  "Business Owner",
  "Organization / Community",
  "School / Education",
  "Other",
] as const;

export const websiteTypeOptions = [
  "Company Profile",
  "Personal Portfolio",
  "Landing Page",
  "E-Commerce",
  "School Website",
  "Community Website",
  "Web Application",
  "Admin Dashboard",
  "Custom Website",
] as const;

export const technicalRequirementOptions = ["Yes", "No", "Not Sure"] as const;

export const designStyleOptions = [
  "Minimalist",
  "Modern",
  "Professional",
  "Elegant",
  "Creative",
  "Futuristic",
  "Corporate",
  "Custom",
] as const;

export const primaryPriorityOptions = [
  "User Experience",
  "Visual Design",
  "Performance",
  "SEO",
  "Security",
  "Functionality",
  "Scalability",
] as const;

// STEP 1: Client Information Schema
export const step1Schema = z.object({
  clientName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  contact: z
    .string()
    .min(8, "Nomor WhatsApp minimal 8 digit")
    .regex(/^[\d\s+\-()]+$/, "Nomor WhatsApp hanya boleh angka dan simbol telepon"),
  discordUsername: z.string().optional().default(""),
  clientType: z.enum(clientStatusOptions, {
    message: "Pilih salah satu status pemesan",
  }),
  organizationName: z.string().optional().default(""),
}).refine(
  (data) => {
    if (data.clientType !== "Personal / Individual") {
      return Boolean(data.organizationName && data.organizationName.trim().length > 0);
    }
    return true;
  },
  {
    message: "Nama perusahaan/organisasi wajib diisi untuk kategori ini",
    path: ["organizationName"],
  }
);

// STEP 2: Project Information Schema
export const step2Schema = z.object({
  projectName: z.string().min(2, "Nama proyek minimal 2 karakter"),
  websiteType: z.enum(websiteTypeOptions, {
    message: "Pilih jenis website yang diinginkan",
  }),
  websiteGoal: z.string().min(10, "Tujuan pembuatan website minimal 10 karakter"),
  targetAudience: z.string().min(5, "Target pengguna minimal 5 karakter"),
  problemToSolve: z.string().min(10, "Jelaskan masalah yang ingin diselesaikan minimal 10 karakter"),
  projectDescription: z.string().min(20, "Deskripsi proyek minimal 20 karakter"),
});

// STEP 3: Features & Technical Requirements Schema
export const step3Schema = z.object({
  requiresLogin: z.enum(technicalRequirementOptions),
  requiresAdminDashboard: z.enum(technicalRequirementOptions),
  requiresDatabase: z.enum(technicalRequirementOptions),
  requiresPaymentGateway: z.enum(technicalRequirementOptions),
  requiresApiIntegration: z.enum(technicalRequirementOptions),
  techReference: z.string().optional().default(""),
  extraFeatures: z.string().optional().default(""),
});

// STEP 4: Project Expectations Schema
export const step4Schema = z.object({
  expectedOutcome: z.string().min(10, "Ekspektasi hasil akhir minimal 10 karakter"),
  primaryPriority: z.enum(primaryPriorityOptions, {
    message: "Pilih prioritas utama website",
  }),
  designReference: z.string().optional().default(""),
  designStyle: z.enum(designStyleOptions, {
    message: "Pilih gaya desain yang diinginkan",
  }),
  specialRequirements: z.string().optional().default(""),
  futureScaling: z.enum(technicalRequirementOptions, {
    message: "Pilih kepastian pengembangan di masa depan",
  }),
  notesToDeveloper: z.string().optional().default(""),
});

// Complete Order Submission Schema (Step 1-4 + Consent)
export const fullOrderSchema = z.object({
  // Step 1
  clientName: z.string().min(2),
  email: z.string().email(),
  contact: z.string().min(8),
  discordUsername: z.string().optional().default(""),
  clientType: z.enum(clientStatusOptions),
  organizationName: z.string().optional().default(""),

  // Step 2
  projectName: z.string().min(2),
  websiteType: z.enum(websiteTypeOptions),
  websiteGoal: z.string().min(10),
  targetAudience: z.string().min(5),
  problemToSolve: z.string().min(10),
  projectDescription: z.string().min(20),

  // Step 3
  features: z.object({
    requiresLogin: z.enum(technicalRequirementOptions),
    requiresAdminDashboard: z.enum(technicalRequirementOptions),
    requiresDatabase: z.enum(technicalRequirementOptions),
    requiresPaymentGateway: z.enum(technicalRequirementOptions),
    requiresApiIntegration: z.enum(technicalRequirementOptions),
    techReference: z.string().optional().default(""),
    extraFeatures: z.string().optional().default(""),
  }),

  // Step 4
  projectExpectations: z.object({
    expectedOutcome: z.string().min(10),
    primaryPriority: z.enum(primaryPriorityOptions),
    designReference: z.string().optional().default(""),
    designStyle: z.enum(designStyleOptions),
    specialRequirements: z.string().optional().default(""),
    futureScaling: z.enum(technicalRequirementOptions),
    notesToDeveloper: z.string().optional().default(""),
  }),

  agreementAccepted: z.literal(true, {
    message: "Kamu wajib menyetujui kebijakan pengiriman permintaan proyek",
  }),
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type FullOrderSubmission = z.infer<typeof fullOrderSchema>;

/**
 * Generate a unique readable Order Number, e.g. AHA-2026-X8F2
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomCode = "";
  for (let i = 0; i < 4; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `AHA-${year}-${randomCode}`;
}
