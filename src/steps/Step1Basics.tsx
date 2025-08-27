import React from "react";
import { useNavigate } from "react-router-dom";
import { useWizard } from "../context/WizardContext";

export default function Step1Basics() {
  const { data, update } = useWizard();
  const nav = useNavigate();

  return (
    <div>
      <h2>Step 1 — Basics</h2>
      <div>
        <label>Title</label>
        <input value={data.title} onChange={(e) => update({ title: e.target.value })} style={inp} />
      </div>
      <div>
        <label>Organization</label>
        <input value={data.organization} onChange={(e) => update({ organization: e.target.value })} style={inp} />
      </div>
      <div>
        <label>Country / Region</label>
        <input value={data.countryRegion} onChange={(e) => update({ countryRegion: e.target.value })} style={inp} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label>Budget</label>
          <input value={data.budget} onChange={(e) => update({ budget: e.target.value })} style={inp} />
        </div>
        <div style={{ flex: 1 }}>
          <label>Duration</label>
          <input value={data.duration} onChange={(e) => update({ duration: e.target.value })} style={inp} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label>Sector</label>
          <select value={data.sector} onChange={(e) => update({ sector: e.target.value as any })} style={inp}>
            <option value=""></option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="WASH">WASH</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Economic Development">Economic Development</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {data.sector === "Other" && (
          <div style={{ flex: 1 }}>
            <label>Sector (Other)</label>
            <input value={data.sectorOther || ""} onChange={(e) => update({ sectorOther: e.target.value })} style={inp} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label>Donor</label>
          <select value={data.donorChoice} onChange={(e) => update({ donorChoice: e.target.value as any })} style={inp}>
            <option value=""></option>
            <option value="EU">EU</option>
            <option value="USAID">USAID</option>
            <option value="UN">UN</option>
            <option value="FAO">FAO</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {data.donorChoice === "Other" && (
          <div style={{ flex: 1 }}>
            <label>Donor (Other)</label>
            <input value={data.donorOther || ""} onChange={(e) => update({ donorOther: e.target.value })} style={inp} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <span></span>
        <button onClick={() => nav("/step2")} style={btn}>Next →</button>
      </div>
    </div>
  );
}

const inp: React.CSSProperties = { width: "100%", padding: 10, borderRadius: 8, border: "1px solid #D1D5DB", marginBottom: 8 };
const btn: React.CSSProperties = { padding: "10px 14px", borderRadius: 10, border: "1px solid #111827", background: "white", cursor: "pointer" };