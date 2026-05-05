// src/app/contact/page.tsx
// rsd.exe — Contact page
// Total height = exactly 100dvh: dark section (flex-1) + white social strip (fixed height).
// No scroll. Everything visible in one viewport.

"use client";

import ContactHero from "@/components/contact/ContactHero";

const SOCIALS = [
  { label: "LinkedIn",  href: "https://www.linkedin.com/in/sudharshan-r-b0a8b0254/", iconSrc: "/assets/socialMediaIcons/linkedin_icon.png" },
  { label: "Instagram", href: "https://www.instagram.com/rsd_exe/",                  iconSrc: "/assets/socialMediaIcons/instagram_icon.png" },
  { label: "Threads",   href: "https://www.threads.com/@rsd_exe",                    iconSrc: "/assets/socialMediaIcons/threads_icon.png" },
  { label: "GitHub",    href: "https://github.com/rsd-06",                           iconSrc: "/assets/socialMediaIcons/github_icon.png" },
  { label: "Twitter",   href: "https://x.com/rsd_2006",                              iconSrc: "/assets/socialMediaIcons/twitter_icon.png" },
];

export default function ContactPage() {
  return (
    // Outer shell = exactly 100dvh, flex-col, no overflow
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Dark hero — flex-1 fills remaining space ── */}
      <main
        id="contact-page"
        style={{
          flex: 1,
          minHeight: 0,
          backgroundColor: "var(--color-bg-dark)",
          color: "var(--color-text-inv)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ContactHero />
      </main>

      {/* ── White social strip — always visible at the very bottom ── */}
      <div
        style={{
          backgroundColor: "var(--bg-base)",
          borderTop: "1px solid var(--border-subtle)",
          padding: "0.9rem var(--page-px)",
          flexShrink: 0,
        }}
      >
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Social media links">
          {SOCIALS.map(({ label, href, iconSrc }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow on ${label} — opens in new tab`}
              className="f-mono"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "var(--text-2xs)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                opacity: 1,
                color: "var(--text-primary)",
                textDecoration: "none",
                minHeight: "36px",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <img 
                src={`${iconSrc}?v=2`} 
                alt={`${label} icon`} 
                width="16" 
                height="16" 
                style={{ flexShrink: 0, objectFit: "contain", display: "block" }} 
              />
              {label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}