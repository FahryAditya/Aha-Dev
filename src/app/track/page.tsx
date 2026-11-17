"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import OrderTrackerView from "@/components/track/OrderTrackerView";

function TrackPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || searchParams.get("orderNumber") || "";

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 relative">
      {/* Decorative Sparkles */}
      <div className="sparkle top-[8%] left-[7%]" />
      <div className="sparkle top-[25%] right-[6%] [animation-delay:0.9s]" />
      <div className="sparkle bottom-[12%] left-[5%] [animation-delay:1.7s]" />

      <header className="max-w-4xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <Link href="/" className="btn-tactical">
          <ArrowLeft className="w-3.5 h-3.5" /> Beranda Aha Dev
        </Link>
        <div className="suit-badge">
          <span className="suit-badge__diamond" />
          <span>ORDER TRACKING PORTAL</span>
        </div>
      </header>

      <main className="relative z-10">
        <OrderTrackerView initialQuery={query} />
      </main>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen grid place-items-center font-mono-code text-[#00e5ff]">
          Memuat Portal Pelacakan...
        </div>
      }
    >
      <TrackPageContent />
    </Suspense>
  );
}
