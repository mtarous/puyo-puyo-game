"use client";

import React from "react";
import { PuyoColor } from "@/lib/puyo";
import { PuyoCell } from "@/components/GameBoard";

interface NextPuyoProps {
  queue: [PuyoColor, PuyoColor][];
}

export default function NextPuyo({ queue }: NextPuyoProps) {
  const CELL = 32;

  return (
    <div className="flex flex-col gap-3">
      {queue.slice(0, 2).map((pair, idx) => {
        const [pivotColor, satelliteColor] = pair;
        const isNext = idx === 0;

        return (
          <div key={idx} className="flex flex-col items-center gap-1">
            {/* Label */}
            <span
              className={`text-xs font-bold tracking-widest uppercase ${
                isNext ? "text-indigo-300" : "text-slate-500"
              }`}
            >
              {isNext ? "NEXT" : "2ND"}
            </span>

            {/* Pair display */}
            <div
              className="flex flex-col items-center gap-1 p-2 rounded-xl"
              style={{
                background: isNext
                  ? "rgba(80,80,200,0.18)"
                  : "rgba(40,40,80,0.12)",
                border: isNext
                  ? "1px solid rgba(120,120,255,0.35)"
                  : "1px solid rgba(80,80,120,0.18)",
                boxShadow: isNext ? "0 0 14px rgba(100,100,255,0.12)" : "none",
                width: CELL + 20,
              }}
            >
              <PuyoCell color={satelliteColor} size={CELL} />
              <PuyoCell color={pivotColor} size={CELL} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
