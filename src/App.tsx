import React from 'react'

function App() {
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
              <button className="btn btn-secondary">Previous</button>
              <button className="btn btn-primary">Next Step</button>
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
        </div>
      </div>
    </div>
  )
}

export default App