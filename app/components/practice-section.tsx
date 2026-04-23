"use client";

import { PracticeCardIcon } from "./practice-card-icon";
import { PracticeCardShader } from "./practice-card-shader";

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
    title: "Aura Creative Well",
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
  return (
    <section
      id="practice-section-root"
      aria-labelledby="practice-heading"
      className="bg-ink-950 px-6 pb-20 pt-8 sm:px-10 sm:pt-10 sm:pb-24 lg:pt-12 lg:pb-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center text-center">
          <h2
            id="practice-heading"
            className="font-serif text-[clamp(2rem,5.5vw,4rem)] font-normal leading-[1.1] tracking-[-0.04em] text-ember-50 md:text-[64px] md:leading-[1.1]"
          >
            <span className="block whitespace-normal md:whitespace-nowrap">
              Three lines of practice.
            </span>
            <span className="block whitespace-normal italic md:whitespace-nowrap">
              One throughline.
            </span>
          </h2>

          <p className="mx-auto mt-7 w-full max-w-[566px] text-[20px] leading-[1.54] tracking-[-0.01em] text-clay-300">
            Closing the gap between high-level ambition and sustainable
            excellence: through strategic partnerships, operational
            infrastructure, and curated executive experiences.
          </p>
        </div>

        <ul
          role="list"
          className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-3 md:gap-5 lg:mt-20 lg:gap-6"
        >
          {CARDS.map((card) => (
            <li key={card.title} className="flex h-full">
              <article className="mx-auto flex min-h-[558px] h-full w-full max-w-[384px] flex-col overflow-hidden rounded-t-[clamp(96px,28vw,200px)] border border-white/11 bg-ink-925">
                <div className="relative aspect-384/223 w-full overflow-hidden">
                  <PracticeCardShader variant={card.variant} />
                  {/* Single-layer icon: cream fill + soft ink drop-shadow for
                      readability on any part of the watercolor. Sits at
                      top-[58%] to optically center under the arched crop. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 text-cream-100 [filter:drop-shadow(0_1px_10px_rgba(38,8,7,0.55))]"
                  >
                    <div className="h-20 w-20 sm:h-24 sm:w-24">
                      <PracticeCardIcon variant={card.variant} />
                    </div>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col items-center px-6 pt-9 pb-8 text-center sm:px-8 sm:pt-10 sm:pb-10">
                  <h3 className="font-serif text-[37px] font-normal leading-[1.09] tracking-[-0.04em] text-practice-card-title">
                    {card.title}
                  </h3>

                  <p className="mt-3 font-sans text-[19px] font-normal italic leading-[1.54] tracking-[-0.01em] text-rust-400">
                    {card.subtitle}
                  </p>

                  <ul
                    role="list"
                    className="mx-auto mt-5 block w-full max-w-[383px] list-disc text-center font-sans text-[18px] font-normal not-italic leading-0 tracking-[-0.18px] text-cream-300 marker:text-cream-300"
                  >
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="mb-0 ms-[27px]">
                        <span className="leading-[1.54]">{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex w-full justify-center pt-[30px]">
                    <a
                      href={card.href}
                      className="flex w-full max-w-[322px] items-center justify-center bg-brick-700 p-2 text-center font-sans text-[18px] font-medium leading-[1.54] tracking-[-0.18px] text-practice-cta-text transition-colors duration-200 hover:bg-brick-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-practice-cta-text focus-visible:ring-offset-2 focus-visible:ring-offset-ink-925"
                    >
                      {card.cta} →
                    </a>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
