import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { EMPTY_DATA, WizardData } from "../types";

const STORAGE_KEY = "cnc-draft-v1";

type Ctx = {
  data: WizardData;
  update: (patch: Partial<WizardData>) => void;
  reset: () => void;
};

const WizardCtx = createContext<Ctx | null>(null);

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<WizardData>(EMPTY_DATA);

  // restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch {
      // ignore parse errors; keep EMPTY_DATA
    }
  }, []);

  // autosave
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // quota/full storage -> ignore silently
    }
  }, [data]);

  const update = (patch: Partial<WizardData>) => setData((d) => ({ ...d, ...patch }));
  const reset = () => { setData(EMPTY_DATA); localStorage.removeItem(STORAGE_KEY); };

  return <WizardCtx.Provider value={{ data, update, reset }}>{children}</WizardCtx.Provider>;
};

export const useWizard = () => {
  const ctx = useContext(WizardCtx);
  if (!ctx) throw new Error("useWizard must be used inside WizardProvider");
  return ctx;
};