import React from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/WizardContext";
import Counter from "../components/Counter";
import { LIMITS } from "../utils/limits";
import { polishText } from "../utils/grammar";

const wc = (s: string) => (s ? s.trim().split(/\s+/).filter(Boolean).length : 0);

export default function Step3Implementation() {
  const { data, update } = useWizard();
  const nav = useNavigate();

  // Risks with "Other"
  const riskOptions = ["Funding", "Capacity", "Market", "Climate", "Compliance", "Logistics"];
  const initial = data.risks ? data.risks.split(", ").filter(Boolean) : [];
  const [gridSel, setGridSel] = React.useState<string[]>(initial.filter(r => riskOptions.includes(r)));
  const [otherOn, setOtherOn] = React.useState<boolean>(initial.some(r => !riskOptions.includes(r)));
  const [otherText, setOtherText] = React.useState<string>(initial.find(r => !riskOptions.includes(r)) || "");

  const toggle = (r: string) =>
    setGridSel((arr) => (arr.includes(r) ? arr.filter((x) => x !== r) : [...arr, r]));

  // --- local inline component to render a single examples row ---
  const ExampleRow = ({ label, text }: { label: string; text?: string }) => {
    if (!text) return null;
    return (
      <div className="mb-2 text-xs text-slate-300 dark:text-slate-300/90 bg-slate-800/30 border border-slate-700/60 rounded px-2 py-1">
        <strong>Examples — {label}:</strong> <span>{text}</span>
      </div>
    );
  };

  React.useEffect(() => {
    const list = [...gridSel];
    if (otherOn && otherText.trim()) list.push(otherText.trim());
    update({ risks: list.join(", ") });
  }, [gridSel, otherOn, otherText, update]);

  const canNext =
    wc(data.beneficiaries) > 0 &&
    wc(data.activities) > 0 &&
    wc(data.expectedResults) > 0;

  return (
    <section className="section">
      <h2 className="pane-title">Step 3 — Implementation</h2>

      <ExampleRow label="Beneficiaries" text={examples?.beneficiaries} />
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

      <ExampleRow label="Activities" text={examples?.activities} />
      <label className="field">
        <span className="label">Activities</span>
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

      <ExampleRow label="Expected Results" text={examples?.expected} />
      <label className="field">
        <span className="label">Expected Results</span>
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
        <div className="grid2">
          {riskOptions.map(risk => (
            <div 
              key={risk}
              className={`card example ${gridSel.includes(risk) ? 'selected' : ''}`}
              onClick={() => toggle(risk)}
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
            onClick={() => setOtherOn(v => !v)}
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
            onChange={(e) => setOtherText(e.target.value)}
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
          onClick={() => nav("/wizard/step-4")}
        >
          Next
        </button>
      </div>
    </section>
  );