import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { EMPTY_DATA, WizardData } from "../types";

type Ctx = {
  data: WizardData;
  update: (patch: Partial<WizardData>) => void;
  reset: () => void;
};

const WizardCtx = createContext<Ctx | null>(null);

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<WizardData>(EMPTY_DATA);
  
  // load draft on mount
  useEffect(() => {
    const raw = localStorage.getItem("cnc-draft");
    if (raw) setData(JSON.parse(raw));
  }, []);

  // autosave on change
  useEffect(() => {
    localStorage.setItem("cnc-draft", JSON.stringify(data));
  }, [data]);

  const update = (patch: Partial<WizardData>) => setData((d) => ({ ...d, ...patch }));
  const reset = () => setData(EMPTY_DATA);
  return <WizardCtx.Provider value={{ data, update, reset }}>{children}</WizardCtx.Provider>;
};

export const useWizard = () => {
  const ctx = useContext(WizardCtx);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
};