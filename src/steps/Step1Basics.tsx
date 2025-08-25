import React from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../app/WizardContext";

export default function Step1Basics() {
  const { data, update } = useWizard();
  const nav = useNavigate();
  const canNext = data.title && data.countryRegion && data.organization;

  return (
    <section className="section">
      <h2 className="pane-title">Step 1 — Basics</h2>

      <label className="field">
        <span className="label">Title *</span>
        <input 
          className="input" 
          value={data.title} 
          onChange={e => update({ title: e.target.value })} 
          placeholder="Enter project title"
        />
      </label>

      <label className="field">
        <span className="label">Country / Region *</span>
        <input 
          className="input" 
          value={data.countryRegion} 
          onChange={e => update({ countryRegion: e.target.value })} 
          placeholder="e.g. Kenya, East Africa"
        />
      </label>

      <label className="field">
        <span className="label">Organization *</span>
        <input 
          className="input" 
          value={data.organization} 
          onChange={e => update({ organization: e.target.value })} 
          placeholder="Your organization name"
        />
      </label>

      <div className="grid2">
        <label className="field">
          <span className="label">Currency</span>
          <select 
            className="input" 
            value={data.currency} 
            onChange={e => update({ currency: e.target.value })}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </label>
        <label className="field">
          <span className="label">Budget</span>
          <input 
            className="input" 
            value={data.budget} 
            onChange={e => update({ budget: e.target.value })} 
            placeholder="e.g. 50,000"
          />
        </label>
      </div>

      <label className="field">
        <span className="label">Duration</span>
        <input 
          className="input" 
          value={data.duration} 
          onChange={e => update({ duration: e.target.value })} 
          placeholder="e.g. 12 months"
        />
      </label>

      <label className="field">
        <span className="label">Sector</span>
        <select 
          className="input" 
          value={data.sector} 
          onChange={e => update({ sector: e.target.value })}
        >
          <option value="">Select sector…</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="WASH">WASH</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Economic Development">Economic Development</option>
          <option value="Other">Other</option>
        </select>
      </label>

      {data.sector === "Other" && (
        <label className="field">
          <span className="label">Specify sector</span>
          <input 
            className="input" 
            value={data.sectorOther || ""} 
            onChange={e => update({ sectorOther: e.target.value })} 
            placeholder="Please specify"
          />
        </label>
      )}

      <label className="field">
        <span className="label">Donor</span>
        <select 
          className="input" 
          value={data.donorChoice} 
          onChange={e => update({ donorChoice: e.target.value })}
        >
          <option value="">Select donor…</option>
          <option value="EU">EU</option>
          <option value="USAID">USAID</option>
          <option value="UN">UN</option>
          <option value="FAO">FAO</option>
          <option value="Other">Other</option>
        </select>
      </label>

      {data.donorChoice === "Other" && (
        <label className="field">
          <span className="label">Specify donor</span>
          <input 
            className="input" 
            value={data.donorOther || ""} 
            onChange={e => update({ donorOther: e.target.value })} 
            placeholder="Please specify"
          />
        </label>
      )}

      <div className="navrow">
        <button className="btn ghost" disabled>Back</button>
        <button 
          className="btn primary" 
          disabled={!canNext} 
          onClick={() => nav("/wizard/step-2")}
        >
          Next
        </button>
      </div>
    </section>
  );
}