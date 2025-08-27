import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../context/WizardContext";
import TextArea from "../components/TextArea";
import ChipGroup from "../components/ChipGroup";

const RISK_OPTS = [
  "Weather/climate shocks (floods/drought)",
  "Market volatility (price swings, demand shifts)",
  "Delays in inputs/logistics (seed, tools, transport)",
  "Partner coordination gaps (roles, timelines)",
  "Low participant uptake/attendance",
  "Compliance/permits & reporting slippage"
];

const MIT_OPTS = [
  "Seasonal scheduling & buffer time",
  "Diversify buyers & forward agreements",
  "Backup suppliers & local stock",
  "Clear MOUs & weekly stand-ups",
  "Early mobilization & incentive nudges",
  "Compliance calendar & owner assigned"
];

export default function Step4Summary() {
  const { data, update, reset } = useWizard();
  const nav = useNavigate();
  const [risksSel, setRisksSel] = useState<string[]>([]);
  const [mitSel, setMitSel] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const joinUnique = (base: string, picks: string[]) => {
    const tokens = (base || "")
      .split(/\s*;\s*/)
      .filter(Boolean);
    const set = new Set([...tokens, ...picks]);
    return Array.from(set).join("; ");
  };

  const handleRiskToggle = (opt: string) => {
    setRisksSel(prev => {
      const next = prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt];
      update({ risks: joinUnique(data.risks, next) });
      return next;
    });
  };

  const handleMitToggle = (opt: string) => {
    setMitSel(prev => {
      const next = prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt];
      update({ mitigations: joinUnique(data.mitigations, next) });
      return next;
    });
  };

  const hasRequiredFields =
    (data.title?.trim()) &&
    (data.problemStatement?.trim()) &&
    (data.objectives?.trim()) &&
    (data.beneficiaries?.trim()) &&
    (data.activities?.trim()) &&
    (data.expected?.trim());

  const isReadyForAnalysis =
    !!hasRequiredFields &&
    data.consentConfirmAccuracy === true &&
    data.consentDataProcessing === true;

  const generateAnalysis = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch(
        import.meta.env.VITE_ANALYSIS_WEBHOOK_URL || "/.netlify/functions/analysis",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payload: data,
            options: { anonymize: data.consentAnonymizeOutputs },
          }),
        }
      );
      const json = await res.json();
      if (json.analysisUrl) {
        window.location.href = json.analysisUrl;
      } else if (json.pdfUrl) {
        window.open(json.pdfUrl, "_blank");
      } else {
        setErrorMsg("Analysis generated but no URL was returned.");
      }
    } catch (err) {
      setErrorMsg("Couldn't generate analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Step 4 — Review & Analysis</h2>
      
      <ChipGroup
        options={RISK_OPTS}
        selected={risksSel}
        onToggle={handleRiskToggle}
        label="Quick-pick risks (click to add/remove):"
      />
      <TextArea
        label="Risks"
        value={data.risks || ""}
        onChange={(v) => update({ risks: v })}
        wordTarget={100}
        charTarget={800}
        placeholder="Top 3–5 risks (operational, market, compliance). Separate by semicolons."
      />

      <ChipGroup
        options={MIT_OPTS}
        selected={mitSel}
        onToggle={handleMitToggle}
        label="Quick-pick mitigations (click to add/remove):"
      />
      <TextArea
        label="Mitigations"
        value={data.mitigations || ""}
        onChange={(v) => update({ mitigations: v })}
        wordTarget={120}
        charTarget={800}
        placeholder="How you will reduce each risk. Separate by semicolons."
      />

      <div style={{ marginTop: 16 }}>
        <h3>Consent</h3>

        <label style={{ display: "flex", gap: 8, alignItems: "flex-start", margin: "8px 0" }}>
          <input
            type="checkbox"
            checked={!!data.consentConfirmAccuracy}
            onChange={(e) => update({ consentConfirmAccuracy: e.target.checked })}
          />
          <span>I confirm the information provided is accurate. (required)</span>
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "flex-start", margin: "8px 0" }}>
          <input
            type="checkbox"
            checked={!!data.consentDataProcessing}
            onChange={(e) => update({ consentDataProcessing: e.target.checked })}
          />
          <span>I consent to automated processing to generate analysis. (required)</span>
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "flex-start", margin: "8px 0" }}>
          <input
            type="checkbox"
            checked={!!data.consentAnonymizeOutputs}
            onChange={(e) => update({ consentAnonymizeOutputs: e.target.checked })}
          />
          <span>Anonymize my outputs where possible. (optional)</span>
        </label>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={() => nav("/step3")} style={btn}>← Back</button>
        <button
          onClick={generateAnalysis}
          disabled={!isReadyForAnalysis || loading}
          style={{
            ...btn,
            opacity: !isReadyForAnalysis || loading ? 0.5 : 1,
            cursor: !isReadyForAnalysis || loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Generating…" : "Generate Analysis"}
        </button>
        <button onClick={() => { reset(); nav("/step1"); }} style={btn}>Start Over</button>
      </div>
      
      {errorMsg && <div style={{ color: "#B91C1C", marginTop: 8 }}>{errorMsg}</div>}
    </div>
  );
}

const btn: React.CSSProperties = { 
  padding: "10px 14px", 
  borderRadius: 10, 
  border: "1px solid #111827", 
  background: "white", 
  cursor: "pointer" 
};