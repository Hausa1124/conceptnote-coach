// App.tsx — Bavarios‑Exact UI (two‑pane, examples, live preview)
import React, { createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// ---------- Types ----------
export type WizardData = {
  // Step 1 — Basics
  title: string;
  countryRegion: string;
  organization: string;
  budget: string;
  duration: string;
  sector:
    | "Health"
    | "Education"
    | "WASH"
    | "Agriculture"
    | "Economic Development"
    | "Other"
    | "";
  sectorOther?: string;
  donorChoice: "EU" | "USAID" | "UN" | "FAO" | "Other" | "";
  donorOther?: string;

  // Step 2 — Problem & Objectives
  problemStatement: string;
  objectives: string;
  objectivePreset: string;

  // Step 3 — Beneficiaries & Activities
  beneficiaries: string;
  activities: string;

  // Step 4 — Results, Risks, Email, Protocols
  expectedResults: string;
  risks: string; // newline-delimited list incl. common risk selections
  email: string;
  shareAnon: boolean;
  ghostMode: boolean;
  acknowledgeProtocols: boolean;

  // API
  analysisText: string;
};

const defaultData: WizardData = {
  title: "",
  countryRegion: "",
  organization: "",
  budget: "",
  duration: "",
  sector: "",
  sectorOther: "",
  donorChoice: "",
  donorOther: "",
  problemStatement: "",
  objectives: "",
  objectivePreset: "",
  beneficiaries: "",
  activities: "",
  expectedResults: "",
  risks: "",
  email: "",
  shareAnon: false,
  ghostMode: false,
  acknowledgeProtocols: false,
  analysisText: "",
};

// ---------- Examples by Sector (cards + nudges) ----------
const examplesBySector = {
  "Economic Development": {
    problemNudge: "150–200 words describing the situation and challenges",
    problemExample: [
      "Smallholder households face price volatility and limited market access; women-led cooperatives lack post-harvest handling leading to 25–35% losses.",
    ],
    objectivesExample: [
      "Increase household income by 35% for target beneficiaries within 24 months",
      "Establish 10 village savings and loan associations",
      "Train 200 entrepreneurs in business management skills",
    ],
    beneficiariesNudge: "Be specific about who, how many, and key demographics",
    beneficiariesExample: [
      "300 low‑income households (70% women‑led) in peri‑urban areas; focus on micro‑entrepreneurs and informal sector workers.",
    ],
    activitiesNudge: "4–6 concrete activities that will achieve your objectives",
    activitiesExample: [
      "Facilitate access to microfinance and credit",
      "Establish market linkages for small businesses",
      "Create cooperative purchasing groups for bulk buying",
    ],
    resultsExample: [
      "Household income increases by 35% on average",
      "200 entrepreneurs complete business training",
      "10 savings groups mobilize $50,000 in community savings",
      "150 new micro‑enterprises established",
    ],
    commonRisks: [
      "Price/Market Volatility",
      "Low Participation Rates",
      "Quality Control Issues",
      "Stakeholder Conflicts",
      "Funding Delays",
    ],
  },
  Agriculture: {
    problemNudge: "150–200 words on yields, inputs, extension services, shocks",
    problemExample: [
      "Pineapple yields remain low due to poor planting material and limited access to agronomic training; post‑harvest loss >30%.",
    ],
    objectivesExample: [
      "Improve average yield by 25% within 18 months",
      "Reduce post‑harvest losses to <10% via collective processing",
      "Train 300 farmers on GAP and quality standards",
    ],
    beneficiariesNudge: "Who farms, where, how many, gender/age mix",
    beneficiariesExample: [
      "1,000 smallholder farmers (60% women) in Gakenke and Nyabihu; organized in 30 producer groups.",
    ],
    activitiesNudge: "4–6 activities (training, inputs, aggregation, QA)",
    activitiesExample: [
      "Seasonal agronomy trainings on spacing, fertilization, pest control",
      "Set up 2 aggregation centers with cold storage",
      "Introduce standardized grading and bulking for traders",
    ],
    resultsExample: [
      "Average yield rises from 12t/ha to 15t/ha",
      "Post‑harvest loss reduced to 8%",
      "2 functioning aggregation centers established",
    ],
    commonRisks: [
      "Weather/Climate Shocks",
      "Price/Market Volatility",
      "Quality Control Issues",
      "Funding Delays",
    ],
  },
  Health: {
    problemNudge: "150–200 words on access, quality, outcomes, equity",
    problemExample: [
      "High maternal anemia and low ANC attendance in rural zones; stockouts and distance limit service uptake.",
    ],
    objectivesExample: [
      "Increase ANC 4+ visits from 42% to 65%",
      "Reduce anemia prevalence among pregnant women by 20%",
    ],
    beneficiariesNudge: "Who, how many, age/sex, vulnerabilities",
    beneficiariesExample: ["5,000 women of reproductive age across 12 health catchments."],
    activitiesNudge: "4–6 interventions (outreach, counseling, supply)",
    activitiesExample: ["Community outreach, CHW training, micronutrient supply chains."],
    resultsExample: ["ANC coverage improved; anemia reduced; improved stock reliability"],
    commonRisks: ["Stockouts", "Staff turnover", "Misinformation"],
  },
} as const;

type SectorKey = keyof typeof examplesBySector;

// ---------- Context ----------
const WizardCtx = createContext<{
  data: WizardData;
  setData: React.Dispatch<React.SetStateAction<WizardData>>;
}>({ data: defaultData, setData: () => {} });
const useWizard = () => useContext(WizardCtx);

// ---------- Layout ----------
const Frame: React.FC<{
  stepIndex: number;
  total: number;
  children: React.ReactNode;
  preview: React.ReactNode;
  title: string;
}> = ({ stepIndex, total, children, preview, title }) => {
  return (
    <div className="app-root">
      <header className="app-top">
        <div className="brand">◎ Concept Note Coach</div>
        <div className="progress">
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={`dot ${i <= stepIndex ? "active" : ""}`} />
          ))}
          <span className="step-text">Step {stepIndex + 1} of {total}</span>
        </div>
        <div className="secure">Secure Mode</div>
      </header>

      <div className="two-pane">
        <section className="pane-left">
          <h2 className="pane-title">{title}</h2>
          <div className="pane-scroll">{children}</div>
        </section>
        <aside className="pane-right">
          <div className="pane-scroll">
            <div className="preview">
              <div className="preview-head">
                <span className="dot live" /> LIVE FEED ACTIVE
              </div>
              {preview}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const ExampleCard: React.FC<{ title: string; items: readonly string[] }> = ({ title, items }) => (
  <div className="card example">
    <div className="card-title">{title}</div>
    <ul className="card-list">{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
  </div>
);

const HelperText: React.FC<{ text: string }> = ({ text }) => <div className="helper">{text}</div>;

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="section">
    <h3>{title}</h3>
    {children}
  </div>
);

