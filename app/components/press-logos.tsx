"use client";

import { motion, useReducedMotion } from "motion/react";

import { EASE_PRESS, INTRO_DELAY, PRESS_STAGGER } from "./intro-motion";

type Logo = {
  src: string;
  alt: string;
  /** Mask height in px, mobile then desktop. */
  height: { base: number; lg: number };
  /** Intrinsic width / height — drives `aspectRatio` so the masked box matches the SVG's natural footprint. */
  aspect: number;
};

const LOGO_COLOR = "#410F0B";

const LOGOS: readonly Logo[] = [
  {
    src: "/images/press/nyt.svg",
    alt: "The New York Times",
    height: { base: 38, lg: 44 },
    aspect: 236 / 40.856,
  },
  {
    src: "/images/press/PRINT.svg",
    alt: "PRINT",
    height: { base: 36, lg: 42 },
    aspect: 105 / 27,
  },
  {
    src: "/images/press/adage.svg",
    alt: "Ad Age",
    height: { base: 34, lg: 40 },
    aspect: 121 / 37.37,
  },
  {
    src: "/images/press/cannes-lions.svg",
    alt: "Cannes Lions",
    height: { base: 40, lg: 46 },
    aspect: 106 / 45.43,
  },
  {
    src: "/images/press/adcolor.svg",
    alt: "ADCOLOR",
    height: { base: 38, lg: 44 },
    aspect: 173 / 42.17,
  },
  {
    src: "/images/press/adweek.svg",
    alt: "Adweek",
    height: { base: 32, lg: 38 },
    aspect: 128 / 45,
  },
  {
    src: "/images/press/abc.svg",
    alt: "ABC",
    height: { base: 38, lg: 44 },
    aspect: 1,
  },
  {
    src: "/images/press/black-enterprise.svg",
    alt: "Black Enterprise",
    height: { base: 32, lg: 38 },
    aspect: 170 / 43,
  },
  {
    src: "/images/press/ebony.svg",
    alt: "Ebony",
    height: { base: 38, lg: 44 },
    aspect: 135 / 42,
  },
];

/** Marquee loop duration in seconds. Lower = faster. One full duration scrolls one copy of the list off the left edge. */
const MARQUEE_DURATION_S = 50;
/** Horizontal gap between adjacent logos in the marquee. */
const MARQUEE_GAP_PX = 64;

export function PressLogos() {
  const reduceMotion = useReducedMotion();
  const instant = reduceMotion === true;

  // Duplicate the list so when the first copy translates fully off-screen,
  // the second copy is in the same x-position the first started at — visually
  // seamless when we snap x back to 0%.
  const loop = [...LOGOS, ...LOGOS];

  return (
    <section
      aria-label="Featured in"
      data-press-logos
      className="relative pt-6 pb-8 sm:pt-8 sm:pb-10"
    >
      <motion.p
        aria-hidden
        className="mb-5 text-center text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-700/55 lg:mb-6 lg:text-[13px]"
        initial={instant ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: instant ? 0 : 0.52,
          delay: instant ? 0 : INTRO_DELAY.press,
          ease: EASE_PRESS,
        }}
      >
        Featured in
      </motion.p>

      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10 lg:px-8">
        <div
          className="relative w-full overflow-hidden"
          style={{
            /* Soft fade at the row's left/right edges (within the 1200px container, not the viewport) so logos don't pop in/out at the boundary. */
            maskImage:
              "linear-gradient(to right, transparent 0, #000 80px, #000 calc(100% - 80px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, #000 80px, #000 calc(100% - 80px), transparent 100%)",
          }}
        >
          <motion.ul
          role="list"
          className="flex w-max items-center"
          style={{ gap: `${MARQUEE_GAP_PX}px` }}
          animate={instant ? undefined : { x: ["0%", "-50%"] }}
          transition={
            instant
              ? undefined
              : {
                  duration: MARQUEE_DURATION_S,
                  ease: "linear",
                  repeat: Infinity,
                }
          }
        >
          {loop.map((logo, i) => {
              // Entrance animation only on the first copy of the list — second
              // copy is the marquee duplicate, off-screen until x-scroll brings
              // it in, so it should start fully visible.
              const isFirstCopy = i < LOGOS.length;
              const stepIndex = i % LOGOS.length;
              return (
                <motion.li
                  key={`${logo.src}-${i}`}
                  className="flex shrink-0 items-center"
                  style={{ paddingLeft: i === 0 ? MARQUEE_GAP_PX : undefined }}
                  initial={
                    instant || !isFirstCopy
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 14 + stepIndex * 3 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    instant || !isFirstCopy
                      ? { duration: 0 }
                      : {
                          duration: 0.52,
                          delay:
                            INTRO_DELAY.press + stepIndex * PRESS_STAGGER,
                          ease: EASE_PRESS,
                        }
                  }
                >
                  <span
                    role="img"
                    aria-label={logo.alt}
                    className="block select-none"
                    style={{
                      height: `${logo.height.base}px`,
                      aspectRatio: logo.aspect,
                      backgroundColor: LOGO_COLOR,
                      WebkitMaskImage: `url(${logo.src})`,
                      maskImage: `url(${logo.src})`,
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                    }}
                  />
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
