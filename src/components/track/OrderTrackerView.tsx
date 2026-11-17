"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Code2,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import type { StoredOrder } from "@/lib/ordersService";

interface OrderTrackerViewProps {
  initialQuery?: string;
}

const milestoneSteps = [
  { key: "PENDING", label: "Request Submitted", desc: "Pesanan diterima sistem", stepNum: 1 },
  { key: "UNDER_REVIEW", label: "Under Review", desc: "Ditinjau oleh developer", stepNum: 2 },
  { key: "IN_PROGRESS", label: "In Development", desc: "Website sedang dibangun", stepNum: 3 },
  { key: "COMPLETED", label: "Completed & Deployed", desc: "Selesai dan online", stepNum: 4 },
];

function getStatusRank(status: string): number {
  switch (status) {
    case "PENDING":
      return 1;
    case "UNDER_REVIEW":
      return 2;
    case "ACCEPTED":
    case "IN_PROGRESS":
      return 3;
    case "COMPLETED":
      return 4;
    case "REJECTED":
    case "CANCELLED":
      return 0;
    default:
      return 1;
  }
}

export default function OrderTrackerView({ initialQuery = "" }: OrderTrackerViewProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchOrder = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/track?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order tidak ditemukan.");
      }

      setOrder(data.order);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat order";
      setError(msg);
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      fetchOrder(initialQuery);
    }
  }, [initialQuery, fetchOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchQuery);
  };

  const handleCopy = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentRank = order ? getStatusRank(order.status) : 1;
  const progressPercent = Math.min(((currentRank - 1) / 3) * 100, 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Search Order Card */}
      <div className="comic-card comic-card--hero comic-card--checker">
        <h2 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-[#f8f9fc] flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#d91e36] rotate-45 border border-[#f8f9fc]" />
          Lacak Status Proyek Anda
        </h2>
        <p className="text-xs sm:text-sm text-[#9aa3ba] mt-1 font-sans">
          Masukkan Nomor Order Unik (contoh: <span className="text-[#00e5ff] font-mono">AHA-2026-DEMO</span>) atau Email / WhatsApp Anda.
        </p>

        <form onSubmit={handleSearch} className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Contoh: AHA-2026-DEMO atau email@domain.com"
              className="comic-input pl-10"
            />
            <Search className="w-4 h-4 text-[#00e5ff] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button type="submit" disabled={isLoading} className="btn-royal shrink-0">
            {isLoading ? "Mencari..." : "Lacak Order →"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-[#d91e36]/20 border-2 border-[#d91e36] rounded-lg text-xs font-mono-code text-[#f8f9fc] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#ff2a85] shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Details View (Active when order is loaded) */}
      {order && (
        <div className="space-y-6">
          {/* Card: Order Summary Header */}
          <div className="comic-card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-code text-xs text-[#9aa3ba] uppercase tracking-wider">
                    ORDER ID:
                  </span>
                  <span className="font-display font-black text-xl sm:text-2xl text-[#f8f9fc] chromatic-title">
                    {order.orderNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="btn-tactical p-1.5 ml-1"
                    title="Salin Nomor Order"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5 text-[#ffe66d]" />}
                  </button>
                </div>
                <p className="text-xs text-[#cfd4e2] mt-1 font-mono-code">
                  Klien: <span className="font-bold text-[#f8f9fc]">{order.clientName}</span>{" "}
                  {order.organizationName && `(${order.organizationName})`}
                </p>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2">
                <span className={`status-pill status-pill--${order.status.toLowerCase()}`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  {order.status.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Delivery Progress Bar & 4-Step Milestones */}
            <div className="mt-8">
              <div className="relative w-full h-3 bg-[#0b0a12] border-[2.5px] border-[#09080d] rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
                <div
                  className="h-full bg-gradient-to-r from-[#00e5ff] via-[#d91e36] to-[#ff2a85] transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* 4 Milestones */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {milestoneSteps.map((m) => {
                  const isDone = currentRank > m.stepNum;
                  const isActive = currentRank === m.stepNum;

                  return (
                    <div
                      key={m.key}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        isActive
                          ? "bg-[#1e193b] border-[#00e5ff] shadow-[3px_3px_0px_#d91e36]"
                          : isDone
                          ? "bg-[#0b0a12] border-[#10b981] shadow-[2px_2px_0px_#09080d]"
                          : "bg-[#0b0a12]/60 border-[#09080d] opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1.5">
                        <div
                          className={`w-7 h-7 rounded-full grid place-items-center font-mono-code text-xs font-bold border-2 border-[#09080d] ${
                            isDone
                              ? "bg-[#10b981] text-[#09080d]"
                              : isActive
                              ? "bg-[#d91e36] text-[#f8f9fc] ring-2 ring-[#d91e36]/60"
                              : "bg-[#0b0a12] text-[#9aa3ba]"
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : m.stepNum}
                        </div>
                      </div>
                      <div className="font-mono-code text-xs font-bold uppercase text-[#f8f9fc]">
                        {m.label}
                      </div>
                      <div className="text-[11px] text-[#9aa3ba] font-sans mt-0.5">
                        {m.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Project Specs */}
            <div className="comic-card space-y-3">
              <h3 className="card-title">
                <Layers className="w-4 h-4 text-[#00e5ff]" />
                Spesifikasi Proyek
              </h3>
              <div className="space-y-2 text-xs font-mono-code">
                <div>
                  <span className="text-[#9aa3ba]">Nama Proyek:</span>{" "}
                  <span className="text-[#f8f9fc] font-bold">{order.projectName}</span>
                </div>
                <div>
                  <span className="text-[#9aa3ba]">Jenis Website:</span>{" "}
                  <span className="text-[#ffe66d]">{order.websiteType}</span>
                </div>
                <div>
                  <span className="text-[#9aa3ba]">Tujuan:</span>{" "}
                  <p className="text-[#cfd4e2] font-sans mt-0.5">{order.websiteGoal}</p>
                </div>
                <div>
                  <span className="text-[#9aa3ba]">Target Audiens:</span>{" "}
                  <p className="text-[#cfd4e2] font-sans mt-0.5">{order.targetAudience}</p>
                </div>
                <div>
                  <span className="text-[#9aa3ba]">Masalah yang Diselesaikan:</span>{" "}
                  <p className="text-[#cfd4e2] font-sans mt-0.5">{order.problemToSolve}</p>
                </div>
              </div>
            </div>

            {/* Features & Expectations */}
            <div className="comic-card space-y-3">
              <h3 className="card-title">
                <Code2 className="w-4 h-4 text-[#00e5ff]" />
                Fitur & Ekspektasi Desain
              </h3>
              <div className="space-y-2.5 text-xs font-mono-code">
                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(order.features).map(([key, val]) => {
                    if (typeof val !== "string" || key.includes("Reference") || key.includes("extra")) return null;
                    const cleanKey = key.replace("requires", "");
                    return (
                      <span
                        key={key}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border border-[#09080d] ${
                          val === "Yes"
                            ? "bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40"
                            : val === "Not Sure"
                            ? "bg-[#ffe66d]/20 text-[#ffe66d] border-[#ffe66d]/40"
                            : "bg-[#0b0a12] text-[#9aa3ba]"
                        }`}
                      >
                        {cleanKey}: {val}
                      </span>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-[#1e193b] space-y-1.5">
                  <div>
                    <span className="text-[#9aa3ba]">Gaya Desain:</span>{" "}
                    <span className="text-[#00e5ff] font-bold">
                      {String(order.projectExpectations.designStyle || "-")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9aa3ba]">Prioritas Utama:</span>{" "}
                    <span className="text-[#ffe66d] font-bold">
                      {String(order.projectExpectations.primaryPriority || "-")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9aa3ba]">Ekspektasi:</span>{" "}
                    <p className="text-[#cfd4e2] font-sans mt-0.5">
                      {String(order.projectExpectations.expectedOutcome || "-")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Timeline History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="comic-card space-y-3">
              <h3 className="card-title">
                <Clock className="w-4 h-4 text-[#00e5ff]" />
                Riwayat Pembaruan Status
              </h3>
              <div className="space-y-3 mt-3">
                {order.statusHistory.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3 bg-[#0b0a12] border-2 border-[#09080d] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-[2px_2px_0px_#09080d]"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#00e5ff] mt-1.5 shrink-0" />
                      <div>
                        <div className="font-mono-code text-xs font-bold text-[#f8f9fc]">
                          Status: <span className="text-[#ffe66d]">{item.newStatus}</span>{" "}
                          <span className="text-[#9aa3ba] font-normal font-sans">
                            oleh {item.changedBy}
                          </span>
                        </div>
                        {item.note && (
                          <p className="text-xs text-[#cfd4e2] font-sans mt-0.5">{item.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="font-mono-code text-[11px] text-[#9aa3ba] shrink-0 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
