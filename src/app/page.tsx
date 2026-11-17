"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Terminal, Shield, Bot, ArrowRight, Search, CheckCircle } from "lucide-react";
import OrderFormContainer from "@/components/order/OrderFormContainer";

export default function HomePage() {
  return (
    <div className="min-h-screen relative pb-20">
      {/* Animated Sparkles */}
      <div className="sparkle top-[8%] left-[7%]" />
      <div className="sparkle top-[22%] right-[8%] [animation-delay:0.9s]" />
      <div className="sparkle bottom-[18%] left-[6%] [animation-delay:1.7s]" />
      <div className="sparkle bottom-[8%] right-[7%] [animation-delay:2.2s]" />

      {/* Navigation Bar */}
      <nav className="w-full border-b-2 border-[#09080d] bg-[#131126]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#d91e36] border-2 border-[#09080d] flex items-center justify-center font-display font-black text-lg text-[#f8f9fc] shadow-[3px_3px_0px_#00e5ff]">
              A
            </div>
            <div>
              <span className="font-display font-black tracking-wider text-base text-[#f8f9fc]">
                AHA DEV
              </span>
              <span className="hidden sm:inline-block font-mono-code text-[11px] text-[#00e5ff] ml-2 px-1.5 py-0.5 bg-[#0b0a12] border border-[#09080d] rounded">
                ORDER SYSTEM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/track" className="btn-tactical text-xs">
              <Search className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span className="hidden xs:inline">Track</span> Order
            </Link>
            <a
              href="#order-form-section"
              className="btn-royal text-xs py-2 px-3.5"
            >
              Request Web →
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-10 text-center relative z-10">
        <div className="inline-block suit-badge mb-4">
          <span className="suit-badge__diamond" />
          <span>AUTOMATED WEBSITE ORDERING // DISCORD INTEGRATED</span>
        </div>

        <h1 className="chromatic-title text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight max-w-4xl mx-auto">
          BANGUN WEBSITE IMPIAN ANDA DENGAN AHA DEV
        </h1>

        <p className="text-[#cfd4e2] text-sm sm:text-base max-w-2xl mx-auto mt-4 font-sans leading-relaxed">
          Sistem pemesanan jasa pembuatan website profesional, terstruktur, dan otomatis.
          Kirimkan kebutuhan proyek Anda dalam 4 tahap interaktif, dan kami langsung mengelolanya secara presisi melalui Discord.
        </p>

        {/* Feature Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-mono-code text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0b0a12] border-2 border-[#09080d] rounded-md shadow-[2px_2px_0px_#09080d]">
            <CheckCircle className="w-3.5 h-3.5 text-[#10b981]" />
            <span>4-Step Smart Form</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0b0a12] border-2 border-[#09080d] rounded-md shadow-[2px_2px_0px_#09080d]">
            <Bot className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>Discord Bot Pipeline</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0b0a12] border-2 border-[#09080d] rounded-md shadow-[2px_2px_0px_#09080d]">
            <Shield className="w-3.5 h-3.5 text-[#ffe66d]" />
            <span>PostgreSQL Permanent History</span>
          </div>
        </div>
      </section>

      {/* Main Order Form Section */}
      <section id="order-form-section" className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <OrderFormContainer />
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 mt-20 pt-8 border-t-2 border-[#1e193b] text-center font-mono-code text-xs text-[#9aa3ba] space-y-2">
        <p>
          Aha Dev — Website Order Management System © 2026
        </p>
        <p className="text-[11px] text-[#cfd4e2]/60">
          Powered by Next.js 16 • Tailwind CSS • Prisma • Discord.js • Queen of Hearts Design System
        </p>
      </footer>
    </div>
  );
}
