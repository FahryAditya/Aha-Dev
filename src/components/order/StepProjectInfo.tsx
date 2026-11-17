"use client";

import React, { useState } from "react";
import { FolderGit2, Globe, Target, HelpCircle, FileText, AlertCircle } from "lucide-react";
import { useOrderFormStore } from "@/stores/orderFormStore";
import { websiteTypeOptions, step2Schema } from "@/lib/validation";

export default function StepProjectInfo() {
  const { step2, updateStep2, nextStep, prevStep } = useOrderFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const result = step2Schema.safeParse(step2);
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
          STEP 02 — Informasi Proyek Website
        </h2>
        <p className="text-sm text-[#9aa3ba] mt-1 font-sans">
          Jelaskan visi, sasaran pengguna, dan masalah utama yang ingin Anda selesaikan melalui website ini.
        </p>
      </div>

      {/* Nama Proyek */}
      <div className="space-y-2">
        <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
          <FolderGit2 className="w-3.5 h-3.5 text-[#00e5ff]" />
          Nama Proyek Website <span className="text-[#d91e36]">*</span>
        </label>
        <input
          type="text"
          required
          value={step2.projectName}
          onChange={(e) => updateStep2({ projectName: e.target.value })}
          placeholder="Contoh: Modern SaaS Platform / Website Profil Kantor Hukum"
          className="comic-input"
        />
        {errors.projectName && (
          <p className="text-xs text-[#ff2a85] font-mono-code flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.projectName}
          </p>
        )}
      </div>

      {/* Jenis Website */}
      <div className="space-y-2">
        <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-[#00e5ff]" />
          Jenis Website <span className="text-[#d91e36]">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {websiteTypeOptions.map((type) => {
            const isSelected = step2.websiteType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => updateStep2({ websiteType: type })}
                className={`p-3 text-left border-2 rounded-lg font-mono-code text-xs transition-all ${
                  isSelected
                    ? "bg-[#d91e36] text-[#f8f9fc] border-[#09080d] shadow-[3px_3px_0px_#00e5ff]"
                    : "bg-[#0b0a12] text-[#cfd4e2] border-[#09080d] hover:border-[#00e5ff] shadow-[2px_2px_0px_#09080d]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? "bg-[#ffe66d]" : "bg-[#9aa3ba]"
                    }`}
                  />
                  <span className="font-bold">{type}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tujuan Pembuatan Website */}
        <div className="space-y-2">
          <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#00e5ff]" />
            Tujuan Pembuatan Website <span className="text-[#d91e36]">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={step2.websiteGoal}
            onChange={(e) => updateStep2({ websiteGoal: e.target.value })}
            placeholder="Apa gol utama yang ingin dicapai? (contoh: meningkatkan kredibilitas, otomasi booking klien)"
            className="comic-input resize-y"
          />
          {errors.websiteGoal && (
            <p className="text-xs text-[#ff2a85] font-mono-code flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.websiteGoal}
            </p>
          )}
        </div>

        {/* Target Pengguna */}
        <div className="space-y-2">
          <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#00e5ff]" />
            Target Pengguna <span className="text-[#d91e36]">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={step2.targetAudience}
            onChange={(e) => updateStep2({ targetAudience: e.target.value })}
            placeholder="Siapa calon pengunjung utama website? (contoh: eksekutif B2B, mahasiswa, umum usia 20-40)"
            className="comic-input resize-y"
          />
          {errors.targetAudience && (
            <p className="text-xs text-[#ff2a85] font-mono-code flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.targetAudience}
            </p>
          )}
        </div>
      </div>

      {/* Masalah yang Ingin Diselesaikan */}
      <div className="space-y-2">
        <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#00e5ff]" />
          Masalah yang Ingin Diselesaikan <span className="text-[#d91e36]">*</span>
        </label>
        <textarea
          rows={3}
          required
          value={step2.problemToSolve}
          onChange={(e) => updateStep2({ problemToSolve: e.target.value })}
          placeholder="Kendala apa yang sedang Anda hadapi saat ini tanpa website ini?"
          className="comic-input resize-y"
        />
        {errors.problemToSolve && (
          <p className="text-xs text-[#ff2a85] font-mono-code flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.problemToSolve}
          </p>
        )}
      </div>

      {/* Deskripsi Proyek Lengkap */}
      <div className="space-y-2">
        <label className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#cfd4e2] flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#00e5ff]" />
          Deskripsi Proyek Lengkap <span className="text-[#d91e36]">*</span>
        </label>
        <textarea
          rows={4}
          required
          value={step2.projectDescription}
          onChange={(e) => updateStep2({ projectDescription: e.target.value })}
          placeholder="Tuliskan gambaran umum, alur yang dibayangkan, dan informasi penting lainnya..."
          className="comic-input resize-y"
        />
        {errors.projectDescription && (
          <p className="text-xs text-[#ff2a85] font-mono-code flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.projectDescription}
          </p>
        )}
      </div>

      {/* Form Navigation Buttons */}
      <div className="pt-4 flex items-center justify-between">
        <button type="button" onClick={prevStep} className="btn-tactical">
          ← Kembali
        </button>
        <button type="submit" className="btn-royal">
          Lanjut ke Step 03: Fitur & Teknis →
        </button>
      </div>
    </form>
  );
}
