"use client";

import React, { useState } from "react";
import { User, Mail, Phone, MessageSquare, Building2, AlertCircle } from "lucide-react";
import { useOrderFormStore } from "@/stores/orderFormStore";
import { clientStatusOptions, step1Schema } from "@/lib/validation";

export default function StepClientInfo() {
  const { step1, updateStep1, nextStep } = useOrderFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step1Schema.safeParse(step1);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    nextStep();
  };

  const isOrgRequired = step1.clientType !== "Personal / Individual";

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-black text-[#f8f9fc] uppercase tracking-wide flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#d91e36] rotate-45 border border-[#f8f9fc]" />
          STEP 01 — Identitas & Kontak Klien
        </h2>
        <p className="text-sm text-[#9aa3ba] mt-1 font-sans">
          Beri tahu kami siapa Anda agar kami dapat menghubungkan Anda langsung dengan developer Aha Dev.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nama Lengkap */}
        <div className="space-y-2">
          <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#00e5ff]" />
            Nama Lengkap <span className="text-[#d91e36]">*</span>
          </label>
          <input
            type="text"
            required
            value={step1.clientName}
            onChange={(e) => updateStep1({ clientName: e.target.value })}
            placeholder="Contoh: Rian Pratama"
            className="comic-input"
          />
          {errors.clientName && (
            <p className="text-xs text-[#ff2a85] font-mono-code flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.clientName}
            </p>
          )}
        </div>

        {/* Email Aktif */}
        <div className="space-y-2">
          <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#00e5ff]" />
            Email Aktif <span className="text-[#d91e36]">*</span>
          </label>
          <input
            type="email"
            required
            value={step1.email}
            onChange={(e) => updateStep1({ email: e.target.value })}
            placeholder="klien@example.com"
            className="comic-input"
          />
          {errors.email && (
            <p className="text-xs text-[#ff2a85] font-mono-code flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.email}
            </p>
          )}
        </div>

        {/* Nomor WhatsApp */}
        <div className="space-y-2">
          <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#00e5ff]" />
            Nomor WhatsApp <span className="text-[#d91e36]">*</span>
          </label>
          <input
            type="tel"
            required
            value={step1.contact}
            onChange={(e) => updateStep1({ contact: e.target.value })}
            placeholder="Contoh: 081234567890"
            className="comic-input"
          />
          {errors.contact && (
            <p className="text-xs text-[#ff2a85] font-mono-code flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.contact}
            </p>
          )}
        </div>

        {/* Discord Username */}
        <div className="space-y-2">
          <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#00e5ff]" />
            Discord Username <span className="text-xs text-[#9aa3ba] font-normal">(Opsional)</span>
          </label>
          <input
            type="text"
            value={step1.discordUsername || ""}
            onChange={(e) => updateStep1({ discordUsername: e.target.value })}
            placeholder="Contoh: rian#1234 atau rian_dev"
            className="comic-input"
          />
        </div>
      </div>

      {/* Status Pemesan */}
      <div className="space-y-2">
        <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2]">
          Status Pemesan <span className="text-[#d91e36]">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {clientStatusOptions.map((opt) => {
            const isSelected = step1.clientType === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => updateStep1({ clientType: opt })}
                className={`p-3 text-left border-2 rounded-lg font-mono-code text-xs transition-all ${
                  isSelected
                    ? "bg-[#d91e36] text-[#f8f9fc] border-[#09080d] shadow-[3px_3px_0px_#00e5ff]"
                    : "bg-[#0b0a12] text-[#cfd4e2] border-[#09080d] hover:border-[#00e5ff] shadow-[2px_2px_0px_#09080d]"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? "bg-[#ffe66d]" : "bg-[#9aa3ba]"
                    }`}
                  />
                  <span className="font-bold">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nama Perusahaan / Organisasi (Kondisional) */}
      {isOrgRequired && (
        <div className="space-y-2 transition-all">
          <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#00e5ff]" />
            Nama Perusahaan / Organisasi / Instansi <span className="text-[#d91e36]">*</span>
          </label>
          <input
            type="text"
            required
            value={step1.organizationName || ""}
            onChange={(e) => updateStep1({ organizationName: e.target.value })}
            placeholder="Contoh: PT Nusantara Solusi Digital"
            className="comic-input"
          />
          {errors.organizationName && (
            <p className="text-xs text-[#ff2a85] font-mono-code flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.organizationName}
            </p>
          )}
        </div>
      )}

      {/* Form Action */}
      <div className="pt-4 flex justify-end">
        <button type="submit" className="btn-royal">
          Lanjut ke Step 02: Info Proyek →
        </button>
      </div>
    </form>
  );
}