// ---------- Intelligence Preview (right pane) ----------
const IntelligencePreview: React.FC = () => {
  const { data } = useWizard();
  return (
    <div className="intel">
      <FieldRead label="Mission Designation" value={data.title || "—"} />
      <FieldRead label="Operational Zone" value={data.countryRegion || "—"} />
      <FieldRead
        label="Funding Source"
        value={
          data.donorChoice === "Other" ? (data.donorOther || "Other") : (data.donorChoice || "—")
        }
      />
      <FieldRead
        label="Sector Classification"
        value={data.sector === "Other" ? (data.sectorOther || "Other") : (data.sector || "—")}
      />
    </div>
  );
};

const FieldRead: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="read">
    <div className="read-label">{label}</div>
    <div className="read-value">{value}</div>
  </div>
);

// ---------- Inputs ----------
const Input: React.FC<{
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}> = ({ label, value, onChange, placeholder, type = "text" }) => (
  <label className="field">
    <div className="label">{label}</div>
    <input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type} />
  </label>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; }> =
({ label, value, onChange, placeholder }) => (
  <label className="field">
    <div className="label">{label}</div>
    <textarea className="textarea" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </label>
);

const Select: React.FC<{
  label: string; value: string; onChange: (v: string) => void; options: readonly string[]; placeholder?: string;
}> = ({ label, value, onChange, options, placeholder }) => (
  <label className="field">
    <div className="label">{label}</div>
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder || "Select"}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </label>
);

const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void; note?: string; }> =
({ label, checked, onChange, note }) => (
  <label className="check">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span>{label}</span>
    {note && <div className="check-note">{note}</div>}
  </label>
);

const NavRow: React.FC<{ onPrev?: () => void; onNext?: () => void; nextLabel?: string; disabledNext?: boolean; }> =
({ onPrev, onNext, nextLabel = "Next", disabledNext }) => (
  <div className="navrow">
    {onPrev ? <button className="btn ghost" onClick={onPrev}>Previous</button> : <span />}
    {onNext && (
      <button className="btn primary" onClick={onNext} disabled={!!disabledNext}>
        {nextLabel}
      </button>
    )}
  </div>
);

