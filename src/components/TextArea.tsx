import React from "react";

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  wordTarget?: number;
  charTarget?: number;
  placeholder?: string;
};

const countWords = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);

export default function TextArea({ label, value, onChange, rows = 6, wordTarget, charTarget, placeholder }: Props) {
  const words = countWords(value);
  const chars = value.length;
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #D1D5DB" }}
      />
      <div style={{ fontSize: 12, marginTop: 6, color: "#374151" }}>
        words: {words}{wordTarget ? `/${wordTarget}` : ""} • chars: {chars}{charTarget ? `/${charTarget}` : ""}
      </div>
    </div>
  );
}