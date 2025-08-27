import React from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../context/WizardContext";

export default function Step4Summary() {
  const { data, reset } = useWizard();
  const nav = useNavigate();

  const download = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "concept-note.json"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Step 4 — Review & Export</h2>
      <p>Everything you wrote is on the right. You can export as JSON for now.</p>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => nav("/step3")} style={btn}>← Back</button>
        <button onClick={download} style={btn}>Download JSON</button>
        <button onClick={() => { reset(); nav("/step1"); }} style={btn}>Start Over</button>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = { padding: "10px 14px", borderRadius: 10, border: "1px solid #111827", background: "white", cursor: "pointer" };