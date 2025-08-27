import React from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../context/WizardContext";
import TextArea from "../components/TextArea";

export default function Step2Problem() {
  const { data, update } = useWizard();
  const nav = useNavigate();

  return (
    <div>
      <h2>Step 2 — Problem & Objectives</h2>
      <TextArea
        label="Problem Statement"
        value={data.problemStatement}
        onChange={(v) => update({ problemStatement: v })}
        wordTarget={120}
        charTarget={900}
        placeholder="What problem are you addressing? Who is affected? Evidence?"
      />

      <TextArea
        label="Objectives"
        value={data.objectives}
        onChange={(v) => update({ objectives: v })}
        wordTarget={80}
        charTarget={600}
        placeholder="List 2–4 SMART objectives."
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <button onClick={() => nav("/step1")} style={btn}>← Back</button>
        <button onClick={() => nav("/step3")} style={btn}>Next →</button>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = { padding: "10px 14px", borderRadius: 10, border: "1px solid #111827", background: "white", cursor: "pointer" };