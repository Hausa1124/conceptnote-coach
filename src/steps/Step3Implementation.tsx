import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/WizardContext";
import Counter from "../components/Counter";
import { LIMITS } from "../utils/limits";
import { polishText } from "../utils/grammar";

const wc = (s: string) => (s ? s.trim().split(/\s+/).filter(Boolean).length : 0);

export default function Step3Implementation() {
  const { data, update } = useWizard();
  const nav = useNavigate();

  // Safely normalize incoming values
  const safeArray = (v: unknown) => (Array.isArray(v) ? v : []);
  const safeText = (v: unknown) => (typeof v === "string" ? v : "");

  // Parse existing risks data safely
  const initial = data.risks ? data.risks.split(", ").filter(Boolean) : [];

  // Risk options that belong on this page
  const riskOptions = ["Funding", "Capacity", "Market", "Climate", "Compliance", "Logistics"];

  // Single source of state (no duplicates)
  const [gridSel, setGridSel] = useState<string[]>(
    initial.filter(r => riskOptions.includes(r))
  );

  const [otherOn, setOtherOn] = useState<boolean>(
    initial.some(r => !riskOptions.includes(r))
  );

  const [otherText, setOtherText] = useState<string>(
    initial.filter(r => !riskOptions.includes(r)).join(", ")
  );

  // Handlers (no undefined ops)
  function toggleItem(item: string) {
    setGridSel(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }

  function handleOtherToggle(checked: boolean) {
    setOtherOn(checked);
    if (!checked) setOtherText("");
  }

  function handleOtherTextChange(v: string) {
    setOtherText(v);
  }

  // Build the canonical risks array when saving/next
  function buildRisks(): string[] {
    const others = otherOn
      ? otherText
          .split(",")
          .map(s => s.trim())
          .filter(Boolean)
      : [];
    return [...gridSel, ...others];
  }

  // Update risks whenever state changes
  useEffect(() => {
    const risks = buildRisks();
    update({ risks: risks.join(", ") });
  }, [gridSel, otherOn, otherText, update]);

  const canNext =
    wc(data.beneficiaries) > 0 &&
    wc(data.activities) > 0 &&
    wc(data.expectedResults) > 0;

  // Save/Next wiring (no undefined writes)
  function handleNext() {
    const risks = buildRisks();
    update({ risks: risks.join(", ") });
    nav("/wizard/step-4");
  }

  return (
    <section className="section">
      <h2 className="pane-title">Step 3 — Implementation</h2>

      <label className="field">
        <span className="label">Beneficiaries</span>
        <textarea 
          className="textarea" 
          value={data.beneficiaries} 
          onChange={e => update({ beneficiaries: e.target.value })} 
          placeholder="Who will benefit from this project?"
        />
        <Counter text={data.beneficiaries} lims={LIMITS.beneficiaries} />
        <div className="helper" style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
          Who, where, how many. Example: "300 women farmers in Nyabihu, 6 co-ops."
        </div>
        <div className="actions" style={{ marginTop: 6 }}>
          <button 
            className="btn ghost" 
            type="button" 
            onClick={() => update({ beneficiaries: polishText(data.beneficiaries) })}
          >
            Polish
          </button>
        </div>
      </label>

      <label className="field">
        <span className="label">Activities</span>
        <div className="text-sm text-gray-600 mb-1">
          <strong>Examples:</strong> "Train 50 lead farmers on climate-smart techniques; establish 10 demonstration plots; conduct 24 monthly field visits" • "Deliver 6 training modules to 45 midwives; provide emergency kits to 15 health centers"
        </div>
        <div className="text-sm text-gray-600 mb-1">
          <strong>Examples:</strong> "Train 50 lead farmers on climate-smart techniques; establish 10 demonstration plots; conduct 24 monthly field visits" • "Deliver 6 training modules to 45 midwives; provide emergency kits to 15 health centers"
        </div>
        <textarea 
          className="textarea" 
          value={data.activities} 
          onChange={e => update({ activities: e.target.value })} 
          placeholder="What activities will be implemented?"
        />
        <Counter text={data.activities} lims={LIMITS.activities} />
        <div className="helper" style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
          Start each line with a verb. Example: "Train 6 lead farmers; set up 2 demo plots…"
        </div>
        <div className="actions" style={{ marginTop: 6 }}>
          <button 
            className="btn ghost" 
            type="button" 
            onClick={() => update({ activities: polishText(data.activities) })}
          >
            Polish
          </button>
        </div>
      </label>

      <label className="field">
        <span className="label">Expected Results</span>
        <div className="text-sm text-gray-600 mb-1">
          <strong>Examples:</strong> "300 farmers adopt improved seeds; average yields increase from 2.1 to 2.7 tons/hectare; 15 new buyer contracts signed" • \"45 certified midwives deployed; emergency referral time reduced by 40%; 200 safe deliveries recorded"
        </div>
        <div className="text-sm text-gray-600 mb-1">
          <strong>Examples:</strong> "300 farmers adopt improved seeds; average yields increase from 2.1 to 2.7 tons/hectare; 15 new buyer contracts signed" • \"45 certified midwives deployed; emergency referral time reduced by 40%; 200 safe deliveries recorded"
        </div>
        <textarea 
          className="textarea" 
          value={data.expectedResults} 
          onChange={e => update({ expectedResults: e.target.value })} 
          placeholder="What results do you expect to achieve?"
        />
        <Counter text={data.expectedResults} lims={LIMITS.expectedResults} />
        <div className="helper" style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
          Quantify results if possible. Example: "+20% yields; 15 new buyer contracts."
        </div>
        <div className="actions" style={{ marginTop: 6 }}>
          <button 
            className="btn ghost" 
            type="button" 
            onClick={() => update({ expectedResults: polishText(data.expectedResults) })}
          >
            Polish
          </button>
        </div>
      </label>

      <div className="field">
        <span className="label">Risks</span>
        {/* Render (map safely) */}
        <div className="grid2">
          {(riskOptions || []).map(risk => (
            <div 
              key={risk}
              className={`card example ${gridSel.includes(risk) ? 'selected' : ''}`}
              onClick={() => toggleItem(risk)}
              style={{ 
                cursor: 'pointer',
                backgroundColor: gridSel.includes(risk) ? '#0d162d' : '#0c1324',
                border: gridSel.includes(risk) ? '1px solid #3b82f6' : '1px solid #1f2937'
              }}
            >
              <div className="card-title">{risk}</div>
            </div>
          ))}
          <div 
            className={`card example ${otherOn ? 'selected' : ''}`}
            onClick={() => handleOtherToggle(!otherOn)}
            style={{ 
              cursor: 'pointer',
              backgroundColor: otherOn ? '#0d162d' : '#0c1324',
              border: otherOn ? '1px solid #3b82f6' : '1px solid #1f2937'
            }}
          >
            <div className="card-title">Other</div>
          </div>
        </div>
        {otherOn && (
          <input
            className="input" 
            style={{ marginTop: 8 }}
            placeholder="Type other risk…"
            value={otherText}
            onChange={(e) => handleOtherTextChange(e.target.value)}
          />
        )}
      </div>

      <div className="navrow">
        <button 
          className="btn ghost" 
          onClick={() => nav("/wizard/step-2")}
        >
          Back
        </button>
        <button 
          className="btn primary" 
          disabled={!canNext}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </section>
  );
}