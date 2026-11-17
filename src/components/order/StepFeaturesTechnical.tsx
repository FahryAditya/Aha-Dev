"use client";

import React from "react";
import { KeyRound, LayoutDashboard, Database, CreditCard, Network, Code2, PlusCircle } from "lucide-react";
import { useOrderFormStore } from "@/stores/orderFormStore";
import { technicalRequirementOptions } from "@/lib/validation";

interface TechQuestionItem {
  id: "requiresLogin" | "requiresAdminDashboard" | "requiresDatabase" | "requiresPaymentGateway" | "requiresApiIntegration";
  label: string;
  desc: string;
  icon: React.ElementType;
}

const techQuestions: TechQuestionItem[] = [
  {
    id: "requiresLogin",
    label: "Membutuhkan Login / Register Akun?",
    desc: "Autentikasi user, proteksi halaman, atau area khusus member.",
    icon: KeyRound,
  },
  {
    id: "requiresAdminDashboard",
    label: "Membutuhkan Admin Dashboard?",
    desc: "Panel kontrol internal untuk mengelola konten, pesanan, atau user.",
    icon: LayoutDashboard,
  },
  {
    id: "requiresDatabase",
    label: "Membutuhkan Database Penyimpanan?",
    desc: "Penyimpanan data interaktif, form dinamis, atau database relasional.",
    icon: Database,
  },
  {
    id: "requiresPaymentGateway",
    label: "Membutuhkan Payment Gateway?",
    desc: "Pembayaran otomatis via QRIS, Virtual Account, Credit Card, dll.",
    icon: CreditCard,
  },
  {
    id: "requiresApiIntegration",
    label: "Membutuhkan API Integration?",
    desc: "Koneksi ke sistem eksternal (CRM, Webhook Discord, Ekspedisi, dll).",
    icon: Network,
  },
];

export default function StepFeaturesTechnical() {
  const { step3, updateStep3, nextStep, prevStep } = useOrderFormStore();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-black text-[#f8f9fc] uppercase tracking-wide flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#d91e36] rotate-45 border border-[#f8f9fc]" />
          STEP 03 — Kebutuhan Fitur & Teknis
        </h2>
        <p className="text-sm text-[#9aa3ba] mt-1 font-sans">
          Pilih kebutuhan teknis website Anda. Jangan khawatir jika belum yakin, Anda bebas memilih opsi <span className="text-[#ffe66d] font-bold">Not Sure</span>.
        </p>
      </div>

      {/* Tech Question Cards */}
      <div className="space-y-3.5">
        {techQuestions.map((q) => {
          const Icon = q.icon;
          const currentValue = step3[q.id];

          return (
            <div
              key={q.id}
              className="p-3.5 sm:p-4 bg-[#0b0a12] border-2 border-[#09080d] rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-[3px_3px_0px_#09080d]"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#1e193b] border border-[#09080d] rounded text-[#00e5ff] shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-mono-code text-xs sm:text-sm font-bold text-[#f8f9fc]">
                    {q.label}
                  </h4>
                  <p className="text-xs text-[#9aa3ba]">{q.desc}</p>
                </div>
              </div>

              {/* Tactical Tri-State Toggle */}
              <div className="inline-flex rounded-md p-1 bg-[#131126] border border-[#09080d] shrink-0">
                {technicalRequirementOptions.map((opt) => {
                  const isSelected = currentValue === opt;
                  let activeClass = "bg-[#d91e36] text-[#f8f9fc]";
                  if (opt === "Yes") activeClass = "bg-[#10b981] text-[#09080d]";
                  if (opt === "Not Sure") activeClass = "bg-[#ffe66d] text-[#09080d]";

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateStep3({ [q.id]: opt })}
                      className={`px-3 py-1.5 font-mono-code text-xs font-bold rounded transition-all ${
                        isSelected
                          ? `${activeClass} shadow-[1px_1px_0px_#09080d]`
                          : "text-[#9aa3ba] hover:text-[#f8f9fc]"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Referensi Teknologi / Arsitektur */}
      <div className="space-y-2">
        <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-[#00e5ff]" />
          Referensi Fitur atau Teknologi Tertentu <span className="text-xs text-[#9aa3ba] font-normal">(Opsional)</span>
        </label>
        <input
          type="text"
          value={step3.techReference || ""}
          onChange={(e) => updateStep3({ techReference: e.target.value })}
          placeholder="Contoh: Ingin integrasi Telegram bot, Midtrans, PostgreSQL, Next.js, dsb."
          className="comic-input"
        />
      </div>

      {/* Fitur Tambahan */}
      <div className="space-y-2">
        <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
          <PlusCircle className="w-3.5 h-3.5 text-[#00e5ff]" />
          Fitur Tambahan Lainnya <span className="text-xs text-[#9aa3ba] font-normal">(Opsional)</span>
        </label>
        <textarea
          rows={3}
          value={step3.extraFeatures || ""}
          onChange={(e) => updateStep3({ extraFeatures: e.target.value })}
          placeholder="Tuliskan jika ada fitur spesifik seperti live chat, export data Excel, dark mode switcher, dsb."
          className="comic-input resize-y"
        />
      </div>

      {/* Form Navigation Buttons */}
      <div className="pt-4 flex items-center justify-between">
        <button type="button" onClick={prevStep} className="btn-tactical">
          ← Kembali
        </button>
        <button type="submit" className="btn-royal">
          Lanjut ke Step 04: Ekspektasi Proyek →
        </button>
      </div>
    </form>
  );
}
