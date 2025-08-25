// src/app/WizardContext.tsx
import React, { createContext, useContext, useState } from "react";

/** ====== Data shape ====== */
export type WizardData = {
  // Step 1 — Basics
  title: string;
  countryRegion: string;
  organization: string;
  budget: string;
  currency: string;
  duration: string;
  sector: string;
  sectorOther?: string;
  donorChoice: string;
  donorOther?: string;

  // Step 2 — Problem
  problemStatement: string;
  objectives: string;

  // Step 3 — Implementation
  beneficiaries: string;
  activities: string;
  expectedResults: string;
  risks: string;

  // Step 4 — Finalize
  email: string;
  shareAnon: boolean;
  ghostMode: boolean;
  acknowledgeProtocols: boolean;

  // Returned by backend
  analysisText: string;
}; // <-- make sure this brace and semicolon are present

/** ====== Defaults ====== */
export const defaultWizardData: WizardData = {
  // Step 1
  title: "",
  countryRegion: "",
  organization: "",
  budget: "",
  currency: "USD",
  duration: "",
  sector: "",
  sectorOther: "",
  donorChoice: "",
  donorOther: "",

  // Step 2
  problemStatement: "",
  objectives: "",

  // Step 3
  beneficiaries: "",
  activities: "",
  expectedResults: "",
  risks: "",

  // Step 4
  email: "",
  shareAnon: false,
  ghostMode: false,
  acknowledgeProtocols: false,

  // Backend
  analysisText: "",
};

/** ====== Context ====== */
type Ctx = {
  data: WizardData;
  update: (p: Partial<WizardData>) => void;
  reset: () => void;
};

const WizardCtx = createContext<Ctx | null>(null);

export const WizardProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<WizardData>(defaultWizardData);
  const update = (p: Partial<WizardData>) => setData((d) => ({ ...d, ...p }));
  const reset = () => setData(defaultWizardData);
  return <WizardCtx.Provider value={{ data, update, reset }}>{children}</WizardCtx.Provider>;
};

export const useWizard = () => {
  const ctx = useContext(WizardCtx);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
};