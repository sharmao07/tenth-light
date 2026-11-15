import type { Who } from "@/lib/game/types";

const PALETTE: Record<string, string> = {
  k: "#1a1714",
  s: "#c96b4a",
  p: "#efe6d6",
  a: "#e39b12",
  f: "#e39b12",
  c: "#f4efe6",
  r: "#c4452d",
  m: "#8a8175",
  b: "#245066",
  w: "#d5e4ea",
  ".": "transparent",
};

const HUMAN = [
  ".......kkkkkk.......",
  ".....kkkkkkkkkk.....",
  "....kkkkkkkkkkkk....",
  "...kkksssssssskkk...",
  "...kksssssssssskk...",
  "...kksskksskksskk...",
  "...kksssssssssskk...",
  "....ssssssssssss....",
  ".....sskkkkss......",
  ".....ssssssssss.....",
  "......ssssssss......",
  "....pppppppppppp....",
  "...pppaaaaapppp....",
  "...ppppppppppppp....",
  "....pppppppppppp....",
  ".....pppppppp.......",
];

const CAT = [
  "..ff..........ff..",
  ".ffff........ffff.",
  ".ffcf........fcff.",
  "..ffffffffffffff..",
  "..ffkkffffffkkff..",
  "..ffkffffffffkff..",
  "..ffffffffffffff..",
  "...fffccccccfff...",
  "...ffffrrrrffff...",
  "....ffffffffff....",
  "...kkkkkkkkkkkk...",
];

const ALIEN = [
  ".....aaaaa......",
  "...aaakakaaa....",
  "..aaaaaaaaaaa...",
  "..aakaaaaakaa...",
  "..aaaaaaaaaaa...",
  "...aaaarrrr.....",
  "....aaaaaaa.....",
  "...mmaaaaamm....",
  "..mmmaaaaammm...",
  "...mmmmmmmmm....",
];

const SPRITE: Record<Who, string[]> = {
  wren: HUMAN,
  scientist: HUMAN,
  control: HUMAN,
  nori: CAT,
  lumen: ALIEN,
  redline: ALIEN,
  pebble: ALIEN,
  bolt: ALIEN,
  spray: ALIEN,
  tilt: ALIEN,
  lag: ALIEN,
  heart: ALIEN,
  whisper: ALIEN,
  shore: ALIEN,
};

const TINT: Partial<Record<Who, Record<string, string>>> = {
  control: { s: "#d9d2c5", a: "#e39b12" },
  scientist: { p: "#f7f1e6" },
  redline: { a: "#c4452d", m: "#8a8175" },
  spray: { a: "#d5e4ea" },
  pebble: { a: "#8a8175" },
  bolt: { a: "#e39b12", m: "#1a1714" },
  shore: { a: "#efe6d6", k: "#efe6d6" },
  whisper: { a: "#6d645b" },
  heart: { r: "#c4452d", a: "#efe6d6" },
  lag: { a: "#efe6d6", m: "#e39b12" },
  tilt: { a: "#d9d2c5" },
  lumen: { a: "#f4efe6" },
};

export function Portrait({ who }: { who: Who }) {
  const rows = SPRITE[who];
  const tint = TINT[who] ?? {};
  const width = rows[0].length;
  const height = rows.length;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="pixel"
      role="img"
      aria-label={who}
      shapeRendering="crispEdges"
    >
      {rows.map((row, y) =>
        [...row].map((cell, x) => {
          const fill = tint[cell] ?? PALETTE[cell];
          if (!fill || fill === "transparent") return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
        }),
      )}
    </svg>
  );
}
