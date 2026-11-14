let context: AudioContext | null = null;
let muted = true;

export function isMuted(): boolean {
  return muted;
}

export function setMuted(next: boolean) {
  muted = next;
}

function tone(freq: number, duration: number, type: OscillatorType, gainValue: number) {
  if (muted || typeof window === "undefined") return;
  const Ctx = window.AudioContext;
  context ??= new Ctx();
  if (context.state === "suspended") void context.resume();
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = gainValue;
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  osc.stop(context.currentTime + duration);
}

export function blip(kind: "ok" | "miss" | "cheer") {
  if (kind === "ok") tone(520, 0.08, "sine", 0.03);
  if (kind === "miss") tone(140, 0.18, "triangle", 0.04);
  if (kind === "cheer") {
    tone(392, 0.2, "sine", 0.03);
    setTimeout(() => tone(523, 0.22, "sine", 0.03), 90);
    setTimeout(() => tone(659, 0.28, "sine", 0.03), 180);
  }
}
