"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserCheck,
  FolderKanban,
  Cpu,
  Eye,
  Edit3,
  ShieldCheck,
  Send,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useOrderFormStore } from "@/stores/orderFormStore";

export default function ReviewOrder() {
  const router = useRouter();
  const {
    step1,
    step2,
    step3,
    step4,
    agreementAccepted,
    setAgreementAccepted,
    setStep,
    prevStep,
    resetForm,
  } = useOrderFormStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!agreementAccepted) {
      setErrorMessage("Silakan centang persetujuan pengiriman permintaan proyek sebelum melanjutkan.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      // Step 1
      clientName: step1.clientName,
      email: step1.email,
      contact: step1.contact,
      discordUsername: step1.discordUsername || undefined,
      clientType: step1.clientType,
      organizationName: step1.organizationName || undefined,

      // Step 2
      projectName: step2.projectName,
      websiteType: step2.websiteType,
      websiteGoal: step2.websiteGoal,
      targetAudience: step2.targetAudience,
      problemToSolve: step2.problemToSolve,
      projectDescription: step2.projectDescription,

      // Step 3
      features: {
        requiresLogin: step3.requiresLogin,
        requiresAdminDashboard: step3.requiresAdminDashboard,
        requiresDatabase: step3.requiresDatabase,
        requiresPaymentGateway: step3.requiresPaymentGateway,
        requiresApiIntegration: step3.requiresApiIntegration,
        techReference: step3.techReference || undefined,
        extraFeatures: step3.extraFeatures || undefined,
      },

      // Step 4
      projectExpectations: {
        expectedOutcome: step4.expectedOutcome,
        primaryPriority: step4.primaryPriority,
        designReference: step4.designReference || undefined,
        designStyle: step4.designStyle,
        specialRequirements: step4.specialRequirements || undefined,
        futureScaling: step4.futureScaling,
        notesToDeveloper: step4.notesToDeveloper || undefined,
      },

      agreementAccepted: true,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengirim permintaan proyek. Silakan coba lagi.");
      }

      // Success! Clear store and redirect
      resetForm();
      router.push(`/confirmation?orderNumber=${encodeURIComponent(data.orderNumber)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-black text-[#f8f9fc] uppercase tracking-wide flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#d91e36] rotate-45 border border-[#f8f9fc]" />
          REVIEW & SUBMIT — Pemeriksaan Akhir
        </h2>
        <p className="text-sm text-[#9aa3ba] mt-1 font-sans">
          Pastikan semua informasi sudah tepat sebelum dikirimkan ke Discord developer Aha Dev.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-[#d91e36]/20 border-2 border-[#d91e36] rounded-lg text-sm text-[#f8f9fc] flex items-center gap-2 font-mono-code">
          <AlertTriangle className="w-4 h-4 text-[#ffe66d] shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Review Section Cards */}
      <div className="space-y-4">
        {/* Section 1: Client Info */}
        <div className="p-4 bg-[#0b0a12] border-2 border-[#09080d] rounded-lg shadow-[3px_3px_0px_#09080d] space-y-2">
          <div className="flex items-center justify-between border-b border-[#1e193b] pb-2">
            <h3 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#00e5ff] flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#00e5ff]" />
              01. Identitas & Kontak
            </h3>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="font-mono-code text-xs text-[#ffe66d] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono-code">
            <div>
              <span className="text-[#9aa3ba]">Nama:</span>{" "}
              <span className="text-[#f8f9fc] font-bold">{step1.clientName || "-"}</span>
            </div>
            <div>
              <span className="text-[#9aa3ba]">Email:</span>{" "}
              <span className="text-[#f8f9fc] font-bold">{step1.email || "-"}</span>
            </div>
            <div>
              <span className="text-[#9aa3ba]">WhatsApp:</span>{" "}
              <span className="text-[#f8f9fc] font-bold">{step1.contact || "-"}</span>
            </div>
            <div>
              <span className="text-[#9aa3ba]">Discord:</span>{" "}
              <span className="text-[#f8f9fc]">{step1.discordUsername || "Tidak dicantumkan"}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[#9aa3ba]">Status:</span>{" "}
              <span className="text-[#ffe66d]">{step1.clientType}</span>
              {step1.organizationName && ` (${step1.organizationName})`}
            </div>
          </div>
        </div>

        {/* Section 2: Project Info */}
        <div className="p-4 bg-[#0b0a12] border-2 border-[#09080d] rounded-lg shadow-[3px_3px_0px_#09080d] space-y-2">
          <div className="flex items-center justify-between border-b border-[#1e193b] pb-2">
            <h3 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#00e5ff] flex items-center gap-1.5">
              <FolderKanban className="w-4 h-4 text-[#00e5ff]" />
              02. Informasi Proyek
            </h3>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="font-mono-code text-xs text-[#ffe66d] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="space-y-1.5 text-xs font-mono-code">
            <div>
              <span className="text-[#9aa3ba]">Nama Proyek:</span>{" "}
              <span className="text-[#f8f9fc] font-bold">{step2.projectName || "-"}</span>
            </div>
            <div>
              <span className="text-[#9aa3ba]">Jenis Website:</span>{" "}
              <span className="text-[#ffe66d] font-bold">{step2.websiteType}</span>
            </div>
            <div>
              <span className="text-[#9aa3ba]">Tujuan:</span>{" "}
              <span className="text-[#cfd4e2]">{step2.websiteGoal || "-"}</span>
            </div>
            <div>
              <span className="text-[#9aa3ba]">Target Pengguna:</span>{" "}
              <span className="text-[#cfd4e2]">{step2.targetAudience || "-"}</span>
            </div>
            <div>
              <span className="text-[#9aa3ba]">Deskripsi:</span>{" "}
              <p className="text-[#cfd4e2] font-sans mt-0.5 line-clamp-3">{step2.projectDescription || "-"}</p>
            </div>
          </div>
        </div>

        {/* Section 3: Features & Tech */}
        <div className="p-4 bg-[#0b0a12] border-2 border-[#09080d] rounded-lg shadow-[3px_3px_0px_#09080d] space-y-2">
          <div className="flex items-center justify-between border-b border-[#1e193b] pb-2">
            <h3 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#00e5ff] flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#00e5ff]" />
              03. Fitur & Teknis
            </h3>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="font-mono-code text-xs text-[#ffe66d] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono-code">
            <div>
              <span className="text-[#9aa3ba]">Login/Auth:</span>{" "}
              <span className={step3.requiresLogin === "Yes" ? "text-[#10b981]" : "text-[#f8f9fc]"}>
                {step3.requiresLogin}
              </span>
            </div>
            <div>
              <span className="text-[#9aa3ba]">Admin Panel:</span>{" "}
              <span className={step3.requiresAdminDashboard === "Yes" ? "text-[#10b981]" : "text-[#f8f9fc]"}>
                {step3.requiresAdminDashboard}
              </span>
            </div>
            <div>
              <span className="text-[#9aa3ba]">Database:</span>{" "}
              <span className={step3.requiresDatabase === "Yes" ? "text-[#10b981]" : "text-[#f8f9fc]"}>
                {step3.requiresDatabase}
              </span>
            </div>
            <div>
              <span className="text-[#9aa3ba]">Payment Gateway:</span>{" "}
              <span className={step3.requiresPaymentGateway === "Yes" ? "text-[#10b981]" : "text-[#f8f9fc]"}>
                {step3.requiresPaymentGateway}
              </span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[#9aa3ba]">API Integration:</span>{" "}
              <span className={step3.requiresApiIntegration === "Yes" ? "text-[#10b981]" : "text-[#f8f9fc]"}>
                {step3.requiresApiIntegration}
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Expectations */}
        <div className="p-4 bg-[#0b0a12] border-2 border-[#09080d] rounded-lg shadow-[3px_3px_0px_#09080d] space-y-2">
          <div className="flex items-center justify-between border-b border-[#1e193b] pb-2">
            <h3 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#00e5ff] flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#00e5ff]" />
              04. Ekspektasi & Desain
            </h3>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="font-mono-code text-xs text-[#ffe66d] hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="space-y-1.5 text-xs font-mono-code">
            <div>
              <span className="text-[#9aa3ba]">Gaya Desain:</span>{" "}
              <span className="text-[#00e5ff] font-bold">{step4.designStyle}</span>
            </div>
            <div>
              <span className="text-[#9aa3ba]">Prioritas:</span>{" "}
              <span className="text-[#ffe66d] font-bold">{step4.primaryPriority}</span>
            </div>
            <div>
              <span className="text-[#9aa3ba]">Pengembangan Lanjut:</span>{" "}
              <span className="text-[#f8f9fc]">{step4.futureScaling}</span>
            </div>
            {step4.notesToDeveloper && (
              <div>
                <span className="text-[#9aa3ba]">Catatan:</span>{" "}
                <span className="text-[#cfd4e2]">{step4.notesToDeveloper}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Persetujuan Penggunaan Data */}
      <div className="p-4 bg-[#1e193b]/50 border-2 border-[#09080d] rounded-lg">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreementAccepted}
            onChange={(e) => setAgreementAccepted(e.target.checked)}
            className="w-5 h-5 rounded border-2 border-[#09080d] accent-[#d91e36] mt-0.5"
          />
          <span className="text-xs text-[#cfd4e2] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#10b981] inline mr-1" />
            Saya menyatakan bahwa data yang saya kirimkan adalah valid dan menyetujui kebijakan privasi Aha Dev.
            Permintaan proyek ini akan diteruskan ke tim developer melalui Discord untuk penjadwalan konsultasi dan pengerjaan.
          </span>
        </label>
      </div>

      {/* Form Action Buttons */}
      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="btn-tactical"
        >
          ← Kembali
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !agreementAccepted}
          className="btn-royal"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Mengirim Order...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Kirim Permintaan Proyek
            </>
          )}
        </button>
      </div>
    </div>
  );
}
