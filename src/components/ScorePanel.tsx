"use client";

import React from "react";

interface ScorePanelProps {
  score: number;
  level: number;
  chainCount: number;
  maxChain: number;
}

function StatBox({
  label,
  value,
  accent = false,
  large = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  large?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 p-2 rounded-xl w-full"
      style={{
        background: accent
          ? "rgba(120,80,255,0.18)"
          : "rgba(30,30,60,0.55)",
        border: accent
          ? "1px solid rgba(160,100,255,0.4)"
          : "1px solid rgba(80,80,120,0.2)",
        boxShadow: accent ? "0 0 18px rgba(130,80,255,0.18)" : "none",
      }}
    >
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
        {label}
      </span>
      <span
        className={`font-extrabold tabular-nums ${
          large
            ? "text-2xl text-white"
            : accent
            ? "text-xl text-purple-200"
            : "text-lg text-indigo-100"
        }`}
        style={
          accent
            ? { textShadow: "0 0 10px rgba(160,100,255,0.7)" }
            : {}
        }
      >
        {value}
      </span>
    </div>
  );
}

export default function ScorePanel({
  score,
  level,
  chainCount,
  maxChain,
}: ScorePanelProps) {
  return (
    <div className="flex flex-col gap-2 w-28">
      <StatBox label="SCORE" value={score.toLocaleString()} large />
      <StatBox label="LEVEL" value={level} />
      <StatBox
        label="CHAIN"
        value={chainCount > 0 ? `${chainCount}×` : "—"}
        accent={chainCount > 0}
      />
      <StatBox label="BEST" value={maxChain > 0 ? `${maxChain}×` : "—"} />
    </div>
  );
}
