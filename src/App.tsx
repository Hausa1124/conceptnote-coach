// App.tsx — Bavarios-Exact UI (two-pane, examples, live preview)
import React, { createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

/* ---------- Types ---------- */
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

/* ---------- Examples by Sector (cards + nudges) ---------- */
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
      "300 low-income households (70% women-led) in peri-urban areas; focus on micro-entrepreneurs and informal sector workers.",
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
      "150 new micro-enterprises established",
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
      "Pineapple yields remain low due to poor planting material and limited access to agronomic training; post-harvest loss >30%.",
    ],
    objectivesExample: [
      "Improve average yield by 25% within 18 months",
      "Reduce post-harvest losses to <10% via collective processing",
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
      "Post-harvest loss reduced to 8%",
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

/* ---------- Type-safe key picker ---------- */
type SectorKey = keyof typeof examplesBySector;
function pickSector(key: string): SectorKey {
  const allowed = Object.keys(examplesBySector) as SectorKey[];
  return allowed.includes(key as SectorKey) ? (key as SectorKey) : "Economic Development";
}

/* ---------- Context ---------- */
const WizardCtx = createContext<{
  data: WizardData;
  setData: React.Dispatch<React.SetStateAction<WizardData>>;
}>({ data: defaultData, setData: () => {} });

const useWizard = () => useContext(WizardCtx);

/* ---------- Reusable UI ---------- */
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

const FieldRead: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="read">
    <div className="read-label">{label}</div>
    <div className="read-value">{value}</div>
  </div>
);

/* ---------- Intelligence Preview (right pane) ---------- */
const IntelligencePreview: React.FC = () => {
  const { data } = useWizard();
  return (
    <div className="intel">
      {/* Basic Information */}
      <div className="intel-section">
        <h4 className="intel-section-title">Project Basics</h4>
        <FieldRead label="Mission Designation" value={data.title || "—"} />
        <FieldRead label="Operational Zone" value={data.countryRegion || "—"} />
        <FieldRead label="Organization" value={data.organization || "—"} />
        <FieldRead label="Budget (USD)" value={data.budget || "—"} />
        <FieldRead label="Duration (months)" value={data.duration || "—"} />
        <FieldRead
          label="Funding Source"
          value={data.donorChoice === "Other" ? (data.donorOther || "Other") : (data.donorChoice || "—")}
        />
        <FieldRead
          label="Sector Classification"
          value={data.sector === "Other" ? (data.sectorOther || "Other") : (data.sector || "—")}
        />
      </div>

      {/* Problem & Objectives */}
      {(data.problemStatement || data.objectives) && (
        <div className="intel-section">
          <h4 className="intel-section-title">Problem & Objectives</h4>
          {data.problemStatement && (
            <FieldRead 
              label="Problem Statement" 
              value={data.problemStatement.length > 150 
                ? data.problemStatement.substring(0, 150) + "..." 
                : data.problemStatement
              } 
            />
          )}
          {data.objectives && (
            <FieldRead 
              label="Objectives" 
              value={data.objectives.length > 150 
                ? data.objectives.substring(0, 150) + "..." 
                : data.objectives
              } 
            />
          )}
        </div>
      )}

      {/* Implementation Plan */}
      {(data.beneficiaries || data.activities || data.expectedResults) && (
        <div className="intel-section">
          <h4 className="intel-section-title">Implementation</h4>
          {data.beneficiaries && (
            <FieldRead 
              label="Target Beneficiaries" 
              value={data.beneficiaries.length > 100 
                ? data.beneficiaries.substring(0, 100) + "..." 
                : data.beneficiaries
              } 
            />
          )}
          {data.activities && (
            <FieldRead 
              label="Key Activities" 
              value={data.activities.length > 100 
                ? data.activities.substring(0, 100) + "..." 
                : data.activities
              } 
            />
          )}
          {data.expectedResults && (
            <FieldRead 
              label="Expected Results" 
              value={data.expectedResults.length > 100 
                ? data.expectedResults.substring(0, 100) + "..." 
                : data.expectedResults
              } 
            />
          )}
        </div>
      )}

      {/* Risk Assessment */}
      {data.risks && (
        <div className="intel-section">
          <h4 className="intel-section-title">Risk Assessment</h4>
          <FieldRead 
            label="Identified Risks" 
            value={(() => {
              const riskList = data.risks.split('\n').filter(r => r.trim());
              if (riskList.length === 0) return "—";
              if (riskList.length <= 3) return riskList.join(', ');
              return `${riskList.slice(0, 3).join(', ')} (+${riskList.length - 3} more)`;
            })()} 
          />
        </div>
      )}

      {/* Contact & Settings */}
      {(data.email || data.shareAnon || data.ghostMode) && (
        <div className="intel-section">
          <h4 className="intel-section-title">Settings</h4>
          {data.email && <FieldRead label="Contact Email" value={data.email} />}
          {data.shareAnon && <FieldRead label="Anonymous Sharing" value="Enabled" />}
          {data.ghostMode && <FieldRead label="Ghost Mode" value="Active" />}
        </div>
      )}
    </div>
        />
        <FieldRead
          label="Sector Classification"
          value={data.sector === "Other" ? (data.sectorOther || "Other") : (data.sector || "—")}
        />
      </div>

      {/* Problem & Objectives */}
      {(data.problemStatement || data.objectives) && (
        <div className="intel-section">
          <h4 className="intel-section-title">Problem & Objectives</h4>
          {data.problemStatement && (
            <FieldRead 
              label="Problem Statement" 
              value={data.problemStatement.length > 150 
                ? data.problemStatement.substring(0, 150) + "..." 
                : data.problemStatement
              } 
            />
          )}
          {data.objectives && (
            <FieldRead 
              label="Objectives" 
              value={data.objectives.length > 150 
                ? data.objectives.substring(0, 150) + "..." 
                : data.objectives
              } 
            />
          )}
        </div>
      )}

      {/* Implementation Plan */}
      {(data.beneficiaries || data.activities || data.expectedResults) && (
        <div className="intel-section">
          <h4 className="intel-section-title">Implementation</h4>
          {data.beneficiaries && (
            <FieldRead 
              label="Target Beneficiaries" 
              value={data.beneficiaries.length > 100 
                ? data.beneficiaries.substring(0, 100) + "..." 
                : data.beneficiaries
              } 
            />
          )}
          {data.activities && (
            <FieldRead 
              label="Key Activities" 
              value={data.activities.length > 100 
                ? data.activities.substring(0, 100) + "..." 
                : data.activities
              } 
            />
          )}
          {data.expectedResults && (
            <FieldRead 
              label="Expected Results" 
              value={data.expectedResults.length > 100 
                ? data.expectedResults.substring(0, 100) + "..." 
                : data.expectedResults
              } 
            />
          )}
        </div>
      )}

      {/* Risk Assessment */}
      {data.risks && (
        <div className="intel-section">
          <h4 className="intel-section-title">Risk Assessment</h4>
          <FieldRead 
            label="Identified Risks" 
            value={(() => {
              const riskList = data.risks.split('\n').filter(r => r.trim());
              if (riskList.length === 0) return "—";
              if (riskList.length <= 3) return riskList.join(', ');
              return `${riskList.slice(0, 3).join(', ')} (+${riskList.length - 3} more)`;
            })()} 
          />
        </div>
      )}

      {/* Contact & Settings */}
      {(data.email || data.shareAnon || data.ghostMode) && (
        <div className="intel-section">
          <h4 className="intel-section-title">Settings</h4>
          {data.email && <FieldRead label="Contact Email" value={data.email} />}
          {data.shareAnon && <FieldRead label="Anonymous Sharing" value="Enabled" />}
          {data.ghostMode && <FieldRead label="Ghost Mode" value="Active" />}
        </div>
      )}
    </div>
  );
};

