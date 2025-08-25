// App.tsx — Bavarios-Exact UI (two-pane, examples, live preview)
import React, { createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ResizableTwoPane from "./components/ResizableTwoPane";

/* ---------- Grammar Correction Utility ---------- */
const correctGrammar = (text: string): string => {
  if (!text || text.trim().length === 0) return text;

  let corrected = text;

  // Basic capitalization fixes
  corrected = corrected.replace(/^\s*([a-z])/g, (match, letter) =>
    match.replace(letter, letter.toUpperCase())
  );

  // Fix sentence starts after periods
  corrected = corrected.replace(/\.\s+([a-z])/g, (match, letter) =>
    match.replace(letter, letter.toUpperCase())
  );

  const grammarFixes: Array<[RegExp, string]> = [
    [/\bi is\b/g, "I am"],
    [/\bwe is\b/g, "we are"],
    [/\bthey is\b/g, "they are"],
    [/\byou is\b/g, "you are"],
    [/\ba ([aeiou])/gi, "an $1"],
    [/\ban ([^aeiou])/gi, "a $1"],
    [/\bthere is many\b/gi, "there are many"],
    [/\bthere is several\b/gi, "there are several"],
    [/\bthis are\b/gi, "these are"],
    [/\bthat are\b/gi, "those are"],
    [/\bin the rural area\b/gi, "in rural areas"],
    [/\bin the urban area\b/gi, "in urban areas"],
    [/\bmake a training\b/gi, "provide training"],
    [/\bdo a training\b/gi, "conduct training"],
    [/\bmake a meeting\b/gi, "hold a meeting"],
    [/\bdo a meeting\b/gi, "hold a meeting"],
    [/\b(\d+)\s+person\b/g, "$1 people"],
    [/\bmany person\b/gi, "many people"],
    [/\bseveral person\b/gi, "several people"],
    [/\bfor (\d+) month\b/g, "for $1 months"],
    [/\bfor (\d+) year\b/g, "for $1 years"],
    [/\bin (\d+) month\b/g, "in $1 months"],
    [/\bin (\d+) year\b/g, "in $1 years"],
  ];
  grammarFixes.forEach(([pattern, replacement]) => {
    corrected = corrected.replace(pattern, replacement);
  });

  corrected = corrected.replace(/\s+/g, " ");
  corrected = corrected.trim();
  if (corrected && !corrected.match(/[.!?]$/)) corrected += ".";
  return corrected;
};

/* ---------- Types ---------- */
export type WizardData = {
  title: string;
  countryRegion: string;
  organization: string;
  budget: string;
  duration: string;
  sector:
    | "Health"
    | "Education"
    | "WASH"
    | "Agriculture"
    | "Economic Development"
    | "Other"
    | "";
  sectorOther?: string;
  donorChoice: "EU" | "USAID" | "UN" | "FAO" | "Other" | "";
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

const defaultData: WizardData = {
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
  analysisText: "",
};

/* ---------- Examples by Sector ---------- */
const examplesBySector = {
  "Economic Development": {
    problemNudge: "150–200 words describing the situation and challenges",
    problemExample: ["Smallholder households face price volatility and limited market access; women-led cooperatives lack post-harvest handling leading to 25–35% losses."],
    objectivesExample: [
      "Increase household income by 35% for target beneficiaries within 24 months",
      "Establish 10 village savings and loan associations",
      "Train 200 entrepreneurs in business management skills",
    ],
    beneficiariesNudge: "Be specific about who, how many, and key demographics",
    beneficiariesExample: ["300 low-income households (70% women-led) in peri-urban areas; focus on micro-entrepreneurs and informal sector workers."],
    activitiesNudge: "4–6 concrete activities that will achieve your objectives",
    activitiesExample: [
      "Facilitate access to microfinance and credit",
      "Establish market linkages for small businesses",
      "Create cooperative purchasing groups for bulk buying",
    ],
    resultsExample: [
      "Household income increases by 35% on average",
      "200 entrepreneurs complete business training",
      "10 savings groups mobilize $50,000 in community savings",
      "150 new micro-enterprises established",
    ],
    commonRisks: ["Price/Market Volatility", "Low Participation Rates", "Quality Control Issues", "Stakeholder Conflicts", "Funding Delays"],
  },
  Agriculture: {
    problemNudge: "150–200 words on yields, inputs, extension services, shocks",
    problemExample: ["Pineapple yields remain low due to poor planting material and limited access to agronomic training; post-harvest loss >30%."],
    objectivesExample: ["Improve average yield by 25% within 18 months", "Reduce post-harvest losses to <10% via collective processing", "Train 300 farmers on GAP and quality standards"],
    beneficiariesNudge: "Who farms, where, how many, gender/age mix",
    beneficiariesExample: ["1,000 smallholder farmers (60% women) in Gakenke and Nyabihu; organized in 30 producer groups."],
    activitiesNudge: "4–6 activities (training, inputs, aggregation, QA)",
    activitiesExample: ["Seasonal agronomy trainings on spacing, fertilization, pest control", "Set up 2 aggregation centers with cold storage", "Introduce standardized grading and bulking for traders"],
    resultsExample: ["Average yield rises from 12t/ha to 15t/ha", "Post-harvest loss reduced to 8%", "2 functioning aggregation centers established"],
    commonRisks: ["Weather/Climate Shocks", "Price/Market Volatility", "Quality Control Issues", "Funding Delays"],
  },
  Health: {
    problemNudge: "150–200 words on access, quality, outcomes, equity",
    problemExample: ["High maternal anemia and low ANC attendance in rural zones; stockouts and distance limit service uptake."],
    objectivesExample: ["Increase ANC 4+ visits from 42% to 65%", "Reduce anemia prevalence among pregnant women by 20%"],
    beneficiariesNudge: "Who, how many, age/sex, vulnerabilities",
    beneficiariesExample: ["5,000 women of reproductive age across 12 health catchments."],
    activitiesNudge: "4–6 interventions (outreach, counseling, supply)",
    activitiesExample: ["Community outreach, CHW training, micronutrient supply chains."],
    resultsExample: ["ANC coverage improved; anemia reduced; improved stock reliability"],
    commonRisks: ["Stockouts", "Staff turnover", "Misinformation"],
  },
} as const;

type SectorKey = keyof typeof examplesBySector;
function pickSector(key: string): SectorKey {
  const allowed = Object.keys(examplesBySector) as SectorKey[];
  return allowed.includes(key as SectorKey) ? (key as SectorKey) : "Economic Development";
}

/* ---------- Context ---------- */
const WizardCtx = createContext<{
  data: WizardData;
  setData: React.Dispatch<React.SetStateAction<WizardData>>;
}>({ data: defaultData, setData: () => {} });

const useWizard = () => useContext(WizardCtx);

/* ---------- Frame (fixed) ---------- */
const Frame: React.FC<{
  stepIndex: number;
  total: number;
  children: React.ReactNode;
  preview: React.ReactNode;
  title: string;
}> = ({ stepIndex, total, children, preview, title }) => {
  return (
    <div className="app-root">
      <header className="app-top">
        <div className="brand">◎ Concept Note Coach</div>
        <div className="progress">
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={`dot ${i <= stepIndex ? "active" : ""}`} />
          ))}
          <span className="step-text">Step {stepIndex + 1} of {total}</span>
        </div>
        <div className="secure">Secure Mode</div>
      </header>

      {/* Fill viewport height minus header */}
      <div style={{ height: "calc(100vh - 60px)" }}>
        <ResizableTwoPane
          initialPct={40}
          minPct={35}
          maxPct={65}
          left={
            <section className="pane-left">
              <h2 className="pane-title">{title}</h2>
              <div className="pane-scroll">{children}</div>
            </section>
          }
          right={
            <aside className="pane-right">
              <div className="pane-scroll">
                <div className="preview">
                  <div className="preview-head">
                    <span className="dot live" /> LIVE FEED ACTIVE
                  </div>
                  {preview}
                </div>
              </div>
            </aside>
          }
        />
      </div>
    </div>
  );
};
