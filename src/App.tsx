// App.tsx — Bavarios-Exact UI (two-pane, examples, live preview)
import React, { createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ResizableTwoPane from "./components/ResizableTwoPane";

/* ---------- Grammar Correction Utility ---------- */
const correctGrammar = (text: string): string => {
  if (!text || text.trim().length === 0) return text;
  let corrected = text;

  corrected = corrected.replace(/^\s*([a-z])/g, (m, l) => m.replace(l, l.toUpperCase()));
  corrected = corrected.replace(/\.\s+([a-z])/g, (m, l) => m.replace(l, l.toUpperCase()));

  const grammarFixes: Array<[RegExp, string]> = [
    [/\bi is\b/g, "I am"], [/\bwe is\b/g, "we are"], [/\bthey is\b/g, "they are"], [/\byou is\b/g, "you are"],
    [/\ba ([aeiou])/gi, "an $1"], [/\ban ([^aeiou])/gi, "a $1"],
    [/\bthere is many\b/gi, "there are many"], [/\bthis are\b/gi, "these are"], [/\bthat are\b/gi, "those are"],
    [/\bin the rural area\b/gi, "in rural areas"], [/\bin the urban area\b/gi, "in urban areas"],
    [/\bmake a training\b/gi, "provide training"], [/\bdo a meeting\b/gi, "hold a meeting"],
    [/\b(\d+)\s+person\b/g, "$1 people"], [/\bmany person\b/gi, "many people"],
    [/\bfor (\d+) month\b/g, "for $1 months"]
  ];
  grammarFixes.forEach(([pattern, replacement]) => { corrected = corrected.replace(pattern, replacement); });
  corrected = corrected.replace(/\s+/g, " ").trim();
  if (corrected && !corrected.match(/[.!?]$/)) corrected += ".";
  return corrected;
};

/* ---------- Types ---------- */
export type WizardData = {
  title: string; countryRegion: string; organization: string; budget: string; duration: string;
  sector: "Health" | "Education" | "WASH" | "Agriculture" | "Economic Development" | "Other" | "";
  sectorOther?: string;
  donorChoice: "EU" | "USAID" | "UN" | "FAO" | "Other" | "";
  donorOther?: string;
  problemStatement: string; objectives: string; objectivePreset: string;
  beneficiaries: string; activities: string;
  expectedResults: string; risks: string;
  email: string; shareAnon: boolean; ghostMode: boolean; acknowledgeProtocols: boolean;
  analysisText: string;
};

const defaultData: WizardData = {
  title: "", countryRegion: "", organization: "", budget: "", duration: "",
  sector: "", sectorOther: "", donorChoice: "", donorOther: "",
  problemStatement: "", objectives: "", objectivePreset: "",
  beneficiaries: "", activities: "", expectedResults: "", risks: "",
  email: "", shareAnon: false, ghostMode: false, acknowledgeProtocols: false,
  analysisText: ""
};

/* ---------- Context ---------- */
const WizardCtx = createContext<{ data: WizardData; setData: React.Dispatch<React.SetStateAction<WizardData>>; }>
({ data: defaultData, setData: () => {} });
const useWizard = () => useContext(WizardCtx);

/* ---------- Frame Component ---------- */
const Frame: React.FC<{ stepIndex: number; total: number; children: React.ReactNode; preview: React.ReactNode; title: string; }> =
({ stepIndex, total, children, preview, title }) => {
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

      {/* NEW: Resizable split */}
      <ResizableTwoPane
        initialPct={40}
        minPct={35}
        maxPct={65}
        left={
          <section className="pane-left">
            <h2 className="pane-title">{title}</h2>
            <div className="pane-scroll">{children}</div>
          </section>
        }
        right={
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
        }
      />
    </div>
  );
};

/* ---------- Example helper UI ---------- */
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="section"><h3>{title}</h3>{children}</div>
);
const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; }> =
({ label, value, onChange, placeholder, type = "text" }) => (
  <label className="field">
    <div className="label">{label}</div>
    <input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type}/>
  </label>
);

/* ---------- Steps (simplified for clarity) ---------- */
const Step1: React.FC = () => {
  const { data, setData } = useWizard(); const nav = useNavigate();
  return (
    <Frame stepIndex={0} total={4} title="Basics" preview={<div>Preview</div>}>
      <Section title="Project Basics">
        <Input label="Concept Title" value={data.title} onChange={(v)=>setData(d=>({...d,title:v}))} placeholder="e.g., Pineapple Passion"/>
      </Section>
      <button onClick={()=>nav("/step-2")}>Next</button>
    </Frame>
  );
};
const Step2: React.FC = () => { const nav = useNavigate(); return <Frame stepIndex={1} total={4} title="Problem" preview={<div/>}><button onClick={()=>nav("/step-3")}>Next</button></Frame>; };
const Step3: React.FC = () => { const nav = useNavigate(); return <Frame stepIndex={2} total={4} title="Implementation" preview={<div/>}><button onClick={()=>nav("/step-4")}>Next</button></Frame>; };
const Step4: React.FC = () => { const nav = useNavigate(); return <Frame stepIndex={3} total={4} title="Finalize" preview={<div/>}><button onClick={()=>nav("/results")}>Submit</button></Frame>; };
const Results: React.FC = () => { const nav = useNavigate(); return <div className="app-root"><h2>Results</h2><button onClick={()=>nav("/step-1")}>Start Over</button></div>; };

/* ---------- App Shell ---------- */
const WizardProvider: React.FC<{children:React.ReactNode}> = ({ children }) => {
  const [data, setData] = useState<WizardData>(defaultData);
  return <WizardCtx.Provider value={{data,setData}}>{children}</WizardCtx.Provider>;
};

function App() {
  return (
    <WizardProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Step1/>}/>
          <Route path="/step-1" element={<Step1/>}/>
          <Route path="/step-2" element={<Step2/>}/>
          <Route path="/step-3" element={<Step3/>}/>
          <Route path="/step-4" element={<Step4/>}/>
          <Route path="/results" element={<Results/>}/>
        </Routes>
      </Router>
    </WizardProvider>
  );
}

export default App;
