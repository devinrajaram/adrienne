"use client";

import {
  Shader,
  Liquify,
  MultiPointGradient,
  Paper,
  WaveDistortion,
} from "shaders/react";

export function HeroShaderBackground({ className }: { className?: string }) {
  return (
    <Shader
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#F0E3C8",
      }}
    >
      <MultiPointGradient
        colorA="#8f6c5a"
        colorB="#F0E3C8"
        colorC="#4d312a"
        colorD="#462A27"
        colorE="#57312A"
        positionB={{ x: 0.59, y: 0.02 }}
        positionC={{ x: 0.81, y: 0.53 }}
        positionD={{ x: 0.33, y: 0.73 }}
        positionE={{ x: 0.57, y: 0.3 }}
        smoothness={2.05}
      />
      <WaveDistortion angle={112} frequency={1.2} speed={3.2} />
      <Liquify damping={0.7} radius={1.5} stiffness={15} />
      <Paper displacement={1} grainScale={0.1} roughness={0.1} seed={42} />
    </Shader>
  );
}
