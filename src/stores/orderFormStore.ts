import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Step1FormData,
  Step2FormData,
  Step3FormData,
  Step4FormData,
} from "@/lib/validation";

interface OrderFormState {
  currentStep: number;
  step1: Step1FormData;
  step2: Step2FormData;
  step3: Step3FormData;
  step4: Step4FormData;
  agreementAccepted: boolean;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateStep1: (data: Partial<Step1FormData>) => void;
  updateStep2: (data: Partial<Step2FormData>) => void;
  updateStep3: (data: Partial<Step3FormData>) => void;
  updateStep4: (data: Partial<Step4FormData>) => void;
  setAgreementAccepted: (val: boolean) => void;
  resetForm: () => void;
}

const initialStep1: Step1FormData = {
  clientName: "",
  email: "",
  contact: "",
  discordUsername: "",
  clientType: "Personal / Individual",
  organizationName: "",
};

const initialStep2: Step2FormData = {
  projectName: "",
  websiteType: "Company Profile",
  websiteGoal: "",
  targetAudience: "",
  problemToSolve: "",
  projectDescription: "",
};

const initialStep3: Step3FormData = {
  requiresLogin: "No",
  requiresAdminDashboard: "No",
  requiresDatabase: "No",
  requiresPaymentGateway: "No",
  requiresApiIntegration: "No",
  techReference: "",
  extraFeatures: "",
};

const initialStep4: Step4FormData = {
  expectedOutcome: "",
  primaryPriority: "Functionality",
  designReference: "",
  designStyle: "Modern",
  specialRequirements: "",
  futureScaling: "Yes",
  notesToDeveloper: "",
};

export const useOrderFormStore = create<OrderFormState>()(
  persist(
    (set) => ({
      currentStep: 1,
      step1: initialStep1,
      step2: initialStep2,
      step3: initialStep3,
      step4: initialStep4,
      agreementAccepted: false,

      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 5) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      updateStep1: (data) =>
        set((state) => ({ step1: { ...state.step1, ...data } })),
      updateStep2: (data) =>
        set((state) => ({ step2: { ...state.step2, ...data } })),
      updateStep3: (data) =>
        set((state) => ({ step3: { ...state.step3, ...data } })),
      updateStep4: (data) =>
        set((state) => ({ step4: { ...state.step4, ...data } })),
      setAgreementAccepted: (val) => set({ agreementAccepted: val }),

      resetForm: () =>
        set({
          currentStep: 1,
          step1: initialStep1,
          step2: initialStep2,
          step3: initialStep3,
          step4: initialStep4,
          agreementAccepted: false,
        }),
    }),
    {
      name: "aha-dev-order-form-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
