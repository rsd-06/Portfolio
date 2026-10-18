// src/app/layout.tsx
// rsd.exe — Root Layout
// Next.js 16 App Router | Mobile-first | Lenis + Framer Motion

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cormorant_Garamond, DM_Mono, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import LenisProvider    from "@/components/providers/LenisProvider";
import ScrollResetOnRouteChange from "@/components/providers/ScrollResetOnRouteChange";
import CustomCursor     from "@/components/ui/CustomCursor";
import GrainOverlay     from "@/components/ui/GrainOverlay";
import Navbar           from "@/components/layout/Navbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import GlobalSetup      from "@/components/providers/GlobalSetup";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { SITE_URL } from "@/lib/site";
import { CONTACT_EMAIL, SAME_AS } from "@/data/socials";
import { ogImageUrl } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

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
  // Resolves every relative metadata URL (canonical, OG) against the real origin.
  metadataBase: new URL(SITE_URL),
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
  authors: [{ name: "Sudharshan R", url: SITE_URL }],
  category: "technology",
  // No canonical or og:url here: children would inherit them. Each page sets
  // its own through pageMetadata() in lib/seo.
  openGraph: {
    title: "rsd.exe — Sudharshan R | Full-Stack Developer & Builder",
    description:
      "Portfolio of Sudharshan R — EIE student at KCT Coimbatore, full-stack developer, ML enthusiast, and Project Based Learner at Forge Innovation & Ventures (KCT Tech Park).",
    type: "website",
    locale: "en_IN",
    siteName: "rsd.exe",
    images: [{ url: ogImageUrl("Sudharshan R — building through software"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "rsd.exe — Sudharshan R | Full-Stack Developer",
    description:
      "Portfolio of Sudharshan R — EIE student at KCT Coimbatore, full-stack developer, ML enthusiast, and Project Based Learner at Forge Innovation & Ventures.",
    creator: "@rsd_2006",
    images: [ogImageUrl("Sudharshan R — building through software")],
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

// Without JavaScript, framer-motion's server-rendered starting states never
// animate away: entrances stay at opacity 0 and the home loader covers the
// page forever. This only targets those starting states (opacity 0 paired with
// a transform, the clip-path headline reveal, the loader), not elements that
// are hidden on purpose until hover (those never carry a transform).
const NO_JS_CSS = `
[style*="opacity:0;"][style*="transform:"],[style$="opacity:0"][style*="transform:"],[style="opacity:0"]{opacity:1!important;transform:none!important;filter:none!important}
[style*="clip-path:inset(0 100% 0 0)"]{clip-path:none!important}
[data-loader]{display:none!important}
`;

/* ── Root Layout ─────────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    "name": "Sudharshan R",
    "image": `${SITE_URL}/hero.jpg`,
    "email": `mailto:${CONTACT_EMAIL}`,
    "alternateName": ["R Sudharshan", "rsd.exe"],
    "url": SITE_URL,
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
      "MERN Stack", "TypeScript", "Python", "Cloud Computing",
      "PyTorch", "Reinforcement Learning", "Remote Sensing", "Rust", "Tauri"
    ],
    "sameAs": SAME_AS
  };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": SITE_URL,
        "name": "rsd.exe",
        "alternateName": "Sudharshan R — Portfolio",
        "inLanguage": "en-IN",
        "author": { "@id": `${SITE_URL}/#person` },
        "publisher": { "@id": `${SITE_URL}/#person` },
      },
    ],
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
        <noscript>
          <style>{NO_JS_CSS}</style>
        </noscript>
      </head>
      <body className="bg-base-bg text-text-primary antialiased" suppressHydrationWarning>
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
        <JsonLd data={schemaMarkup} />

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
          {/* Resets scroll position on navigation (see the component for why) */}
          <ScrollResetOnRouteChange />

          {/* Global one-time setup (image protection, etc.) */}
          <GlobalSetup />

          {/* Fixed overlays */}
          <GrainOverlay />

          {/* Fixed top nav */}
          <Navbar />

          {/* Page content. Each route owns its own offset for the fixed nav. */}
          <div>
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
