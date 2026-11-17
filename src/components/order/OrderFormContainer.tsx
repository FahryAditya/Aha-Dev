"use client";

import React from "react";
import { useOrderFormStore } from "@/stores/orderFormStore";
import FormStepHeader from "./FormStepHeader";
import StepClientInfo from "./StepClientInfo";
import StepProjectInfo from "./StepProjectInfo";
import StepFeaturesTechnical from "./StepFeaturesTechnical";
import StepProjectExpectations from "./StepProjectExpectations";
import ReviewOrder from "./ReviewOrder";

export default function OrderFormContainer() {
  const { currentStep, setStep } = useOrderFormStore();

  return (
    <div className="comic-card comic-card--hero comic-card--checker max-w-3xl mx-auto w-full relative z-10">
      <FormStepHeader currentStep={currentStep} onStepClick={setStep} />

      <div className="mt-4">
        {currentStep === 1 && <StepClientInfo />}
        {currentStep === 2 && <StepProjectInfo />}
        {currentStep === 3 && <StepFeaturesTechnical />}
        {currentStep === 4 && <StepProjectExpectations />}
        {currentStep === 5 && <ReviewOrder />}
      </div>
    </div>
  );
}
