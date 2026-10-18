// src/data/socials.ts
// Single source for profile links and the contact email. These used to be
// copied into HeroStatic, AboutHero, GlobalFooter, the contact page, ContactReveal
// and the JSON-LD block, so changing one handle meant hunting down six copies.
//
// Each surface picks its own subset and order from SOCIAL rather than sharing one
// list, because they deliberately differ (e.g. Threads only appears on /contact).

export type Social = {
  label: string;
  href: string;
  /** PNG under public/assets/socialMediaIcons. */
  icon: string;
  handle: string;
};

export const SOCIAL = {
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sudharshan-r-b0a8b0254/",
    icon: "/assets/socialMediaIcons/linkedin_icon.png",
    handle: "sudharshan-r-b0a8b0254",
  },
  github: {
    label: "GitHub",
    href: "https://github.com/rsd-06",
    icon: "/assets/socialMediaIcons/github_icon.png",
    handle: "rsd-06",
  },
  instagram: {
    label: "Instagram",
    href: "https://www.instagram.com/rsd_exe/",
    icon: "/assets/socialMediaIcons/instagram_icon.png",
    handle: "@rsd_exe",
  },
  threads: {
    label: "Threads",
    href: "https://www.threads.com/@rsd_exe",
    icon: "/assets/socialMediaIcons/threads_icon.png",
    handle: "@rsd_exe",
  },
  twitter: {
    label: "Twitter",
    href: "https://x.com/rsd_2006",
    icon: "/assets/socialMediaIcons/twitter_icon.png",
    handle: "@rsd_2006",
  },
} satisfies Record<string, Social>;

/** Icon row in the home hero and the About hero. */
export const HERO_SOCIALS: Social[] = [SOCIAL.linkedin, SOCIAL.github, SOCIAL.instagram, SOCIAL.twitter];

/** Text links in the global footer. */
export const FOOTER_SOCIALS: Social[] = [SOCIAL.github, SOCIAL.linkedin, SOCIAL.twitter, SOCIAL.instagram];

/** Strip along the bottom of /contact. */
export const CONTACT_SOCIALS: Social[] = [
  SOCIAL.linkedin,
  SOCIAL.github,
  SOCIAL.instagram,
  SOCIAL.threads,
  SOCIAL.twitter,
];

/** Profiles that identify the person to search engines (JSON-LD `sameAs`). */
export const SAME_AS: string[] = [SOCIAL.github, SOCIAL.linkedin, SOCIAL.twitter, SOCIAL.instagram].map(
  (s) => s.href
);

export const CONTACT_EMAIL = "hello.rsd06@gmail.com";
