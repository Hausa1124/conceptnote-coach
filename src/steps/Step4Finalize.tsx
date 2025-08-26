import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/WizardContext";

export default function Step4Finalize() {
  const { data, update } = useWizard();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const [confirmAccuracy, setConfirmAccuracy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [authorizeAnalysis, setAuthorizeAnalysis] = useState(false);

  const canSubmit = Boolean(
    data.email && confirmAccuracy && agreeTerms && authorizeAnalysis
  );

  async function handleGenerateAnalysis() {
    try {
      const payload = {
        title: data.title,
        countryRegion: data.countryRegion,
        organization: data.organization,
        budget: data.budget,
        currency: data.currency,
        duration: data.duration,
        sector: data.sector,
        sectorOther: data.sectorOther,
        donorChoice: data.donorChoice,
        donorOther: data.donorOther,
        problemStatement: data.problemStatement,
        objectives: data.objectives,
        beneficiaries: data.beneficiaries,
        activities: data.activities,
        expectedResults: data.expectedResults,
        risks: data.risks ?? ""
      };

      const res = await fetch("/.netlify/functions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const text = await res.text();

      if (!res.ok) {
        console.error("Submit error:", text);
        alert("Submission failed. Please try again.");
        return;
      }

      navigate(`/results?text=${encodeURIComponent(text)}`);
    } catch (e) {
      console.error(e);
      alert("Network error. Please try again.");
    }
  }

  const submit = async () => {
    try {
      setLoading(true);
      setErr(null);
      setOk(false);

      const res = await fetch("/.netlify/functions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const text = await res.text(); // your function may return text
      update({ analysisText: text });
      setOk(true);
    } catch (e: any) {
      setErr(e?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2 className="card-title">Step 4 — Finalize</h2>

      <label className="field">
        <span className="label">Email</span>
        <input
          className="input"
          placeholder="you@example.com"
          value={data.email}
          onChange={(e) => update({ email: e.target.value })}
        />
      </label>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={confirmAccuracy}
            onChange={e => setConfirmAccuracy(e.target.checked)} 
          />
          <span>I confirm the information provided is accurate.</span>
        </label>

        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={agreeTerms}
            onChange={e => setAgreeTerms(e.target.checked)} 
          />
          <span>I agree to the terms and privacy policy.</span>
        </label>

        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={authorizeAnalysis}
            onChange={e => setAuthorizeAnalysis(e.target.checked)} 
          />
          <span>I authorize generation of the analysis.</span>
        </label>
      </div>

      {loading && <p className="intel-section">Submitting…</p>}
      {err && <p className="intel-section">Error: {err}</p>}
      {ok && <p className="intel-section">Submitted. See "AI Analysis" in the right preview.</p>}

      <div className="actions" style={{ marginTop: 16 }}>
        <button className="btn" type="button" onClick={() => navigate("/wizard/step-3")}>
          Back
        </button>
        <button className="btn primary" type="button" disabled={!canSubmit || loading} onClick={handleGenerateAnalysis}>
          Generate Analysis
        </button>
      </div>
    </section>
  );
}