import React from "react";

type Props = {
  title: string;
  content: string;
};

export default function ExampleBox({ title, content }: Props) {
  if (!content) return null;
  
  return (
    <div style={{
      background: "#f8f9fa",
      border: "1px solid #e9ecef",
      borderRadius: 6,
      padding: 12,
      marginBottom: 8,
      fontSize: 13,
      color: "#495057"
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4, color: "#6c757d", fontSize: 11, textTransform: "uppercase" }}>
        Example {title}:
      </div>
      <div>{content}</div>
    </div>
  );
}