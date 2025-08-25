import React from "react";
import { Outlet } from "react-router-dom";
import LivePreview from "../preview/LivePreview";

export default function WizardLayout() {
  return (
    <div className="app-root">
      <header className="app-top">
        <div className="brand">◎ Concept Note Coach</div>
        <div className="progress">
          <span className="dot active" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="step-text">Wizard Active</span>
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