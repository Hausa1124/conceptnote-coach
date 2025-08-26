import React from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/WizardContext";
import Counter from "../components/Counter";
import { LIMITS } from "../utils/limits";
import { polishText } from "../utils/grammar";

const wc = (s: string) => (s ? s.trim().split(/\s+/).filter(Boolean).length : 0);

type SectorKey = "Health" | "Education" | "WASH" | "Agriculture" | "Economic Development";

const SECTOR_EXAMPLES: Record<SectorKey, {beneficiaries:string;activities:string;expected:string}> = {
  Health: {
    beneficiaries: "Pregnant women attending ANC; community health workers; newborns.",
    activities: "Deliver 6 ANC modules to 45 midwives; supply 15 health centers with emergency kits.",
    expected: "ANC visits increase by 30% within 12 months; 200 safe facility deliveries recorded."
  },
  Education: {
    beneficiaries: "Grade 1–3 students; teachers; school administrators.",
    activities: "Train 60 teachers in phonics; set up 10 reading corners; run monthly assessment clinics.",
    expected: "Grade-3 literacy +20% in 12 months; attendance 85%."
  },
  WASH: {
    beneficiaries: "Rural households; schoolchildren; water user committees.",
    activities: "Rehabilitate 10 boreholes; train 20 WUCs; hygiene promotion to 2,000 HHs.",
    expected: "1,500 HHs access safe water; handwashing ↑25%."
  },
  Agriculture: {
    beneficiaries: "Smallholder farmers; cooperative leaders; local buyers.",
    activities: "Train 50 lead farmers; establish 10 demo plots; conduct 24 field visits.",
    expected: "300 farmers adopt improved seeds; yield 2.1→2.7 t/ha; 15 buyer contracts."
  },
  "Economic Development": {
    beneficiaries: "Micro-entrepreneurs; youth groups; women-led SMEs.",
    activities: "Deliver 8 business clinics; set up savings groups; link 20 SMEs to buyers.",
    expected: "Sales +25%; 40 MSMEs financed; 60 jobs created."
  }
};

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

  React.useEffect(() => {
    const list = [...gridSel];
    if (otherOn && otherText.trim()) list.push(otherText.trim());
    update({ risks: list.join(", ") });
  }, [gridSel, otherOn, otherText, update]);

  const rawSector = data.sector || "";
  const sectorMap: Record<string, SectorKey> = {
    Health: "Health",
    Education: "Education",
    WASH: "WASH",
    "Agriculture": "Agriculture",
    "Economic Development": "Economic Development",
    Other: "Economic Development"
  };
  const sectorKey: SectorKey = sectorMap[rawSector] ?? "Economic Development";
  const ex = SECTOR_EXAMPLES[sectorKey];

  const canNext =
    wc(data.beneficiaries) > 0 &&
    wc(data.activities) > 0 &&
    wc(data.expectedResults) > 0;

  // Debug navigation timeline
  const handleNext = () => {
    console.log('BEFORE CLICK:', window.location.pathname);
    nav("step-4", { relative: "route" });
    setTimeout(() => console.log('AFTER 0ms:', window.location.pathname), 0);
    setTimeout(() => console.log('AFTER 200ms:', window.location.pathname), 200);
  };

  return (
    <section className="section">
      <h2 className="pane-title">Step 3 — Implementation</h2>

      {ex?.beneficiaries && (
        <div className="mb-2 text-xs text-slate-300 dark:text-slate-300/90 bg-slate-800/30 border border-slate-700/60 rounded px-2 py-1">
          <strong>Examples — Beneficiaries:</strong> <span>{ex.beneficiaries}</span>
        </div>
      )}
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

      {ex?.activities && (
        <div className="mb-2 text-xs text-slate-300 dark:text-slate-300/90 bg-slate-800/30 border border-slate-700/60 rounded px-2 py-1">
          <strong>Examples — Activities:</strong> <span>{ex.activities}</span>
        </div>
      )}
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

      {ex?.expected && (
        <div className="mb-2 text-xs text-slate-300 dark:text-slate-300/90 bg-slate-800/30 border border-slate-700/60 rounded px-2 py-1">
          <strong>Examples — Expected Results:</strong> <span>{ex.expected}</span>
        </div>
      )}
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
          type="button"
          className="btn primary" 
          disabled={!canNext}
          onClick={() => nav("step-4", { relative: "route" })}
        >
          Next
        </button>
      </div>
    </section>
  );
}