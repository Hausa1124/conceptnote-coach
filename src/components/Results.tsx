import { useMemo } from "react";

export default function Results() {
  const text = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    // Make is returning text; we URL-encoded it on navigate
    return params.get("text") ? decodeURIComponent(params.get("text")!) : "";
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Analysis</h1>
      <pre className="whitespace-pre-wrap leading-7">{text || "No analysis returned."}</pre>
    </div>
  );
}