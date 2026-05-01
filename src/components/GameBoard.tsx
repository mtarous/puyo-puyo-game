"use client";

import React, { useMemo } from "react";
import { Board, BOARD_COLS, BOARD_ROWS, VISIBLE_ROWS, PuyoColor } from "@/lib/puyo";
import { FallingPiece } from "@/hooks/useGame";

// ─── Color definitions ────────────────────────────────────────────────────────

const PUYO_COLORS: Record<PuyoColor, { bg: string; glow: string; highlight: string }> = {
  red: {
    bg: "radial-gradient(circle at 35% 35%, #ff8080, #ff4444 55%, #cc0000)",
    glow: "0 0 12px #ff4444, 0 0 24px #ff444480",
    highlight: "#ff8888",
  },
  blue: {
    bg: "radial-gradient(circle at 35% 35%, #88bbff, #4488ff 55%, #0044cc)",
    glow: "0 0 12px #4488ff, 0 0 24px #4488ff80",
    highlight: "#88aaff",
  },
  green: {
    bg: "radial-gradient(circle at 35% 35%, #88ee88, #44cc44 55%, #008800)",
    glow: "0 0 12px #44cc44, 0 0 24px #44cc4480",
    highlight: "#88dd88",
  },
  yellow: {
    bg: "radial-gradient(circle at 35% 35%, #ffee66, #ffcc00 55%, #cc9900)",
    glow: "0 0 12px #ffcc00, 0 0 24px #ffcc0080",
    highlight: "#ffee88",
  },
  purple: {
    bg: "radial-gradient(circle at 35% 35%, #ee88ff, #cc44ff 55%, #8800cc)",
    glow: "0 0 12px #cc44ff, 0 0 24px #cc44ff80",
    highlight: "#dd88ff",
  },
  ojama: {
    bg: "radial-gradient(circle at 35% 35%, #bbbbbb, #888888 55%, #444444)",
    glow: "0 0 8px #88888860",
    highlight: "#aaaaaa",
  },
  empty: {
    bg: "transparent",
    glow: "none",
    highlight: "transparent",
  },
};

// ─── Single puyo cell ─────────────────────────────────────────────────────────

interface PuyoCellProps {
  color: PuyoColor;
  isPopping?: boolean;
  isFalling?: boolean;
  size?: number;
}

export function PuyoCell({ color, isPopping = false, isFalling = false, size = 40 }: PuyoCellProps) {
  if (color === "empty") {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-sm opacity-0"
      />
    );
  }

  const def = PUYO_COLORS[color];

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full transition-all duration-150 ${
        isPopping ? "animate-puyo-pop" : ""
      } ${isFalling ? "animate-puyo-fall" : ""}`}
    >
      {/* Main body */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: def.bg,
          boxShadow: def.glow,
        }}
      />
      {/* Shine highlight */}
      <div
        className="absolute rounded-full opacity-60"
        style={{
          top: "15%",
          left: "18%",
          width: "40%",
          height: "35%",
          background: `radial-gradient(ellipse at center, ${def.highlight}cc, transparent)`,
        }}
      />
      {/* Ojama X mark */}
      {color === "ojama" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-black text-white select-none"
            style={{ fontSize: size * 0.45, lineHeight: 1, textShadow: "0 1px 2px #00000080" }}
          >
            ×
          </span>
        </div>
      )}
    </div>
  );
}

// ─── GameBoard component ──────────────────────────────────────────────────────

interface GameBoardProps {
  board: Board;
  current: FallingPiece | null;
  poppedKeys: Set<string>;
  chainFlash: boolean;
}

export default function GameBoard({
  board,
  current,
  poppedKeys,
  chainFlash,
}: GameBoardProps) {
  const CELL = 40; // px per cell

  /** Overlay the falling piece onto a display grid */
  const displayGrid = useMemo(() => {
    const grid: PuyoColor[][] = board.map((row) => [...row]);
    if (current) {
      const { pivot, satellite, pivotColor, satelliteColor } = current;
      if (pivot.row >= 0 && pivot.row < BOARD_ROWS && pivot.col >= 0 && pivot.col < BOARD_COLS) {
        grid[pivot.row][pivot.col] = pivotColor;
      }
      if (
        satellite.row >= 0 &&
        satellite.row < BOARD_ROWS &&
        satellite.col >= 0 &&
        satellite.col < BOARD_COLS
      ) {
        grid[satellite.row][satellite.col] = satelliteColor;
      }
    }
    return grid;
  }, [board, current]);

  // Visible rows: skip row 0 (hidden spawn zone), show rows 1–12
  const visibleRows = displayGrid.slice(1); // rows 1..12

  return (
    <div className="relative">
      {/* Chain flash overlay */}
      {chainFlash && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none z-20 animate-chain-flash"
          style={{ background: "rgba(255,255,200,0.18)" }}
        />
      )}

      {/* Board container */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          width: BOARD_COLS * CELL + 4,
          height: VISIBLE_ROWS * CELL + 4,
          background:
            "linear-gradient(180deg, rgba(10,10,30,0.92) 0%, rgba(5,5,20,0.97) 100%)",
          border: "2px solid rgba(120,120,255,0.25)",
          boxShadow:
            "0 0 40px rgba(80,80,255,0.12), inset 0 0 30px rgba(0,0,0,0.5)",
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.07 }}>
          {Array.from({ length: VISIBLE_ROWS - 1 }, (_, i) => (
            <div
              key={`hr-${i}`}
              className="absolute w-full"
              style={{ top: (i + 1) * CELL + 2, height: 1, background: "#8888ff" }}
            />
          ))}
          {Array.from({ length: BOARD_COLS - 1 }, (_, i) => (
            <div
              key={`vr-${i}`}
              className="absolute h-full"
              style={{ left: (i + 1) * CELL + 2, width: 1, background: "#8888ff" }}
            />
          ))}
        </div>

        {/* Cells */}
        <div className="absolute inset-0 p-[2px]">
          {visibleRows.map((row, rIdx) =>
            row.map((color, cIdx) => {
              const boardRow = rIdx + 1; // actual board row (1-based)
              const key = `${boardRow},${cIdx}`;
              const isPopping = poppedKeys.has(key);
              const isFallingCell =
                current !== null &&
                ((current.pivot.row === boardRow && current.pivot.col === cIdx) ||
                  (current.satellite.row === boardRow && current.satellite.col === cIdx));

              return (
                <div
                  key={key}
                  className="absolute"
                  style={{
                    left: cIdx * CELL + 2,
                    top: rIdx * CELL + 2,
                    width: CELL - 2,
                    height: CELL - 2,
                    padding: 2,
                  }}
                >
                  {color !== "empty" && (
                    <PuyoCell
                      color={color}
                      isPopping={isPopping}
                      isFalling={isFallingCell}
                      size={CELL - 6}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
