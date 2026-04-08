import { useEffect, useRef } from 'react';

/**
 * CS2-style terminal SFX using Web Audio (no media files).
 * - Plays a short "boot" chirp sequence on first user interaction.
 * - Plays subtle click ticks while typewriter text animates.
 */
const TerminalSfxController = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const unlockedRef = useRef(false);
  const lastTickMsRef = useRef(0);
  const enabledRef = useRef(true);
  const ambientOscRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const whirrOscRef = useRef<OscillatorNode | null>(null);
  const whirrGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const createCtx = () => {
      if (!ctxRef.current) {
        const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return null;
        ctxRef.current = new Ctx();
      }
      return ctxRef.current;
    };

    const beep = (ctx: AudioContext, freq: number, durationSec: number, gain = 0.03) => {
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      amp.gain.setValueAtTime(0.0001, ctx.currentTime);
      amp.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.008);
      amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);
      osc.connect(amp);
      amp.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationSec + 0.01);
    };

    const click = (ctx: AudioContext, when = 0, gain = 0.025) => {
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1300, ctx.currentTime + when);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + when + 0.03);
      amp.gain.setValueAtTime(0.0001, ctx.currentTime + when);
      amp.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + when + 0.003);
      amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + 0.045);
      osc.connect(amp);
      amp.connect(ctx.destination);
      osc.start(ctx.currentTime + when);
      osc.stop(ctx.currentTime + when + 0.06);
    };

    const metallicUnseal = (ctx: AudioContext) => {
      // Futuristic "unseal" sweep: filtered noise + rising digital tone.
      const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.24), ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * 0.35;
      }

      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(480, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3400, ctx.currentTime + 0.2);
      filter.Q.value = 9;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.24);

      const tone = ctx.createOscillator();
      const toneGain = ctx.createGain();
      tone.type = 'sawtooth';
      tone.frequency.setValueAtTime(240, ctx.currentTime);
      tone.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.21);
      toneGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      toneGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);
      toneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.23);

      src.connect(filter);
      filter.connect(g);
      g.connect(ctx.destination);
      tone.connect(toneGain);
      toneGain.connect(ctx.destination);

      src.start();
      src.stop(ctx.currentTime + 0.25);
      tone.start();
      tone.stop(ctx.currentTime + 0.25);
    };

    const stopAmbient = () => {
      if (ambientOscRef.current) {
        try {
          ambientOscRef.current.stop();
        } catch {
          // oscillator may already be stopped
        }
        ambientOscRef.current.disconnect();
        ambientOscRef.current = null;
      }
      if (ambientGainRef.current) {
        ambientGainRef.current.disconnect();
        ambientGainRef.current = null;
      }
      if (whirrOscRef.current) {
        try {
          whirrOscRef.current.stop();
        } catch {
          // oscillator may already be stopped
        }
        whirrOscRef.current.disconnect();
        whirrOscRef.current = null;
      }
      if (whirrGainRef.current) {
        whirrGainRef.current.disconnect();
        whirrGainRef.current = null;
      }
    };

    const startAmbient = (ctx: AudioContext) => {
      stopAmbient();
      // Low room hum.
      const hum = ctx.createOscillator();
      const humGain = ctx.createGain();
      hum.type = 'triangle';
      hum.frequency.value = 42;
      humGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      humGain.gain.exponentialRampToValueAtTime(0.0036, ctx.currentTime + 0.35);
      hum.connect(humGain);
      humGain.connect(ctx.destination);
      hum.start();
      ambientOscRef.current = hum;
      ambientGainRef.current = humGain;

      // Mid "electronic whirr" bed.
      const whirr = ctx.createOscillator();
      const whirrGain = ctx.createGain();
      whirr.type = 'sawtooth';
      whirr.frequency.value = 118;
      whirrGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      whirrGain.gain.exponentialRampToValueAtTime(0.0016, ctx.currentTime + 0.4);
      whirr.connect(whirrGain);
      whirrGain.connect(ctx.destination);
      whirr.start();
      whirrOscRef.current = whirr;
      whirrGainRef.current = whirrGain;
    };

    const unlockAndBoot = async () => {
      if (unlockedRef.current || !enabledRef.current) return;
      const ctx = createCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      unlockedRef.current = true;
      // Terminal opening: unseal + digital whirr + click/clack.
      metallicUnseal(ctx);
      beep(ctx, 520, 0.03, 0.013);
      window.setTimeout(() => beep(ctx, 690, 0.04, 0.013), 45);
      window.setTimeout(() => beep(ctx, 880, 0.045, 0.013), 95);
      click(ctx, 0.16, 0.02);
      click(ctx, 0.22, 0.017);
      startAmbient(ctx);
    };

    const onTick = () => {
      if (!enabledRef.current || !unlockedRef.current) return;
      const now = performance.now();
      // Throttle ticks for long text.
      if (now - lastTickMsRef.current < 28) return;
      lastTickMsRef.current = now;
      const ctx = createCtx();
      if (!ctx) return;
      beep(ctx, 1400, 0.015, 0.008);
    };

    const onFirstInteraction = () => {
      void unlockAndBoot();
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
    };

    const onSetEnabled = (e: Event) => {
      const custom = e as CustomEvent<{ enabled?: boolean }>;
      const enabled = Boolean(custom.detail?.enabled);
      enabledRef.current = enabled;
      const ctx = createCtx();
      if (enabled && unlockedRef.current && ctx) {
        startAmbient(ctx);
      } else if (!enabled) {
        stopAmbient();
      }
      try {
        window.localStorage.setItem('terminalSfxEnabled', enabled ? '1' : '0');
      } catch {
        // ignore storage failures
      }
    };

    try {
      const stored = window.localStorage.getItem('terminalSfxEnabled');
      if (stored === '0') enabledRef.current = false;
    } catch {
      // ignore storage failures
    }

    window.addEventListener('pointerdown', onFirstInteraction, { passive: true });
    window.addEventListener('keydown', onFirstInteraction, { passive: true });
    window.addEventListener('touchstart', onFirstInteraction, { passive: true });
    window.addEventListener('typewriter:tick', onTick as EventListener);
    window.addEventListener('terminal-sfx:set-enabled', onSetEnabled as EventListener);

    return () => {
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('typewriter:tick', onTick as EventListener);
      window.removeEventListener('terminal-sfx:set-enabled', onSetEnabled as EventListener);
      stopAmbient();
    };
  }, []);

  return null;
};

export default TerminalSfxController;
