"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LEFT = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
];

const NAV_RIGHT = [
  { label: "Media Kit", href: "#media-kit" },
  { label: "Contact", href: "#contact" },
];

const linkClass =
  "text-[15px] font-medium uppercase tracking-[0.18em] text-ink-700 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

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
    <header className="absolute inset-x-0 top-0 z-20">
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
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-[clamp(1.6rem,2.5vw,2.55rem)] font-bold leading-none tracking-[-0.04em] text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
        >
          Adrienne L. Lucas
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
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink-700 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 md:hidden"
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
    </header>
  );
}
