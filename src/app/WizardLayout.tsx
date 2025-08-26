import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import LivePreview from "../preview/LivePreview";

export default function WizardLayout() {
  const location = useLocation();
  const step = location.pathname.includes("step-1") ? 1 :
               location.pathname.includes("step-2") ? 2 :
               location.pathname.includes("step-3") ? 3 :
               location.pathname.includes("step-4") ? 4 : 1;

  return (
    <div className="app-root">
      <header className="app-top">
        <div className="brand">◎ Concept Note Coach</div>
        <div className="progress">
          {[1, 2, 3, 4].map(i => (
            <span key={i} className={`dot ${i <= step ? 'active' : ''}`} />
          ))}
          <span className="step-text">Step {step} of 4</span>
        </div>
        <div className="secure">Secure Mode</div>
      </header>

      <div className="two-pane">
        <section className="pane-left">
          <div className="pane-scroll">
            <Outlet />
          </div>
        </section>
        <aside className="pane-right">
          <div className="pane-scroll">
            <div className="preview">
              <div className="preview-head">
                <span className="dot live" /> LIVE FEED ACTIVE
              </div>
              <LivePreview />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}