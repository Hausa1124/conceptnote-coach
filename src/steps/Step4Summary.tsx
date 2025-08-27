import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../context/WizardContext";
import TextArea from "../components/TextArea";

export default function Step4Summary() {
  const { data, update, reset } = useWizard();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      
      <TextArea
        label="Risks"
        value={data.risks}
        onChange={(v) => update({ risks: v })}
        wordTarget={100}
        charTarget={800}
        placeholder="Top 3–5 risks (operational, market, compliance)."
      />

      <TextArea
        label="Mitigations"
        value={data.mitigations}
        onChange={(v) => update({ mitigations: v })}
        wordTarget={100}
        charTarget={800}
        placeholder="How you will reduce each risk."
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