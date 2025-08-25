import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/WizardContext";

export default function Step4Finalize() {
  const { data, update } = useWizard();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = data.email && data.acknowledgeProtocols;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/.netlify/functions/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      
      const text = await response.text();
      update({ analysisText: text });
      
    } catch (e: any) {
      setError(e?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <h2 className="pane-title">Step 4 — Finalize</h2>

      <label className="field">
        <span className="label">Email *</span>
        <input 
          className="input" 
          type="email"
          value={data.email} 
          onChange={e => update({ email: e.target.value })} 
          placeholder="your.email@example.com"
        />
      </label>

      <label className="field" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input 
          type="checkbox" 
          checked={data.shareAnon} 
          onChange={e => update({ shareAnon: e.target.checked })} 
        />
        <span className="label">Share anonymized data to improve the tool</span>
      </label>

      <label className="field" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input 
          type="checkbox" 
          checked={data.ghostMode} 
          onChange={e => update({ ghostMode: e.target.checked })} 
        />
        <span className="label">Ghost mode (hide my email in logs)</span>
      </label>

      <label className="field" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input 
          type="checkbox" 
          checked={data.acknowledgeProtocols} 
          onChange={e => update({ acknowledgeProtocols: e.target.checked })} 
        />
        <span className="label">I acknowledge project protocols *</span>
      </label>

      {loading && (
        <div className="intel-section">
          <p>Submitting your concept note...</p>
        </div>
      )}

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      <div className="navrow">
        <button 
          className="btn ghost" 
          onClick={() => nav("/wizard/step-3")}
        >
          Back
        </button>
        <button 
          className="btn primary" 
          disabled={!canSubmit || loading} 
          onClick={handleSubmit}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </section>
  );
}