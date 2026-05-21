export const playHeartbeatSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playBeat = (time: number, frequency: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, time);
      // Rapid pitch drop for a realistic thud sound
      osc.frequency.exponentialRampToValueAtTime(0.01, time + duration);

      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + duration);
    };

    const now = ctx.currentTime;
    // First beat (lower pitch)
    playBeat(now, 80, 0.15);
    // Second beat (slightly higher pitch, shortly after)
    playBeat(now + 0.18, 85, 0.15);
  } catch (e) {
    console.warn("Audio context failed to play:", e);
  }
};