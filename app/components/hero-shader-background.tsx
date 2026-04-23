"use client";

import {
  Shader,
  FilmGrain,
  Liquify,
  MultiPointGradient,
  Paper,
  WaveDistortion,
} from "shaders/react";

export function HeroShaderBackground({ className }: { className?: string }) {
  return (
    <Shader
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      {/* Elegant wellness palette: real tonal range — caramel highlight → copper
          mid → deep wine-brown anchor → near-ink shadow — with a single muted
          burgundy note so the wash reads rich instead of monochrome/muddy. */}
      <MultiPointGradient
        colorA="#b88464"
        colorB="#6a2824"
        colorC="#8a553f"
        colorD="#2e0d0a"
        colorE="#a67050"
        positionA={{ x: 0.22, y: 0.18 }}
        positionB={{ x: 0.88, y: 0.62 }}
        positionC={{ x: 0.54, y: 0.42 }}
        positionD={{ x: 0.18, y: 0.82 }}
        positionE={{ x: 0.78, y: 0.22 }}
        smoothness={2.15}
      />
      <WaveDistortion angle={112} frequency={1.1} strength={0.28} speed={0.9} />
      <Liquify intensity={12} damping={0.75} radius={1.5} stiffness={14} />
      <Paper displacement={1} grainScale={0.1} roughness={0.1} seed={23} />
      <FilmGrain strength={0.35} visible={false} />
    </Shader>
  );
}
