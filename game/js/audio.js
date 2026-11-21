// audio.js — every sound is synthesized with the Web Audio API, so the game
// needs no audio files and stays silent until the player's first gesture.

const SoundKit = (() => {
  let context = null;

  function ensureContext() {
    if (context) {
      if (context.state === 'suspended') context.resume();
      return context;
    }
    try {
      context = new (window.AudioContext || window.webkitAudioContext)();
    } catch (err) {
      context = null;
    }
    return context;
  }

  function tone(freq, start, duration, type, volume, slideTo) {
    const ac = ensureContext();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const t0 = ac.currentTime + start;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  // A bright two-note chime when a difference is found.
  function playFound() {
    tone(880, 0, 0.16, 'sine', 0.22);
    tone(1318, 0.07, 0.22, 'sine', 0.22);
  }

  // A low buzz when a click misses.
  function playMiss() {
    tone(160, 0, 0.2, 'square', 0.08, 110);
  }

  // A soft tick for the last seconds of the clock.
  function playTick() {
    tone(1200, 0, 0.05, 'sine', 0.07);
  }

  // A hint shimmer: three rising notes.
  function playHint() {
    tone(660, 0, 0.12, 'triangle', 0.16);
    tone(880, 0.08, 0.12, 'triangle', 0.16);
    tone(1100, 0.16, 0.18, 'triangle', 0.16);
  }

  // A little fanfare when a scene is cleared.
  function playSceneClear() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => tone(n, i * 0.11, 0.24, 'triangle', 0.2));
  }

  // A sad descending pair when time runs out.
  function playTimeUp() {
    tone(392, 0, 0.3, 'triangle', 0.18);
    tone(262, 0.22, 0.45, 'triangle', 0.18);
  }

  return { unlock: ensureContext, playFound, playMiss, playTick, playHint, playSceneClear, playTimeUp };
})();
