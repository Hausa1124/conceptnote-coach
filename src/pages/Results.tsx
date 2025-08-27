import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function Results() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const analysisText = params.get('text') || '';

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/step1" style={{ color: "#007bff", textDecoration: "none" }}>
          ← Back to Wizard
        </Link>
      </div>
      
      <h1 style={{ marginBottom: 20 }}>Concept Note Analysis</h1>
      
      <div style={{ 
        background: "#f8f9fa", 
        padding: 20, 
        borderRadius: 8, 
        border: "1px solid #e9ecef",
        whiteSpace: "pre-wrap",
        lineHeight: 1.6
      }}>
        {decodeURIComponent(analysisText)}
      </div>
      
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button 
          onClick={() => window.print()}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            marginRight: 10
          }}
        >
          Print / Save as PDF
        </button>
        <Link 
          to="/step1"
          style={{
            padding: "10px 20px",
            background: "#6c757d",
            color: "white",
            textDecoration: "none",
            borderRadius: 6
          }}
        >
          Create New Concept Note
        </Link>
      </div>
    </div>
  );
}