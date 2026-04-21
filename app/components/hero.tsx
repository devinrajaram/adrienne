"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { EASE_HERO_OPACITY, HERO_STAGGER } from "./intro-motion";
import { HEADLINE, HERO_SUBHEAD, ROLES } from "../lib/landing-content";
import { PressLogos } from "./press-logos";

export function heroEntranceVariants(reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      column: {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0, delayChildren: 0 },
        },
      },
      block: {
        hidden: { opacity: 1, y: 0 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0 },
        },
      },
    } as const;
  }

  return {
    column: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: HERO_STAGGER,
          delayChildren: 0,
        },
      },
    },
    block: {
      hidden: { opacity: 0, y: 12 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          opacity: {
            duration: 1.05,
            ease: EASE_HERO_OPACITY,
          },
          y: {
            type: "spring" as const,
            stiffness: 76,
            damping: 24,
            mass: 0.88,
          },
        },
      },
    },
  } as const;
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const instant = reduceMotion === true;
  const variants = heroEntranceVariants(instant);

  return (
    <section
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col bg-cream-200"
    >
      <div className="relative isolate flex min-h-0 flex-1 flex-col bg-haze-300">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {!instant ? (
            <video
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 block h-auto w-auto min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.12] object-cover object-center"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              src="/video/vid2.mp4"
            />
          ) : null}
        </div>

        <motion.div
          className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-6 pt-[120px] pb-12 text-center sm:px-10 sm:pt-[140px] sm:pb-16 lg:pt-[160px]"
          variants={variants.column}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex flex-col items-center gap-5"
            variants={variants.block}
          >
            {/* Inter 500, 15.1676px / 100% lh, 0.09em tracking, uppercase — per Figma auto-layout */}
            <ul
              aria-label="Roles"
              className="flex shrink-0 flex-wrap items-center justify-center gap-3 font-sans text-[15.1676px] font-medium uppercase leading-[100%] tracking-[1.5px] text-ink-900"
            >
              {ROLES.map((role, i) => (
                <li key={role} className="flex shrink-0 items-center gap-3">
                  <span className="shrink-0">{role}</span>
                  {i < ROLES.length - 1 ? (
                    <span
                      aria-hidden
                      className="block h-[15px] w-px shrink-0 bg-ink-900/60"
                    />
                  ) : null}
                </li>
              ))}
            </ul>

            {/* Figma: display serif ~69px, leading 0.94, tracking ~-2.75px, max 804px */}
            <h1 className="w-full max-w-[804px] text-pretty font-serif text-[clamp(2.5rem,5.2vw,4.305rem)] font-normal leading-[0.94] tracking-[-0.04em] text-ink-900">
              {HEADLINE}
            </h1>
          </motion.div>

          {/* Inter 20/400, leading 144%, tracking -0.01em, 457px — centered in flow (not absolute) */}
          <motion.p
            className="mt-4 w-full max-w-[457px] text-center text-pretty font-sans text-[20px] font-normal leading-[144%] tracking-[-0.01em] text-ink-900"
            variants={variants.block}
          >
            {HERO_SUBHEAD}
          </motion.p>

          {/* Figma: 48×279, p-8; label Inter Medium 17px, leading 1.19 */}
          <motion.div className="mt-9" variants={variants.block}>
            <Link
              href="#contact"
              className="inline-flex h-12 min-w-[279px] items-center justify-center rounded-none bg-ink-700 p-2 text-[17px] font-medium leading-[1.19] tracking-[-0.01em] text-cream-100 transition-colors duration-200 hover:bg-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-4 focus-visible:ring-offset-haze-300"
            >
              Start a conversation
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <PressLogos />
    </section>
  );
}
