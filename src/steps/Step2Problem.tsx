import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/WizardContext";
import { getStep2Guidance } from "../utils/nudges";
import { evalSMART } from "../utils/smart";
import Counter from "../components/Counter";
import { LIMITS } from "../utils/limits";
import { polishText } from "../utils/grammar";

type SectorKey = "Health" | "Education" | "WASH" | "Agriculture" | "Economic Development";

const STEP2_EXAMPLES: Record<
  SectorKey,
  { problem: string; objectives: string }
> = {
  Health: {
    problem: "High maternal morbidity; poor ANC uptake; stockouts; long referral times.",
    objectives: "Increase ANC uptake; strengthen CHW referrals; reduce stockouts."
  },
  Education: {
    problem: "Low early-grade literacy; teacher shortages; weak assessment practices.",
    objectives: "Improve reading in grades 1–3; train teachers; introduce regular assessment."
  },
  WASH: {
    problem: "Nonfunctional boreholes; unsafe water; poor hygiene practices.",
    objectives: "Restore water points; ensure safe water; promote handwashing."
  },
  Agriculture: {
    problem: "Low yields; limited quality inputs; weak market linkages.",
    objectives: "Adopt improved seeds; train lead farmers; connect to buyers."
  },
  "Economic Development": {
    problem: "Low MSME sales; limited finance; weak business skills.",
    objectives: "Business coaching; link to finance; grow monthly sales."
  }
};

const words = (s: string) => (s ? s.trim().split(/\s+/).filter(Boolean).length : 0);

function SmartMeter({ flags }: { flags: ReturnType<typeof evalSMART> }) {
  const chip = (txt: string, on: boolean) => (
    <span
      key={txt}
      style={{
        padding: "2px 8px",
        borderRadius: 8,
        marginRight: 6,
        fontSize: 12,
        border: "1px solid var(--border, #334155)",
        opacity: on ? 1 : 0.5,
        color: on ? "var(--text)" : "var(--muted)",
        backgroundColor: on ? "rgba(59, 130, 246, 0.1)" : "transparent",
      }}
    >
      {txt}
    </span>
  );
  return (
    <div style={{ marginTop: 6 }}>
      {chip("Specific", flags.specific)}
      {chip("Measurable", flags.measurable)}
      {chip("Achievable", flags.achievable)}
      {chip("Relevant", flags.relevant)}
      {chip("Time-bound", flags.timebound)}
    </div>
  );
}

export default function Step2Problem() {
  const { data, update } = useWizard();
  const nav = useNavigate();

  const g = getStep2Guidance(data.sector, data.donorChoice);

  const problemFlags = useMemo(() => evalSMART(data.problemStatement), [data.problemStatement]);
  const objectiveFlags = useMemo(
    () => evalSMART(data.objectives, data.problemStatement),
    [data.objectives, data.problemStatement]
  );

  const raw = (data?.sector ?? "").trim();
  const map: Record<string, SectorKey> = {
    Health: "Health",
    Education: "Education",
    WASH: "WASH",
    Agriculture: "Agriculture",
    "Economic Development": "Economic Development",
    Other: "Economic Development"
  };
  const sectorKey: SectorKey = map[raw] ?? "Economic Development";
  const ex2 = STEP2_EXAMPLES[sectorKey];

  const canNext = words(data.problemStatement) > 0 && words(data.objectives) > 0;

  return (
    <section className="section">
      <h2 className="pane-title">Step 2 — Problem</h2>

      {ex2?.problem && (
        <div className="mb-2 text-xs text-slate-300 bg-slate-800/40 border border-slate-700/60 rounded px-2 py-1">
          <strong>Examples — Problem:</strong> <span>{ex2.problem}</span>
        </div>
      )}
      <label className="field">
        <span className="label">Problem Statement</span>
        <textarea 
          className="textarea" 
          value={data.problemStatement} 
          onChange={e => update({ problemStatement: e.target.value })} 
          placeholder={g.problemPlaceholder}
        />
        <Counter text={data.problemStatement} lims={LIMITS.problemStatement} />
        <div className="helper" style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{g.problemHint}</div>
        <SmartMeter flags={problemFlags} />
        <div className="actions" style={{ marginTop: 6 }}>
          <button 
            className="btn ghost" 
            type="button" 
            onClick={() => update({ problemStatement: polishText(data.problemStatement) })}
          >
            Polish
          </button>
        </div>
      </label>

      {ex2?.objectives && (
        <div className="mb-2 text-xs text-slate-300 bg-slate-800/40 border border-slate-700/60 rounded px-2 py-1">
          <strong>Examples — Objectives:</strong> <span>{ex2.objectives}</span>
        </div>
      )}
      <label className="field">
        <span className="label">Objectives</span>
        <textarea 
          className="textarea" 
          value={data.objectives} 
          onChange={e => update({ objectives: e.target.value })} 
          placeholder={g.objectivesPlaceholder}
        />
        <Counter text={data.objectives} lims={LIMITS.objectives} />
        <div className="helper" style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{g.objectivesHint}</div>
        <SmartMeter flags={objectiveFlags} />
        <div className="actions" style={{ marginTop: 6 }}>
          <button 
            className="btn ghost" 
            type="button" 
            onClick={() => update({ objectives: polishText(data.objectives) })}
          >
            Polish
          </button>
        </div>
      </label>

      <div className="navrow">
        <button 
          className="btn ghost" 
          onClick={() => nav("/wizard/step-1")}
        >
          Back
        </button>
        <button 
          className="btn primary" 
          disabled={!canNext}
          onClick={() => nav("/wizard/step-3")}
        >
          Next
        </button>
      </div>
    </section>
  );
}