"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

import { BioSection } from "./bio-section";
import { Hero, heroEntranceVariants } from "./hero";
import { PressLogos } from "./press-logos";

const ROLES = ["Strategist", "Curator", "Connector"] as const;
const HEADLINE = "Building the rooms senior creatives return to";
const HERO_SUBHEAD =
  "Strategic partnerships, executive experiences, and a practice of recalibration — so creative ambition can scale without depletion.";

const BIO_HEADLINE_LINES = [
  "Communications Executive.",
  "Cultural Strategist.",
  "Entrepreneur.",
] as const;
const BIO =
  "Fifteen years across communications, media, and law. Global Head of Strategic Partnerships at The One Club for Creativity, where she doubled the revenue and regional footprint of the flagship program. Founder of Auria Creative Well — the rooms senior creatives return to for clarity, performance, and excellence.";

/**
 * Total scroll length of the morph in svh.
 * Container = SCROLL_LENGTH_VH; sticky child = 100svh.
 * Net scroll travel for the morph = SCROLL_LENGTH_VH - 100 svh.
 */
/** Longer track so the final bio layout stays on screen for more scroll before the next section. */
const SCROLL_LENGTH_VH = 235;
const DARK_BAND_MAX_HEIGHT_PX = 280;
const DARK_BAND_VIEWPORT_RATIO = 0.28;

/** Fixed SiteHeader height — door + centered card must clear this. */
const NAV_OFFSET_PX = 70;
/** Breathing room below the nav for the centered/final door state. */
const NAV_CLEARANCE_PX = 48;

/**
 * Viewport thresholds below which the morph is too cramped to land cleanly.
 * Below either, we render static <Hero /> + <BioSection /> instead. The static
 * layout already adapts to every size via flexbox + clamp typography.
 */
const MIN_MORPH_HEIGHT_PX = 760;
const MIN_MORPH_WIDTH_PX = 768;

/** Scroll progress: expand door over press → crop to card → slide to bio. */
const P_COVER_PRESS_END = 0.14;
const P_CENTERED_END = 0.42;
const P_HOLD_CENTER_END = 0.62;
const P_SLIDE_END = 0.82;

/** Hero text ↔ video ↔ portrait crossfade (eased, overlapping ranges). */
const P_TEXT_FADE_END = 0.58;
const P_PORTRAIT_IN_START = 0.44;
const P_PORTRAIT_IN_END = 0.64;
const P_VIDEO_OUT_START = 0.48;
const P_VIDEO_OUT_END = 0.68;

type Rect = { top: number; left: number; width: number; height: number };

type Measurements = {
  /** Initial door bounds — area above the press strip (matches static Hero). */
  hero: Rect;
  /** Full sticky viewport — door covers press strip while morph continues. */
  stickyFull: Rect;
  /** Centered "card" bounds — same size as final, centered in viewport. */
  centered: Rect;
  /** Final door bounds — exact bio portrait position. */
  final: Rect;
  /** Top corner radius for the door at final state. */
  finalRadius: number;
};

/** Piecewise-linear interpolator over (progress → value) keyframes. */
function interp(
  p: number,
  stops: ReadonlyArray<readonly [number, number]>
): number {
  if (p <= stops[0][0]) return stops[0][1];
  const last = stops[stops.length - 1];
  if (p >= last[0]) return last[1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, v0] = stops[i];
    const [p1, v1] = stops[i + 1];
    if (p >= p0 && p <= p1) {
      const t = (p - p0) / (p1 - p0);
      return v0 + (v1 - v0) * t;
    }
  }
  return last[1];
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

