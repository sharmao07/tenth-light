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
      <circle cx="100" cy="108" r="46" fill="#c96b4a" />
      <path d="M54 96c8-40 84-40 92 0v8H54z" fill="#1a1714" />
      <rect x="62" y="128" width="76" height="70" fill="#e6dfd0" />
      <rect x="70" y="96" width="60" height="8" fill="#e39b12" />
      <circle cx="84" cy="112" r="3" fill="#1a1714" />
      <circle cx="116" cy="112" r="3" fill="#1a1714" />
    </g>
  );
}

function Nori() {
  return (
    <g>
      <path d="M58 108 L78 48 L96 96 Z" fill="#e39b12" />
      <path d="M142 108 L122 48 L104 96 Z" fill="#e39b12" />
      <circle cx="100" cy="124" r="48" fill="#e39b12" />
      <circle cx="100" cy="132" r="22" fill="#f3eee4" />
      <circle cx="84" cy="118" r="5" fill="#1a1714" />
      <circle cx="116" cy="118" r="5" fill="#1a1714" />
      <path d="M96 132 h8 l-4 6 z" fill="#c4452d" />
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
      <circle cx="100" cy="108" r="40" fill="#d9d2c5" />
      <path d="M60 108 h-12 v28 h12 M140 108 h12 v28 h-12" fill="none" stroke="#e39b12" strokeWidth="6" />
      <rect x="70" y="150" width="60" height="40" fill="#2a261f" />
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
