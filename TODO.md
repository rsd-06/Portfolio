[] Build a real dark-mode toggle. globals.css already has ~66 lines of `.dark`
   theme tokens plus the `@custom-variant dark` declaration, but nothing ever
   adds the `.dark` class, so none of it is reachable today. Needs: a toggle,
   system-preference detection, no flash on first paint, and an audit of the
   literal rgba values in components that won't follow the theme.

[] Verify the sub-768px layouts on a real phone. They were fixed and checked
   against the emitted CSS, but never observed at an actual phone viewport.

[] Replace the project placeholder images. 9 image references in
   src/data/projects.ts now point at /assets/projects/_shared/placeholder.jpg
   because the real files were missing (gitpr had none at all). Drop the real
   screenshots in and update the paths.

[] Reconsider gating page content behind framer-motion entrance animations.
   Every section starts at opacity:0 and is revealed by JS, so if the animation
   does not run the page renders blank. Consider a MotionConfig with
   reducedMotion="user", or a CSS fallback that shows content without JS.

[] Add LeetCode to the social icon rows: beside GitHub in the home hero, and
   in the top-right icon row of the About hero. Add a `leetcode` entry (and an
   icon PNG in public/assets/socialMediaIcons/) to src/data/socials.ts, then add
   it to HERO_SOCIALS. Also consider SAME_AS (JSON-LD).

[] Floating interactive pet (in the spirit of Meta's "dots"). Small, clean and
   subtle; reacts to interaction — a few taps and it looks hurt, keep hitting
   it and it gets offended, and so on. Later stage: give it knowledge about me
   so it can answer questions. (Deferred.)

[] Enhance the mobile view and responsiveness across all pages.

[] Featured projects rail (home, HorizontalProjectsSection) scrolls too fast:
   one quick wheel/trackpad flick moves 2–3 cards. Make it advance about one
   card per gesture (or lower the scroll-to-x ratio).

[] Overall scroll sensitivity is too high — one wheel/trackpad flick travels
   too far across the whole site, not just the projects rail. Reduce it in
   the Lenis setup (src/components/providers/LenisProvider.tsx: e.g. lower
   wheelMultiplier below 1 and/or raise duration), then re-check the pinned
   sections (MacMonitorSection zoom, HobbiesSection, TechStack) still feel right.

[] Switch the domain to sudharshan-r.dev once bought: add it in Vercel →
   Domains, set NEXT_PUBLIC_BASE_URL=https://sudharshan-r.dev (or change the
   fallback in src/lib/site.ts), redirect sudharshan-r.vercel.app and
   rsd-exe.vercel.app to it. Later: hello@sudharshan-r.dev via Cloudflare
   Email Routing → rsudharshan2006@gmail.com.

[] New hero video edit (15–20 s montage): encode with
   `npm run compress-video -- -InputPath <master> -KeepAudio`, refresh
   public/hero.jpg, then set hasAudio: true in src/lib/heroVideo.ts so the
   "sound on" button appears.

[] Sitemaps, robots.txt and proper SEO optimisation (per-page metadata,
   OG images, structured data per project/blog, canonical domain).

[] Optimise for AI agents and LLM search (e.g. /llms.txt, clean semantic HTML,
   structured data, crawlable text that doesn't depend on JS animations).

[] Add PyTorch and the other tools / tech I use to the tech stack
   (src/components/about/TechStack.tsx, TECH_STACK).

[] Blogs list: group posts by month by default (month separators).

[] Write more blogs. Topics from my "Portfolio Blogs" list, with sources:
   - Arundhati & Salman interview — https://youtu.be/tIekAj-ussc?si=kePDFUO9uy_Thj1G
   - Michelin Stars reel — (source to add)
   - Claude thinking levels — https://youtu.be/rKV5JcALQoQ?si=EZBnWuq1ESIIKwtZ
   - CISC vs RISC, Von Neumann (vs Harvard) architecture — (source to add)
   - Spec-Driven Development — (source to add)
   - The Mom Test — https://youtu.be/TmNeVbk0hNQ
   - Why warm countries are poorer — https://beyondtweets.substack.com/p/why-warm-countries-are-poorer
   - GitHub Actions — (source to add)
   - The Infinite Hotel Paradox — https://youtu.be/Uj3_KqkI9Zo
     and the sizes-of-infinity follow-up — https://youtu.be/OxGsU8oIWjY?si=IMGhK81IosD7o_j0
     (my notes: docs/blog-sources/infinite-hotel-paradox.md — Hilbert's hotel →
     Cantor → Gödel → Turing → theory of computation → computers/phones)
   - Hinduism is actually cool — https://youtu.be/njJTmkY7RqU?si=VRO95ab9Wu7Hz0h_
   - Justice: What's The Right Thing To Do? (Harvard, Michael Sandel) —
     YouTube lecture series, episodes 1–6
   - Calhoun effect (Universe 25 / "behavioural sink") — https://youtu.be/LuCans9euxY?si=0nX8aQ6s91wLiYmL
   - On the Heights of Despair (Cioran) — https://youtu.be/DNGXsbZHMMI?si=zvTcjd4dpqWHDdvd

[] Projects: add CodeCritters and SatSaathi (GitHub repos) as new project
   entries — collect images and write-up from the repos — and make them
   featured. Un-feature SkillSync and rsd.exe (portfolio). Also collect the
   missing images for the other projects, and add a short demo video for every
   project to its detail page (Project.video).

--- done ---
[x] Blogs slug component tracks sub headings and marks the side index
[x] Back to Previous Blog link on blog pages
[x] Scroll Down Hint on the Home Screen working and placed properly
