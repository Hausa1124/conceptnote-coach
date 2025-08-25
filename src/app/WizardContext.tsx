import React, { createContext, useContext, useState } from "react";

export type WizardData = {
  title: string;
  countryRegion: string;
  organization: string;
  budget: string;
  duration: string;
  sector: string;
  sectorOther?: string;
  donorChoice: string;
  donorOther?: string;
  problemStatement: string;
  objectives: string;
  objectivePreset: string;
  beneficiaries: string;
  activities: string;
  expectedResults: string;
  title: string;
  countryRegion: string;
  organization: string;
  budget: string;
  duration: string;
  sector: string;
  sectorOther?: string;
  donorChoice: string;
  donorOther?: string;
  problemStatement: string;
  objectives: string;
  objectivePreset: string;
  beneficiaries: string;
  activities: string;
  expectedResults: string;
  risks: string;
  email: string;
  shareAnon: boolean;
  ghostMode: boolean;
  acknowledgeProtocols: boolean;
  analysisText: string;
};

const defaultWizardData: WizardData = {
  title: "",
  countryRegion: "",
  organization: "",
  budget: "",
  duration: "",
  sector: "",
  sectorOther: "",
  donorChoice: "",
  donorOther: "",
  problemStatement: "",
  objectives: "",
  objectivePreset: "",
  beneficiaries: "",
  activities: "",
  expectedResults: "",
  risks: "",
  email: "",
  shareAnon: false,
  ghostMode: false,
  acknowledgeProtocols: false,
  analysisText: ""
  sectorOther: "",
  donorChoice: "",
  donorOther: "",
  problemStatement: "",
  objectives: "",
  objectivePreset: "",
  beneficiaries: "",
  activities: "",
  expectedResults: "",
  risks: "",
  email: "",
  shareAnon: false,
  ghostMode: false,
  acknowledgeProtocols: false,
  analysisText: ""
};

type WizardContextType = {
  data: WizardData;
  update: (partial: Partial<WizardData>) => void;
  reset: () => void;
type WizardContextType = {
  data: WizardData;
  update: (partial: Partial<WizardData>) => void;
  reset: () => void;
};
const WizardContext = createContext<WizardContextType | null>(null);
const WizardContext = createContext<WizardContextType | null>(null);

export const WizardProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<WizardData>(defaultWizardData);
  
  const update = (partial: Partial<WizardData>) => {
    setData(current => ({ ...current, ...partial }));
  };
  
  const update = (partial: Partial<WizardData>) => {
    setData(current => ({ ...current, ...partial }));
  };
  
  const reset = () => {
    setData(defaultWizardData);
  };
  
  return (
    <WizardContext.Provider value={{ data, update, reset }}>
      {children}
    </WizardContext.Provider>
  
  return (
    <WizardContext.Provider value={{ data, update, reset }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used inside WizardProvider");
  }
  return context;
  }
  return context;
};