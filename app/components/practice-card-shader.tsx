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
  // Aura — warm brown / sienna. Sits close to ink-950 with a touch more amber.
  aura: {
    colors: ["#2a130f", "#3d1f17", "#57312a", "#6e3f2a", "#8a4d36"],
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
  // Talent — chestnut / walnut. Warm neutral brown without the gold-yellow of
  // cognac or the red of dialogue; reads as a quiet mid-brown.
  talent: {
    colors: ["#20130f", "#2f1c15", "#452a20", "#5e3a2c", "#80543d"],
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
  // Dialogue — burgundy / wine. Most saturated; reads red-brown.
  dialogue: {
    colors: ["#260c0a", "#3d1410", "#5a1c1a", "#7a2622", "#9e4a4e"],
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
