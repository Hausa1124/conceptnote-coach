import React from 'react'
import { useState } from 'react'

function App() {
  // State for email generation functionality
  const [email, setEmail] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);

  const isEmailValid = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // Build payload from form data (placeholder for now)
  const buildPayload = () => {
    return {
      project_title: "Sample Project", // This would come from form state
      project_description: "Sample description", // This would come from form state
      // Add other form fields as needed
    };
  };

  // Handle generate function
  async function handleGenerate() {
    if (!isEmailValid(email)) return;
    setRequesting(true);
    try {
      const payload = buildPayload();
      payload.email = email.trim();
      const res = await fetch("/.netlify/functions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || `HTTP ${res.status}`);

      const data = JSON.parse(text);
      setDraft(data.full_draft);

      // instant download (txt)
      const blob = new Blob([data.full_draft], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${payload.project_title || "concept-note"}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e.message || "Generation failed");
    } finally {
      setRequesting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="background-animation"></div>
      
      <div className="header">
        <div className="logo">Concept Note Coach</div>
        <div className="progress-bar">
          <div className="progress-steps">
            <div className="step active"></div>
            <div className="step"></div>
            <div className="step"></div>
            <div className="step"></div>
          </div>
          <div className="no-store-toggle">Enhanced Interface</div>
        </div>
      </div>

      <div className="flex min-h-screen">
        <div className="form-panel">
          <div className="form-step">
            <h2 className="step-title">Project Concept Development</h2>
            <p className="step-subtitle">Define your project vision and objectives</p>
            
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter your project title..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Project Description</label>
              <textarea 
                className="form-textarea" 
                placeholder="Describe your project concept in detail..."
              ></textarea>
            </div>

            <div className="button-group">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                <input
                  type="email"
                  placeholder="Enter email for instant download"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full md:w-80 rounded-lg px-3 py-2 bg-slate-800 text-white border border-slate-700"
                />
                <button
                  onClick={handleGenerate}
                  disabled={!isEmailValid(email) || requesting}
                  className={`px-4 py-2 rounded-lg font-semibold
                    ${!isEmailValid(email) || requesting ? "opacity-50 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600 text-white"}`}
                >
                  {requesting ? "Generating…" : "Generate Analysis"}
                </button>
              </div>
              <div className="flex gap-4 mt-4">
                <button className="btn btn-secondary">Previous</button>
                <button className="btn btn-primary">Next Step</button>
              </div>
            </div>
          </div>
        </div>

        <div className="preview-panel">
          <div className="preview-header">
            <h3 className="preview-title">Live Preview</h3>
            <div className="preview-status">Updating...</div>
          </div>

          <div className="concept-preview">
            <div className="concept-section">
              <div className="section-header">Project Overview</div>
              <div className="section-content">
                <div className="placeholder">Project title will appear here</div>
                <p>Your project description and key details will be displayed in this preview area as you complete the form.</p>
              </div>
            </div>
          </div>

          {draft && (
            <div className="mt-6">
              <div className="section-header">Generated Analysis</div>
              <pre className="mt-6 whitespace-pre-wrap leading-7 text-slate-100 bg-slate-800 p-4 rounded-lg border border-slate-700">
                {draft}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App