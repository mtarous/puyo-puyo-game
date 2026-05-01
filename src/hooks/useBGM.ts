"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GamePhase } from "./useGame";

// ─── Frequencies (Hz) ─────────────────────────────────────────────────────────

const F = {
  E2: 82.41,  G2: 98.00,  A2: 110.00, C3: 130.81, E3: 164.81,
  A3: 220.00, C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00,
  A4: 440.00, C5: 523.25, D5: 587.33, E5: 659.25, G5: 784.00, A5: 880.00,
};
const R = 0; // rest

// ─── Sequences (16th notes) ───────────────────────────────────────────────────

// 2-bar bass (32 steps)
const BASS_SEQ = [
  F.A2, R,     F.A2, R,     F.E2, R,     F.G2, R,
  F.A2, R,     F.C3, R,     F.E2, F.G2,  F.A2, R,
  F.A2, R,     F.A2, F.A2,  F.G2, R,     F.E2, R,
  F.A2, F.C3,  F.A2, R,     F.G2, R,     F.E2, R,
];

// 4-bar melody (64 steps) – A minor pentatonic
const MELODY_SEQ = [
  F.E5,  R,     F.C5,  F.E5,  F.G5,  R,     F.A5,  R,
  F.G5,  F.E5,  F.D5,  R,     F.C5,  R,     F.D5,  F.E5,
  F.G5,  R,     F.A5,  R,     F.G5,  F.E5,  F.C5,  F.D5,
  F.E5,  R,     F.C5,  F.A4,  F.G4,  R,     F.A4,  R,
  F.C5,  F.E5,  F.G5,  R,     F.A5,  F.G5,  F.E5,  F.D5,
  F.C5,  R,     F.E5,  R,     F.G5,  F.A5,  F.G5,  F.E5,
  F.D5,  F.C5,  F.A4,  R,     F.G4,  R,     F.A4,  F.C5,
  F.E5,  F.G5,  F.A5,  R,     F.G5,  F.E5,  F.D5,  R,
];

// 1-bar rhythm (16 steps)
const KICK_SEQ    = [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0];
const SNARE_SEQ   = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0];
const HIHAT_SEQ   = [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,0,0];
const OPENHAT_SEQ = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,1,0];

// ─── Timing ───────────────────────────────────────────────────────────────────

function step16Dur(level: number): number {
  const bpmVal = Math.min(185, 132 + (level - 1) * 3.5);
  return (60 / bpmVal) / 4;
}

// ─── Noise buffer ─────────────────────────────────────────────────────────────

function makeNoiseBuf(ctx: AudioContext): AudioBuffer {
  const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

// ─── Sound generators ─────────────────────────────────────────────────────────

function playBass(ctx: AudioContext, dest: AudioNode, freq: number, when: number, dur: number) {
  if (!freq) return;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  osc1.type = "square";
  osc2.type = "square";
  osc1.frequency.value = freq;
  osc2.frequency.value = freq * 1.006;
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(0.22, when + 0.005);
  gain.gain.setValueAtTime(0.18, when + dur * 0.5);
  gain.gain.exponentialRampToValueAtTime(0.001, when + dur * 0.88);
  osc1.connect(gain); osc2.connect(gain); gain.connect(dest);
  osc1.start(when); osc1.stop(when + dur);
  osc2.start(when); osc2.stop(when + dur);
}

function playLead(ctx: AudioContext, dest: AudioNode, freq: number, when: number, dur: number) {
  if (!freq) return;
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.value = freq;
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(5000, when);
  filter.frequency.exponentialRampToValueAtTime(900, when + dur * 0.45);
  filter.Q.value = 6;
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(0.19, when + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, when + dur * 0.72);
  osc.connect(filter); filter.connect(gain); gain.connect(dest);
  osc.start(when); osc.stop(when + dur + 0.01);
}

function playKick(ctx: AudioContext, dest: AudioNode, when: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(165, when);
  osc.frequency.exponentialRampToValueAtTime(38, when + 0.13);
  gain.gain.setValueAtTime(1.0, when);
  gain.gain.exponentialRampToValueAtTime(0.001, when + 0.18);
  osc.connect(gain); gain.connect(dest);
  osc.start(when); osc.stop(when + 0.2);
  // click transient
  const click = ctx.createOscillator();
  const cg = ctx.createGain();
  click.type = "square";
  click.frequency.value = 900;
  cg.gain.setValueAtTime(0.28, when);
  cg.gain.exponentialRampToValueAtTime(0.001, when + 0.01);
  click.connect(cg); cg.connect(dest);
  click.start(when); click.stop(when + 0.015);
}

function playSnare(ctx: AudioContext, dest: AudioNode, when: number, noiseBuf: AudioBuffer) {
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuf;
  const nf = ctx.createBiquadFilter();
  nf.type = "bandpass"; nf.frequency.value = 2800; nf.Q.value = 0.8;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.38, when);
  ng.gain.exponentialRampToValueAtTime(0.001, when + 0.11);
  noise.connect(nf); nf.connect(ng); ng.connect(dest);
  noise.start(when); noise.stop(when + 0.15);
  // tone body
  const osc = ctx.createOscillator();
  const tg = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(230, when);
  osc.frequency.exponentialRampToValueAtTime(150, when + 0.06);
  tg.gain.setValueAtTime(0.28, when);
  tg.gain.exponentialRampToValueAtTime(0.001, when + 0.08);
  osc.connect(tg); tg.connect(dest);
  osc.start(when); osc.stop(when + 0.1);
}

