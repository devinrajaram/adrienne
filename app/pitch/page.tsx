"use client";

import { motion, useReducedMotion } from "motion/react";

import { HeroShaderBackground } from "../components/hero-shader-background";

/**
 * Pitch deck — vertical, full-viewport slides explaining the brand thinking
 * behind the look-and-feel, palette, and motion.
 *
 * Tone notes (per Adrienne):
 *   - The gradients are NOT "watercolor" — they're an aura, a sense of welcome.
 *   - Adrienne does not gatekeep rooms. She builds the rooms and brings people in.
 *   - The work is intentionally intimate, for senior leaders and creatives.
 *   - The brand is wellness-adjacent, but grounded in earth tones rather than the
 *     blue/sage/teal palettes most wellness-community brands default to.
 */

type Slide = {
  id: string;
  surface: "cream" | "ink" | "haze";
  body: React.ReactNode;
};

const SLIDES: Slide[] = [
  // 01 — Cover
  {
    id: "cover",
    surface: "cream",
    body: (
      <div className="flex flex-col items-start gap-6">
        <SlideEyebrow>The brand · why it looks like this</SlideEyebrow>
        <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[0.98] tracking-[-0.04em] text-ink-900">
          Adrienne L. Lucas
          <span className="block italic text-brick-600">in her own register.</span>
        </h1>
        <p className="max-w-[640px] text-[19px] leading-[1.55] tracking-[-0.012em] text-ink-900/85">
          A short tour of the thinking behind the design, the palette, the type,
          and the way the site moves. The shape of a room before anyone walks in.
        </p>
      </div>
    ),
  },

  // 02 — Premise
  {
    id: "premise",
    surface: "cream",
    body: (
      <div className="flex flex-col items-start gap-6">
        <SlideEyebrow>The premise</SlideEyebrow>
        <h2 className="font-serif text-[clamp(2.25rem,5.5vw,4.25rem)] font-normal leading-[1.02] tracking-[-0.04em] text-ink-900">
          She isn’t the gatekeeper.
          <span className="block italic">She builds the room and welcomes you in.</span>
        </h2>
        <p className="max-w-[680px] text-[19px] leading-[1.55] tracking-[-0.012em] text-ink-900/85">
          The work is curation. The site has to read that way the moment it
          loads. Every choice in this deck is in service of one feeling: this
          person makes spaces, and you are welcome inside the one she is making.
        </p>
      </div>
    ),
  },

  // 03 — Wellness, but grounded
  {
    id: "wellness",
    surface: "haze",
    body: (
      <div className="flex flex-col items-start gap-6">
        <SlideEyebrow>The category move</SlideEyebrow>
        <h2 className="font-serif text-[clamp(2.25rem,5.5vw,4.25rem)] font-normal leading-[1.02] tracking-[-0.04em] text-ink-900">
          Wellness, grounded in earth.
          <span className="block italic">Not blue. Not sage. Not spa.</span>
        </h2>
        <p className="max-w-[700px] text-[19px] leading-[1.55] tracking-[-0.012em] text-ink-900/85">
          Most wellness-community brands look the same: cool blues, mint greens,
          soft teals, white space that feels clinical. That language is loud
          right now, which means it disappears. We went the other direction.
        </p>
        <p className="max-w-[700px] text-[19px] leading-[1.55] tracking-[-0.012em] text-ink-900/85">
          Soil, clay, dark wood, warm cream. A brand that signals wellness
          through stability and warmth instead of stillness and cool air. It
          reads as <em>rooted</em>, not <em>retreated</em>. It’s the difference
          between an aromatherapy app and a long meal at a long table.
        </p>
      </div>
    ),
  },

  // 04 — Aura, not aesthetic
  {
    id: "aura",
    surface: "ink",
    body: (
      <div className="flex flex-col items-start gap-6">
        <SlideEyebrow tone="ember">What the gradients are doing</SlideEyebrow>
        <h2 className="font-serif text-[clamp(2.25rem,5.5vw,4.25rem)] font-normal leading-[1.02] tracking-[-0.04em] text-ember-50">
          Aura, not aesthetic.
          <span className="block italic text-rust-400">A feeling before a word.</span>
        </h2>
        <p className="max-w-[700px] text-[19px] leading-[1.55] tracking-[-0.012em] text-clay-300">
          The gradients in the hero and on the offering cards aren’t decoration.
          They’re doing one job: producing the sense of <em>welcome</em> you
          register before reading anything. They’re warm. They breathe. They
          are never identical twice.
        </p>
        <p className="max-w-[700px] text-[19px] leading-[1.55] tracking-[-0.012em] text-clay-300">
          What greets you when you walk into a space someone has prepared for
          you is not the décor. It’s the temperature. The light. The feeling
          that thought has been put in. That’s what this layer of the brand is.
        </p>
      </div>
    ),
  },

  // 05 — Palette
  {
    id: "palette",
    surface: "cream",
    body: (
      <div className="flex flex-col items-start gap-8">
        <SlideEyebrow>The palette</SlideEyebrow>
        <h2 className="font-serif text-[clamp(2.25rem,5.5vw,4.25rem)] font-normal leading-[1.02] tracking-[-0.04em] text-ink-900">
          Earth, wood, coffee, wine.
        </h2>
        <p className="max-w-[680px] text-[19px] leading-[1.55] tracking-[-0.012em] text-ink-900/85">
          A small palette doing big work. Five colors, five jobs. Every shader,
          every hover, every heading pulls from this family. That’s what
          makes the brand feel like one piece instead of a kit.
        </p>
        <ul className="grid w-full max-w-[820px] grid-cols-2 gap-4 sm:grid-cols-5">
          <Swatch hex="#F0E3C8" name="Paper" role="The base. Warm cream, not white." />
          <Swatch hex="#D8A886" name="Clay" role="The mid. Soil and skin." />
          <Swatch hex="#88353A" name="Wine" role="Heritage. Intention." />
          <Swatch hex="#9E2616" name="Brick" role="Accent. Energy." />
          <Swatch hex="#410F0B" name="Coffee" role="The grounding ink." />
        </ul>
      </div>
    ),
  },

  // 06 — Typography
  {
    id: "type",
    surface: "cream",
    body: (
      <div className="flex flex-col items-start gap-6">
        <SlideEyebrow>The voice</SlideEyebrow>
        <h2 className="font-serif text-[clamp(2.25rem,5.5vw,4.25rem)] font-normal leading-[1.02] tracking-[-0.04em] text-ink-900">
          Two voices. One person.
        </h2>
        <p className="max-w-[680px] text-[19px] leading-[1.55] tracking-[-0.012em] text-ink-900/85">
          A serif for the statements that take up space. Vision, headlines,
          italics. Inter for the working voice: roles, navigation, body. The
          contrast mirrors how she works. Visionary on the page, operator
          behind the scenes.
        </p>
        <div className="mt-2 flex w-full max-w-[820px] flex-col gap-6 rounded-md border border-ink-900/10 bg-cream-200 p-6">
          <p className="font-serif text-[44px] leading-[0.98] tracking-[-0.04em] text-ink-900">
            Three offerings.
            <span className="block italic">One throughline.</span>
          </p>
          <p className="font-sans text-[15.1676px] font-medium uppercase leading-none tracking-[1.5px] text-ink-900/70">
            Strategist · Curator · Connector
          </p>
        </div>
      </div>
    ),
  },

  // 07 — Intimacy
  {
    id: "intimacy",
    surface: "ink",
    body: (
      <div className="flex flex-col items-start gap-6">
        <SlideEyebrow tone="ember">Who it’s for</SlideEyebrow>
        <h2 className="font-serif text-[clamp(2.25rem,5.5vw,4.25rem)] font-normal leading-[1.02] tracking-[-0.04em] text-ember-50">
          An intimate gathering of people.
          <span className="block italic text-rust-400">On purpose.</span>
        </h2>
        <p className="max-w-[700px] text-[19px] leading-[1.55] tracking-[-0.012em] text-clay-300">
          The audience is specific: senior leaders and creatives doing the work
          of leading well. The brand isn’t designed to convert volume. It’s
          designed to qualify. Long copy. Slow motion. The visitor self-selects
          by staying.
        </p>
        <p className="max-w-[700px] text-[19px] leading-[1.55] tracking-[-0.012em] text-clay-300">
          Intimacy is a feature here, not a tone. The work happens in rooms
          built for the people in them, because that’s where the conversation
          actually changes how someone leads. The brand has to feel like one
          of those rooms before a single email goes out.
        </p>
      </div>
    ),
  },

  // 08 — Arches
  {
    id: "arches",
    surface: "cream",
    body: (
      <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col items-start gap-6">
          <SlideEyebrow>The shape</SlideEyebrow>
          <h2 className="font-serif text-[clamp(2.25rem,5.5vw,4.25rem)] font-normal leading-[1.02] tracking-[-0.04em] text-ink-900">
            Doorways, not buttons.
          </h2>
          <p className="max-w-[600px] text-[19px] leading-[1.55] tracking-[-0.012em] text-ink-900/85">
            Each offering card is rounded at the top in an arch. Arches are
            thresholds. Chapels, galleries, entryways. The shape tells the
            visitor what kind of experience this is before any words do.
            <em> You are stepping into something.</em>
          </p>
        </div>
        <ArchTriptych />
      </div>
    ),
  },

  // 09 — Editorial handling of standard modules
  {
    id: "cadence",
    surface: "cream",
    body: (
      <div className="flex flex-col items-start gap-8">
        <SlideEyebrow>How it’s handled</SlideEyebrow>
        <h2 className="font-serif text-[clamp(2.25rem,5.5vw,4.25rem)] font-normal leading-[1.02] tracking-[-0.04em] text-ink-900">
          Editorial cadence,
          <span className="block italic">not lead-gen tactics.</span>
        </h2>
        <p className="max-w-[700px] text-[19px] leading-[1.55] tracking-[-0.012em] text-ink-900/85">
          The site has the standard modules. Press, recognition, brands worked
          with, testimonials, get in touch. Each one is treated like a quiet
          museum credit or a magazine spread, never a conversion module. Single
          ink. Pull quotes. Slow drift. The voice stays steady.
        </p>
        <ul className="grid w-full max-w-[860px] grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            "Press marquee in a single ink. Editorial credits, not logo soup.",
            "Recognition as a timeline. The work, over time.",
            "Testimonials as pull-quotes with portraits. A voice, not a rating.",
            "Brands worked with: a roll, not a wall.",
            "One CTA per section. No urgency banners.",
            "No popups, no exit-intent, no chatbot.",
          ].map((line) => (
            <li
              key={line}
              className="border-l border-ink-900/15 pl-4 text-[17px] leading-[1.5] tracking-[-0.012em] text-ink-900/80"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>
    ),
  },

  // 10 — How to talk about it
  {
    id: "lines",
    surface: "haze",
    body: (
      <div className="flex flex-col items-start gap-8">
        <SlideEyebrow>Talking points</SlideEyebrow>
        <h2 className="font-serif text-[clamp(2.25rem,5.5vw,4.25rem)] font-normal leading-[1.02] tracking-[-0.04em] text-ink-900">
          How to describe the brand.
        </h2>
        <ul className="flex w-full max-w-[860px] flex-col gap-6">
          <PullQuote
            label="On the palette"
            quote="Earth, wood, coffee, wine. Warmth where most wellness brands go cool."
          />
          <PullQuote
            label="On the work"
            quote="She builds the room and welcomes you in."
          />
          <PullQuote
            label="On the audience"
            quote="An intimate gathering, on purpose. Senior leaders and creatives doing the work of leading well."
          />
          <PullQuote
            label="On the category"
            quote="A wellness-community brand grounded in warmth, not in cool air."
          />
        </ul>
      </div>
    ),
  },

  // 11 — Closer
  {
    id: "closer",
    surface: "ink",
    body: (
      <div className="flex flex-col items-start gap-6">
        <SlideEyebrow tone="ember">The takeaway</SlideEyebrow>
        <h2 className="font-serif text-[clamp(2.5rem,6vw,4.75rem)] font-normal leading-[0.98] tracking-[-0.04em] text-ember-50">
          It’s purposeful.
          <span className="block italic text-rust-400">It’s intentional.</span>
        </h2>
        <p className="max-w-[700px] text-[19px] leading-[1.55] tracking-[-0.012em] text-clay-300">
          The colors are the uniform. The serif is the headline. The arches are
          the shorthand. The cadence is editorial. Every choice in the brand
          was made on purpose, so the work can be read as such on first contact.
        </p>
        <p className="max-w-[700px] text-[19px] leading-[1.55] tracking-[-0.012em] text-clay-300">
          Aligning creative ambition with the systems that sustain it. Said by
          the brand before the conversation starts.
        </p>
      </div>
    ),
  },
];

export default function PitchDeck() {
  const reduce = useReducedMotion();
  const instant = reduce === true;

  return (
    <main
      className="relative h-svh w-full overflow-y-auto overflow-x-hidden"
      style={{
        scrollSnapType: "y mandatory",
      }}
    >
      {SLIDES.map((slide, i) => (
        <Slide
          key={slide.id}
          slide={slide}
          index={i}
          total={SLIDES.length}
          instant={instant}
        />
      ))}
    </main>
  );
}

// ── Slide shell ─────────────────────────────────────────────────────────────

function Slide({
  slide,
  index,
  total,
  instant,
}: {
  slide: Slide;
  index: number;
  total: number;
  instant: boolean;
}) {
  const surface = SURFACE[slide.surface];
  return (
    <section
      id={`slide-${slide.id}`}
      className={`relative flex min-h-svh w-full flex-col overflow-hidden ${surface.bg}`}
      style={{ scrollSnapAlign: "start" }}
    >
      {slide.surface === "haze" ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.55]"
        >
          {!instant ? <HeroShaderBackground /> : null}
        </div>
      ) : null}

      <div className="px-6 sm:px-10 lg:px-8">
        <div className="mx-auto flex min-h-svh w-full max-w-[1200px] flex-col justify-center pt-[88px] pb-16 sm:pt-[96px] sm:pb-20">
          <motion.div
            initial={instant ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            {slide.body}
          </motion.div>
        </div>
      </div>

      <SlideFooter index={index} total={total} surface={slide.surface} />
    </section>
  );
}

