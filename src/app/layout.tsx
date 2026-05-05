// src/app/layout.tsx
// rsd.exe — Root Layout
// Next.js 16 App Router | Mobile-first | Lenis + Framer Motion

import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import LenisProvider    from "@/components/providers/LenisProvider";
import CustomCursor     from "@/components/ui/CustomCursor";
import GrainOverlay     from "@/components/ui/GrainOverlay";
import Navbar           from "@/components/layout/Navbar";
import GlobalFooter     from "@/components/layout/GlobalFooter";

/* ── Google Fonts via next/font (zero CLS) ───────────────────── */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-dm-mono",
  display: "swap",
  preload: true,
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
  preload: true,
});

/* ── Metadata ────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "rsd.exe — Sudharshan R",
    template: "%s — rsd.exe",
  },
  description:
    "Portfolio of Sudharshan R — EIE engineer at KCT, full-stack developer, builder of SkillSync. Aspiring SDE.",
  keywords: [
    "Sudharshan R", "rsd.exe", "portfolio", "developer",
    "engineer", "KCT Coimbatore", "SkillSync", "Next.js",
  ],
  authors: [{ name: "Sudharshan R", url: "https://rsd.exe" }],
  themeColor: "#F5F4F0",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5, // allow user zoom — accessibility
  },
  openGraph: {
    title: "rsd.exe",
    description: "Aspiring SDE · Student · Builder",
    type: "website",
    locale: "en_IN",
    siteName: "rsd.exe",
  },
  twitter: {
    card: "summary_large_image",
    title: "rsd.exe — Sudharshan R",
    description: "Aspiring SDE · Student · Builder",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ── Root Layout ─────────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`
        ${cormorant.variable}
        ${dmMono.variable}
        ${instrumentSerif.variable}
      `}
      suppressHydrationWarning
    >
      <body className="bg-bg text-text antialiased overflow-x-hidden" suppressHydrationWarning>
        {/*
          Layout structure:
          ┌──────────────────────────────┐
          │  GrainOverlay  (fixed)       │
          │  CustomCursor  (fixed)       │
          │  Navbar        (fixed top)   │
          │  ─────────────────────────   │
          │  [page content]              │
          │  ─────────────────────────   │
          │  GlobalFooter  (curved top)  │
          └──────────────────────────────┘

          Lenis wraps everything for smooth scroll.
          The footer is rendered here globally so it
          appears identically across all pages.
        */}
        <LenisProvider>
          {/* Fixed overlays */}
          <GrainOverlay />

          {/* Fixed top nav */}
          <Navbar />

          {/* Page-specific content (padded top for fixed nav) */}
          <div className="pt-nav md:pt-nav-d">
            {children}
          </div>

          {/* Global curved footer — present on every page */}
          <GlobalFooter />

          {/* Cursor rendered last to ensure perfect mix-blend-mode calculation */}
          <CustomCursor />
        </LenisProvider>
      </body>
    </html>
  );
}
