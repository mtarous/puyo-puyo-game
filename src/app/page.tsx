"use client";

import React from "react";
import GameBoard from "@/components/GameBoard";
import NextPuyo from "@/components/NextPuyo";
import ScorePanel from "@/components/ScorePanel";
import { useGame } from "@/hooks/useGame";
import { useBGM } from "@/hooks/useBGM";

// ─── Key hint row ─────────────────────────────────────────────────────────────

function KeyHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-1">
        {keys.map((k) => (
          <kbd
            key={k}
            className="inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-bold text-slate-200"
            style={{
              background: "rgba(60,60,100,0.7)",
              border: "1px solid rgba(120,120,180,0.4)",
              boxShadow: "0 2px 0 rgba(0,0,0,0.5)",
              minWidth: 22,
            }}
          >
            {k}
          </kbd>
        ))}
      </div>
      <span className="text-[11px] text-slate-400">{label}</span>
    </div>
  );
}

// ─── Overlay screens ──────────────────────────────────────────────────────────

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 rounded-xl"
      style={{ background: "rgba(5,5,20,0.88)", backdropFilter: "blur(6px)" }}
    >
      {/* Title */}
      <div className="flex flex-col items-center gap-1">
        <h1
          className="text-5xl font-black tracking-tight select-none"
          style={{
            background: "linear-gradient(135deg, #ff4444, #cc44ff, #4488ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
            filter: "drop-shadow(0 0 18px rgba(180,80,255,0.5))",
          }}
        >
          ぷよぷよ
        </h1>
        <span className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
          Puyo Puyo
        </span>
      </div>

      {/* Controls preview */}
      <div
        className="flex flex-col gap-2 p-4 rounded-xl text-left"
        style={{
          background: "rgba(20,20,50,0.7)",
          border: "1px solid rgba(100,100,200,0.25)",
        }}
      >
        <KeyHint keys={["←", "→"]} label="移動" />
        <KeyHint keys={["Z"]} label="反時計回り" />
        <KeyHint keys={["X"]} label="時計回り" />
        <KeyHint keys={["↓"]} label="ソフトドロップ" />
        <KeyHint keys={["↑", "SPC"]} label="ハードドロップ" />
      </div>

      <button
        onClick={onStart}
        className="relative overflow-hidden px-8 py-3 rounded-full font-black text-white tracking-widest uppercase text-sm transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #7744ff, #cc44ff)",
          boxShadow: "0 0 24px rgba(150,80,255,0.5), 0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        PRESS ENTER / START
      </button>
    </div>
  );
}

function GameOverScreen({
  score,
  maxChain,
  onRestart,
}: {
  score: number;
  maxChain: number;
  onRestart: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 rounded-xl"
      style={{ background: "rgba(5,2,15,0.90)", backdropFilter: "blur(8px)" }}
    >
      <h2
        className="text-4xl font-black tracking-tight"
        style={{
          background: "linear-gradient(135deg, #ff4444, #ff8800)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 14px rgba(255,80,0,0.5))",
        }}
      >
        GAME OVER
      </h2>

      <div className="flex flex-col items-center gap-1">
        <p className="text-slate-400 text-sm">スコア</p>
        <p className="text-3xl font-black text-white tabular-nums">
          {score.toLocaleString()}
        </p>
        {maxChain > 0 && (
          <p className="text-sm text-purple-300 font-bold mt-1">
            最大 {maxChain} 連鎖
          </p>
        )}
      </div>

      <button
        onClick={onRestart}
        className="px-8 py-3 rounded-full font-black text-white tracking-widest uppercase text-sm transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #ff4444, #cc2200)",
          boxShadow: "0 0 20px rgba(255,60,0,0.4), 0 4px 14px rgba(0,0,0,0.4)",
        }}
      >
        RETRY
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const { state, start } = useGame();
  const { board, current, poppedKeys, chainFlash, phase, score, level, chainCount, maxChain, queue } = state;
  const { muted, toggleMute } = useBGM(phase, level);

  return (
    <main
      className="min-h-screen flex items-center justify-center select-none"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(40,20,80,0.8) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(20,40,100,0.6) 0%, transparent 60%), linear-gradient(180deg, #050510 0%, #0a0a1e 50%, #080818 100%)",
      }}
    >
      {/* Mute button */}
      <button
        onClick={toggleMute}
        title={muted ? "BGM ON" : "BGM OFF"}
        className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 active:scale-90"
        style={{
          background: muted ? "rgba(40,40,60,0.85)" : "rgba(80,50,160,0.85)",
          border: `1px solid ${muted ? "rgba(100,100,140,0.4)" : "rgba(160,100,255,0.5)"}`,
          boxShadow: muted ? "none" : "0 0 16px rgba(140,80,255,0.4)",
          backdropFilter: "blur(6px)",
        }}
      >
        <span className="text-lg select-none">{muted ? "🔇" : "🎵"}</span>
      </button>

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full opacity-20 blur-3xl animate-float-a"
          style={{ width: 350, height: 350, top: "10%", left: "5%", background: "#7744ff" }}
        />
        <div
          className="absolute rounded-full opacity-15 blur-3xl animate-float-b"
          style={{ width: 280, height: 280, bottom: "15%", right: "8%", background: "#4488ff" }}
        />
        <div
          className="absolute rounded-full opacity-12 blur-3xl animate-float-c"
          style={{ width: 200, height: 200, top: "50%", right: "20%", background: "#ff44cc" }}
        />
      </div>

      {/* Game layout */}
      <div className="relative z-10 flex items-start gap-6 px-4">
        {/* Left panel: score */}
        <div className="flex flex-col gap-3 pt-2">
          <ScorePanel
            score={score}
            level={level}
            chainCount={chainCount}
            maxChain={maxChain}
          />

          {/* Controls help */}
          <div
            className="flex flex-col gap-1.5 p-3 rounded-xl mt-2"
            style={{
              background: "rgba(15,15,35,0.7)",
              border: "1px solid rgba(80,80,130,0.2)",
            }}
          >
            <p className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-1">
              Controls
            </p>
            <KeyHint keys={["←", "→"]} label="移動" />
            <KeyHint keys={["Z"]} label="反時計" />
            <KeyHint keys={["X"]} label="時計回り" />
            <KeyHint keys={["↓"]} label="ドロップ" />
            <KeyHint keys={["SPC"]} label="即落下" />
          </div>
        </div>

        {/* Center: board */}
        <div className="relative">
          <GameBoard
            board={board}
            current={current}
            poppedKeys={poppedKeys}
            chainFlash={chainFlash}
          />

          {/* Chain badge */}
          {chainCount >= 2 && (
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-black text-white text-sm whitespace-nowrap animate-chain-badge z-10"
              style={{
                background: "linear-gradient(135deg, #cc44ff, #7744ff)",
                boxShadow: "0 0 20px rgba(180,80,255,0.6)",
              }}
            >
              {chainCount} 連鎖!!
            </div>
          )}

          {/* Overlays */}
          {phase === "idle" && <StartScreen onStart={start} />}
          {phase === "gameover" && (
            <GameOverScreen score={score} maxChain={maxChain} onRestart={start} />
          )}
        </div>

        {/* Right panel: next puyo */}
        <div className="flex flex-col items-center gap-4 pt-2">
          <NextPuyo queue={queue} />
        </div>
      </div>
    </main>
  );
}
