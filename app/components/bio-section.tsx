import Image from "next/image";

const HEADLINE_LINES = [
  "Communications Executive.",
  "Cultural Strategist.",
  "Entrepreneur.",
] as const;

const BIO =
  "Fifteen years across communications, media, and law. Global Head of Strategic Partnerships at The One Club for Creativity, where she doubled the revenue and regional footprint of the flagship program. Founder of Auria Creative Well — the rooms senior creatives return to for clarity, performance, and excellence.";

export function BioSection() {
  return (
    <section
      aria-labelledby="bio-eyebrow"
      className="bg-cream-200 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-12 px-6 sm:gap-16 sm:px-10 lg:flex-row lg:items-start lg:gap-20 lg:px-8 xl:gap-24">
        <div className="relative mx-auto w-full max-w-[501px] shrink-0 overflow-hidden rounded-t-[min(28vw,258px)] bg-white lg:mx-0">
          {/*
            Crop matches Figma (node 32:169 / 32:170): 501×647 viewport on a ~2269×1730
            bitmap offset (-893, -485). Anchor ≈ center of that window → 50.4% / 46.7%.
          */}
          <div className="relative aspect-501/647 w-full">
            <Image
              src="/images/adrienne-portrait.png"
              alt="Adrienne L. Lucas, seated portrait"
              fill
              sizes="(max-width: 1024px) 100vw, 501px"
              className="object-cover object-[50.4%_46.7%]"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 pt-0 lg:max-w-[600px] lg:pt-2 xl:max-w-[640px]">
          <p
            id="bio-eyebrow"
            className="text-[15px] font-semibold uppercase tracking-[0.18em] text-brick-600"
          >
            Adrienne L. Lucas
          </p>

          <p className="mt-8 font-serif text-[clamp(1.75rem,4.2vw,2.75rem)] font-normal leading-[1.02] tracking-[-0.04em] text-ink-900">
            {HEADLINE_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <p className="mt-10 max-w-[510px] text-[18px] leading-[1.54] tracking-[-0.012em] text-ink-900 sm:text-[19px] lg:text-[20px]">
            {BIO}
          </p>
        </div>
      </div>
    </section>
  );
}
