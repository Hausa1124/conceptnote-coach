// src/components/Counter.tsx
type Lims = { minWords:number; maxWords:number; minChars:number; maxChars:number };

const wc = (s:string) => (s ? s.trim().split(/\s+/).filter(Boolean).length : 0);
const cc = (s:string) => (s ? s.length : 0);

export default function Counter({ text, lims }:{ text:string; lims:Lims }) {
  const w = wc(text), c = cc(text);
  const wClass = w < lims.minWords ? "warn" : w > lims.maxWords ? "exceed" : "ok";
  const cClass = c < lims.minChars ? "warn" : c > lims.maxChars ? "exceed" : "ok";
  return (
    <div className="word-counter">
      <span className={wClass}>words: {w}/{lims.maxWords}</span>{" • "}
      <span className={cClass}>chars: {c}/{lims.maxChars}</span>
    </div>
  );
}