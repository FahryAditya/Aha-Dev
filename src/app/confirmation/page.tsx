"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Copy, Check, Search, ArrowRight, ShieldCheck } from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "AHA-2026-XXXX";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 relative">
      {/* Decorative Sparkles */}
      <div className="sparkle top-[10%] left-[8%]" />
      <div className="sparkle top-[30%] right-[10%] [animation-delay:1.2s]" />
      <div className="sparkle bottom-[15%] left-[6%] [animation-delay:2s]" />

      <main className="max-w-2xl mx-auto space-y-6 relative z-10">
        {/* Header Badge */}
        <div className="text-center">
          <div className="suit-badge mb-3">
            <span className="suit-badge__diamond" />
            <span>ORDER DISPATCHED // PENDING DEVELOPER REVIEW</span>
          </div>
          <h1 className="chromatic-title text-3xl sm:text-4xl font-black">
            PERMINTAAN DITERIMA!
          </h1>
          <p className="text-sm text-[#cfd4e2] mt-2 font-sans">
            Data kebutuhan website Anda telah tersimpan dan antrean notifikasi Discord sedang berjalan.
          </p>
        </div>

        {/* Main Comic Card */}
        <div className="comic-card comic-card--hero comic-card--checker text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#10b981] border-[3px] border-[#09080d] shadow-[4px_4px_0px_#09080d] flex items-center justify-center text-[#09080d]">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <div className="font-mono-code text-xs uppercase tracking-widest text-[#9aa3ba]">
              NOMOR ORDER UNIK ANDA
            </div>
            <div className="mt-2 inline-flex items-center gap-3 bg-[#0b0a12] border-[2.5px] border-[#09080d] px-5 py-3 rounded-lg shadow-[4px_4px_0px_#d91e36]">
              <span className="font-mono-code text-2xl sm:text-3xl font-black tracking-wider text-[#00e5ff]">
                {orderNumber}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="btn-tactical p-2"
                title="Salin nomor order"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[#10b981]" />
                ) : (
                  <Copy className="w-4 h-4 text-[#ffe66d]" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-xs text-[#10b981] font-mono-code mt-1.5">
                Nomor order berhasil disalin ke clipboard!
              </p>
            )}
          </div>

          {/* Quick Info Box */}
          <div className="bg-[#0b0a12] border-2 border-[#09080d] rounded-lg p-4 text-left space-y-2 shadow-[2px_2px_0px_#09080d]">
            <h3 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[#ffe66d] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#ffe66d]" />
              Langkah Selanjutnya:
            </h3>
            <ul className="text-xs text-[#cfd4e2] space-y-1.5 font-sans list-disc list-inside">
              <li>Developer Aha Dev akan meninjau detail teknis pesanan Anda melalui Discord.</li>
              <li>Status order dapat dipantau kapan saja secara real-time di halaman Tracking Portal.</li>
              <li>Kami akan menghubungi Anda melalui kontak WhatsApp atau email yang telah didaftarkan.</li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/track?query=${encodeURIComponent(orderNumber)}`}
              className="btn-royal w-full sm:w-auto"
            >
              <Search className="w-4 h-4" />
              Pantau Status Order Ini
            </Link>
            <Link href="/" className="btn-tactical w-full sm:w-auto">
              Kembali ke Beranda <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen grid place-items-center font-mono-code text-[#00e5ff]">
          Loading Confirmation...
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
