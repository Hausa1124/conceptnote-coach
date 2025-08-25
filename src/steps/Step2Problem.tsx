import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/WizardContext";
import { getStep2Guidance } from "../utils/nudges";
import { evalSMART } from "../utils/smart";
import Counter from "../components/Counter";
import { LIMITS } from "../utils/limits";
import { polishText } from "../utils/grammar";

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

  const canNext = words(data.problemStatement) > 0 && words(data.objectives) > 0;

  return (
    <section className="section">
      <h2 className="pane-title">Step 2 — Problem</h2>

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