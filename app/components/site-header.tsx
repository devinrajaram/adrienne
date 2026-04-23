"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useState } from "react";

import { EASE_NAV, INTRO_DELAY } from "./intro-motion";

const NAV_LEFT = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
];

const NAV_RIGHT = [
  { label: "Media Kit", href: "#media-kit" },
  { label: "Contact", href: "#contact" },
];

const linkClass =
  "text-[15px] font-medium uppercase tracking-[0.18em] text-[color:inherit] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm";

/**
 * Cream bar fades in over the same scroll window the morph uses to fill in
 * the dark band (progress 0.76 → 0.92 of the 200svh morph track).
 * One vh of scroll ≈ one progress unit / 1.0, so the window in pixels is:
 *   start = innerHeight * 0.76, end = innerHeight * 0.92
 */
const SCROLL_START_VH = 0.76;
const SCROLL_END_VH = 0.92;

/** --cream-200; max alpha keeps the bar slightly translucent over content below. */
const CREAM_BAR_MAX_ALPHA = 0.88;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const instant = reduceMotion === true;

  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const vh = window.innerHeight || 1;
      const start = vh * SCROLL_START_VH;
      const end = vh * SCROLL_END_VH;
      const y = window.scrollY;
      const p = Math.max(0, Math.min(1, (y - start) / (end - start)));
      scrollProgress.set(p);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scrollProgress]);

  const bgAlpha = useTransform(
    scrollProgress,
    [0, 1],
    [0, CREAM_BAR_MAX_ALPHA]
  );
  const backgroundColor = useMotionTemplate`rgba(244, 234, 210, ${bgAlpha})`;
  const backdropFilter = useTransform(scrollProgress, [0, 1], [
    "blur(0px)",
    "blur(10px)",
  ]);

  /** Cream over the hero shader → ink once the cream bar has filled in. */
  const color = useTransform(
    scrollProgress,
    [0, 1],
    ["#f4ead2", "#410f0b"]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 will-change-transform"
      style={{
        backgroundColor,
        backdropFilter,
        WebkitBackdropFilter: backdropFilter,
        color,
      }}
      initial={
        instant
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: "-100%" }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: instant ? 0 : 0.8,
        delay: instant ? 0 : INTRO_DELAY.nav,
        ease: EASE_NAV,
      }}
    >
      <nav
        aria-label="Primary"
        className="relative mx-auto flex h-[70px] max-w-[1400px] items-center px-6 sm:px-10 lg:px-8"
      >
        <ul className="hidden flex-1 items-center gap-10 md:flex">
          {NAV_LEFT.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/"
          aria-label="Adrienne L. Lucas — home"
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
            if (pathname === "/") {
              window.scrollTo(0, 0);
              window.location.reload();
            } else {
              window.location.assign("/");
            }
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
        >
          <motion.span
            aria-hidden
            className="relative block h-10 w-60 sm:h-11 sm:w-64 md:h-12 md:w-72"
            style={{
              backgroundColor: color,
              maskImage: "url(/images/logo.svg)",
              WebkitMaskImage: "url(/images/logo.svg)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
        </Link>

        <ul className="ml-auto hidden items-center gap-10 md:flex">
          {NAV_RIGHT.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-sm text-[color:inherit] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 md:hidden"
        >
          <span className="sr-only">{open ? "Close" : "Open"} menu</span>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 8h16" />
                <path d="M4 16h16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-0 top-[70px] z-10 bg-cream-200/95 backdrop-blur-sm"
        >
          <ul className="flex flex-col items-center gap-8 py-12">
            {[...NAV_LEFT, ...NAV_RIGHT].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium uppercase tracking-[0.18em] text-ink-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </motion.header>
  );
}
