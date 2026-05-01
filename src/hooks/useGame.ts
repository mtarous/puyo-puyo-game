"use client";

import { useReducer, useEffect, useCallback, useRef } from "react";
import {
  Board,
  PuyoPair,
  PuyoColor,
  Rotation,
  createBoard,
  cloneBoard,
  spawnPair,
  satellitePos,
  tryMove,
  tryRotateCW,
  tryRotateCCW,
  lockPair,
  applyGravity,
  popGroups,
  calcScore,
  hardDropPosition,
  isGameOver,
  generateQueue,
  findConnectedGroups,
  BOARD_COLS,
} from "@/lib/puyo";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GamePhase =
  | "idle"      // not started
  | "falling"   // piece is falling
  | "locking"   // brief lock delay
  | "popping"   // groups being cleared
  | "gravity"   // post-pop gravity
  | "gameover";

export interface FallingPiece {
  pivot: { row: number; col: number };
  satellite: { row: number; col: number };
  pivotColor: PuyoColor;
  satelliteColor: PuyoColor;
  rotation: Rotation;
}

export interface GameState {
  board: Board;
  phase: GamePhase;
  current: FallingPiece | null;
  queue: [PuyoColor, PuyoColor][]; // next pairs
  score: number;
  level: number;
  chainCount: number;
  maxChain: number;
  linesCleared: number;
  poppedKeys: Set<string>; // cells currently being cleared (for animation)
  chainFlash: boolean;     // true briefly on each chain pop
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const QUEUE_SIZE = 3;

function buildFalling(
  pivot: { row: number; col: number },
  rotation: Rotation,
  pivotColor: PuyoColor,
  satelliteColor: PuyoColor
): FallingPiece {
  return {
    pivot,
    satellite: satellitePos(pivot, rotation),
    pivotColor,
    satelliteColor,
    rotation,
  };
}

function replenishQueue(
  queue: [PuyoColor, PuyoColor][]
): [PuyoColor, PuyoColor][] {
  if (queue.length >= QUEUE_SIZE) return queue;
  return [...queue, ...generateQueue(QUEUE_SIZE - queue.length)];
}

function initialQueue(): [PuyoColor, PuyoColor][] {
  return generateQueue(QUEUE_SIZE);
}

function initialState(): GameState {
  return {
    board: createBoard(),
    phase: "idle",
    current: null,
    queue: initialQueue(),
    score: 0,
    level: 1,
    chainCount: 0,
    maxChain: 0,
    linesCleared: 0,
    poppedKeys: new Set(),
    chainFlash: false,
  };
}

/** Interval (ms) for gravity based on level */
function gravityInterval(level: number): number {
  return Math.max(100, 800 - (level - 1) * 60);
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "START" }
  | { type: "TICK" }           // gravity tick
  | { type: "MOVE_LEFT" }
  | { type: "MOVE_RIGHT" }
  | { type: "MOVE_DOWN" }      // soft drop
  | { type: "HARD_DROP" }
  | { type: "ROTATE_CW" }
  | { type: "ROTATE_CCW" }
  | { type: "POP_STEP" }       // advance chain step
  | { type: "GRAVITY_STEP" }   // apply gravity after pop
  | { type: "CLEAR_FLASH" }
  | { type: "RESET" };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function spawnNext(
  board: Board,
  queue: [PuyoColor, PuyoColor][]
): { current: FallingPiece; queue: [PuyoColor, PuyoColor][] } | null {
  const [pivotColor, satelliteColor] = queue[0];
  const newQueue = replenishQueue(queue.slice(1));
  const { pair, rotation } = spawnPair(pivotColor, satelliteColor);
  if (!pair) return null;
  const piece = buildFalling(pair.pivot, rotation, pivotColor, satelliteColor);
  return { current: piece, queue: newQueue };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    // ── START ────────────────────────────────────────────────────────────────
    case "START": {
      const queue = initialQueue();
      const spawned = spawnNext(createBoard(), queue);
      if (!spawned) return state;
      return {
        ...initialState(),
        phase: "falling",
        board: createBoard(),
        queue: spawned.queue,
        current: spawned.current,
      };
    }

    // ── RESET ────────────────────────────────────────────────────────────────
    case "RESET": {
      return initialState();
    }

    // ── TICK (gravity) ───────────────────────────────────────────────────────
    case "TICK": {
      if (state.phase !== "falling" || !state.current) return state;
      const { current, board } = state;
      const moved = tryMove(board, current.pivot, current.rotation, 1, 0);
      if (moved) {
        return {
          ...state,
          current: {
            ...current,
            pivot: moved.pivot,
            satellite: moved.satellite,
          },
        };
      }
      // Cannot move down — lock
      const locked = lockPair(board, {
        pivot: current.pivot,
        satellite: current.satellite,
        pivotColor: current.pivotColor,
        satelliteColor: current.satelliteColor,
      });
      const afterGravity = applyGravity(locked);
      // Check for pops
      const popResult = popGroups(afterGravity);
      if (popResult) {
        return {
          ...state,
          board: afterGravity,
          current: null,
          phase: "popping",
          poppedKeys: popResult.poppedKeys,
          chainCount: 1,
          chainFlash: true,
        };
      }
      // No pop — spawn next
      if (isGameOver(afterGravity)) {
        return { ...state, board: afterGravity, current: null, phase: "gameover" };
      }
      const spawned = spawnNext(afterGravity, state.queue);
      if (!spawned) {
        return { ...state, board: afterGravity, current: null, phase: "gameover" };
      }
      return {
        ...state,
        board: afterGravity,
        current: spawned.current,
        queue: spawned.queue,
        phase: "falling",
        chainCount: 0,
        poppedKeys: new Set(),
      };
    }

    // ── POP_STEP ─────────────────────────────────────────────────────────────
    case "POP_STEP": {
      if (state.phase !== "popping") return state;
      const { board, poppedKeys, chainCount } = state;

      // Score
      const popped = poppedKeys.size;
      const groups = findConnectedGroups(board);
      const colorSet = new Set<string>();
      for (const key of poppedKeys) {
        const [r, c] = key.split(",").map(Number);
        colorSet.add(board[r][c]);
      }
      const score = state.score + calcScore(popped, chainCount, groups.length, colorSet.size);
      const linesCleared = state.linesCleared + popped;
      const level = Math.min(20, 1 + Math.floor(linesCleared / 30));
      const maxChain = Math.max(state.maxChain, chainCount);

      // Remove popped cells
      const next = cloneBoard(board);
      for (const key of poppedKeys) {
        const [r, c] = key.split(",").map(Number);
        next[r][c] = "empty";
      }

      return {
        ...state,
        board: next,
        score,
        level,
        linesCleared,
        maxChain,
        phase: "gravity",
        poppedKeys: new Set(),
      };
    }

    // ── GRAVITY_STEP ─────────────────────────────────────────────────────────
    case "GRAVITY_STEP": {
      if (state.phase !== "gravity") return state;
      const afterGravity = applyGravity(state.board);
      const popResult = popGroups(afterGravity);
      if (popResult) {
        return {
          ...state,
          board: afterGravity,
          phase: "popping",
          poppedKeys: popResult.poppedKeys,
          chainCount: state.chainCount + 1,
          chainFlash: true,
        };
      }
      // Chain done — spawn next
      if (isGameOver(afterGravity)) {
        return { ...state, board: afterGravity, current: null, phase: "gameover" };
      }
      const spawned = spawnNext(afterGravity, state.queue);
      if (!spawned) {
        return { ...state, board: afterGravity, current: null, phase: "gameover" };
      }
      return {
        ...state,
        board: afterGravity,
        current: spawned.current,
        queue: spawned.queue,
        phase: "falling",
        poppedKeys: new Set(),
      };
    }

    // ── CLEAR_FLASH ──────────────────────────────────────────────────────────
    case "CLEAR_FLASH": {
      return { ...state, chainFlash: false };
    }

    // ── MOVE_LEFT / RIGHT ────────────────────────────────────────────────────
    case "MOVE_LEFT":
    case "MOVE_RIGHT": {
      if (state.phase !== "falling" || !state.current) return state;
      const dc = action.type === "MOVE_LEFT" ? -1 : 1;
      const moved = tryMove(state.board, state.current.pivot, state.current.rotation, 0, dc);
      if (!moved) return state;
      return {
        ...state,
        current: {
          ...state.current,
          pivot: moved.pivot,
          satellite: moved.satellite,
        },
      };
    }

    // ── MOVE_DOWN (soft drop) ─────────────────────────────────────────────────
    case "MOVE_DOWN": {
      if (state.phase !== "falling" || !state.current) return state;
      const moved = tryMove(state.board, state.current.pivot, state.current.rotation, 1, 0);
      if (!moved) return state;
      return {
        ...state,
        current: { ...state.current, pivot: moved.pivot, satellite: moved.satellite },
        score: state.score + 1,
      };
    }

    // ── HARD_DROP ────────────────────────────────────────────────────────────
    case "HARD_DROP": {
      if (state.phase !== "falling" || !state.current) return state;
      const { current, board } = state;
      const { pivot: dp, satellite: ds } = hardDropPosition(board, current.pivot, current.rotation);

      // Distance for score
      const dist = dp.row - current.pivot.row;
      const locked = lockPair(board, {
        pivot: dp,
        satellite: ds,
        pivotColor: current.pivotColor,
        satelliteColor: current.satelliteColor,
      });
      const afterGravity = applyGravity(locked);
      const popResult = popGroups(afterGravity);
      if (popResult) {
        return {
          ...state,
          board: afterGravity,
          current: null,
          phase: "popping",
          poppedKeys: popResult.poppedKeys,
          chainCount: 1,
          chainFlash: true,
          score: state.score + dist * 2,
        };
      }
      if (isGameOver(afterGravity)) {
        return {
          ...state,
          board: afterGravity,
          current: null,
          phase: "gameover",
          score: state.score + dist * 2,
        };
      }
      const spawned = spawnNext(afterGravity, state.queue);
      if (!spawned) {
        return {
          ...state,
          board: afterGravity,
          current: null,
          phase: "gameover",
          score: state.score + dist * 2,
        };
      }
      return {
        ...state,
        board: afterGravity,
        current: spawned.current,
        queue: spawned.queue,
        phase: "falling",
        chainCount: 0,
        poppedKeys: new Set(),
        score: state.score + dist * 2,
      };
    }

    // ── ROTATE_CW / CCW ──────────────────────────────────────────────────────
    case "ROTATE_CW": {
      if (state.phase !== "falling" || !state.current) return state;
      const result = tryRotateCW(state.board, state.current.pivot, state.current.rotation);
      if (!result) return state;
      return {
        ...state,
        current: {
          ...state.current,
          pivot: result.pivot,
          rotation: result.rotation,
          satellite: satellitePos(result.pivot, result.rotation),
        },
      };
    }
    case "ROTATE_CCW": {
      if (state.phase !== "falling" || !state.current) return state;
      const result = tryRotateCCW(state.board, state.current.pivot, state.current.rotation);
      if (!result) return state;
      return {
        ...state,
        current: {
          ...state.current,
          pivot: result.pivot,
          rotation: result.rotation,
          satellite: satellitePos(result.pivot, result.rotation),
        },
      };
    }

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  // ── Gravity loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (state.phase !== "falling") return;
    const interval = setInterval(() => {
      dispatch({ type: "TICK" });
    }, gravityInterval(state.level));
    return () => clearInterval(interval);
  }, [state.phase, state.level]);

  // ── Pop animation then advance chain ─────────────────────────────────────
  useEffect(() => {
    if (state.phase !== "popping") return;
    const t = setTimeout(() => {
      dispatch({ type: "POP_STEP" });
    }, 450); // show pop animation for 450 ms
    return () => clearTimeout(t);
  }, [state.phase, state.poppedKeys]);

  // ── Gravity after pop ─────────────────────────────────────────────────────
  useEffect(() => {
    if (state.phase !== "gravity") return;
    const t = setTimeout(() => {
      dispatch({ type: "GRAVITY_STEP" });
    }, 200);
    return () => clearTimeout(t);
  }, [state.phase]);

  // ── Clear chain flash ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!state.chainFlash) return;
    const t = setTimeout(() => {
      dispatch({ type: "CLEAR_FLASH" });
    }, 300);
    return () => clearTimeout(t);
  }, [state.chainFlash]);

  // ── Keyboard handler ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scroll behavior for arrow keys and space
      if (["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", "Space", " "].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case "ArrowLeft":
          dispatch({ type: "MOVE_LEFT" });
          break;
        case "ArrowRight":
          dispatch({ type: "MOVE_RIGHT" });
          break;
        case "ArrowDown":
          dispatch({ type: "MOVE_DOWN" });
          break;
        case "ArrowUp":
          dispatch({ type: "HARD_DROP" });
          break;
        case " ":
        case "Space":
          dispatch({ type: "HARD_DROP" });
          break;
        case "z":
        case "Z":
          dispatch({ type: "ROTATE_CCW" });
          break;
        case "x":
        case "X":
          dispatch({ type: "ROTATE_CW" });
          break;
        case "Enter":
          if (stateRef.current.phase === "idle" || stateRef.current.phase === "gameover") {
            dispatch({ type: "START" });
          }
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const start = useCallback(() => dispatch({ type: "START" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  return { state, start, reset, dispatch };
}
