"use client";

import React from "react";
import { Check } from "lucide-react";

interface FormStepHeaderProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const steps = [
  { step: 1, label: "Client Info", short: "01" },
  { step: 2, label: "Project Info", short: "02" },
  { step: 3, label: "Tech & Features", short: "03" },
  { step: 4, label: "Expectations", short: "04" },
  { step: 5, label: "Review & Submit", short: "05" },
];

export default function FormStepHeader({ currentStep, onStepClick }: FormStepHeaderProps) {
  // calculate progress percentage
  const progressPercent = Math.min(((currentStep - 1) / (steps.length - 1)) * 100, 100);

  return (
    <div className="w-full mb-8">
      {/* Header Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="suit-badge">
          <span className="suit-badge__diamond" />
          <span>AHA DEV // SMART REQUEST FORM</span>
        </div>
        <div className="font-mono-code text-xs tracking-wider text-[#cfd4e2] bg-[#0b0a12] border-2 border-[#09080d] px-3 py-1 rounded shadow-[2px_2px_0px_#09080d]">
          STEP <span className="text-[#00e5ff] font-bold">{currentStep}</span> OF{" "}
          <span className="text-[#ffe66d]">{steps.length}</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative w-full h-3 bg-[#0b0a12] border-[2.5px] border-[#09080d] rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
        <div
          className="h-full bg-gradient-to-r from-[#00e5ff] via-[#d91e36] to-[#ff2a85] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Nodes Grid */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mt-4 text-center">
        {steps.map((s) => {
          const isDone = s.step < currentStep;
          const isActive = s.step === currentStep;

          return (
            <button
              key={s.step}
              type="button"
              onClick={() => onStepClick && isDone && onStepClick(s.step)}
              disabled={!isDone && !isActive}
              className={`flex flex-col items-center gap-1.5 transition-all text-left ${
                isDone ? "cursor-pointer hover:opacity-90" : "cursor-default"
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full grid place-items-center border-[2.5px] border-[#09080d] text-xs font-mono font-bold transition-all shadow-[2px_2px_0px_#09080d] ${
                  isDone
                    ? "bg-[#10b981] text-[#09080d]"
                    : isActive
                    ? "bg-[#d91e36] text-[#f8f9fc] ring-2 ring-[#d91e36]/50 scale-105"
                    : "bg-[#0b0a12] text-[#9aa3ba]"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.short}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-colors hidden md:inline-block ${
                  isActive
                    ? "text-[#00e5ff]"
                    : isDone
                    ? "text-[#f8f9fc]"
                    : "text-[#9aa3ba]"
                }`}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
