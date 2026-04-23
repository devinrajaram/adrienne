"use client";

import {
  Shader,
  FilmGrain,
  Liquify,
  MultiPointGradient,
  Paper,
  WaveDistortion,
} from "shaders/react";

type Variant = "aura" | "talent" | "dialogue";

type Palette = {
  colors: [string, string, string, string, string];
  positions: [
    { x: number; y: number },
    { x: number; y: number },
    { x: number; y: number },
    { x: number; y: number },
    { x: number; y: number },
  ];
  seed: number;
  /** Per-variant motion. Each card breathes at its own rate and direction. */
  wave: {
    angle: number;
    frequency: number;
    strength: number;
    speed: number;
  };
  liquify: {
    intensity: number;
    stiffness: number;
    damping: number;
  };
};

/**
 * Watercolor gradients for the three Practice cards. Same shader stack as the
 * hero so the language reads as one system; palette, seed, and motion params
 * diverge so each card has its own wash and pace.
 */
const PALETTES: Record<Variant, Palette> = {
  // Aura — warm honey/amber, languid drift
  aura: {
    colors: ["#d4a574", "#e8bd8a", "#ffd4a1", "#a67150", "#c89160"],
    positions: [
      { x: 0.22, y: 0.18 },
      { x: 0.82, y: 0.28 },
      { x: 0.55, y: 0.62 },
      { x: 0.18, y: 0.78 },
      { x: 0.88, y: 0.82 },
    ],
    seed: 17,
    wave: { angle: 78, frequency: 1.35, strength: 0.42, speed: 1.4 },
    liquify: { intensity: 14, stiffness: 12, damping: 0.55 },
  },
  // Talent — smoky sand/taupe, softest motion
  talent: {
    colors: ["#e8d9c2", "#c8a990", "#8b6b5a", "#d8c0a8", "#a88870"],
    positions: [
      { x: 0.14, y: 0.22 },
      { x: 0.78, y: 0.14 },
      { x: 0.62, y: 0.58 },
      { x: 0.32, y: 0.76 },
      { x: 0.9, y: 0.7 },
    ],
    seed: 29,
    wave: { angle: 146, frequency: 0.95, strength: 0.3, speed: 2.2 },
    liquify: { intensity: 9, stiffness: 18, damping: 0.85 },
  },
  // Dialogue — coral/peach, brisker and more agitated
  dialogue: {
    colors: ["#ffcabf", "#e89a82", "#cb7463", "#ffbeaf", "#b56a52"],
    positions: [
      { x: 0.18, y: 0.32 },
      { x: 0.74, y: 0.18 },
      { x: 0.58, y: 0.64 },
      { x: 0.28, y: 0.8 },
      { x: 0.9, y: 0.46 },
    ],
    seed: 47,
    wave: { angle: 214, frequency: 1.7, strength: 0.55, speed: 3.2 },
    liquify: { intensity: 18, stiffness: 9, damping: 0.4 },
  },
};

export function PracticeCardShader({ variant }: { variant: Variant }) {
  const p = PALETTES[variant];
  return (
    <Shader
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <MultiPointGradient
        colorA={p.colors[0]}
        colorB={p.colors[1]}
        colorC={p.colors[2]}
        colorD={p.colors[3]}
        colorE={p.colors[4]}
        positionA={p.positions[0]}
        positionB={p.positions[1]}
        positionC={p.positions[2]}
        positionD={p.positions[3]}
        positionE={p.positions[4]}
        smoothness={2.05}
      />
      <WaveDistortion
        angle={p.wave.angle}
        frequency={p.wave.frequency}
        strength={p.wave.strength}
        speed={p.wave.speed}
      />
      <Liquify
        intensity={p.liquify.intensity}
        stiffness={p.liquify.stiffness}
        damping={p.liquify.damping}
        radius={1.5}
      />
      <Paper displacement={1} grainScale={0.1} roughness={0.1} seed={p.seed} />
      <FilmGrain strength={0.35} visible={false} />
    </Shader>
  );
}