const SURFACE: Record<Slide["surface"], { bg: string; ink: string }> = {
  cream: { bg: "bg-cream-200", ink: "text-ink-900" },
  ink: { bg: "bg-ink-950", ink: "text-ember-50" },
  haze: { bg: "bg-haze-300", ink: "text-ink-900" },
};

function SlideFooter({
  index,
  total,
  surface,
}: {
  index: number;
  total: number;
  surface: Slide["surface"];
}) {
  const tone =
    surface === "ink" ? "text-ember-50/55" : "text-ink-900/45";
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0">
      <div className="px-6 sm:px-10 lg:px-8">
        <div
          className={`mx-auto flex w-full max-w-[1200px] items-end justify-between pb-6 font-sans text-[12px] font-medium uppercase tracking-[0.18em] ${tone}`}
        >
          <span>Adrienne L. Lucas · Brand pitch</span>
          <span className="tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Bits ────────────────────────────────────────────────────────────────────

function SlideEyebrow({
  children,
  tone = "ink",
}: {
  children: React.ReactNode;
  tone?: "ink" | "ember";
}) {
  const color = tone === "ember" ? "text-rust-400" : "text-brick-600";
  return (
    <p
      className={`font-sans text-[13px] font-semibold uppercase tracking-[0.22em] ${color}`}
    >
      {children}
    </p>
  );
}

function Swatch({
  hex,
  name,
  role,
}: {
  hex: string;
  name: string;
  role: string;
}) {
  return (
    <li className="flex flex-col gap-3">
      <div
        aria-hidden
        className="h-24 w-full rounded-md ring-1 ring-ink-900/10"
        style={{ backgroundColor: hex }}
      />
      <div>
        <p className="font-serif text-[20px] leading-none tracking-[-0.02em] text-ink-900">
          {name}
        </p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-900/60">
          {hex}
        </p>
        <p className="mt-2 text-[13px] leading-[1.45] tracking-[-0.01em] text-ink-900/75">
          {role}
        </p>
      </div>
    </li>
  );
}

function PullQuote({ label, quote }: { label: string; quote: string }) {
  return (
    <li className="flex flex-col gap-2 border-l border-ink-900/20 pl-5">
      <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-brick-600">
        {label}
      </span>
      <span className="font-serif text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.02em] text-ink-900">
        {`“${quote}”`}
      </span>
    </li>
  );
}

function ArchTriptych() {
  // Three small arches showing the threshold shape used by the offering cards.
  const arches = [
    { fill: "#3a221a", title: "Auria" },
    { fill: "#2f1c15", title: "Talent" },
    { fill: "#3d1410", title: "Dialogue" },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {arches.map((a) => (
        <div
          key={a.title}
          className="relative aspect-[3/5] w-full overflow-hidden rounded-t-[clamp(48px,16vw,120px)] border border-ink-900/15"
          style={{ backgroundColor: a.fill }}
        >
          <span className="absolute inset-x-0 bottom-3 text-center font-serif text-[14px] tracking-[-0.01em] text-ember-50/85">
            {a.title}
          </span>
        </div>
      ))}
    </div>
  );
}
