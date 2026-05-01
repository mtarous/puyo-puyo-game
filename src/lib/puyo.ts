// ============================================================
// puyo.ts — Pure game-logic functions for Puyo Puyo
// ============================================================

export const BOARD_COLS = 6;
export const BOARD_ROWS = 13;
export const VISIBLE_ROWS = 12; // row 0 is the hidden "death" row

export type PuyoColor =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "ojama"
  | "empty";

/** A single cell on the board */
export type Cell = PuyoColor;

/** 6×13 board (row 0 = top/hidden) */
export type Board = Cell[][];

/** A puyo pair: pivot + satellite (relative offset from pivot) */
export interface PuyoPair {
  pivot: { row: number; col: number };
  satellite: { row: number; col: number };
  pivotColor: PuyoColor;
  satelliteColor: PuyoColor;
}

export type Rotation = 0 | 1 | 2 | 3; // 0=up, 1=right, 2=down, 3=left

/** Satellite offsets indexed by rotation */
const SATELLITE_OFFSETS: Record<Rotation, { row: number; col: number }> = {
  0: { row: -1, col: 0 }, // satellite above pivot
  1: { row: 0, col: 1 },  // satellite right of pivot
  2: { row: 1, col: 0 },  // satellite below pivot
  3: { row: 0, col: -1 }, // satellite left of pivot
};

/** Compute satellite position from pivot + rotation */
export function satellitePos(
  pivot: { row: number; col: number },
  rotation: Rotation
): { row: number; col: number } {
  const off = SATELLITE_OFFSETS[rotation];
  return { row: pivot.row + off.row, col: pivot.col + off.col };
}

/** Create a blank board */
export function createBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array<Cell>(BOARD_COLS).fill("empty")
  );
}

/** Deep clone a board */
export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

/** Returns true if the position is inside the board */
export function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_ROWS && col >= 0 && col < BOARD_COLS;
}

/** Returns true if a cell is occupied */
export function isOccupied(board: Board, row: number, col: number): boolean {
  if (!inBounds(row, col)) return true; // treat out-of-bounds as solid wall/floor
  return board[row][col] !== "empty";
}

/** Spawn position for a new pair */
export function spawnPair(
  pivotColor: PuyoColor,
  satelliteColor: PuyoColor
): { pair: PuyoPair; rotation: Rotation } {
  const pivot = { row: 1, col: 2 };
  const rotation: Rotation = 0;
  const sat = satellitePos(pivot, rotation);
  return {
    pair: { pivot, satellite: sat, pivotColor, satelliteColor },
    rotation,
  };
}

/** Check if a pair can occupy the given cells */
export function canPlace(
  board: Board,
  pivot: { row: number; col: number },
  satellite: { row: number; col: number }
): boolean {
  return (
    !isOccupied(board, pivot.row, pivot.col) &&
    !isOccupied(board, satellite.row, satellite.col)
  );
}

/** Move pivot by (dr, dc), return new positions or null if blocked */
export function tryMove(
  board: Board,
  pivot: { row: number; col: number },
  rotation: Rotation,
  dr: number,
  dc: number
): { pivot: { row: number; col: number }; satellite: { row: number; col: number } } | null {
  const newPivot = { row: pivot.row + dr, col: pivot.col + dc };
  const newSat = satellitePos(newPivot, rotation);
  if (canPlace(board, newPivot, newSat)) {
    return { pivot: newPivot, satellite: newSat };
  }
  return null;
}

/** Rotate clockwise, with wall-kick if needed */
export function tryRotateCW(
  board: Board,
  pivot: { row: number; col: number },
  rotation: Rotation
): { pivot: { row: number; col: number }; rotation: Rotation } | null {
  const newRot = ((rotation + 1) % 4) as Rotation;
  const newSat = satellitePos(pivot, newRot);

  if (canPlace(board, pivot, newSat)) {
    return { pivot, rotation: newRot };
  }
  // Wall kick: try shifting pivot
  for (const [dr, dc] of [[0, 1], [0, -1], [-1, 0], [1, 0]]) {
    const kickPivot = { row: pivot.row + dr, col: pivot.col + dc };
    const kickSat = satellitePos(kickPivot, newRot);
    if (canPlace(board, kickPivot, kickSat)) {
      return { pivot: kickPivot, rotation: newRot };
    }
  }
  return null;
}

/** Rotate counter-clockwise, with wall-kick if needed */
export function tryRotateCCW(
  board: Board,
  pivot: { row: number; col: number },
  rotation: Rotation
): { pivot: { row: number; col: number }; rotation: Rotation } | null {
  const newRot = ((rotation + 3) % 4) as Rotation;
  const newSat = satellitePos(pivot, newRot);

  if (canPlace(board, pivot, newSat)) {
    return { pivot, rotation: newRot };
  }
  for (const [dr, dc] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
    const kickPivot = { row: pivot.row + dr, col: pivot.col + dc };
    const kickSat = satellitePos(kickPivot, newRot);
    if (canPlace(board, kickPivot, kickSat)) {
      return { pivot: kickPivot, rotation: newRot };
    }
  }
  return null;
}

