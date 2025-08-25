import React from "react";
import { useWizard } from "../app/WizardContext";

export default function LivePreview() {
  const { data } = useWizard();
  
  return (
    <div className="intel-section">
      <div className="card example">
        <div className="card-title">Project Snapshot</div>
        <p><strong>{data.title || "Untitled Project"}</strong></p>
        <p>{data.organization} · {data.countryRegion}</p>
        <p>{data.duration} · {data.currency} {data.budget}</p>
        <p>Donor: {data.donorChoice}{data.donorChoice === "Other" && data.donorOther ? ` (${data.donorOther})` : ""}</p>
      </div>

      <div className="card example">
        <div className="card-title">Problem & Objectives</div>
        <p>{data.problemStatement || "—"}</p>
        <p><em>{data.objectives || "—"}</em></p>
      </div>

      <div className="card example">
        <div className="card-title">Implementation</div>
        <p><strong>Beneficiaries:</strong> {data.beneficiaries || "—"}</p>
        <p><strong>Activities:</strong> {data.activities || "—"}</p>
        <p><strong>Expected Results:</strong> {data.expectedResults || "—"}</p>
        <p><strong>Risks:</strong> {data.risks || "—"}</p>
      </div>

      {data.analysisText && (
        <div className="card example">
          <div className="card-title">AI Analysis</div>
          <p>{data.analysisText}</p>
        </div>
      )}
    </div>
  );
}