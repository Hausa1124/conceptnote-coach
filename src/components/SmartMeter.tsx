import React from "react";

type Props = {
  text: string;                 // the Objectives text to analyze
  sector?: string;              // optional, improves R check
  region?: string;              // optional, improves R check
};

const hasSpecific = (t: string) => {
  // S — mentions a concrete target/who/what
  const whoWhatWords = [
    "farmers","midwives","students","co-ops","cooperatives","msmes","smes","youth","women",
    "households","buyers","schools","clinics","health centers","lead farmers","teachers"
  ];
  const anyWho = new RegExp(`\\b(${whoWhatWords.join("|")})\\b`, "i").test(t);
  const hasDeliverable = /\b(train|deliver|establish|set up|rehabilitate|link|coach|provide|supply)\b/i.test(t);
  return anyWho || hasDeliverable;
};

const hasMeasurable = (t: string) => {
  // M — numbers, %, counts, deltas
  return /(\b\d+\b|%|percent|increase|decrease|reduce|raise|grow|improve)/i.test(t);
};

const hasActionable = (t: string) => {
  // A — starts lines with verbs (quick heuristic)
  return /(^|\n)\s*(train|deliver|establish|set up|rehabilitate|link|coach|provide|supply|organize|conduct|develop)\b/i.test(t);
};

const hasRelevant = (t: string, sector?: string, region?: string) => {
  // R — references sector/context terms
  const sectorHit = sector ? new RegExp(sector, "i").test(t) : false;
  const regionHit = region ? new RegExp(region, "i").test(t) : false;
  const contextWords = /\b(agriculture|health|education|wash|economic development|nyabihu|gakenke|rwanda|district|co-ops?|buyers?)\b/i.test(t);
  return sectorHit || regionHit || contextWords;
};

const hasTimebound = (t: string) => {
  // T — time bounds
  return /\b(by|within|before|after)\s+(\d{4}|q[1-4]|jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(t)?(ember)?|oct(ober)?|nov(ember)?|dec(ember)?|\d+\s*(days?|weeks?|months?))\b/i.test(t);
};

export default function SmartMeter({ text, sector, region }: Props) {
  const S = hasSpecific(text);
  const M = hasMeasurable(text);
  const A = hasActionable(text);
  const R = hasRelevant(text, sector, region);
  const T = hasTimebound(text);

  const chip = (label: string, on: boolean) => (
    <span
      key={label}
      title={label}
      style={{
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: 999,
        border: `2px solid ${on ? "#10B981" : "#D1D5DB"}`,  // green when satisfied
        fontSize: 12,
        fontWeight: 700,
        marginRight: 6,
        marginTop: 4,
        background: on ? "rgba(16,185,129,0.08)" : "white"
      }}
    >
      {label}
    </span>
  );

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 12, color: "#374151", marginBottom: 4 }}>SMART check</div>
      {chip("S", S)}{chip("M", M)}{chip("A", A)}{chip("R", R)}{chip("T", T)}
      <div style={{ fontSize: 11, color: "#6B7280", marginTop: 6 }}>
        Tip: include who/what, numbers, an action verb, sector/region context, and a time bound.
      </div>
    </div>
  );
}