/** Lock a falling pair onto the board */
export function lockPair(
  board: Board,
  pair: PuyoPair
): Board {
  const next = cloneBoard(board);
  next[pair.pivot.row][pair.pivot.col] = pair.pivotColor;
  next[pair.satellite.row][pair.satellite.col] = pair.satelliteColor;
  return next;
}

/** Apply gravity: drop all floating puyos down */
export function applyGravity(board: Board): Board {
  const next = cloneBoard(board);
  for (let col = 0; col < BOARD_COLS; col++) {
    const cells: Cell[] = [];
    for (let row = BOARD_ROWS - 1; row >= 0; row--) {
      if (next[row][col] !== "empty") {
        cells.push(next[row][col]);
      }
    }
    for (let row = BOARD_ROWS - 1; row >= 0; row--) {
      next[row][col] = cells[BOARD_ROWS - 1 - row] ?? "empty";
    }
  }
  return next;
}

/** BFS/flood-fill to find connected groups of same color */
export function findConnectedGroups(board: Board): Set<string>[] {
  const visited = new Set<string>();
  const groups: Set<string>[] = [];

  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      const key = `${row},${col}`;
      const color = board[row][col];
      if (color === "empty" || color === "ojama" || visited.has(key)) continue;

      // BFS
      const group = new Set<string>();
      const queue: [number, number][] = [[row, col]];
      while (queue.length > 0) {
        const [r, c] = queue.shift()!;
        const k = `${r},${c}`;
        if (visited.has(k)) continue;
        if (!inBounds(r, c) || board[r][c] !== color) continue;
        visited.add(k);
        group.add(k);
        queue.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
      }
      if (group.size >= 4) {
        groups.push(group);
      }
    }
  }
  return groups;
}

/** Find ojama puyos adjacent to any cell in a set of keys */
function findAdjacentOjama(board: Board, keys: Set<string>): Set<string> {
  const ojama = new Set<string>();
  for (const key of keys) {
    const [r, c] = key.split(",").map(Number);
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(nr, nc) && board[nr][nc] === "ojama") {
        ojama.add(`${nr},${nc}`);
      }
    }
  }
  return ojama;
}

/** Pop groups of 4+ puyos (and adjacent ojama) from the board.
 *  Returns the new board and the number of puyos popped, or null if nothing popped.
 */
export function popGroups(
  board: Board
): { board: Board; popped: number; poppedKeys: Set<string> } | null {
  const groups = findConnectedGroups(board);
  if (groups.length === 0) return null;

  const toRemove = new Set<string>();
  for (const group of groups) {
    for (const k of group) toRemove.add(k);
    const ojama = findAdjacentOjama(board, group);
    for (const k of ojama) toRemove.add(k);
  }

  const next = cloneBoard(board);
  for (const key of toRemove) {
    const [r, c] = key.split(",").map(Number);
    next[r][c] = "empty";
  }

  return { board: next, popped: toRemove.size, poppedKeys: toRemove };
}

/** Score calculation based on puyo pop rules
 *  chainCount: 1-based chain index (1st chain, 2nd chain, …)
 */
export function calcScore(
  popped: number,
  chainCount: number,
  groupCount: number,
  colorCount: number
): number {
  const CHAIN_POWER = [0, 0, 8, 16, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480, 512];
  const GROUP_BONUS = [0, 0, 3, 6, 12, 24];
  const COLOR_BONUS = [0, 0, 3, 6, 12, 24];

  const chainPow = CHAIN_POWER[Math.min(chainCount, CHAIN_POWER.length - 1)] ?? 512;
  const groupBonus = GROUP_BONUS[Math.min(groupCount, GROUP_BONUS.length - 1)] ?? 24;
  const colorBonus = COLOR_BONUS[Math.min(colorCount, COLOR_BONUS.length - 1)] ?? 24;

  const bonus = Math.max(chainPow + groupBonus + colorBonus, 1);
  return popped * 10 * bonus;
}

/** Pick a random puyo color (excluding ojama) */
const COLORS: PuyoColor[] = ["red", "blue", "green", "yellow", "purple"];

export function randomColor(): PuyoColor {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

/** Generate a queue of [pivotColor, satelliteColor] pairs */
export function generateQueue(count: number): [PuyoColor, PuyoColor][] {
  return Array.from({ length: count }, () => [randomColor(), randomColor()]);
}

/** Game-over check: if any cell in the top visible row (row 1) is occupied */
export function isGameOver(board: Board): boolean {
  for (let col = 0; col < BOARD_COLS; col++) {
    if (board[1][col] !== "empty") return true;
  }
  return false;
}

/** Hard-drop: find the lowest valid position */
export function hardDropPosition(
  board: Board,
  pivot: { row: number; col: number },
  rotation: Rotation
): { pivot: { row: number; col: number }; satellite: { row: number; col: number } } {
  let p = { ...pivot };
  let s = satellitePos(p, rotation);

  while (true) {
    const np = { row: p.row + 1, col: p.col };
    const ns = satellitePos(np, rotation);
    if (!canPlace(board, np, ns)) break;
    p = np;
    s = ns;
  }
  return { pivot: p, satellite: s };
}
