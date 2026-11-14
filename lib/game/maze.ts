export const MAZE_ROWS = [
  "###########",
  "#S..W.....#",
  "#.#.###.#.#",
  "#.#D..#.#.#",
  "#.###.#.#.#",
  "#.....#.W.#",
  "#.###.###.#",
  "#.#D....#.#",
  "#.#.###.#.#",
  "#...#...E.#",
  "###########",
];

export type Cell = { row: number; col: number };

export function mazeSize(): { rows: number; cols: number } {
  return { rows: MAZE_ROWS.length, cols: MAZE_ROWS[0].length };
}

export function mazeChar(row: number, col: number): string {
  return MAZE_ROWS[row]?.[col] ?? "#";
}

export function isWall(row: number, col: number): boolean {
  return mazeChar(row, col) === "#";
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

export function reachable(): { water: number; soil: number; exit: boolean; widthsOk: boolean } {
  const width = MAZE_ROWS[0].length;
  const widthsOk = MAZE_ROWS.every((line) => line.length === width);
  const start = mazeStart();
  const seen = new Set<string>();
  const queue = [start];
  let water = 0;
  let soil = 0;
  let exit = false;
  while (queue.length) {
    const cell = queue.shift()!;
    const key = `${cell.row},${cell.col}`;
    if (seen.has(key) || isWall(cell.row, cell.col)) continue;
    seen.add(key);
    const char = mazeChar(cell.row, cell.col);
    if (char === "W") water += 1;
    if (char === "D") soil += 1;
    if (char === "E") exit = true;
    for (const step of STEPS) {
      queue.push({ row: cell.row + step.row, col: cell.col + step.col });
    }
  }
  return { water, soil, exit, widthsOk };
}
