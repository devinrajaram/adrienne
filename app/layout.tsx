import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "./components/site-header";
import { HERO_SUBHEAD } from "./lib/landing-content";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adrienne L. Lucas — Strategist, Curator, Connector",
  description: HERO_SUBHEAD,
};

export const viewport: Viewport = {
  themeColor: "#F0E3C8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
