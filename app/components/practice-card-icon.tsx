"use client";

import { motion, useReducedMotion } from "motion/react";

type Variant = "aura" | "talent" | "dialogue";

/**
 * Thin-stroke line icons for the Practice cards. 48-unit viewBox; stroke
 * width 1.75 reads clearly over the watercolor shader. `currentColor` lets
 * the parent pick tone and blend mode. Each variant has its own ambient
 * animation (rotation / breath / turn-taking) gated by prefers-reduced-motion.
 */
export function PracticeCardIcon({ variant }: { variant: Variant }) {
  const reduce = useReducedMotion() === true;
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
    >
      {variant === "aura" ? <AuraGlyph reduce={reduce} /> : null}
      {variant === "talent" ? <TalentGlyph reduce={reduce} /> : null}
      {variant === "dialogue" ? <DialogueGlyph reduce={reduce} /> : null}
    </svg>
  );
}

/** Aura — filled core + inner ring + 10 rays. Rays rotate slowly, core breathes. */
function AuraGlyph({ reduce }: { reduce: boolean }) {
  const cx = 24;
  const cy = 24;
  const rays = 10;
  const rayStart = 11;
  const rayEnd = 19;
  return (
    <>
      <motion.g
        style={{ transformOrigin: "24px 24px", transformBox: "fill-box" }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: rays }).map((_, i) => {
          const a = (i / rays) * Math.PI * 2 - Math.PI / 2;
          const x1 = cx + Math.cos(a) * rayStart;
          const y1 = cy + Math.sin(a) * rayStart;
          const x2 = cx + Math.cos(a) * rayEnd;
          const y2 = cy + Math.sin(a) * rayEnd;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </motion.g>
      <motion.circle
        cx={cx}
        cy={cy}
        r={7}
        style={{ transformOrigin: "24px 24px", transformBox: "fill-box" }}
        animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r={2.2}
        fill="currentColor"
        stroke="none"
        animate={reduce ? undefined : { opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

/** Talent & Connections — three interlocking rings. Each breathes on its own phase. */
function TalentGlyph({ reduce }: { reduce: boolean }) {
  const rings: readonly {
    cx: number;
    cy: number;
    r: number;
    delay: number;
  }[] = [
    { cx: 17, cy: 20, r: 7.5, delay: 0 },
    { cx: 31, cy: 20, r: 7.5, delay: 1.3 },
    { cx: 24, cy: 31, r: 7.5, delay: 2.6 },
  ];
  return (
    <g>
      {rings.map((ring, i) => (
        <motion.circle
          key={i}
          cx={ring.cx}
          cy={ring.cy}
          r={ring.r}
          style={{
            transformOrigin: `${ring.cx}px ${ring.cy}px`,
            transformBox: "fill-box",
          }}
          animate={reduce ? undefined : { scale: [1, 1.06, 1] }}
          transition={{
            duration: 4.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: ring.delay,
          }}
        />
      ))}
    </g>
  );
}

/** Dialogue — two speech bubbles. Alternating glow suggests turn-taking. */
function DialogueGlyph({ reduce }: { reduce: boolean }) {
  return (
    <g>
      <motion.path
        d="M7 12 h16 a3 3 0 0 1 3 3 v8 a3 3 0 0 1 -3 3 h-9 l-4.5 4 v-4 h-2.5 a3 3 0 0 1 -3 -3 v-8 a3 3 0 0 1 3 -3 z"
        animate={reduce ? undefined : { opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M41 22 h-16 a3 3 0 0 0 -3 3 v8 a3 3 0 0 0 3 3 h2.5 v4 l4.5 -4 h9 a3 3 0 0 0 3 -3 v-8 a3 3 0 0 0 -3 -3 z"
        animate={reduce ? undefined : { opacity: [1, 0.55, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </g>
  );
}
