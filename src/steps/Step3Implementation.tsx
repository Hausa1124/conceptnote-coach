import React from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/WizardContext";

export default function Step3Implementation() {
  const { data, update } = useWizard();
  const nav = useNavigate();

  const beneficiariesWordCount = data.beneficiaries.split(/\s+/).filter(word => word.length > 0).length;
  const activitiesWordCount = data.activities.split(/\s+/).filter(word => word.length > 0).length;
  const resultsWordCount = data.expectedResults.split(/\s+/).filter(word => word.length > 0).length;

  const riskOptions = [
    "Political instability",
    "Economic volatility", 
    "Environmental factors",
    "Technical challenges",
    "Resource constraints",
    "Stakeholder resistance"
  ];

  const selectedRisks = data.risks.split(",").map(r => r.trim()).filter(r => r.length > 0);

  const toggleRisk = (risk: string) => {
    const isSelected = selectedRisks.includes(risk);
    let newRisks;
    
    if (isSelected) {
      newRisks = selectedRisks.filter(r => r !== risk);
    } else {
      newRisks = [...selectedRisks, risk];
    }
    
    update({ risks: newRisks.join(", ") });
  };

  const beneficiariesWordCount = data.beneficiaries.split(/\s+/).filter(word => word.length > 0).length;
  const activitiesWordCount = data.activities.split(/\s+/).filter(word => word.length > 0).length;
  const resultsWordCount = data.expectedResults.split(/\s+/).filter(word => word.length > 0).length;

  const riskOptions = [
    "Political instability",
    "Economic volatility", 
    "Environmental factors",
    "Technical challenges",
    "Resource constraints",
    "Stakeholder resistance"
  ];

  const selectedRisks = data.risks.split(",").map(r => r.trim()).filter(r => r.length > 0);

  const toggleRisk = (risk: string) => {
    const isSelected = selectedRisks.includes(risk);
    let newRisks;
    
    if (isSelected) {
      newRisks = selectedRisks.filter(r => r !== risk);
    } else {
      newRisks = [...selectedRisks, risk];
    }
    
    update({ risks: newRisks.join(", ") });
  };

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
        <div className="word-counter">{beneficiariesWordCount} words</div>
      </label>

      <label className="field">
        <span className="label">Activities</span>
        <textarea 
          className="textarea" 
          value={data.activities} 
          onChange={e => update({ activities: e.target.value })} 
          placeholder="What activities will be implemented?"
        />
        <div className="word-counter">{activitiesWordCount} words</div>
      </label>

      <label className="field">
        <span className="label">Expected Results</span>
        <textarea 
          className="textarea" 
          value={data.expectedResults} 
          onChange={e => update({ expectedResults: e.target.value })} 
          placeholder="What results do you expect to achieve?"
        />
        <div className="word-counter">{resultsWordCount} words</div>
      </label>

      <div className="field">
        <span className="label">Risks</span>
        <div className="grid2">
          {riskOptions.map(risk => (
            <div 
              key={risk}
              className={`card example ${selectedRisks.includes(risk) ? 'selected' : ''}`}
              onClick={() => toggleRisk(risk)}
              style={{ 
                cursor: 'pointer',
                backgroundColor: selectedRisks.includes(risk) ? '#0d162d' : '#0c1324',
                border: selectedRisks.includes(risk) ? '1px solid #3b82f6' : '1px solid #1f2937'
              }}
            >
              <div className="card-title">{risk}</div>
      <label className="field">
        <span className="label">Beneficiaries</span>
        <textarea 
          className="textarea" 
          value={data.beneficiaries} 
          onChange={e => update({ beneficiaries: e.target.value })} 
          placeholder="Who will benefit from this project?"
        />
        <div className="word-counter">{beneficiariesWordCount} words</div>
        </div>
      </div>
      <label className="field">
        <span className="label">Activities</span>
        <textarea 
          className="textarea" 
          value={data.activities} 
          onChange={e => update({ activities: e.target.value })} 
          placeholder="What activities will be implemented?"
        />
        <div className="word-counter">{activitiesWordCount} words</div>
        <button 
          className="btn ghost" 
      <label className="field">
        <span className="label">Expected Results</span>
        <textarea 
          className="textarea" 
          value={data.expectedResults} 
          onChange={e => update({ expectedResults: e.target.value })} 
          placeholder="What results do you expect to achieve?"
        />
        <div className="word-counter">{resultsWordCount} words</div>
          Back
        </button>
      <div className="field">
        <span className="label">Risks</span>
        <div className="grid2">
          {riskOptions.map(risk => (
            <div 
              key={risk}
              className={`card example ${selectedRisks.includes(risk) ? 'selected' : ''}`}
              onClick={() => toggleRisk(risk)}
              style={{ 
                cursor: 'pointer',
                backgroundColor: selectedRisks.includes(risk) ? '#0d162d' : '#0c1324',
                border: selectedRisks.includes(risk) ? '1px solid #3b82f6' : '1px solid #1f2937'
              }}
            >
              <div className="card-title">{risk}</div>
            </div>
          ))}
        </div>
      </div>
          onClick={() => nav("/wizard/step-4")}
      <div className="navrow">
        <button 
          className="btn ghost" 
          onClick={() => nav("/wizard/step-2")}
        >
          Back
        </button>
        <button 
          className="btn primary" 
          onClick={() => nav("/wizard/step-4")}
        >
          Next
        </button>
      </div>
    </section>
  );
}