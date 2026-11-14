let context: AudioContext | null = null;
let muted = false;

export function isMuted(): boolean {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
}

function tone(freq: number, duration: number, type: OscillatorType, gainValue: number, delay = 0) {
  if (muted || typeof window === "undefined") return;
  const Ctx = window.AudioContext;
  context ??= new Ctx();
  if (context.state === "suspended") void context.resume();
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const start = context.currentTime + delay;
  gain.gain.setValueAtTime(gainValue, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start(start);
  osc.stop(start + duration);
}

export type SoundName = "ui" | "talk" | "ok" | "miss" | "launch" | "shoot" | "cheer";

export function blip(kind: SoundName) {
  if (kind === "ui") tone(660, 0.05, "square", 0.02);
  if (kind === "talk") tone(420, 0.04, "square", 0.015);
  if (kind === "ok") tone(520, 0.08, "square", 0.03);
  if (kind === "miss") tone(110, 0.16, "square", 0.04);
  if (kind === "shoot") tone(880, 0.04, "square", 0.02);
  if (kind === "launch") {
    tone(180, 0.25, "sawtooth", 0.03);
    tone(280, 0.3, "square", 0.02, 0.12);
  }
  if (kind === "cheer") {
    tone(392, 0.16, "square", 0.03);
    tone(523, 0.16, "square", 0.03, 0.1);
    tone(659, 0.22, "square", 0.03, 0.2);
  }
}
