// src/app/layout.tsx
// rsd.exe — Root Layout
// Next.js 16 App Router | Mobile-first | Lenis + Framer Motion

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cormorant_Garamond, DM_Mono, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import LenisProvider    from "@/components/providers/LenisProvider";
import CustomCursor     from "@/components/ui/CustomCursor";
import GrainOverlay     from "@/components/ui/GrainOverlay";
import Navbar           from "@/components/layout/Navbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import GlobalSetup      from "@/components/providers/GlobalSetup";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

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

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

/* ── Metadata ────────────────────────────────────────────────── */
export const viewport: Viewport = {
  themeColor: "#F5F4F0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "rsd.exe",
    template: "%s — rsd.exe",
  },
  description:
    "Portfolio Website of Sudharshan R : A modern, design-driven showcase of full-stack engineering, creative coding, and AI project development. Aspiring SDE & Builder.",
  keywords: [
    "Sudharshan R", "R Sudharshan", "rsd.exe", "portfolio", "Full-Stack Developer in India",
    "React Developer", "Coder", "Entrepreneur", "Builder", "SDE", "AIML",
    "Machine Learning Enthusiast", "Cloud Computing", "Software Developer", "Full-Stack",
    "Creative Coding", "Next.js Developer"
  ],
  authors: [{ name: "Sudharshan R", url: "https://rsd.exe" }],
  openGraph: {
    title: "rsd.exe",
    description: "Portfolio Website of Sudharshan R : A modern, design-driven showcase of full-stack engineering, creative coding, and AI project development.",
    type: "website",
    locale: "en_IN",
    siteName: "rsd.exe",
    url: "https://rsd.exe",
  },
  twitter: {
    card: "summary_large_image",
    title: "rsd.exe",
    description: "Portfolio Website of Sudharshan R : A modern, design-driven showcase of full-stack engineering, creative coding, and AI project development.",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ── Root Layout ─────────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Sudharshan R",
    "alternateName": "R Sudharshan",
    "url": "https://rsd.exe",
    "jobTitle": "Full-Stack Developer",
    "description": "A modern, design-driven showcase of full-stack engineering, creative coding, and AI project development.",
    "sameAs": [
      "https://github.com/rsd-exe"
    ]
  };

  return (
    <html
      lang="en"
      className={`
        ${cormorant.variable}
        ${dmMono.variable}
        ${instrumentSerif.variable}
        ${inter.variable}
      `}
      suppressHydrationWarning
    >
      <body className="bg-bg text-text antialiased overflow-x-hidden" suppressHydrationWarning>
        {/* Google Analytics via Environment Variable */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />

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
          {/* Global one-time setup (image protection, etc.) */}
          <GlobalSetup />

          {/* Fixed overlays */}
          <GrainOverlay />

          {/* Fixed top nav */}
          <Navbar />

          {/* Page-specific content (padded top for fixed nav) */}
          <div className="pt-nav md:pt-nav-d">
            {children}
          </div>

          {/* Global curved footer — present on every page */}
          <ConditionalFooter />

          {/* Cursor rendered last to ensure perfect mix-blend-mode calculation */}
          <CustomCursor />
        </LenisProvider>
        
        {/* Vercel Speed Insights */}
        <SpeedInsights />
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
