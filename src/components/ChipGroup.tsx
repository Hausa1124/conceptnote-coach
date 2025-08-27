import React from "react";

type Props = {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  label?: string;
};

export default function ChipGroup({ options, selected, onToggle, label }: Props) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontSize: 12, color: "#374151", marginBottom: 6 }}>{label}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map(opt => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: `2px solid ${on ? "#111827" : "#D1D5DB"}`,
                background: on ? "#F3F4F6" : "white",
                cursor: "pointer"
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}