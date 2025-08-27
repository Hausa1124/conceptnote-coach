import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Step1Basics from "./steps/Step1Basics";
import Step2Problem from "./steps/Step2Problem";
import Step3Implementation from "./steps/Step3Implementation";
import Step4Summary from "./steps/Step4Summary";
import LivePreview from "./components/LivePreview";

export default function App() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 680px) 1fr", height: "100vh" }}>
      {/* Left Pane: Wizard */}
      <div style={{ padding: 16, borderRight: "1px solid #E5E7EB", overflow: "auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800 }}>Concept Note Wizard</h1>
          <nav style={{ display: "flex", gap: 8 }}>
            <Link to="/step1">1</Link>
            <Link to="/step2">2</Link>
            <Link to="/step3">3</Link>
            <Link to="/step4">4</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/step1" element={<Step1Basics />} />
          <Route path="/step2" element={<Step2Problem />} />
          <Route path="/step3" element={<Step3Implementation />} />
          <Route path="/step4" element={<Step4Summary />} />
          <Route path="*" element={<Step1Basics />} />
        </Routes>
      </div>

      {/* Right Pane: Live Preview */}
      <div style={{ overflow: "auto", background: "#FAFAFA" }}>
        <LivePreview />
      </div>
    </div>
  );
}