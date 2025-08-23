// App.tsx — Bavarios‑Exact UI (two‑pane, examples, live preview)
import React, { createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// ---------- Types ----------
export type WizardData = {
  // Step 1 — Basics
  title: string;
  countryRegion: string;
  organization: string;
  budget: string;
  duration: string;
  sector: "Health" | "Education" | "WASH" | "Agriculture" | "Economic Development" | "Other" | "";
  sectorOther?: string;
  donorChoice: "EU" | "USAID" | "UN" | "FAO" | "Other" | "";
  donorOther?: string;

  // Step 2 — Problem & Objectives
  problemStatement: string;
  objectives: string;
  objectivePreset: string;

  // Step 3 — Beneficiaries & Activities
  beneficiaries: string;
  activities: string;

  // Step 4 — Results, Risks, Email, Protocols
  expectedResults: string;
  risks: string; // newline-delimited list incl. common risk selections
  email: string;
  shareAnon: boolean;
  ghostMode: boolean;
  acknowledgeProtocols: boolean;

  // API
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

// ---------- Examples by Sector (cards + nudges) ----------
const examplesBySector = {
  "Economic Development": {
    problemNudge: "150–200 words describing the situation and challenges",
    problemExample: [
      "Smallholder households face price volatility and limited market access; women-led cooperatives lack post-harvest handling leading to 25–35% losses.",
    ],
    objectivesExample: [
      "Increase household income by 35% for target beneficiaries within 24 months",
      "Establish 10 village savings and loan associations",
      "Train 200 entrepreneurs in business management skills",
    ],
    beneficiariesNudge: "Be specific about who, how many, and key demographics",
    beneficiariesExample: [
      "300 low‑income households (70% women‑led) in peri‑urban areas; focus on micro‑entrepreneurs and informal sector workers.",
    ],
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
      "150 new micro‑enterprises established",
    ],
    commonRisks: [
      "Price/Market Volatility",
      "Low Participation Rates",
      "Quality Control Issues",
      "Stakeholder Conflicts",
      "Funding Delays",
    ],
  },
  Agriculture: {
    problemNudge: "150–200 words on yields, inputs, extension services, shocks",
    problemExample: [
      "Pineapple yields remain low due to poor planting material and limited access to agronomic training; post‑harvest loss >30%.",
    ],
    objectivesExample: [
      "Improve average yield by 25% within 18 months",
      "Reduce post‑harvest losses to <10% via collective processing",
      "Tra
