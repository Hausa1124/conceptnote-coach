export type SectorKey =
  | "Health" | "Education" | "WASH" | "Agriculture" | "Economic Development" | "Other" | "";

export type DonorKey = "EU" | "USAID" | "UN" | "FAO" | "Other" | "";

export type WizardData = {
  // Step 1
  title: string;
  countryRegion: string;
  organization: string;
  budget: string;
  duration: string;
  sector: SectorKey;
  sectorOther?: string;
  donorChoice: DonorKey;
  donorOther?: string;

  // Step 2
  problemStatement: string;
  objectives: string;

  // Step 3
  beneficiaries: string;
  activities: string;
  expected: string;
};

export const EMPTY_DATA: WizardData = {
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
  beneficiaries: "",
  activities: "",
  expected: "",
};