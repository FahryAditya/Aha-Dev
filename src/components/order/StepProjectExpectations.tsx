"use client";

import React, { useState } from "react";
import { Sparkles, Compass, Palette, Link2, GitBranch, MessageSquareQuote, AlertCircle } from "lucide-react";
import { useOrderFormStore } from "@/stores/orderFormStore";
import {
  designStyleOptions,
  primaryPriorityOptions,
  technicalRequirementOptions,
  step4Schema,
} from "@/lib/validation";

export default function StepProjectExpectations() {
  const { step4, updateStep4, nextStep, prevStep } = useOrderFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step4Schema.safeParse(step4);
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

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-black text-[#f8f9fc] uppercase tracking-wide flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#d91e36] rotate-45 border border-[#f8f9fc]" />
          STEP 04 — Ekspektasi & Preferensi Desain
        </h2>
        <p className="text-sm text-[#9aa3ba] mt-1 font-sans">
          Bantu kami menangkap cita rasa visual, standar performa, dan arah masa depan website Anda.
        </p>
      </div>

      {/* Hasil Akhir yang Diharapkan */}
      <div className="space-y-2">
        <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#00e5ff]" />
          Seperti Apa Hasil Akhir Website yang Diharapkan? <span className="text-[#d91e36]">*</span>
        </label>
        <textarea
          rows={3}
          required
          value={step4.expectedOutcome}
          onChange={(e) => updateStep4({ expectedOutcome: e.target.value })}
          placeholder="Jelaskan kesan pertama dan sensasi yang harus dirasakan pengunjung saat membuka website Anda..."
          className="comic-input resize-y"
        />
        {errors.expectedOutcome && (
          <p className="text-xs text-[#ff2a85] font-mono-code flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.expectedOutcome}
          </p>
        )}
      </div>

      {/* Prioritas Utama */}
      <div className="space-y-2">
        <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#00e5ff]" />
          Prioritas Utama Website <span className="text-[#d91e36]">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {primaryPriorityOptions.map((priority) => {
            const isSelected = step4.primaryPriority === priority;
            return (
              <button
                key={priority}
                type="button"
                onClick={() => updateStep4({ primaryPriority: priority })}
                className={`p-2.5 text-center border-2 rounded font-mono-code text-xs transition-all ${
                  isSelected
                    ? "bg-[#d91e36] text-[#f8f9fc] border-[#09080d] shadow-[3px_3px_0px_#00e5ff]"
                    : "bg-[#0b0a12] text-[#cfd4e2] border-[#09080d] hover:border-[#00e5ff] shadow-[2px_2px_0px_#09080d]"
                }`}
              >
                {priority}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gaya Desain yang Diinginkan */}
      <div className="space-y-2">
        <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-[#00e5ff]" />
          Gaya Desain yang Diinginkan <span className="text-[#d91e36]">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {designStyleOptions.map((style) => {
            const isSelected = step4.designStyle === style;
            return (
              <button
                key={style}
                type="button"
                onClick={() => updateStep4({ designStyle: style })}
                className={`p-2.5 text-center border-2 rounded font-mono-code text-xs transition-all ${
                  isSelected
                    ? "bg-[#00e5ff] text-[#09080d] font-bold border-[#09080d] shadow-[3px_3px_0px_#d91e36]"
                    : "bg-[#0b0a12] text-[#cfd4e2] border-[#09080d] hover:border-[#00e5ff] shadow-[2px_2px_0px_#09080d]"
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Referensi Website / Desain */}
        <div className="space-y-2">
          <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-[#00e5ff]" />
            Referensi URL Website / Desain <span className="text-xs text-[#9aa3ba] font-normal">(Opsional)</span>
          </label>
          <input
            type="text"
            value={step4.designReference || ""}
            onChange={(e) => updateStep4({ designReference: e.target.value })}
            placeholder="Contoh: stripe.com, apple.com, behance.net/..."
            className="comic-input"
          />
        </div>

        {/* Pengembangan di Masa Depan */}
        <div className="space-y-2">
          <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-[#00e5ff]" />
            Akan Dikembangkan di Masa Depan? <span className="text-[#d91e36]">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {technicalRequirementOptions.map((opt) => {
              const isSelected = step4.futureScaling === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateStep4({ futureScaling: opt })}
                  className={`p-2.5 font-mono-code text-xs font-bold rounded border-2 transition-all ${
                    isSelected
                      ? "bg-[#ffe66d] text-[#09080d] border-[#09080d] shadow-[2px_2px_0px_#09080d]"
                      : "bg-[#0b0a12] text-[#9aa3ba] border-[#09080d] hover:text-[#f8f9fc]"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ketentuan Khusus / Catatan Tambahan */}
      <div className="space-y-2">
        <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
          <MessageSquareQuote className="w-3.5 h-3.5 text-[#00e5ff]" />
          Pesan Tambahan untuk Developer <span className="text-xs text-[#9aa3ba] font-normal">(Opsional)</span>
        </label>
        <textarea
          rows={3}
          value={step4.notesToDeveloper || ""}
          onChange={(e) => updateStep4({ notesToDeveloper: e.target.value })}
          placeholder="Catatan tambahan, timeline yang diinginkan, atau pertanyaan khusus untuk tim developer Aha Dev..."
          className="comic-input resize-y"
        />
      </div>

      {/* Form Navigation Buttons */}
      <div className="pt-4 flex items-center justify-between">
        <button type="button" onClick={prevStep} className="btn-tactical">
          ← Kembali
        </button>
        <button type="submit" className="btn-royal">
          Tinjau Jawaban (Review & Submit) →
        </button>
      </div>
    </form>
  );
}
