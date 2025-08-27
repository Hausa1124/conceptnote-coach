import React from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../context/WizardContext";
import TextArea from "../components/TextArea";
import { SectorKey } from "../types";

const SECTOR_EXAMPLES: Record<SectorKey, { beneficiaries: string; activities: string; expected: string }> = {
  Health: {
    beneficiaries: "300 pregnant women and newborns across 12 health posts in Nyabihu.",
    activities: "Train 45 midwives; supply 12 emergency kits; run 8 community ANC outreaches.",
    expected: "≥200 safe deliveries; referral time ↓40%; ANC coverage +25%.",
  },
  Education: {
    beneficiaries: "600 girls in upper primary from 10 rural schools.",
    activities: "Coach 40 teachers; set up 10 reading corners; run 6 STEM clubs.",
    expected: "Literacy +15% and math +12% by Term 3; 90% attendance.",
  },
  WASH: {
    beneficiaries: "2,000 residents in 5 villages lacking safe water.",
    activities: "Rehabilitate 5 boreholes; train 10 WASH committees; hygiene campaigns in 5 cells.",
    expected: "95% households with safe water access; diarrhea cases ↓30%.",
  },
  Agriculture: {
    beneficiaries: "300 women pineapple farmers in Gakenke (6 co-ops).",
    activities: "Train 50 lead farmers; establish 10 demo plots; 24 monthly field visits; buyer linkages.",
    expected: "+20% yields; 15 new buyer contracts; 300 adopt improved seed.",
  },
  "Economic Development": {
    beneficiaries: "120 youth- and women-led MSMEs in 2 districts.",
    activities: "Deliver 8 business clinics; link 20 MSMEs to buyers; set up 6 savings groups.",
    expected: "Sales +25%; 40 MSMEs financed; 60 decent jobs created.",
  },
  Other: {
    beneficiaries: "Target groups in the chosen niche (specify who/where/how many).",
    activities: "List 3–5 concrete interventions starting with verbs.",
    expected: "State 2–3 quantifiable outcomes (%, #, time).",
  },
  "": { beneficiaries: "", activities: "", expected: "" },
};

export default function Step3Implementation() {
  const { data, update } = useWizard();
  const nav = useNavigate();

  const examples = SECTOR_EXAMPLES[data.sector || "Other"];

  return (
    <div>
      <h2>Step 3 — Implementation</h2>

      <TextArea
        label="Beneficiaries"
        value={data.beneficiaries}
        onChange={(v) => update({ beneficiaries: v })}
        wordTarget={80}
        charTarget={600}
        placeholder={examples.beneficiaries || "Who, where, how many."}
      />

      <TextArea
        label="Activities"
        value={data.activities}
        onChange={(v) => update({ activities: v })}
        wordTarget={150}
        charTarget={1100}
        placeholder={examples.activities || "Start each line with a verb."}
      />

      <TextArea
        label="Expected Results"
        value={data.expected}
        onChange={(v) => update({ expected: v })}
        wordTarget={100}
        charTarget={800}
        placeholder={examples.expected || "Quantify where possible."}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <button onClick={() => nav("/step2")} style={btn}>← Back</button>
        <button onClick={() => nav("/step4")} style={btn}>Next →</button>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = { padding: "10px 14px", borderRadius: 10, border: "1px solid #111827", background: "white", cursor: "pointer" };