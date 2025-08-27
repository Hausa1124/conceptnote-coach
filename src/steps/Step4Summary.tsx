import React from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../context/WizardContext";
import TextArea from "../components/TextArea";

export default function Step4Summary() {
  const { data, reset } = useWizard();
  const nav = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const hasRequiredFields = !!(
    data.title &&
    data.problemStatement &&
    data.objectives &&
    data.beneficiaries &&
    data.activities &&
    data.expected
  );

  const isReadyForAnalysis = hasRequiredFields && 
    data.consentConfirmAccuracy && 
    data.consentDataProcessing;

  const generateAnalysis = async () => {
    if (!isReadyForAnalysis) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(
        import.meta.env.VITE_ANALYSIS_WEBHOOK_URL || "/.netlify/functions/analysis",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            payload: data, 
            options: { anonymize: data.consentAnonymizeOutputs } 
          })
        }
      );
      
      const result = await response.json();
      
      if (result.analysisUrl) {
        window.location.href = result.analysisUrl;
      } else if (result.pdfUrl) {
        window.open(result.pdfUrl, '_blank');
        // Could add toast notification here
      }
    } catch (err) {
      setError("Couldn't generate analysis. Please try again.");
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

      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, marginBottom: 12 }}>Consent</h3>
        
        <label style={{ display: "flex", alignItems: "center", marginBottom: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={data.consentConfirmAccuracy}
            onChange={(e) => update({ consentConfirmAccuracy: e.target.checked })}
            style={{ marginRight: 8 }}
          />
          I confirm the information provided is accurate. (required)
        </label>
        
        <label style={{ display: "flex", alignItems: "center", marginBottom: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={data.consentDataProcessing}
            onChange={(e) => update({ consentDataProcessing: e.target.checked })}
            style={{ marginRight: 8 }}
          />
          I consent to automated processing to generate analysis. (required)
        </label>
        
        <label style={{ display: "flex", alignItems: "center", marginBottom: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={data.consentAnonymizeOutputs}
            onChange={(e) => update({ consentAnonymizeOutputs: e.target.checked })}
            style={{ marginRight: 8 }}
          />
          Anonymize my outputs where possible. (optional)
        </label>
      </div>

      {error && (
        <div style={{ 
          color: "#dc3545", 
          background: "#f8d7da", 
          border: "1px solid #f5c6cb", 
          padding: 8, 
          borderRadius: 4, 
          marginBottom: 12,
          fontSize: 14
        }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => nav("/step3")} style={btn}>← Back</button>
        <button 
          onClick={generateAnalysis} 
          disabled={!isReadyForAnalysis || loading}
          style={{
            ...btn,
            background: isReadyForAnalysis && !loading ? "#007bff" : "#e9ecef",
            color: isReadyForAnalysis && !loading ? "white" : "#6c757d",
            cursor: isReadyForAnalysis && !loading ? "pointer" : "not-allowed",
            opacity: isReadyForAnalysis && !loading ? 1 : 0.6
          }}
        >
          {loading ? "Generating..." : "Generate Analysis"}
        </button>
        <button onClick={() => { reset(); nav("/step1"); }} style={btn}>Start Over</button>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = { padding: "10px 14px", borderRadius: 10, border: "1px solid #111827", background: "white", cursor: "pointer" };