import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/WizardContext";

export default function Step4Finalize() {
  const { data, update } = useWizard();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const canSubmit = Boolean(data.email && data.acknowledgeProtocols);

  async function handleGenerateAnalysis() {
    try {
      const payload = {
        title: data.title,
        countryRegion: data.countryRegion,
        organization: data.organization,
        budget: data.budget,
        currency: data.currency,
        currency: data.currency,
        duration: data.duration,
        sector: data.sector,
        sectorOther: data.sectorOther,
        donorChoice: data.donorChoice,
        donorOther: data.donorOther,
        sectorOther: data.sectorOther,
        donorChoice: data.donorChoice,
        donorOther: data.donorOther,
        problemStatement: data.problemStatement,
        objectives: data.objectives,
        beneficiaries: data.beneficiaries,
        activities: data.activities,
        expectedResults: data.expectedResults,
        risks: data.risks
        risks: data.risks
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

      <label className="checkbox">
        <input
          type="checkbox"
          checked={data.shareAnon}
          onChange={(e) => update({ shareAnon: e.target.checked })}
        />
        <span>Share anonymized data to improve the tool</span>
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={data.ghostMode}
          onChange={(e) => update({ ghostMode: e.target.checked })}
        />
        <span>Ghost mode (hide my email in logs)</span>
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={data.acknowledgeProtocols}
          onChange={(e) => update({ acknowledgeProtocols: e.target.checked })}
        />
        <span>I acknowledge project protocols</span>
      </label>

      {loading && <p className="intel-section">Submitting…</p>}
      {err && <p className="intel-section">Error: {err}</p>}
      {ok && <p className="intel-section">Submitted. See "AI Analysis" in the right preview.</p>}

      <div className="actions" style={{ marginTop: 16 }}>
        <button className="btn" type="button" onClick={() => navigate("/wizard/step-3")}>
          Back
        </button>
        <button className="btn primary" type="button" disabled={!canSubmit || loading} onClick={submit}>
          Submit
        </button>
        <button className="btn primary" type="button" onClick={handleGenerateAnalysis}>
          Generate Analysis
        </button>
      </div>
    </section>
  );
}