// ---------- Steps ----------
const Step1: React.FC = () => {
  const { data, setData } = useWizard();
  const nav = useNavigate();
  return (
    <Frame stepIndex={0} total={4} title="Basics" preview={<IntelligencePreview />}>
      <Section title="Project Basics">
        <Input label="Concept Title" value={data.title} onChange={(v) => setData(d => ({ ...d, title: v }))} placeholder="e.g., Pineapple Passion" />
        <Input label="Country/Region" value={data.countryRegion} onChange={(v) => setData(d => ({ ...d, countryRegion: v }))} placeholder="rwanda" />
        <Input label="Organization" value={data.organization} onChange={(v) => setData(d => ({ ...d, organization: v }))} />
        <div className="grid2">
          <Input label="Budget (USD)" value={data.budget} onChange={(v) => setData(d => ({ ...d, budget: v }))} />
          <Input label="Duration (months)" value={data.duration} onChange={(v) => setData(d => ({ ...d, duration: v }))} />
        </div>
        <Select
          label="Sector"
          value={data.sector}
          onChange={(v) => setData(d => ({ ...d, sector: v as WizardData["sector"] }))}
          options={["Economic Development", "Agriculture", "Health", "Education", "WASH", "Other"]}
          placeholder="Select sector"
        />
        {data.sector === "Other" && (
          <Input label="Sector (Other)" value={data.sectorOther || ""} onChange={(v) => setData(d => ({ ...d, sectorOther: v }))} />
        )}
        <Select
          label="Donor"
          value={data.donorChoice}
          onChange={(v) => setData(d => ({ ...d, donorChoice: v as WizardData["donorChoice"] }))}
          options={["EU", "USAID", "UN", "FAO", "Other"]}
          placeholder="Select donor"
        />
        {data.donorChoice === "Other" && (
          <Input label="Donor (Other)" value={data.donorOther || ""} onChange={(v) => setData(d => ({ ...d, donorOther: v }))} />
        )}
      </Section>
      <NavRow onNext={() => nav("/step-2")} />
    </Frame>
  );
};

const Step2: React.FC = () => {
  const { data, setData } = useWizard();
  const nav = useNavigate();
  // SAFE FALLBACK for sectors without examples
  const ex =
    (examplesBySector as Record<string, typeof examplesBySector["Economic Development"]>)[
      data.sector as string
    ] ?? examplesBySector["Economic Development"];

  return (
    <Frame stepIndex={1} total={4} title="Problem Statement" preview={<IntelligencePreview />}>
      <Section title="Problem Statement">
        <ExampleCard title="EXAMPLE PROBLEM" items={ex.problemExample} />
        <TextArea label="Problem Statement" value={data.problemStatement} onChange={(v) => setData(d => ({ ...d, problemStatement: v }))} placeholder={ex.problemNudge} />
        <HelperText text={ex.problemNudge} />
      </Section>

      <Section title="Project Objectives">
        <ExampleCard title="EXAMPLE SMART OBJECTIVES" items={ex.objectivesExample} />
        <TextArea label="Objectives" value={data.objectives} onChange={(v) => setData(d => ({ ...d, objectives: v }))} placeholder="Write your objectives…" />
      </Section>

      <NavRow onPrev={() => nav("/step-1")} onNext={() => nav("/step-3")} />
    </Frame>
  );
};

const Step3: React.FC = () => {
  const { data, setData } = useWizard();
  const nav = useNavigate();
  // SAFE FALLBACK for sectors without examples
  const ex =
    (examplesBySector as Record<string, typeof examplesBySector["Economic Development"]>)[
      data.sector as string
    ] ?? examplesBySector["Economic Development"];

  return (
    <Frame stepIndex={2} total={4} title="Implementation Plan" preview={<IntelligencePreview />}>
      <Section title="Target Beneficiaries">
        <ExampleCard title="EXAMPLE BENEFICIARY DESCRIPTION" items={ex.beneficiariesExample} />
        <TextArea label="Beneficiaries" value={data.beneficiaries} onChange={(v) => setData(d => ({ ...d, beneficiaries: v }))} placeholder={ex.beneficiariesNudge} />
        <HelperText text={ex.beneficiariesNudge} />
      </Section>

      <Section title="Project Activities">
        <ExampleCard title="EXAMPLE ACTIVITIES" items={ex.activitiesExample} />
        <TextArea label="Activities" value={data.activities} onChange={(v) => setData(d => ({ ...d, activities: v }))} placeholder={ex.activitiesNudge} />
        <HelperText text={ex.activitiesNudge} />
      </Section>

      <Section title="Expected Results">
        <ExampleCard title="EXAMPLE RESULTS" items={ex.resultsExample} />
      </Section>

      <NavRow onPrev={() => nav("/step-2")} onNext={() => nav("/step-4")} />
    </Frame>
  );
};

