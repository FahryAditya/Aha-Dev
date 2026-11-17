"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import OrderFormContainer from "@/components/order/OrderFormContainer";

export default function RequestPage() {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 relative">
      {/* Decorative Sparkles */}
      <div className="sparkle top-[6%] left-[7%]" />
      <div className="sparkle top-[24%] right-[6%] [animation-delay:0.9s]" />
      <div className="sparkle bottom-[14%] left-[5%] [animation-delay:1.7s]" />

      <header className="max-w-3xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <Link href="/" className="btn-tactical">
          <ArrowLeft className="w-3.5 h-3.5" /> Beranda
        </Link>
        <Link href="/track" className="btn-tactical">
          <Search className="w-3.5 h-3.5" /> Lacak Order Saya
        </Link>
      </header>

      <main className="relative z-10">
        <OrderFormContainer />
      </main>
    </div>
  );
}
