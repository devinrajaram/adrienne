"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import {
  BIO,
  BIO_HEADLINE_LINES,
  HEADLINE,
  HERO_SUBHEAD,
  ROLES,
} from "../lib/landing-content";
import { BioSection } from "./bio-section";
import { Hero, heroEntranceVariants } from "./hero";
import { HeroShaderBackground } from "./hero-shader-background";
import { PracticeSection } from "./practice-section";
import { PressLogos } from "./press-logos";

/**
 * Total scroll length of the morph in dvh (dynamic viewport).
 * Container = SCROLL_LENGTH_VH dvh; sticky child = 100dvh.
 * JS progress uses the laid-out sticky height (≈100dvh) so scrub range matches paint.
 */
/**
 * Scroll track height in dvh. Lower = less empty tail after the sticky scrubs out (logs: sectionTop was
 * hundreds of px while gapHeadingMinusSection stayed ~80 — gap is morph tail, not practice padding).
 */
const SCROLL_LENGTH_VH = 175;

/**
 * Dark band fills from `darkBandTopPx` to the bottom of the sticky so it
 * butts directly against the in-flow PracticeSection (same `--ink-950`). Capping
 * the height left a visible cream-200 stripe (the sticky's bg) below the band
 * on tall viewports, which read as a growing gap before the practice heading.
 */

/**
 * Visual gap (px) between the bio bottom and the top edge of PracticeSection.
 * Without pulling Practice up, the gap = (100dvh − bioBottom) which grows with
 * viewport height. We negative-margin Practice so this stays fixed at every
 * viewport. Combined with PracticeSection's own pt-12 (48px on lg), the bio
 * bottom → heading distance is ~72px on every screen.
 */
const PRACTICE_GAP_PX = 24;

/** Fixed SiteHeader height — door + centered card must clear this. */
const NAV_OFFSET_PX = 70;
/** Breathing room below the nav for the centered/final door state (layout measure). */
const NAV_CLEARANCE_PX = 36;
/** Gap below fixed header for bio stack (top-aligned; do not viewport-center the whole row or tall screens get a false “gap”). */
const BIO_STACK_TOP_GAP_PX = 10;

/**
 * Width threshold below which we fall back to static. The morph's bio layout
 * is desktop-only (lg:flex-row), so on narrow viewports the static stack
 * already gives a better experience.
 *
 * No height gate: the final portrait stays a fixed size at every viewport
 * height, with padding above protecting it from the nav. On short displays
 * the bottom of the portrait may clip into the dark band — that's intended,
 * and it keeps the visual scale consistent across devices.
 */
const MIN_MORPH_WIDTH_PX = 768;

/**
 * Width gate with SSR-safe first snapshot: always `false` until after the first
 * microtask post-subscribe (matches static SSR HTML, avoids hydration mismatch),
 * then tracks `innerWidth` including resize.
 */
const morphWidthListeners = new Set<() => void>();
let morphWidthCommitted = false;

function subscribeMorphWidth(onStoreChange: () => void) {
  morphWidthListeners.add(onStoreChange);
  queueMicrotask(() => {
    if (morphWidthCommitted) return;
    morphWidthCommitted = true;
    morphWidthListeners.forEach((l) => l());
  });
  window.addEventListener("resize", onStoreChange);
  return () => {
    morphWidthListeners.delete(onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}

function getSnapshotMorphWidth(): boolean {
  if (typeof window === "undefined") return false;
  if (!morphWidthCommitted) return false;
  return window.innerWidth >= MIN_MORPH_WIDTH_PX;
}

function getServerSnapshotMorphWidth(): boolean {
  return false;
}

function useMorphWidthGate(): boolean {
  return useSyncExternalStore(
    subscribeMorphWidth,
    getSnapshotMorphWidth,
    getServerSnapshotMorphWidth
  );
}

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
  /** Distance from sticky top to dark band top (px). */
  darkBandTopPx: number;
  /** lg row: cap bio copy to portrait column height so brown can start at arch bottom. */
  bioColumnMaxHeightPx: number | null;
};

const MEASURE_EPS = 0.5;

function nearlyRectEqual(a: Rect, b: Rect): boolean {
  return (
    Math.abs(a.top - b.top) < MEASURE_EPS &&
    Math.abs(a.left - b.left) < MEASURE_EPS &&
    Math.abs(a.width - b.width) < MEASURE_EPS &&
    Math.abs(a.height - b.height) < MEASURE_EPS
  );
}

function nullableNumberClose(
  a: number | null | undefined,
  b: number | null
): boolean {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return Math.abs(a - b) < MEASURE_EPS;
}

function measurementsEqual(
  prev: Measurements | null,
  next: Measurements
): boolean {
  if (!prev) return false;
  return (
    nearlyRectEqual(prev.hero, next.hero) &&
    nearlyRectEqual(prev.stickyFull, next.stickyFull) &&
    nearlyRectEqual(prev.centered, next.centered) &&
    nearlyRectEqual(prev.final, next.final) &&
    Math.abs(prev.finalRadius - next.finalRadius) < MEASURE_EPS &&
    Math.abs(prev.darkBandTopPx - next.darkBandTopPx) < MEASURE_EPS &&
    nullableNumberClose(prev.bioColumnMaxHeightPx, next.bioColumnMaxHeightPx)
  );
}

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
  const wideEnough = useMorphWidthGate();
  /** Wait for a definite `false` so we never flash morph before prefers-reduced-motion resolves. */
  const enabled = reduceMotion === false && wideEnough;
  const instant = reduceMotion === true;

  if (!enabled) {
    return (
      <>
        <Hero />
        <BioSection />
        <div className="relative z-0">
          <PracticeSection />
        </div>
      </>
    );
  }

  return <MorphImpl instant={instant} />;
}

