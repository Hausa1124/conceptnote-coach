import React from "react";

type Props = {
  text: string;
};

const SMART_PATTERNS = {
  S: /\b(farmers|midwives|training|deliver|women|youth|students|teachers|households|communities|beneficiaries|target|group)\b/i,
  M: /(\d+|%|increase by|reduce by|improve by|\+\d+|-\d+|≥|≤|>|<)/i,
  A: /\b(train|deliver|establish|set up|create|build|develop|implement|provide|support|conduct|organize)\b/i,
  R: /\b(health|education|wash|agriculture|economic|development|co-ops|msmes|rural|urban|district|region|country|community)\b/i,
  T: /\b(days?|weeks?|months?|years?|by q[1-4]|by \w+ \d{4}|within \d+|deadline|timeline|phase|term)\b/i,
};

export default function SmartMeter({ text }: Props) {
  const checkSmart = (pattern: RegExp) => pattern.test(text);

  return (
    <div style={{ 
      display: "flex", 
      gap: 8, 
      marginTop: 8, 
      padding: "8px 12px", 
      background: "#f8f9fa", 
      borderRadius: 6,
      border: "1px solid #e9ecef"
    }}>
      <span style={{ fontSize: 12, color: "#6c757d", marginRight: 8 }}>SMART:</span>
      {Object.entries(SMART_PATTERNS).map(([letter, pattern]) => (
        <span
          key={letter}
          style={{
            padding: "2px 6px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            background: checkSmart(pattern) ? "#28a745" : "#e9ecef",
            color: checkSmart(pattern) ? "white" : "#6c757d",
            border: `1px solid ${checkSmart(pattern) ? "#28a745" : "#dee2e6"}`,
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}