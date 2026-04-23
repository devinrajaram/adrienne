"use client";

import { motion, useReducedMotion } from "motion/react";

import { EASE_PRESS, INTRO_DELAY, PRESS_STAGGER } from "./intro-motion";

type Logo = {
  src: string;
  alt: string;
  /** Tailwind height utility, mobile then desktop. */
  heightClass: string;
};

const LOGOS: Logo[] = [
  {
    src: "/images/press/nyt.svg",
    alt: "The New York Times",
    heightClass: "h-[28px] lg:h-[34px]",
  },
  {
    src: "/images/press/adage.svg",
    alt: "Ad Age",
    heightClass: "h-[24px] lg:h-[30px]",
  },
  {
    src: "/images/press/cannes-lions.svg",
    alt: "Cannes Lions",
    heightClass: "h-[30px] lg:h-[36px]",
  },
  {
    src: "/images/press/adcolor.svg",
    alt: "ADCOLOR",
    heightClass: "h-[28px] lg:h-[34px]",
  },
];

export function PressLogos() {
  const reduceMotion = useReducedMotion();
  const instant = reduceMotion === true;

  const itemProps = (stepIndex: number) =>
    instant
      ? {
          initial: { opacity: 1, y: 0 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0 },
        }
      : {
          /* Slightly deeper for later steps so they read as a staggered stack rising */
          initial: { opacity: 0, y: 14 + stepIndex * 3 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.52,
            delay: INTRO_DELAY.press + stepIndex * PRESS_STAGGER,
            ease: EASE_PRESS,
          },
        };

  return (
    <section
      aria-label="Featured in"
      className="relative pt-6 pb-8 sm:pt-8 sm:pb-10"
    >
      <div className="mx-auto flex max-w-[1200px] flex-nowrap items-center gap-x-8 px-6 sm:px-10 lg:gap-x-10 lg:px-8">
        <motion.p
          aria-hidden
          className="shrink-0 text-[13px] font-semibold uppercase tracking-[0.18em] text-ink-700/50 lg:text-[15px]"
          {...itemProps(0)}
        >
          Featured In:
        </motion.p>

        <ul className="flex flex-1 flex-nowrap items-center justify-between">
          <li className="flex items-center">
            <motion.div className="flex items-center" {...itemProps(1)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOGOS[0].src}
                alt={LOGOS[0].alt}
                className={`${LOGOS[0].heightClass} w-auto max-w-none object-contain select-none`}
              />
            </motion.div>
          </li>

          <li className="flex items-center">
            <motion.div className="flex items-center" {...itemProps(2)}>
              <span className="font-serif text-[22px] font-bold leading-none tracking-[-0.05em] text-ink-700 lg:text-[28px]">
                PRINT
              </span>
            </motion.div>
          </li>

          {LOGOS.slice(1).map((logo, i) => (
            <li key={logo.src} className="flex items-center">
              <motion.div className="flex items-center" {...itemProps(3 + i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`${logo.heightClass} w-auto max-w-none object-contain select-none`}
                />
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
