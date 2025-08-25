import React, { useRef, useState } from "react";

type Props = {
  left: React.ReactNode;   // form
  right: React.ReactNode;  // live preview
  initialPct?: number;     // default 40
  minPct?: number;         // default 35
  maxPct?: number;         // default 65
};

export default function ResizableTwoPane({
  left,
  right,
  initialPct = 40,
  minPct = 35,
  maxPct = 65,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(initialPct);
  const [dragging, setDragging] = useState(false);

  const onDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const onMove = (e: React.MouseEvent) => {
    if (!dragging || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let next = (x / rect.width) * 100;
    if (next < minPct) next = minPct;
    if (next > maxPct) next = maxPct;
    setPct(next);
  };

  const onUp = () => setDragging(false);

  return (
    <div
      ref={wrapRef}
      className="w-full h-full flex overflow-hidden select-none"
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
    >
      {/* Left pane */}
      <div style={{ width: `${pct}%` }} className="h-full overflow-auto pr-3">
        {left}
      </div>

      {/* Handle */}
      <div
        onMouseDown={onDown}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panes"
        className={`w-1.5 mx-1 cursor-col-resize ${
          dragging ? "bg-blue-400" : "bg-slate-600/60"
        } rounded`}
        title="Drag to resize"
      />

      {/* Right pane */}
      <div style={{ width: `${100 - pct}%` }} className="h-full overflow-auto pl-3">
        {right}
      </div>
    </div>
  );
}
