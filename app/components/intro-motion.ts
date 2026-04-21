/**
 * Shared landing entrance timings (seconds from mount).
 * Order: center hero fades in → nav slides down → press rises up.
 */
export const INTRO_DELAY = {
  /** Primary nav — after hero column has begun */
  nav: 0.56,
  /** Press strip — first logo step (after nav begins) */
  press: 0.86,
} as const;

/** Delay between each press item (label + each logo) for stepped entrance */
export const PRESS_STAGGER = 0.11;

/** Hero copy: slow ease-in-out feel (Material-like), reads calm on large type */
export const EASE_HERO_OPACITY = [0.4, 0, 0.2, 1] as const;

/** Seconds between hero lead → sub → CTA */
export const HERO_STAGGER = 0.16;

/** Nav from top: gentle deceleration as it settles */
export const EASE_NAV = [0.16, 1, 0.28, 1] as const;

/** Press from bottom: same family, slightly softer landing */
export const EASE_PRESS = [0.22, 1, 0.42, 1] as const;
