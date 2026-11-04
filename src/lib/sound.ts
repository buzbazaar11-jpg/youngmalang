// Notification chime generated with Web Audio (no audio file needed).
let ctx: AudioContext | null = null;

const getCtx = () => {
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
};

// Browsers block audio until the user interacts once; unlock on first tap/click.
if (typeof window !== "undefined") {
  const unlock = () => {
    const c = getCtx();
    c?.resume();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
}

export const playNotificationSound = () => {
  try {
    const c = getCtx();
    if (!c) return;
    c.resume();
    const now = c.currentTime;
    [880, 1175, 1568].forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = now + i * 0.18;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      osc.connect(gain).connect(c.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  } catch {
    /* ignore */
  }
};
