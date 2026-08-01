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
// Only Cormorant is preloaded — it's used in the loader screen, so it must be
// available before the first paint. All other fonts load after interactive.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,   // ← needed in LoaderScreen
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-dm-mono",
  display: "swap",
  preload: false,  // ← loaded after paint; mono is used for labels only
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
  preload: false,  // ← decorative; non-blocking is fine
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
  preload: false,  // ← body fallback; browser has system sans-serif anyway
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
    default: "rsd.exe — Sudharshan R | Full-Stack Developer & Builder",
    template: "%s — rsd.exe",
  },
  description:
    "Portfolio of Sudharshan R — 3rd year EIE student at Kumaraguru College of Technology (KCT), Coimbatore. Full-stack developer, ML enthusiast, and Project Based Learner at ProtoSem (Forge Innovation & Ventures, KCT Tech Park). Building with React, Next.js, Node.js, and AI.",
  keywords: [
    // Identity
    "Sudharshan R", "R Sudharshan", "rsd.exe", "rsd", "rsudh",
    // Role
    "portfolio", "Full-Stack Developer", "Software Developer", "SDE", "Builder", "Entrepreneur",
    "Coder", "Developer", "Engineer",
    // Technical skills
    "React Developer", "Next.js Developer", "Node.js", "Express.js", "MongoDB", "MERN Stack",
    "TypeScript", "JavaScript", "Python", "Full-Stack", "Creative Coding",
    "Machine Learning", "ML", "AI", "AIML", "Machine Learning Enthusiast",
    "Artificial Intelligence", "LLM", "AI Agents", "Multi-modal AI",
    "Cloud Computing", "Vercel", "REST API",
    // Education
    "KCT", "Kumaraguru College of Technology", "Coimbatore", "India",
    "EIE", "Electronics and Instrumentation Engineering",
    "3rd year student", "engineering student", "student developer",
    // Programs & Organizations
    "PBL", "Project Based Learning", "Project Based Learner",
    "ProtoSem", "Forge", "Forge Innovation and Ventures", "KCT Tech Park",
    "ASADI", "apprenticeship", "20-week program",
    // General
    "Full-Stack Developer in India", "Indian developer",
  ],
  authors: [{ name: "Sudharshan R", url: "https://rsd.exe" }],
  category: "technology",
  alternates: {
    canonical: "https://rsd.exe",
  },
  openGraph: {
    title: "rsd.exe — Sudharshan R | Full-Stack Developer & Builder",
    description:
      "Portfolio of Sudharshan R — EIE student at KCT Coimbatore, full-stack developer, ML enthusiast, and Project Based Learner at Forge Innovation & Ventures (KCT Tech Park).",
    type: "website",
    locale: "en_IN",
    siteName: "rsd.exe",
    url: "https://rsd.exe",
  },
  twitter: {
    card: "summary_large_image",
    title: "rsd.exe — Sudharshan R | Full-Stack Developer",
    description:
      "Portfolio of Sudharshan R — EIE student at KCT Coimbatore, full-stack developer, ML enthusiast, and Project Based Learner at Forge Innovation & Ventures.",
    creator: "@rsd_2006",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* ── Root Layout ─────────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Sudharshan R",
    "alternateName": ["R Sudharshan", "rsd.exe"],
    "url": "https://rsd.exe",
    "jobTitle": "Full-Stack Developer & ML Enthusiast",
    "description": "3rd year Electronics and Instrumentation Engineering student at Kumaraguru College of Technology (KCT), Coimbatore. Full-stack developer, ML enthusiast, and Project Based Learner at ProtoSem — Forge Innovation and Ventures, KCT Tech Park.",
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Kumaraguru College of Technology",
      "alternateName": "KCT",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Coimbatore",
        "addressRegion": "Tamil Nadu",
        "addressCountry": "IN"
      }
    },
    "memberOf": [
      {
        "@type": "Organization",
        "name": "Forge Innovation and Ventures",
        "alternateName": "Forge",
        "parentOrganization": {
          "@type": "Organization",
          "name": "KCT Tech Park"
        }
      },
      {
        "@type": "EducationalOrganization",
        "name": "ProtoSem — ASADI Apprenticeship",
        "alternateName": "ProtoSem"
      }
    ],
    "knowsAbout": [
      "Full-Stack Development", "React", "Next.js", "Node.js", "Machine Learning",
      "Artificial Intelligence", "AI Agents", "LLMs", "Project Based Learning",
      "MERN Stack", "TypeScript", "Python", "Cloud Computing"
    ],
    "sameAs": [
      "https://github.com/rsd-06",
      "https://www.linkedin.com/in/sudharshan-r-b0a8b0254/",
      "https://x.com/rsd_2006",
      "https://www.instagram.com/rsd_exe/"
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
      <head>
        {/* Resource hints — these run before the browser parses JS */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
      </head>
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
