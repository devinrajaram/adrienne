"use client";

import { motion, useReducedMotion } from "motion/react";

import { PracticeCardIcon } from "./practice-card-icon";
import { PracticeCardShader } from "./practice-card-shader";

/** Cubic ease-out used by the card scroll-in (matches a calm, expensive feel). */
const CARD_EASE = [0.16, 1, 0.3, 1] as const;
const CARD_DURATION = 0.7;
const CARD_STAGGER = 0.14;
const CARD_DELAY = 0.08;

type Variant = "aura" | "talent" | "dialogue";

type Card = {
  title: string;
  subtitle: string;
  bullets: readonly string[];
  cta: string;
  href: string;
  variant: Variant;
};

const CARDS: readonly Card[] = [
  {
    title: "Auria Creative Well",
    subtitle: "Clarity, performance, and excellence.",
    bullets: ["Small-Group Dinners", "Executive Salons", "Immersive Retreats"],
    cta: "Explore Auria",
    href: "#",
    variant: "aura",
  },
  {
    title: "Talent & Connections",
    subtitle: "Community as infrastructure.",
    bullets: [
      "Executive Recruitment",
      "C-Suite Introductions",
      "Community Building",
    ],
    cta: "How it Works",
    href: "#",
    variant: "talent",
  },
  {
    title: "Dialogue",
    subtitle: "Conversations that feel like the truth.",
    bullets: ["Fireside Chats", "Executive Offsites", "Brand-Hosted Salons"],
    cta: "Book Adrienne",
    href: "#",
    variant: "dialogue",
  },
];

export function PracticeSection() {
  const reduceMotion = useReducedMotion();
  const instant = reduceMotion === true;

  const listVariants = {
    hidden: {},
    visible: {
      transition: instant
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: CARD_STAGGER, delayChildren: CARD_DELAY },
    },
  } as const;

  const cardVariants = {
    hidden: instant ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: instant
        ? { duration: 0 }
        : { duration: CARD_DURATION, ease: CARD_EASE },
    },
  } as const;

  return (
    <section
      id="practice-section-root"
      aria-labelledby="practice-heading"
      className="bg-ink-950 px-6 pb-20 pt-16 sm:px-10 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto flex w-full flex-col items-center text-center">
          <h2
            id="practice-heading"
            className="font-serif text-[clamp(2rem,5.5vw,4rem)] font-normal leading-[1.1] tracking-[-0.04em] text-ember-50 md:text-[64px] md:leading-[1.1]"
          >
            <span className="block whitespace-normal md:whitespace-nowrap">
              Three offerings.
            </span>
            <span className="block whitespace-normal italic md:whitespace-nowrap">
              One throughline.
            </span>
          </h2>

          <p className="mx-auto mt-7 w-full max-w-[566px] text-[20px] leading-[1.54] tracking-[-0.01em] text-clay-300">
            Closing the gap between high ambition and a career that lasts,
            through strategic partnerships, the systems behind sustainable
            leadership, and curated executive experiences.
          </p>
        </div>

        <motion.ul
          role="list"
          className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3 md:gap-5 lg:mt-20 lg:gap-6"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {CARDS.map((card) => (
            <motion.li
              key={card.title}
              className="flex h-full"
              variants={cardVariants}
            >
              <article className="group mx-auto flex min-h-[558px] h-full w-full max-w-[384px] flex-col overflow-hidden rounded-t-[clamp(96px,28vw,200px)] border border-white/11 bg-ink-925 transition-[background-color,border-color] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/22 hover:bg-[#42261f]">
                <div className="relative aspect-384/223 w-full overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-[800ms] ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.05]">
                    <PracticeCardShader variant={card.variant} />
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col items-center px-6 pt-3 pb-8 text-center sm:px-8 sm:pt-4 sm:pb-10">
                  <div
                    aria-hidden
                    className="mb-3 text-cream-100 [filter:drop-shadow(0_1px_10px_rgba(38,8,7,0.55))]"
                  >
                    <div className="h-12 w-12 sm:h-16 sm:w-16">
                      <PracticeCardIcon variant={card.variant} />
                    </div>
                  </div>

                  <h3 className="font-serif text-[37px] font-normal leading-none tracking-[-0.04em] text-practice-card-title">
                    {card.title}
                  </h3>

                  <p className="mt-3 font-sans text-[18px] font-normal italic leading-[1.35] tracking-[-0.18px] text-rust-400">
                    {card.subtitle}
                  </p>

                  <ul
                    role="list"
                    className="mx-auto mt-6 block w-full max-w-[325px] list-inside list-disc text-center font-sans text-[18px] font-normal not-italic leading-0 tracking-[-0.18px] text-cream-300 marker:text-cream-300"
                  >
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="mb-0">
                        <span className="leading-[1.54]">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex w-full justify-center pt-6">
                    <a
                      href={card.href}
                      className="flex w-full max-w-[322px] items-center justify-center bg-brick-700 px-2 py-4 text-center font-sans text-[18px] font-medium leading-[1.1] tracking-[-0.18px] text-practice-cta-text transition-colors duration-200 hover:bg-brick-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-practice-cta-text focus-visible:ring-offset-2 focus-visible:ring-offset-ink-925"
                    >
                      {card.cta} →
                    </a>
                  </div>
                </div>
              </article>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
