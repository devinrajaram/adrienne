import Image from "next/image";
import Link from "next/link";
import { PressLogos } from "./press-logos";
import { SiteHeader } from "./site-header";

const ROLES = ["Strategist", "Curator", "Connector"];

export function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col bg-cream-200"
    >
      <div className="relative isolate flex flex-1 flex-col overflow-hidden bg-haze-300">
        <Image
          src="/images/hero-haze.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />

        <SiteHeader />

        <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col items-center justify-center px-6 pt-[120px] pb-12 text-center sm:px-10 sm:pt-[140px] sm:pb-16 lg:pt-[160px]">
          <ul
            aria-label="Roles"
            className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-900 sm:gap-5 sm:text-[15px]"
          >
            {ROLES.map((role, i) => (
              <li key={role} className="flex items-center gap-2.5 sm:gap-5">
                <span>{role}</span>
                {i < ROLES.length - 1 ? (
                  <span
                    aria-hidden
                    className="block h-3 w-px bg-ink-900/60 sm:h-4"
                  />
                ) : null}
              </li>
            ))}
          </ul>

          <h1 className="mt-7 max-w-[18ch] font-serif text-[clamp(2.25rem,5.5vw,4.3rem)] font-normal leading-[1.06] tracking-[-0.04em] text-ink-900 sm:mt-8">
            Building the rooms senior creatives return to
          </h1>

          <p className="mt-6 max-w-xl text-[clamp(0.95rem,1.4vw,1.375rem)] leading-[1.32] tracking-[-0.01em] text-ink-900 sm:mt-7">
            Strategic partnerships, executive experiences, and a practice of
            recalibration — so creative ambition can scale without depletion.
          </p>

          <Link
            href="#contact"
            className="mt-8 inline-flex h-12 min-w-[279px] items-center justify-center rounded-none bg-ink-700 px-6 text-[18px] font-medium tracking-[-0.01em] text-cream-100 transition-colors duration-200 hover:bg-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-4 focus-visible:ring-offset-haze-300 sm:mt-10"
          >
            Start a conversation
          </Link>
        </div>
      </div>

      <PressLogos />
    </section>
  );
}