/** Smoothstep for opacity ramps (less abrupt than linear keyframes). */
function easeInOutCubic(t: number): number {
  const c = clamp01(t);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

/** Maps `p` in [a, b] to an eased 0→1 curve (0 below a, 1 above b). */
function easedProgress(p: number, a: number, b: number): number {
  if (p <= a) return 0;
  if (p >= b) return 1;
  return easeInOutCubic((p - a) / (b - a));
}

/** Door rect + radius at scroll progress `p` (shared by door + hero clip-path). */
function doorGeometry(
  p: number,
  m: Measurements
): { top: number; left: number; width: number; height: number; radius: number } {
  const top = interp(p, [
    [0.0, m.hero.top],
    [P_COVER_PRESS_END, m.stickyFull.top],
    [P_CENTERED_END, m.centered.top],
    [P_HOLD_CENTER_END, m.centered.top],
    [P_SLIDE_END, m.final.top],
    [1.0, m.final.top],
  ]);
  const left = interp(p, [
    [0.0, m.hero.left],
    [P_COVER_PRESS_END, m.stickyFull.left],
    [P_CENTERED_END, m.centered.left],
    [P_HOLD_CENTER_END, m.centered.left],
    [P_SLIDE_END, m.final.left],
    [1.0, m.final.left],
  ]);
  const width = interp(p, [
    [0.0, m.hero.width],
    [P_COVER_PRESS_END, m.stickyFull.width],
    [P_CENTERED_END, m.final.width],
    [1.0, m.final.width],
  ]);
  const height = interp(p, [
    [0.0, m.hero.height],
    [P_COVER_PRESS_END, m.stickyFull.height],
    [P_CENTERED_END, m.final.height],
    [1.0, m.final.height],
  ]);
  const radius = interp(p, [
    [0.0, 0],
    [0.08, m.finalRadius],
    [1.0, m.finalRadius],
  ]);
  return { top, left, width, height, radius };
}

export function HeroBioMorph() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  /** Set true if MorphImpl's measurement reveals the layout can't fit. Sticky for the session to avoid flicker. */
  const [cannotFit, setCannotFit] = useState(false);

  // Defer enabling the morph until after hydration so reduced-motion users
  // (and the SSR pass) get the static layout, no hydration mismatch.
  // Also gate on viewport size — short or narrow viewports can't fit the
  // morph's final layout cleanly, so they fall back to the static stack.
  useEffect(() => {
    if (reduceMotion === true) {
      setEnabled(false);
      return;
    }

    const fits = () =>
      window.innerHeight >= MIN_MORPH_HEIGHT_PX &&
      window.innerWidth >= MIN_MORPH_WIDTH_PX;

    setEnabled(fits());

    const onResize = () => {
      const ok = fits();
      setEnabled(ok);
      // If the user resizes back up, give the morph another chance to measure.
      if (ok) setCannotFit(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [reduceMotion]);

  if (!enabled || cannotFit) {
    return (
      <>
        <Hero />
        <BioSection />
      </>
    );
  }

  return <MorphImpl onCannotFit={() => setCannotFit(true)} />;
}

type MorphImplProps = {
  /** Called when measurement reveals the viewport can't fit the morph cleanly. */
  onCannotFit: () => void;
};

function MorphImpl({ onCannotFit }: MorphImplProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const heroAreaRef = useRef<HTMLDivElement>(null);
  const portraitGhostRef = useRef<HTMLDivElement>(null);

  const reduceMotion = useReducedMotion();
  const instant = reduceMotion === true;
  const entrance = heroEntranceVariants(instant);

  const [m, setM] = useState<Measurements | null>(null);

  const progress = useMotionValue(0);

  useEffect(() => {
    let raf = 0;

    const measure = () => {
      const sticky = stickyRef.current;
      const heroArea = heroAreaRef.current;
      const portraitGhost = portraitGhostRef.current;
      if (!sticky || !heroArea || !portraitGhost) return;

      const sRect = sticky.getBoundingClientRect();
      const hRect = heroArea.getBoundingClientRect();
      const pRect = portraitGhost.getBoundingClientRect();
      const darkBandHeight = Math.min(
        sRect.height * DARK_BAND_VIEWPORT_RATIO,
        DARK_BAND_MAX_HEIGHT_PX
      );

      /** Door must clear nav at every state past the cover phase. */
      const navFloor = NAV_OFFSET_PX + NAV_CLEARANCE_PX;

      /** Hero band only — press strip stays on cream below, same as `<Hero />`. */
      const heroLocal: Rect = {
        top: hRect.top - sRect.top,
        left: hRect.left - sRect.left,
        width: hRect.width,
        height: hRect.height,
      };
      const stickyFull: Rect = {
        top: 0,
        left: 0,
        width: sRect.width,
        height: sRect.height,
      };
      const unclampedFinalTop = pRect.top - sRect.top;
      const maxCardTop = sRect.height - darkBandHeight - pRect.height;

      // If the bio portrait + dark band can't fit below the nav, the morph
      // has nowhere to land cleanly. Fall back to static so the user still
      // sees a coherent page instead of a clamped/overlapping mess.
      if (maxCardTop < navFloor) {
        onCannotFit();
        return;
      }

      const finalLocal: Rect = {
        top: Math.max(navFloor, Math.min(unclampedFinalTop, maxCardTop)),
        left: pRect.left - sRect.left,
        width: pRect.width,
        height: pRect.height,
      };
      const centeredLocal: Rect = {
        width: finalLocal.width,
        height: finalLocal.height,
        left: (sRect.width - finalLocal.width) / 2,
        top: Math.max(
          navFloor,
          Math.min((sRect.height - finalLocal.height) / 2, maxCardTop)
        ),
      };

      // Radius scales by both axes — a 258px arch on a 600px-tall door
      // eats half the portrait, so cap by height too.
      const finalRadius = Math.min(
        0.28 * window.innerWidth,
        0.4 * window.innerHeight,
        258
      );

      setM({
        hero: heroLocal,
        stickyFull,
        centered: centeredLocal,
        final: finalLocal,
        finalRadius,
      });
    };

    const updateProgress = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        progress.set(0);
        return;
      }
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      progress.set(p);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateProgress);
    };
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        measure();
        updateProgress();
      });
    };

    measure();
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [progress]);

  // ── Door geometry + hero clip-path ────────────────────────────────────────
  // Hero copy is laid out once in the full sticky viewport; `heroClipPath`
  // matches the door so type stays put while the “window” crops — no reflow
  // inside the shrinking door.

  const doorTop = useTransform(progress, (p) =>
    m ? doorGeometry(p, m).top : 0
  );
  const doorLeft = useTransform(progress, (p) =>
    m ? doorGeometry(p, m).left : 0
  );
  const doorWidth = useTransform(progress, (p) =>
    m ? doorGeometry(p, m).width : 0
  );
  const doorHeight = useTransform(progress, (p) =>
    m ? doorGeometry(p, m).height : 0
  );
  const doorRadius = useTransform(progress, (p) =>
    m ? doorGeometry(p, m).radius : 0
  );

  const heroClipPath = useTransform(progress, (p) => {
    if (!m) return "none";
    const d = doorGeometry(p, m);
    const sw = m.stickyFull.width;
    const sh = m.stickyFull.height;
    const insetRight = sw - d.left - d.width;
    const insetBottom = sh - d.top - d.height;
    return `inset(${d.top}px ${insetRight}px ${insetBottom}px ${d.left}px round ${d.radius}px ${d.radius}px 0 0)`;
  });

  // Press strip: visible at rest; fades as the door expands over it.
  const pressOpacity = useTransform(
    progress,
    [0, P_COVER_PRESS_END * 0.35, P_COVER_PRESS_END],
    [1, 1, 0]
  );

  // Fade hero once the door reaches portrait-card size — eased ramp with a
  // longer overlap vs video/portrait so the handoff doesn’t feel like a cut.
  const heroMainOpacity = useTransform(progress, (p) =>
    1 - easedProgress(p, P_CENTERED_END, P_TEXT_FADE_END)
  );

  // ── Door content crossfade ────────────────────────────────────────────────
  const videoOpacity = useTransform(progress, (p) =>
    1 - easedProgress(p, P_VIDEO_OUT_START, P_VIDEO_OUT_END)
  );
  const portraitOpacity = useTransform(progress, (p) =>
    easedProgress(p, P_PORTRAIT_IN_START, P_PORTRAIT_IN_END)
  );

  // ── Bio reveal ────────────────────────────────────────────────────────────
  /** Tighter p-range = copy reaches full opacity sooner (snappier in); longer SCROLL_LENGTH_VH adds dwell after. */
  const bioTextOpacity = useTransform(progress, [0.72, 0.86], [0, 1]);
  const bioTextY = useTransform(progress, [0.72, 0.86], [14, 0]);

  /** Fills the cream gap below the bio row inside the sticky viewport. */
  const darkBandOpacity = useTransform(progress, [0.76, 0.9], [0, 1]);

  return (
    <section aria-label="Introduction" className="relative isolate">
      {/* Scroll track: z-40 + isolate keeps the sticky morph above the in-flow brown block (sibling), which otherwise paints later and can cover the portrait. */}
      <div
        ref={containerRef}
        className="relative z-40 bg-cream-200"
        style={{ height: `${SCROLL_LENGTH_VH}svh` }}
      >
      <div
        ref={stickyRef}
        className="sticky top-0 h-svh w-full overflow-hidden bg-cream-200"
      >
        {/* Hero / press stack — matches static Hero at p=0. Once scroll begins,
            the door expands over this strip (see doorTop/Height) and pressOpacity. */}
        <div className="absolute inset-0 flex flex-col">
          <div ref={heroAreaRef} className="min-h-0 flex-1" aria-hidden />
          <motion.div className="relative z-10 shrink-0" style={{ opacity: pressOpacity }}>
            <PressLogos />
          </motion.div>
        </div>

        {/* Bio layout — z above dark band (z-14) so copy isn’t painted over; below door (z-20) + hero clip (z-30). */}
        <div className="pointer-events-none absolute inset-0 z-16 mx-auto flex max-w-[1400px] flex-col gap-12 px-6 pt-32 pb-0 sm:gap-16 sm:px-10 sm:pt-36 lg:flex-row lg:items-start lg:gap-10 lg:px-8 lg:pt-40 xl:gap-12 xl:px-10 xl:pt-44">
          <div
            ref={portraitGhostRef}
            aria-hidden
            // Cap by viewport height: portrait is 501:647 (≈1.291 ratio).
            // Reserve ~410px for nav + top padding + dark band + breathing room
            // so the ghost (and final door) always fit inside one viewport.
            className="invisible relative mx-auto w-full max-w-[min(501px,calc((100svh-410px)/1.291))] shrink-0 max-lg:mx-0 max-lg:ml-auto max-lg:mr-0 lg:mx-0 lg:ml-20 lg:mr-0 xl:ml-28"
          >
            <div className="relative aspect-501/647 w-full" />
          </div>

          <motion.div
            className="relative z-30 pointer-events-auto min-w-0 flex-1 pt-0 lg:ml-0 lg:max-w-[600px] lg:pt-2 xl:max-w-[640px]"
            style={{ opacity: bioTextOpacity, y: bioTextY }}
          >
            <p
              id="bio-eyebrow"
              className="text-[15px] font-semibold uppercase tracking-[0.18em] text-brick-600"
            >
              Adrienne L. Lucas
            </p>

            <p className="mt-8 font-serif text-[clamp(1.75rem,4.2vw,2.75rem)] font-normal leading-[1.02] tracking-[-0.04em] text-ink-900">
              {BIO_HEADLINE_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>

            <p className="mt-10 max-w-[510px] text-[18px] leading-[1.54] tracking-[-0.012em] text-ink-900 sm:text-[19px] lg:text-[20px]">
              {BIO}
            </p>
          </motion.div>
        </div>

        {/* Door: haze + video + portrait only. */}
        <motion.div
          className={
            m
              ? "absolute z-20 overflow-hidden bg-haze-300 will-change-[width,height,top,left,border-radius]"
              : "absolute left-0 right-0 top-0 bottom-[140px] z-20 overflow-hidden bg-haze-300 sm:bottom-[160px]"
          }
          style={
            m
              ? {
                  top: doorTop,
                  left: doorLeft,
                  width: doorWidth,
                  height: doorHeight,
                  borderTopLeftRadius: doorRadius,
                  borderTopRightRadius: doorRadius,
                }
              : undefined
          }
        >
          <motion.div
            className="absolute inset-0 z-0"
            style={{ opacity: videoOpacity }}
          >
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
          </motion.div>
          <motion.div
            className="absolute inset-0 z-1"
            style={{ opacity: portraitOpacity }}
          >
            <Image
              src="/images/ad.png"
              alt="Adrienne L. Lucas, seated portrait"
              fill
              sizes="(max-width: 1024px) 100vw, 501px"
              className="block object-cover object-center"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Hero copy: full-viewport layout + clip-path synced to door — type does
            not move with the shrinking box; only visibility changes. */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 will-change-[clip-path]"
          style={{ clipPath: heroClipPath }}
        >
          <motion.div
            className="mx-auto flex h-full min-h-0 w-full max-w-[1400px] -translate-y-8 flex-col items-center justify-center px-6 pt-[120px] pb-[140px] text-center sm:-translate-y-10 sm:px-10 sm:pt-[140px] sm:pb-[160px] lg:-translate-y-12 lg:pt-[160px]"
            style={{ opacity: heroMainOpacity }}
          >
            <motion.div
              className="relative mx-auto flex w-full min-h-0 flex-1 flex-col items-center justify-center"
              variants={entrance.column}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="flex flex-col items-center gap-5"
                variants={entrance.block}
              >
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

                <h1 className="w-full max-w-[804px] text-pretty font-serif text-[clamp(2.5rem,5.2vw,4.305rem)] font-normal leading-[0.94] tracking-[-0.04em] text-ink-900">
                  {HEADLINE}
                </h1>
              </motion.div>

              <motion.p
                className="mt-4 w-full max-w-[457px] text-center text-pretty font-sans text-[20px] font-normal leading-[144%] tracking-[-0.01em] text-ink-900"
                variants={entrance.block}
              >
                {HERO_SUBHEAD}
              </motion.p>

              <motion.div className="pointer-events-auto mt-9" variants={entrance.block}>
                <Link
                  href="#contact"
                  className="inline-flex h-12 min-w-[279px] items-center justify-center rounded-none bg-ink-700 p-2 text-[17px] font-medium leading-[1.19] tracking-[-0.01em] text-cream-100 transition-colors duration-200 hover:bg-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-4 focus-visible:ring-offset-haze-300"
                >
                  Start a conversation
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* In-sticky band */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-14 min-h-[min(28vh,280px)] bg-[#301712]"
          style={{ opacity: darkBandOpacity }}
        />
      </div>
      </div>

      {/* In-flow brown — z-0 so morph track (z-40) always stacks above when viewport overlap occurs */}
      <section
        className="relative z-0 min-h-[min(50vh,520px)] bg-[#301712] pb-20 pt-0 md:pb-28"
        aria-hidden
      />
    </section>
  );
}
