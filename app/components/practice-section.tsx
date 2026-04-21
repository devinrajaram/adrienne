import Image, { type StaticImageData } from "next/image";

import auraImg from "../../public/images/practice/aura.png";
import dialogueImg from "../../public/images/practice/dialogue.png";
import talentImg from "../../public/images/practice/talent.png";

type Card = {
  title: string;
  subtitle: string;
  bullets: readonly string[];
  cta: string;
  href: string;
  image: StaticImageData;
  imageAlt: string;
};

const CARDS: readonly Card[] = [
  {
    title: "Aura Creative Well",
    subtitle: "Clarity, performance, and excellence.",
    bullets: ["Small-Group Dinners", "Executive Salons", "Immersive Retreats"],
    cta: "Explore Auria",
    href: "#",
    image: auraImg,
    imageAlt: "",
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
    image: talentImg,
    imageAlt: "",
  },
  {
    title: "Dialogue",
    subtitle: "Conversations that feel like the truth.",
    bullets: ["Fireside Chats", "Executive Offsites", "Brand-Hosted Salons"],
    cta: "Book Adrienne",
    href: "#",
    image: dialogueImg,
    imageAlt: "",
  },
];

export function PracticeSection() {
  return (
    <section
      id="practice-section-root"
      aria-labelledby="practice-heading"
      className="bg-ink-950 px-6 pb-20 pt-8 sm:px-10 sm:pt-10 sm:pb-24 lg:pt-12 lg:pb-32"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
          <h2
            id="practice-heading"
            className="font-serif text-[clamp(2.25rem,5.4vw,4rem)] font-normal leading-[1.05] tracking-[-0.04em] text-ember-50"
          >
            <span className="block">Three lines of practice.</span>
            <span className="block italic">One throughline.</span>
          </h2>

          <p className="mt-7 max-w-[566px] text-[17px] leading-[1.54] tracking-[-0.01em] text-clay-300 sm:text-[18px] lg:text-[20px]">
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
            <li key={card.title} className="flex">
              <article className="flex w-full flex-col overflow-hidden rounded-t-[clamp(96px,28vw,200px)] bg-ink-925">
                <div className="relative aspect-384/240 w-full overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 384px"
                    className="object-cover"
                    placeholder="blur"
                  />
                </div>

                <div className="flex flex-1 flex-col items-center px-6 pt-9 pb-8 text-center sm:px-8 sm:pt-10 sm:pb-10">
                  <h3 className="font-serif text-[clamp(1.625rem,2.6vw,2.3125rem)] font-normal leading-[1.09] tracking-[-0.04em] text-ember-100">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-[18px] leading-[1.54] tracking-[-0.01em] text-rust-400 sm:text-[19px] lg:text-[20px]">
                    {card.subtitle}
                  </p>

                  <ul
                    role="list"
                    className="mt-5 flex list-disc flex-col gap-1 pl-5 text-left text-[17px] leading-[1.54] tracking-[-0.01em] text-clay-300 marker:text-clay-300 sm:text-[18px]"
                  >
                    {card.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>

                  <a
                    href={card.href}
                    className="mt-10 flex w-full items-center justify-center bg-white/6 px-4 py-2.5 text-[16px] leading-[1.54] tracking-[-0.01em] text-clay-300 transition-colors duration-200 hover:bg-white/10 hover:text-ember-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-100 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-925 sm:text-[18px]"
                  >
                    {card.cta} →
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
