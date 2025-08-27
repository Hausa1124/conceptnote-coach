import React from "react";
import { useWizard } from "../context/WizardContext";

export default function LivePreview() {
  const { data } = useWizard();
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Concept Note — Live Preview</h2>

      <section style={{ marginBottom: 16 }}>
        <h3>1) Basics</h3>
        <p><strong>Title:</strong> {data.title || "—"}</p>
        <p><strong>Organization:</strong> {data.organization || "—"}</p>
        <p><strong>Region:</strong> {data.countryRegion || "—"}</p>
        <p><strong>Budget & Duration:</strong> {data.budget || "—"} • {data.duration || "—"}</p>
        <p><strong>Sector/Donor:</strong> {(data.sector || "—") + (data.sector === "Other" && data.sectorOther ? ` (${data.sectorOther})` : "")} • {(data.donorChoice || "—") + (data.donorChoice === "Other" && data.donorOther ? ` (${data.donorOther})` : "")}</p>
      </section>

      <section style={{ marginBottom: 16 }}>
        <h3>2) Problem & Objectives</h3>
        <p><strong>Problem Statement:</strong> {data.problemStatement || "—"}</p>
        <p><strong>Objectives:</strong> {data.objectives || "—"}</p>
      </section>

      <section style={{ marginBottom: 16 }}>
        <h3>3) Beneficiaries, Activities, Expected Results</h3>
        <p><strong>Beneficiaries:</strong> {data.beneficiaries || "—"}</p>
        <p><strong>Activities:</strong> {data.activities || "—"}</p>
        <p><strong>Expected Results:</strong> {data.expected || "—"}</p>
      </section>

      {(data.risks || data.mitigations) && (
        <section style={{ marginBottom: 16 }}>
          <h3>4) Risk Management</h3>
          <p><strong>Risks:</strong> {data.risks || "—"}</p>
          <p><strong>Mitigations:</strong> {data.mitigations || "—"}</p>
        </section>
      )}

      <section>
        <h3>Summary Snippet</h3>
        <p>
          {(data.title || "Project")} will support {(data.beneficiaries || "target groups")} in {(data.countryRegion || "the region")} via
          activities such as {(data.activities || "key interventions")}, aiming for {(data.expected || "measurable improvements")}.
        </p>
      </section>
    </div>
  );
}