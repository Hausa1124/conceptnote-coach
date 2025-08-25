// App.tsx — Bavarios-Exact UI (two-pane, examples, live preview)
import React, { createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

/* ---------- Grammar Correction Utility ---------- */
const correctGrammar = (text: string): string => {
  if (!text || text.trim().length === 0) return text;

  let corrected = text;
  corrected = corrected.replace(/^\s*([a-z])/g, (m, l) => m.replace(l, l.toUpperCase()));
  corrected = corrected.replace(/\.\s+([a-z])/g, (m, l) => m.replace(l, l.toUpperCase()));

  corrected = corrected.replace(/\s+/g, " ").trim();
  if (corrected && !corrected.match(/[.!?]$/)) corrected += ".";
  return corrected;
};

/* ---------- Types ---------- */
export type WizardData = {
  title: string;
  countryRegion: string;
  organization: string;
  budget: string;
  duration: string;
  sector: string;
  sectorOther?: string;
  donorChoice: string;
  donorOther?: string;
  problemStatement: string;
  objectives: string;
  objectivePreset: string;
  beneficiaries: string;
  activities: string;
  expectedResults: string;
  risks: string;
  email: string;
  shareAnon: boolean;
  ghostMode: boolean;
  acknowledgeProtocols: boolean;
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

/* ---------- Context ---------- */
const WizardCtx = createContext<{ data: WizardData; setData: React.Dispatch<React.SetStateAction<WizardData>>; }>
({ data: defaultData, setData: () => {} });
const useWizard = () => useContext(WizardCtx);

/* ---------- Frame (original fixed two-pane) ---------- */
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

/* ---------- Minimal Steps (unchanged) ---------- */
const Step1: React.FC = () => { const nav = useNavigate(); return <Frame stepIndex={0} total={4} title="Basics" preview={<div/>}><button onClick={()=>nav("/step-2")}>Next</button></Frame>; };
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
