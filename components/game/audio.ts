let context: AudioContext | null = null;
let muted = false;

export function isMuted(): boolean {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
}

function ctx(): AudioContext | null {
  if (muted || typeof window === "undefined") return null;
  const Ctx = window.AudioContext;
  context ??= new Ctx();
  if (context.state === "suspended") void context.resume();
  return context;
}

function tone(freq: number, duration: number, type: OscillatorType, gainValue: number, delay = 0) {
  const audio = ctx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime + delay);
  const start = audio.currentTime + delay;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function noise(duration: number, gainValue: number) {
  const audio = ctx();
  if (!audio) return;
  const length = Math.floor(audio.sampleRate * duration);
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const source = audio.createBufferSource();
  const gain = audio.createGain();
  source.buffer = buffer;
  gain.gain.value = gainValue;
  source.connect(gain);
  gain.connect(audio.destination);
  source.start();
}

export type SoundName = "ui" | "talk" | "ok" | "miss" | "launch" | "shoot" | "cheer";

export function blip(kind: SoundName) {
  if (kind === "ui") tone(740, 0.07, "square", 0.06);
  if (kind === "talk") tone(480, 0.06, "triangle", 0.05);
  if (kind === "ok") {
    tone(523, 0.1, "square", 0.06);
    tone(784, 0.14, "square", 0.05, 0.08);
  }
  if (kind === "miss") {
    noise(0.18, 0.08);
    tone(90, 0.22, "sawtooth", 0.05);
  }
  if (kind === "shoot") {
    tone(980, 0.05, "square", 0.04);
    noise(0.04, 0.05);
  }
  if (kind === "launch") {
    noise(0.45, 0.07);
    tone(90, 0.4, "sawtooth", 0.06);
    tone(180, 0.35, "square", 0.04, 0.08);
    tone(360, 0.2, "square", 0.03, 0.2);
  }
  if (kind === "cheer") {
    tone(392, 0.16, "square", 0.06);
    tone(523, 0.16, "square", 0.06, 0.12);
    tone(659, 0.28, "square", 0.06, 0.24);
  }
}
