export const MAZE_ROWS = [
  "###############",
  "#S.....#......#",
  "#.###.#.#.##..#",
  "#.#K..#.#.##..#",
  "#.#.###.#.A#..#",
  "#...#...#....A#",
  "#.#####.#####.#",
  "#.............#",
  "###G###########",
  "#W..D..W..D...#",
  "#............E#",
  "###############",
];

export type Cell = { row: number; col: number };

export function mazeSize(): { rows: number; cols: number } {
  return { rows: MAZE_ROWS.length, cols: MAZE_ROWS[0].length };
}

export function mazeChar(row: number, col: number): string {
  return MAZE_ROWS[row]?.[col] ?? "#";
}

export function isBlocked(row: number, col: number, gateOpen: boolean): boolean {
  const char = mazeChar(row, col);
  if (!char || char === "#") return true;
  if (char === "G" && !gateOpen) return true;
  return false;
}

export function findChar(char: string): Cell[] {
  const cells: Cell[] = [];
  MAZE_ROWS.forEach((line, row) => {
    [...line].forEach((value, col) => {
      if (value === char) cells.push({ row, col });
    });
  });
  return cells;
}

export function mazeStart(): Cell {
  return findChar("S")[0] ?? { row: 1, col: 1 };
}

const STEPS: Cell[] = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

function flood(gateOpen: boolean): { water: number; soil: number; exit: boolean; key: boolean } {
  const start = mazeStart();
  const seen = new Set<string>();
  const queue = [start];
  let water = 0;
  let soil = 0;
  let exit = false;
  let key = false;
  while (queue.length) {
    const cell = queue.shift()!;
    const id = `${cell.row},${cell.col}`;
    if (seen.has(id) || isBlocked(cell.row, cell.col, gateOpen)) continue;
    seen.add(id);
    const char = mazeChar(cell.row, cell.col);
    if (char === "W") water += 1;
    if (char === "D") soil += 1;
    if (char === "E") exit = true;
    if (char === "K") key = true;
    for (const step of STEPS) {
      queue.push({ row: cell.row + step.row, col: cell.col + step.col });
    }
  }
  return { water, soil, exit, key };
}

export function reachable(): {
  widthsOk: boolean;
  keyBeforeGate: boolean;
  waterBehind: boolean;
  soilBehind: boolean;
  exitBehind: boolean;
  aliens: number;
} {
  const width = MAZE_ROWS[0].length;
  const widthsOk = MAZE_ROWS.every((line) => line.length === width);
  const closed = flood(false);
  const open = flood(true);
  return {
    widthsOk,
    keyBeforeGate: closed.key && closed.water === 0 && closed.soil === 0 && !closed.exit,
    waterBehind: open.water === 2,
    soilBehind: open.soil === 2,
    exitBehind: open.exit,
    aliens: findChar("A").length,
  };
}
