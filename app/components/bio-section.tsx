import Image from "next/image";

import { BIO, BIO_HEADLINE_LINES } from "../lib/landing-content";

export function BioSection({
  compact = false,
}: { compact?: boolean } = {}) {
  return (
    <section
      aria-labelledby="bio-eyebrow"
      className={
        compact
          ? "bg-cream-200 px-6 pt-4 pb-0 sm:px-10 sm:pt-5 lg:px-8 lg:pt-6"
          : "bg-cream-200 px-6 pt-28 pb-16 sm:px-10 sm:pt-32 sm:pb-20 lg:px-8 lg:pt-40 lg:pb-24"
      }
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 sm:gap-16 lg:flex-row lg:items-start lg:gap-10 xl:gap-12">
        <div
          className={
            compact
              ? "relative mx-auto w-full max-w-[501px] shrink-0 overflow-hidden rounded-t-[min(28vw,258px)] bg-white max-lg:mx-0 max-lg:ml-auto max-lg:mr-0 lg:mx-0 lg:ml-0 lg:mr-0"
              : "relative mx-auto w-full max-w-[501px] shrink-0 overflow-hidden rounded-t-[min(28vw,258px)] bg-white max-lg:mx-0 max-lg:ml-auto max-lg:mr-0 lg:mx-0 lg:ml-20 lg:mr-0 xl:ml-28"
          }
        >
          <div className="relative aspect-501/647 w-full">
            <Image
              src="/images/ad.png"
              alt="Adrienne L. Lucas, seated portrait"
              fill
              sizes="(max-width: 1024px) 100vw, 501px"
              className="select-none object-cover object-center"
              draggable={false}
              priority
            />
          </div>
        </div>

        <div
          className={
            compact
              ? "min-w-0 flex-1 pt-0 lg:ml-6 lg:mt-10 lg:max-w-[560px] lg:pt-6"
              : "min-w-0 flex-1 pt-0 lg:ml-0 lg:max-w-[560px] lg:pt-2"
          }
        >
          <p
            id="bio-eyebrow"
            className="text-[15px] font-semibold uppercase tracking-[0.18em] text-brick-600"
          >
            Adrienne L. Lucas
          </p>

          <p className="mt-4 font-serif text-[clamp(1.875rem,4.5vw,3rem)] font-normal leading-[1.02] tracking-[-0.04em] text-ink-900">
            {BIO_HEADLINE_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <p className="mt-10 max-w-[560px] text-[18px] leading-[1.54] tracking-[-0.012em] text-ink-900 sm:text-[19px] lg:text-[18px]">
            {BIO}
          </p>
        </div>
      </div>
    </section>
  );
}
