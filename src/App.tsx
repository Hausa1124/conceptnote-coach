import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Step1Basics from "./steps/Step1Basics";
import Step2Problem from "./steps/Step2Problem";
import Step3Implementation from "./steps/Step3Implementation";
import Step4Summary from "./steps/Step4Summary";
import Results from "./pages/Results";
import LivePreview from "./components/LivePreview";

export default function App() {
  const location = window.location.pathname;
  const isResultsPage = location === '/results';

  return (
    <div
      style={{
        display: isResultsPage ? "block" : "grid",
        gridTemplateColumns: isResultsPage ? "1fr" : "40% 60%",
        columnGap: 0,
        height: "100vh",
        width: "100%",
        minWidth: 900,
        overflow: "hidden"
      }}
    >
      {isResultsPage ? (
        <Routes>
          <Route path="/results" element={<Results />} />
        </Routes>
      ) : (
        <>
      {/* Left Pane: Wizard */}
      <div style={{ padding: 16, borderRight: "1px solid #E5E7EB", overflow: "auto", minWidth: 360 }}>
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
      <div style={{ overflow: "auto", background: "#FAFAFA", padding: 16, minWidth: 480 }}>
        <LivePreview />
      </div>
        </>
      )}
    </div>
  );
}