/** Tailwind `lg` breakpoint — matches bio `lg:flex-row`. */
const LG_ROW_MIN_PX = 1024;

function MorphImpl({ instant }: { instant: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const heroAreaRef = useRef<HTMLDivElement>(null);
  const portraitGhostRef = useRef<HTMLDivElement>(null);
  const bioTextColumnRef = useRef<HTMLDivElement>(null);

  const entrance = heroEntranceVariants(instant);

  const [m, setM] = useState<Measurements | null>(null);

  const progress = useMotionValue(0);

  useEffect(() => {
    let raf = 0;
    /** Laid-out height of the morph scroll track (`SCROLL_LENGTH_VH dvh`). When dvh changes, doc length changes; compensate scroll so content below (e.g. Practice) stays stable. */
    let lastMorphTrackHeight: number | null = null;

    const syncMorphTrackScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const h = el.getBoundingClientRect().height;
      const prev = lastMorphTrackHeight;
      if (prev != null && Math.abs(h - prev) > 0.5) {
        const dh = h - prev;
        const scrollBefore = window.scrollY;
        window.scrollTo(0, scrollBefore + dh);
      }
      lastMorphTrackHeight = h;
    };

    const measure = () => {
      const sticky = stickyRef.current;
      const heroArea = heroAreaRef.current;
      const portraitGhost = portraitGhostRef.current;
      if (!sticky || !heroArea || !portraitGhost) return;

      const sRect = sticky.getBoundingClientRect();
      const hRect = heroArea.getBoundingClientRect();
      const pRect = portraitGhost.getBoundingClientRect();

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

      // The portrait ghost (laid out via flex + max-w-[501px]) drives the
      // final position and size at every viewport.
      const unclampedFinalTop = pRect.top - sRect.top;

      const finalLocal: Rect = {
        top: Math.max(navFloor, unclampedFinalTop),
        left: pRect.left - sRect.left,
        width: pRect.width,
        height: pRect.height,
      };
      const centeredLocal: Rect = {
        width: finalLocal.width,
        height: finalLocal.height,
        left: (sRect.width - finalLocal.width) / 2,
        top: Math.max(navFloor, (sRect.height - finalLocal.height) / 2),
      };

      // Radius scales by width only now — door height is fixed (portrait
      // height), so we don't need a height-based clamp.
      const finalRadius = Math.min(0.28 * window.innerWidth, 258);

      const isLgRow = window.matchMedia(`(min-width: ${LG_ROW_MIN_PX}px)`).matches;
      const portraitBottomInSticky = pRect.bottom - sRect.top;
      /** Matches painted door bottom (nav clamp can push door below the flex ghost). */
      const doorBottomInSticky = finalLocal.top + finalLocal.height;
      const bioEl = bioTextColumnRef.current;
      const bioRect = bioEl?.getBoundingClientRect();
      const bioBottomInSticky = bioRect
        ? bioRect.bottom - sRect.top
        : portraitBottomInSticky;
      // Align brown to the *door* bottom so it never cuts the arch when finalLocal.top > ghost top.
      const darkBandTopPx = isLgRow
        ? doorBottomInSticky
        : Math.max(portraitBottomInSticky, bioBottomInSticky, doorBottomInSticky);
      const bioColumnMaxHeightPx = isLgRow ? pRect.height : null;

      const next: Measurements = {
        hero: heroLocal,
        stickyFull,
        centered: centeredLocal,
        final: finalLocal,
        finalRadius,
        darkBandTopPx,
        bioColumnMaxHeightPx,
      };
      setM((prev) => (measurementsEqual(prev, next) ? prev : next));
    };

    const updateProgress = () => {
      const container = containerRef.current;
      const sticky = stickyRef.current;
      if (!container || !sticky) return;
      const rect = container.getBoundingClientRect();
      const innerH = window.innerHeight;
      const vvH = window.visualViewport?.height ?? innerH;
      const stickyH = sticky.getBoundingClientRect().height;
      const viewportForTotal =
        Number.isFinite(stickyH) && stickyH > 1
          ? stickyH
          : vvH;
      const total = rect.height - viewportForTotal;
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
      raf = requestAnimationFrame(() => {
        updateProgress();
        requestAnimationFrame(measure);
      });
    };

    /** After dvh/track/sticky height changes, total = trackH − stickyH changes; keep the same scrub progress so the morph + spacing don't jump. */
    const preserveProgressAfterResize = (pTarget: number) => {
      const container = containerRef.current;
      const sticky = stickyRef.current;
      if (!container || !sticky) return;
      const rect = container.getBoundingClientRect();
      const stickyH = sticky.getBoundingClientRect().height;
      const vvH = window.visualViewport?.height ?? window.innerHeight;
      const viewportForTotal =
        Number.isFinite(stickyH) && stickyH > 1 ? stickyH : vvH;
      const total = rect.height - viewportForTotal;
      if (total <= 0) return;
      const scrolled = -rect.top;
      // p clamps to 1 while scrolled can exceed total (user in practice / below morph).
      // Never scroll upward to force scrolled === total — that creates the huge cream/dark gap.
      if (pTarget >= 0.999 && scrolled > total + 0.5) return;
      const delta = pTarget * total - scrolled;
      if (Math.abs(delta) <= 0.5) return;
      window.scrollTo(0, window.scrollY + delta);
    };

    const runLayout = () => {
      const container = containerRef.current;
      const sticky = stickyRef.current;
      let pBefore = progress.get();
      let scrolledPastMorphEnd = false;
      if (container && sticky) {
        const rect0 = container.getBoundingClientRect();
        const sh0 = sticky.getBoundingClientRect().height;
        const vv0 = window.visualViewport?.height ?? window.innerHeight;
        const vft0 = Number.isFinite(sh0) && sh0 > 1 ? sh0 : vv0;
        const total0 = rect0.height - vft0;
        if (total0 > 0) {
          const sc0 = -rect0.top;
          pBefore = Math.max(0, Math.min(1, sc0 / total0));
          scrolledPastMorphEnd = sc0 > total0 + 0.5;
        }
      }

      syncMorphTrackScroll();
      progress.set(pBefore);
      if (!scrolledPastMorphEnd) {
        preserveProgressAfterResize(pBefore);
      }
      updateProgress();
      measure();
      requestAnimationFrame(measure);
    };

    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(runLayout);
    };

    const onVisualViewportResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(runLayout);
    };

    runLayout();

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(runLayout);
    });
    const pg = portraitGhostRef.current;
    const bioCol = bioTextColumnRef.current;
    if (pg) ro.observe(pg);
    if (bioCol) ro.observe(bioCol);

    const track = containerRef.current;
    const trackRo = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(runLayout);
    });
    if (track) trackRo.observe(track);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onVisualViewportResize);
    return () => {
      ro.disconnect();
      trackRo.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onVisualViewportResize);
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

  /**
   * Shared dark-fill strength for the bio→practice transition. Drives both the
   * in-sticky dark band AND an inverted cream overlay that sits INSIDE the
   * PracticeSection wrapper (see `fillCoverOpacity`). PracticeSection itself
   * stays fully opaque — stacking two fading dark layers would double the
   * opacity in the overlap region and produce visible tonal seams. Using one
   * fading band + one inverted cream cover ensures every pixel in the fill
   * region renders as `cream × (1−α) + dark × α` at every frame.
   */
  const fillOpacity = useTransform(progress, (p) =>
    easedProgress(p, 0.72, 0.94)
  );
  /** Inverse of `fillOpacity` — covers PracticeSection with sticky-matching cream during the fade. */
  const fillCoverOpacity = useTransform(progress, (p) =>
    1 - easedProgress(p, 0.72, 0.94)
  );

  return (
    <section aria-label="Introduction" className="relative isolate">
      {/* Scroll track: z-40 + isolate keeps the sticky morph above the in-flow brown block (sibling), which otherwise paints later and can cover the portrait. */}
      <div
        ref={containerRef}
        data-morph-scroll-track
        className="relative z-40"
        style={{
          height: `${SCROLL_LENGTH_VH}dvh`,
          /* Long bottom fade to ink-950: fills scroll tail with practice-colored field (cannot pull practice up with negative margin — z-40 covers heading). */
          background:
            "linear-gradient(180deg, var(--cream-200) 0%, var(--cream-200) max(0%, calc(100% - min(58dvh, 640px))), var(--ink-950) 100%)",
        }}
      >
      <div
        ref={stickyRef}
        className="sticky top-0 h-dvh w-full overflow-hidden bg-cream-200"
      >
        {/* Hero / press stack — matches static Hero at p=0. Once scroll begins,
            the door expands over this strip (see doorTop/Height) and pressOpacity. */}
        <div className="absolute inset-0 flex flex-col">
          <div ref={heroAreaRef} className="min-h-0 flex-1" aria-hidden />
          <motion.div className="relative z-10 shrink-0" style={{ opacity: pressOpacity }}>
            <PressLogos />
          </motion.div>
        </div>

        {/* Bio layout — z above dark band (z-14); below door (z-20) + hero clip (z-30).
            Top-align under the fixed header only. Viewport-level vertical center (e.g. my-auto) adds half the leftover
            height *above* the arch on tall screens; lg:items-center still lines up copy with the portrait in-row. */}
        <div
          className="pointer-events-none absolute inset-0 z-16 px-6 sm:px-10 lg:px-8"
          style={{ paddingTop: NAV_OFFSET_PX + BIO_STACK_TOP_GAP_PX }}
        >
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 sm:gap-16 lg:flex-row lg:items-center lg:gap-10 xl:gap-12">
            <div
              ref={portraitGhostRef}
              aria-hidden
              className="invisible relative mx-auto w-full max-w-[501px] shrink-0 max-lg:mx-0 max-lg:ml-auto max-lg:mr-0 lg:mx-0 lg:ml-14 lg:mr-0 xl:ml-20"
            >
              <div className="relative aspect-501/647 w-full" />
            </div>

            <motion.div
              ref={bioTextColumnRef}
              className="relative z-30 min-h-0 min-w-0 flex-1 pt-0 [scrollbar-gutter:stable] lg:ml-0 lg:max-w-[600px] xl:max-w-[640px]"
              style={{
                opacity: bioTextOpacity,
                y: bioTextY,
                pointerEvents: "auto",
                ...(m?.bioColumnMaxHeightPx != null
                  ? {
                      maxHeight: m.bioColumnMaxHeightPx,
                      overflowY: "auto",
                      /* Do not use overscroll-behavior: contain — it blocks scroll chaining
                         to the document at the inner edge, so wheel/trackpad can feel “stuck”
                         above Practice when the cursor is over the bio column. */
                    }
                  : {}),
              }}
            >
              <p
                id="bio-eyebrow"
                className="text-[15px] font-semibold uppercase tracking-[0.18em] text-brick-600"
              >
                Adrienne L. Lucas
              </p>

              <p className="mt-3 font-serif text-[clamp(1.875rem,4.5vw,3rem)] font-normal leading-[1.02] tracking-[-0.04em] text-ink-900">
                {BIO_HEADLINE_LINES.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>

              <p className="mt-6 max-w-[510px] text-[18px] leading-[1.54] tracking-[-0.012em] text-ink-900 sm:text-[19px] lg:text-[20px]">
                {BIO}
              </p>
            </motion.div>
          </div>
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
            <HeroShaderBackground />
          </motion.div>
          <motion.div
            className="pointer-events-none absolute inset-0 z-1 select-none"
            style={{ opacity: portraitOpacity }}
          >
            <Image
              src="/images/ad.png"
              alt="Adrienne L. Lucas, seated portrait"
              fill
              sizes="(max-width: 1024px) 100vw, 501px"
              className="pointer-events-none block select-none object-cover object-center"
              draggable={false}
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
            className="flex h-full min-h-0 w-full -translate-y-8 flex-col px-6 pt-[120px] pb-[140px] sm:-translate-y-10 sm:px-10 sm:pt-[140px] sm:pb-[160px] lg:-translate-y-12 lg:px-8 lg:pt-[160px]"
            style={{ opacity: heroMainOpacity }}
          >
            <motion.div
              className="relative mx-auto flex w-full max-w-[1200px] min-h-0 flex-1 flex-col items-center justify-center text-center"
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
                  className="pointer-events-auto flex shrink-0 flex-wrap items-center justify-center gap-3 font-sans text-[15.1676px] font-medium uppercase leading-[100%] tracking-[1.5px] text-cream-200"
                >
                  {ROLES.map((role, i) => (
                    <li key={role} className="flex shrink-0 items-center gap-3">
                      <span className="shrink-0">{role}</span>
                      {i < ROLES.length - 1 ? (
                        <span
                          aria-hidden
                          className="block h-[15px] w-px shrink-0 bg-cream-200/60"
                        />
                      ) : null}
                    </li>
                  ))}
                </ul>

                <h1 className="pointer-events-auto w-full max-w-[804px] text-pretty font-serif text-[clamp(2.5rem,5.2vw,4.305rem)] font-normal leading-[0.94] tracking-[-0.04em] text-cream-200">
                  {HEADLINE}
                </h1>
              </motion.div>

              <motion.p
                className="pointer-events-auto mt-4 w-full max-w-[457px] text-center text-pretty font-sans text-[20px] font-normal leading-[144%] tracking-[-0.01em] text-cream-200"
                variants={entrance.block}
              >
                {HERO_SUBHEAD}
              </motion.p>

              <motion.div className="pointer-events-auto mt-9" variants={entrance.block}>
                <Link
                  href="#contact"
                  className="inline-flex h-12 min-w-[279px] items-center justify-center rounded-none bg-cream-200 p-2 text-[17px] font-medium leading-[1.19] tracking-[-0.01em] text-ink-900 transition-colors duration-200 hover:bg-cream-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-200 focus-visible:ring-offset-4 focus-visible:ring-offset-haze-300"
                >
                  Start a conversation
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* In-sticky band — top edge tracks arch bottom on lg; stacked layouts use max(portrait, bio).
            Fills all the way to the sticky bottom so no cream stripe leaks during the stuck
            phase (PracticeSection doesn't reach its final position until unstick). The
            overlap with PracticeSection is safe because PracticeSection is fully opaque
            and has an inverted cream overlay that visually matches this band's fade. */}
        <motion.div
          aria-hidden
          data-dark-band
          className="pointer-events-none absolute inset-x-0 z-14 bg-ink-950"
          style={{
            opacity: fillOpacity,
            ...(m
              ? (() => {
                  const clampedTop = Math.max(
                    0,
                    Math.min(m.darkBandTopPx, m.stickyFull.height - 2)
                  );
                  return { top: clampedTop, bottom: 0, height: "auto" };
                })()
              : { top: "100%", bottom: 0, height: 0 }),
          }}
        />
      </div>
      </div>

      {/* z-50 stacks Practice above the morph track (z-40) so the heading is
          never hidden by the sticky's dark band during the overlap. The
          negative margin pulls Practice up so the bio bottom → PracticeSection
          top distance is `PRACTICE_GAP_PX` regardless of viewport height —
          fixes the gap that previously grew with `100dvh`. PracticeSection is
          fully opaque; the reveal is driven by the cream overlay below, whose
          fade mirrors the dark band so both regions read as a single wash. */}
      <div
        className="relative z-50"
        style={{
          marginTop: m
            ? Math.min(
                0,
                m.darkBandTopPx + PRACTICE_GAP_PX - m.stickyFull.height
              )
            : 0,
        }}
      >
        <PracticeSection />
        {/* Sticky-matching cream cover. Opacity is the inverse of `fillOpacity`
            so at every frame: cream*(1−α) + dark*α — identical to the dark
            band region. No tonal seam between the sticky-bottom fill and the
            practice-section fill during the reveal. `inset-0` scopes it to the
            wrapper so it fades out completely before the cards scroll in. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-1 bg-cream-200"
          style={{ opacity: fillCoverOpacity }}
        />
      </div>
    </section>
  );
}