const Step4: React.FC = () => {
  const { data, setData } = useWizard();
  const nav = useNavigate();
  // SAFE FALLBACK for sectors without examples
  const ex =
    (examplesBySector as Record<string, typeof examplesBySector["Economic Development"]>)[
      data.sector as string
    ] ?? examplesBySector["Economic Development"];

  const canSubmit = data.acknowledgeProtocols;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async () => {
    setLoading(true); setError(undefined);
    try {
      const res = await fetch("/.netlify/functions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data })
      });
      const text = await res.text();
      let analysis = "";
      try { const parsed = JSON.parse(text); analysis = parsed.analysis || parsed.text || text; }
      catch { analysis = text; }
      setData(d => ({ ...d, analysisText: analysis }));
      nav("/results");
    } catch (e: any) {
      setError(e?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Frame stepIndex={3} total={4} title="Risk & Resources" preview={<IntelligencePreview />}>
      <Section title="Common Project Risks">
        <div className="grid2">
          {ex.commonRisks.map((r) => (
            <Checkbox
              key={r}
              label={r}
              checked={data.risks.includes(r)}
              onChange={(v) => {
                setData(d => ({
                  ...d,
                  risks: v
                    ? (d.risks ? `${d.risks}\n${r}` : r)
                    : (d.risks || "").split("\n").filter((x) => x !== r).join("\n")
                }));
              }}
            />
          ))}
        </div>
      </Section>

      <Section title="Additional Risks">
        <TextArea label="Add any specific risks not covered above…" value={data.risks} onChange={(v) => setData(d => ({ ...d, risks: v }))} />
      </Section>

      <Section title="Email & Protocols">
        <Input label="Your Email" value={data.email} onChange={(v) => setData(d => ({ ...d, email: v }))} placeholder="your@email.com" type="email" />
        <Checkbox label="Share anonymized data for intelligence enhancement" checked={data.shareAnon} onChange={(v) => setData(d => ({ ...d, shareAnon: v }))} />
        <Checkbox label="Activate ghost mode: zero data retention" checked={data.ghostMode} onChange={(v) => setData(d => ({ ...d, ghostMode: v }))} />
        <Checkbox
          label="Acknowledge operational protocols"
          checked={data.acknowledgeProtocols}
          onChange={(v) => setData(d => ({ ...d, acknowledgeProtocols: v }))}
          note={!data.acknowledgeProtocols ? "Required: Must acknowledge protocols to proceed" : undefined}
        />
        <div className="security">
          Security Notice: Data processed through encrypted channels. Ghost mode ensures zero‑trace operations. Intelligence never used for external training protocols.
        </div>
      </Section>

      {error && <div className="error">{error}</div>}

      <div className="navrow">
        <button className="btn ghost" onClick={() => nav("/step-3")}>Previous</button>
        <button className="btn primary" onClick={handleSubmit} disabled={!canSubmit || loading}>
          {loading ? "Generating…" : "⚡ Generate Intelligence"}
        </button>
      </div>
    </Frame>
  );
};

const Results: React.FC = () => {
  const { data } = useWizard();
  const nav = useNavigate();
  return (
    <div className="app-root">
      <header className="app-top">
        <div className="brand">◎ Concept Note Coach</div>
        <div />
        <div className="secure">Secure Mode</div>
      </header>
      <div className="results">
        <h2>Results</h2>
        {data.analysisText ? (
          <pre className="analysis">{data.analysisText}</pre>
        ) : (
          <div className="helper">No analysis yet. Please go back and submit.</div>
        )}
        <div className="navrow">
          <button className="btn ghost" onClick={() => nav("/")}>Back to Start</button>
        </div>
      </div>
    </div>
  );
};

// ---------- App Shell ----------
const AppInner: React.FC = () => {
  const [data, setData] = useState<WizardData>(defaultData);
  return (
    <WizardCtx.Provider value={{ data, setData }}>
      <Routes>
        <Route path="/" element={<Step1 />} />
        <Route path="/step-1" element={<Step1 />} />
        <Route path="/step-2" element={<Step2 />} />
        <Route path="/step-3" element={<Step3 />} />
        <Route path="/step-4" element={<Step4 />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </WizardCtx.Provider>
  );
};

export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
