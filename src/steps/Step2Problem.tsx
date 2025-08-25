import React from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/WizardContext";

export default function Step2Problem() {
  const { data, update } = useWizard();
  const nav = useNavigate();

  const problemWordCount = data.problemStatement.split(/\s+/).filter(word => word.length > 0).length;
  const objectivesWordCount = data.objectives.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <section className="section">
      <h2 className="pane-title">Step 2 — Problem</h2>

      <label className="field">
        <span className="label">Problem Statement</span>
        <textarea 
          className="textarea" 
          value={data.problemStatement} 
          onChange={e => update({ problemStatement: e.target.value })} 
          placeholder="Describe the problem your project will address..."
        />
        <div className="word-counter">{problemWordCount} words</div>
      </label>

      <label className="field">
        <span className="label">Objectives</span>
        <textarea 
          className="textarea" 
          value={data.objectives} 
          onChange={e => update({ objectives: e.target.value })} 
          placeholder="What are the main objectives of this project?"
        />
        <div className="word-counter">{objectivesWordCount} words</div>
      </label>

      <label className="field">
        <span className="label">Objective Preset</span>
        <select 
          className="input" 
          value={data.objectivePreset} 
          onChange={e => update({ objectivePreset: e.target.value })}
        >
          <option value="">Select preset…</option>
          <option value="Capacity Building">Capacity Building</option>
          <option value="Service Delivery">Service Delivery</option>
          <option value="Infrastructure Development">Infrastructure Development</option>
          <option value="Policy Advocacy">Policy Advocacy</option>
          <option value="Research & Development">Research & Development</option>
        </select>
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
          onClick={() => nav("/wizard/step-3")}
        >
          Next
        </button>
      </div>
    </section>
  );
}