/* ---------- Inputs ---------- */
const Input: React.FC<{
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}> = ({ label, value, onChange, placeholder, type = "text" }) => (
  <label className="field">
    <div className="label">{label}</div>
    <input
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
    />
  </label>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; }> =
({ label, value, onChange, placeholder }) => (
  <label className="field">
    <div className="label">{label}</div>
    <textarea
      className="textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
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

/* ---------- Steps ---------- */
const Step1: React.FC = () => {
  const { data, setData } = useWizard();
  const nav = useNavigate();
  return (
    <Frame stepIndex={0} total={4} title="Basics" preview={<IntelligencePreview />}>
      <Section title="Project Basics">
        <Input label="Concept Title" value={data.title} onChange={(v) => setData(d => ({ ...d, title: v }))} placeholder="e.g., Pineapple Passion" />
        <Input label="Country/Region" value={data.countryRegion} onChange={(v) => setData(d => ({ ...d, countryRegion: v }))} placeholder="Rwanda" />
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
  const ex = examplesBySector[pickSector(data.sector)];

  return (
    <Frame stepIndex={1} total={4} title="Problem Statement" preview={<IntelligencePreview />}>
      <Section title="Problem Statement">
        <ExampleCard title="EXAMPLE PROBLEM" items={ex.problemExample} />
        <TextArea label="Problem Statement" value={data.problemStatement} onChange={(v) => setData(d => ({ ...d, problemStatement: v }))} placeholder={ex.problemNudge} />
        <HelperText text={ex.problemNudge} />
      </Section>

      <Section title="Project Objectives">
        <ExampleCard title="EXAMPLE SMART OBJECTIVES" items={ex.objectivesExample} />
        <TextArea
          label="Objectives"
          value={data.objectives}
          onChange={(v) => setData(d => ({ ...d, objectives: v }))}
          placeholder="Write your objectives…"
        />
      </Section>

      <NavRow onPrev={() => nav("/step-1")} onNext={() => nav("/step-3")} />
    </Frame>
  );
};

const Step3: React.FC = () => {
  const { data, setData } = useWizard();
  const nav = useNavigate();
  const ex = examplesBySector[pickSector(data.sector)];

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
        <TextArea
          label="Expected Results (your draft)"
          value={data.expectedResults}
          onChange={(v) => setData(d => ({ ...d, expectedResults: v }))}
          placeholder="List the measurable outputs/outcomes you expect…"
        />
      </Section>

      <NavRow onPrev={() => nav("/step-2")} onNext={() => nav("/step-4")} />
    </Frame>
  );
};

const Step4: React.FC = () => {
  const { data, setData } = useWizard();
  const nav = useNavigate();
  const ex = examplesBySector[pickSector(data.sector)];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Current selections as array & set
  const selectedList: string[] = (data.risks || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const selectedSet = new Set<string>(selectedList);
  const commonRisks: string[] = [...ex.commonRisks];

  // Toggle helper for common risks
  const toggleRisk = (r: string) => {
    const next = new Set<string>(selectedSet);
    if (next.has(r)) next.delete(r);
    else next.add(r);
    setData((d) => ({ ...d, risks: Array.from(next).join("\n") }));
  };

  // Only non-common risks shown in the textbox
  const otherRisksText: string = selectedList
    .filter((r) => !commonRisks.includes(r))
    .join("\n");

  const canSubmit = data.acknowledgeProtocols;

  const handleSubmit = async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch("/.netlify/functions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      });
      const text = await res.text();
      let analysis = "";
      try {
        const parsed = JSON.parse(text);
        analysis = (parsed as any).analysis || (parsed as any).text || text;
      } catch {
        analysis = text;
      }
      setData((d) => ({ ...d, analysisText: analysis }));
      nav("/results");
    } catch (e: any) {
      setError(e?.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Frame stepIndex={3} total={4} title="Finalize & Submit" preview={<IntelligencePreview />}>
      <Section title="Risk Register (select all that apply)">
        <div className="card">
          <div className="grid2">
            {commonRisks.map((r) => (
              <Checkbox
                key={r}
                label={r}
                checked={selectedSet.has(r)}
                onChange={() => toggleRisk(r)}
              />
            ))}
          </div>

          <TextArea
            label="Other Risks (one per line)"
            value={otherRisksText}
            onChange={(v) => {
              const customs: string[] = v
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);
              const base: string[] = commonRisks.filter((r) => selectedSet.has(r));
              setData((d) => ({ ...d, risks: [...base, ...customs].join("\n") }));
            }}
            placeholder="Add any additional risks…"
          />
        </div>
      </Section>

      <Section title="Contact & Protocols">
        <Input
          label="Email for results"
          value={data.email}
          onChange={(v) => setData((d) => ({ ...d, email: v }))}
          placeholder="you@example.com"
          type="email"
        />
        <div className="grid2">
          <Checkbox
            label="Share learnings anonymously to improve the tool"
            checked={data.shareAnon}
            onChange={(v) => setData((d) => ({ ...d, shareAnon: v }))}
          />
          <Checkbox
            label="Ghost Mode (hide donor hints)"
            checked={data.ghostMode}
            onChange={(v) => setData((d) => ({ ...d, ghostMode: v }))}
          />
        </div>
        <Checkbox
          label="I acknowledge data handling and consent protocols."
          checked={data.acknowledgeProtocols}
          onChange={(v) => setData((d) => ({ ...d, acknowledgeProtocols: v }))}
          note="Required to submit."
        />
      </Section>

      {error && <div className="error">{error}</div>}
      <NavRow
        onPrev={() => nav("/step-3")}
        onNext={handleSubmit}
        nextLabel={loading ? "Submitting..." : "Submit"}
        disabledNext={!canSubmit || loading}
      />
    </Frame>
  );
};

/* ---------- Results Page ---------- */
const Results: React.FC = () => {
  const { data } = useWizard();
  const nav = useNavigate();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(data.analysisText || "");
      alert("Copied analysis to clipboard.");
    } catch {
      alert("Copy failed.");
    }
  };

  return (
    <div className="app-root">
      <header className="app-top">
        <div className="brand">◎ Concept Note Coach</div>
        <div className="spacer" />
        <button className="btn ghost" onClick={() => nav("/step-1")}>Start Over</button>
      </header>
      <div className="results-wrap">
        <h2>Analysis Result</h2>
        <div className="result-box">
          {data.analysisText ? (
            <pre className="result-pre">{data.analysisText}</pre>
          ) : (
            <div className="helper">No analysis text found. Please submit again.</div>
          )}
        </div>
        <div className="navrow">
          <button className="btn ghost" onClick={() => nav("/step-4")}>Back</button>
          <button className="btn primary" onClick={copy}>Copy</button>
        </div>
      </div>
    </div>
  );
};

/* ---------- App Shell + Provider ---------- */
const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WizardData>(defaultData);
  return <WizardCtx.Provider value={{ data, setData }}>{children}</WizardCtx.Provider>;
};

function App() {
  return (
    <WizardProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Step1 />} />
          <Route path="/step-1" element={<Step1 />} />
          <Route path="/step-2" element={<Step2 />} />
          <Route path="/step-3" element={<Step3 />} />
          <Route path="/step-4" element={<Step4 />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </Router>
    </WizardProvider>
  );
}

export default App;