function playHihat(ctx: AudioContext, dest: AudioNode, when: number, open: boolean, noiseBuf: AudioBuffer) {
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuf;
  const hf = ctx.createBiquadFilter();
  hf.type = "highpass"; hf.frequency.value = 9500;
  const hg = ctx.createGain();
  const dur = open ? 0.11 : 0.022;
  hg.gain.setValueAtTime(0.11, when);
  hg.gain.exponentialRampToValueAtTime(0.001, when + dur);
  noise.connect(hf); hf.connect(hg); hg.connect(dest);
  noise.start(when); noise.stop(when + dur + 0.005);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useBGM(phase: GamePhase, level: number) {
  const ctxRef      = useRef<AudioContext | null>(null);
  const masterRef   = useRef<GainNode | null>(null);
  const noiseBufRef = useRef<AudioBuffer | null>(null);
  const stepRef     = useRef(0);
  const nextNoteRef = useRef(0);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const levelRef    = useRef(level);
  const playingRef  = useRef(false);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  useEffect(() => { levelRef.current = level; }, [level]);

  // ── Init AudioContext (must be after user gesture) ────────────────────────
  const ensureCtx = useCallback(() => {
    if (ctxRef.current) return true;
    try {
      const ctx = new AudioContext();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 6;
      comp.ratio.value = 4;
      comp.attack.value = 0.003;
      comp.release.value = 0.25;
      const master = ctx.createGain();
      master.gain.value = 0.001;
      master.connect(comp);
      comp.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
      noiseBufRef.current = makeNoiseBuf(ctx);
      nextNoteRef.current = ctx.currentTime;
      stepRef.current = 0;
      return true;
    } catch {
      return false;
    }
  }, []);

  // ── Scheduler ─────────────────────────────────────────────────────────────
  const schedule = useCallback(() => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    const noiseBuf = noiseBufRef.current;
    if (!ctx || !master || !noiseBuf) return;

    const LOOK_AHEAD = 0.1;
    const s16 = step16Dur(levelRef.current);

    while (nextNoteRef.current < ctx.currentTime + LOOK_AHEAD) {
      const s = stepRef.current;
      const t = nextNoteRef.current;

      playBass(ctx, master, BASS_SEQ[s % BASS_SEQ.length],   t, s16 * 1.9);
      playLead(ctx, master, MELODY_SEQ[s % MELODY_SEQ.length], t, s16 * 1.5);
      if (KICK_SEQ[s % 16])    playKick(ctx, master, t);
      if (SNARE_SEQ[s % 16])   playSnare(ctx, master, t, noiseBuf);
      if (HIHAT_SEQ[s % 16])   playHihat(ctx, master, t, false, noiseBuf);
      if (OPENHAT_SEQ[s % 16]) playHihat(ctx, master, t, true,  noiseBuf);

      nextNoteRef.current += s16;
      stepRef.current++;
    }
  }, []);

  // ── Start / stop ──────────────────────────────────────────────────────────
  const startBGM = useCallback(() => {
    if (!ensureCtx()) return;
    const ctx = ctxRef.current!;
    const master = masterRef.current!;
    if (ctx.state === "suspended") ctx.resume();

    if (!playingRef.current) {
      // reset sequence on fresh start
      stepRef.current = 0;
      nextNoteRef.current = ctx.currentTime;
    }
    playingRef.current = true;

    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value || 0.001, ctx.currentTime);
    if (!mutedRef.current) {
      master.gain.exponentialRampToValueAtTime(0.75, ctx.currentTime + 0.6);
    }

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(schedule, 25);
  }, [ensureCtx, schedule]);

  const stopBGM = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    playingRef.current = false;
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value || 0.001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    }
  }, []);

  // ── React to phase ────────────────────────────────────────────────────────
  useEffect(() => {
    const active = phase === "falling" || phase === "popping" || phase === "gravity" || phase === "locking";
    if (active) startBGM();
    else stopBGM();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, startBGM, stopBGM]);

  // ── Mute toggle ───────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value || 0.001, ctx.currentTime);
    if (next) {
      master.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    } else {
      master.gain.exponentialRampToValueAtTime(0.75, ctx.currentTime + 0.3);
    }
  }, []);

  // ── Cleanup ───────────────────────────────────────────────────────────────
  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    ctxRef.current?.close();
  }, []);

  return { muted, toggleMute };
}
