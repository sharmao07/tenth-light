import type { Who } from "@/lib/game/types";

export function Portrait({ who }: { who: Who }) {
  return (
    <svg viewBox="0 0 200 240" className="portrait" role="img" aria-label={who}>
      <rect width="200" height="240" fill="#1a1714" />
      {who === "nori" && <Nori />}
      {who === "wren" && <Wren />}
      {who === "lumen" && <Disc fill="#f3eee4" />}
      {who === "redline" && <Disc fill="#c4452d" />}
      {who === "pebble" && <Pebble />}
      {who === "bolt" && <Bolt />}
      {who === "spray" && <Disc fill="#d5e4ea" />}
      {who === "tilt" && <Tilt />}
      {who === "lag" && <Lag />}
      {who === "heart" && <HeartFace />}
      {who === "whisper" && <Disc fill="#8a8175" />}
      {who === "shore" && <Shore />}
      {who === "control" && <Control />}
      {who === "scientist" && <Scientist />}
    </svg>
  );
}

function Wren() {
  return (
    <g>
      <path d="M46 168 h108 l-10 48 H56 z" fill="#efe6d6" />
      <path d="M58 168 h84 v18 H58 z" fill="#e39b12" />
      <circle cx="100" cy="108" r="48" fill="#c96b4a" />
      <path d="M52 104c6-46 90-46 96 0v10H52z" fill="#1a1714" />
      <path d="M64 112 h72 v16 H64 z" fill="#1a1714" opacity="0.9" />
      <path d="M68 114 h64 v6 H68 z" fill="#e39b12" />
      <circle cx="84" cy="128" r="3.5" fill="#1a1714" />
      <circle cx="116" cy="128" r="3.5" fill="#1a1714" />
      <path d="M92 142 h16" stroke="#1a1714" strokeWidth="3" />
    </g>
  );
}

function Nori() {
  return (
    <g>
      <path d="M48 118 L74 36 L98 104 Z" fill="#e39b12" />
      <path d="M58 112 L74 52 L88 104 Z" fill="#f3eee4" />
      <path d="M152 118 L126 36 L102 104 Z" fill="#e39b12" />
      <path d="M142 112 L126 52 L112 104 Z" fill="#f3eee4" />
      <ellipse cx="100" cy="132" rx="54" ry="48" fill="#e39b12" />
      <ellipse cx="100" cy="146" rx="24" ry="18" fill="#f3eee4" />
      <ellipse cx="82" cy="128" rx="7" ry="8" fill="#1a1714" />
      <ellipse cx="118" cy="128" rx="7" ry="8" fill="#1a1714" />
      <circle cx="84" cy="126" r="2" fill="#efe6d6" />
      <circle cx="120" cy="126" r="2" fill="#efe6d6" />
      <path d="M96 146 h8 l-4 7 z" fill="#c4452d" />
      <path d="M46 140 h28 M126 140 h28 M50 152 h22 M128 152 h22" stroke="#1a1714" strokeWidth="1.5" />
      <rect x="78" y="176" width="44" height="8" fill="#1a1714" />
    </g>
  );
}

function Disc({ fill }: { fill: string }) {
  return (
    <g>
      <circle cx="100" cy="118" r="58" fill="none" stroke={fill} strokeWidth="8" />
      <circle cx="100" cy="118" r="28" fill={fill} />
      <circle cx="90" cy="112" r="3" fill="#1a1714" />
      <circle cx="110" cy="112" r="3" fill="#1a1714" />
    </g>
  );
}

function Pebble() {
  return (
    <g>
      <path d="M40 150 L70 70 H130 L160 150 Z" fill="#8a8175" />
      <circle cx="88" cy="112" r="4" fill="#1a1714" />
      <circle cx="118" cy="112" r="4" fill="#1a1714" />
    </g>
  );
}

function Bolt() {
  return (
    <g>
      <rect x="48" y="70" width="104" height="100" fill="#e39b12" />
      <rect x="48" y="108" width="104" height="16" fill="#1a1714" />
      <circle cx="86" cy="96" r="4" fill="#1a1714" />
      <circle cx="114" cy="96" r="4" fill="#1a1714" />
    </g>
  );
}

function Tilt() {
  return (
    <g transform="rotate(-18 100 118)">
      <ellipse cx="100" cy="118" rx="62" ry="36" fill="#d9d2c5" />
      <circle cx="82" cy="114" r="3" fill="#1a1714" />
      <circle cx="112" cy="114" r="3" fill="#1a1714" />
    </g>
  );
}

function Lag() {
  return (
    <g>
      <circle cx="78" cy="118" r="36" fill="none" stroke="#e6dfd0" strokeWidth="6" />
      <circle cx="122" cy="118" r="36" fill="none" stroke="#e39b12" strokeWidth="6" />
    </g>
  );
}

function HeartFace() {
  return (
    <g>
      <circle cx="100" cy="120" r="50" fill="#e6dfd0" />
      <path d="M100 138 l-16-14 a10 10 0 1 1 16-8 a10 10 0 1 1 16 8 z" fill="#c4452d" />
    </g>
  );
}

function Shore() {
  return (
    <g>
      <circle cx="100" cy="118" r="52" fill="none" stroke="#e6dfd0" strokeWidth="3" />
      <path d="M78 116 h12 M110 116 h12" stroke="#e6dfd0" strokeWidth="3" />
    </g>
  );
}

function Control() {
  return (
    <g>
      <path d="M48 170 h104 l-8 46 H56 z" fill="#2a261f" />
      <circle cx="100" cy="112" r="42" fill="#d9d2c5" />
      <path d="M58 108 c4-36 80-36 84 0 v6 H58 z" fill="#1a1714" />
      <path d="M62 118 h-16 v22 h16 M138 118 h16 v22 h-16" fill="none" stroke="#e39b12" strokeWidth="5" />
      <circle cx="86" cy="122" r="3" fill="#1a1714" />
      <circle cx="114" cy="122" r="3" fill="#1a1714" />
      <path d="M94 136 h12" stroke="#1a1714" strokeWidth="2" />
    </g>
  );
}

function Scientist() {
  return (
    <g>
      <circle cx="100" cy="104" r="40" fill="#c96b4a" />
      <rect x="64" y="146" width="72" height="60" fill="#f3eee4" />
      <path d="M70 78 h60 l-8 20 h-44 z" fill="#1a1714" />
      <circle cx="86" cy="108" r="3" fill="#1a1714" />
      <circle cx="114" cy="108" r="3" fill="#1a1714" />
    </g>
  );
}
