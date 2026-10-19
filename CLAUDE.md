@AGENTS.md

# CLAUDE.md — rsd.exe Portfolio

Personal portfolio of **Sudharshan R** (GitHub `rsd-06`), deployed on Vercel at `https://sudharshan-r.vercel.app`.
The brand name is **rsd.exe**. It's a design-led, animation-heavy, single-author Next.js site with no backend beyond two GitHub proxy routes.

**Read [FEATURESMAP.md](FEATURESMAP.md) first.** It maps every route → component → data/hook, lists the window-level contracts between components, the open TODOs and known inconsistencies. Keep it updated when you add, move or delete a component, route, data field or asset folder.

---

## 1. Stack (what is actually used)

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16.1.6**, App Router, Turbopack | See AGENTS.md: read `node_modules/next/dist/docs/` before using a Next API you aren't sure of. `params` is a `Promise` and must be awaited. |
| UI | React 19.2 | |
| Language | TypeScript 5, `strict: true`, alias `@/*` → `src/*` | |
| Styling | **Tailwind CSS v4, CSS-first** (no `tailwind.config`), `src/app/globals.css` | `@theme` tokens + `:root` CSS variables. `tw-animate-css` and `shadcn/tailwind.css` imported. |
| Animation | **framer-motion 12** (primary), **Lenis** smooth scroll | No GSAP in use. |
| WebGL | `ogl` (only `Grainient`, in the loader) | Three.js / R3F / GSAP were removed as unused — ask before adding a new animation or 3D library. |
| Content | MDX via `next-mdx-remote/rsc` + `gray-matter` | `src/content/blogs/*.mdx` |
| Icons | `lucide-react` (UI icons), `react-icons` (`Si*`/`Fa*` brand logos) | |
| Fonts | `next/font/google`: Cormorant Garamond, DM Mono, Instrument Serif, Inter | |
| Analytics | `@vercel/analytics`, `@vercel/speed-insights`, optional GA | |
| Lint | ESLint 10 flat config, `eslint-config-next` core-web-vitals + typescript | |

There is **no unit-test suite**. Verification is `npm run lint`, `npm run build`, and three rerunnable checks against a running server (`npm run dev` first):

| Command | What it proves |
|---|---|
| `npm run check:blogs` | Every post has full frontmatter and compiles as MDX (no stray `{` or `<`). No server needed. |
| `npm run check:seo [baseUrl]` | Every sitemap URL has a title, a 50+ char description, a canonical equal to its own URL, OG and Twitter tags, an OG image, and JSON-LD (BlogPosting or SoftwareSourceCode where relevant); every post is in the sitemap and in `/llms.txt`. |
| `npm run audit:mobile [baseUrl] [routes…]` | Headless Edge at 375×812 in real time: no element past the right edge, no on-screen text stuck invisible. `NOJS=1` audits the no-JavaScript render, `WIDTH`/`HEIGHT` change the viewport, `FOCUS="<selector>"` also saves a viewport shot at that element. Screenshots land in `.mobile-audit/`. It can't see one element overlapping another, so look at the shots. |
| `npm run demo:record -- <scenario>` | Records `scripts/demos/<scenario>.mjs` into `public/assets/projects/<slug>/demo.mp4` plus stills (needs ffmpeg). Long waits go through `d.compress()`; still stretches are capped at 3 s. Record the portfolio against `npm run build && npm run start`, not dev (dev badge, slow first compiles). |

In Git Bash, prefix route arguments with `MSYS_NO_PATHCONV=1` or `/` becomes a Windows path. The Claude preview pane does not paint while it's hidden (requestAnimationFrame runs at 0 fps), so animation-dependent checks there are inconclusive. Use `audit:mobile`.
`npm run lint` currently exits non-zero on a **pre-existing baseline** (37 errors / 34 warnings, see FEATURESMAP §13 "Still open"). The bar is: no *new* problems in files you touch, and fix old ones there when it's cheap. `npm run build` must pass.

## 2. Commands

```bash
npm run dev            # next dev
npm run build          # next build (type-checks + SSG all slugs)
npm run start
npm run lint           # eslint .
npm run compress-video -- -InputPath "C:\path\to\raw-master.mov" [-Variant Desktop|Mobile|Both] [-KeepAudio]
```

`compress-video.ps1` needs `ffmpeg` on PATH and refuses to read from its own output paths in `public/`. Keep raw masters outside `public/`.

Environment (`.env.local`, git-ignored — never commit or print values):

| Var | Used in | Required |
|---|---|---|
| `GITHUB_TOKEN` | `src/app/api/github/route.ts` (required), `api/github/repo/route.ts` (optional) | For the contributions grid |
| `NEXT_PUBLIC_BASE_URL` | `src/lib/site.ts`, `src/app/robots.ts` | Optional; defaults to `https://sudharshan-r.vercel.app` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `src/app/layout.tsx` | Optional |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | `src/app/layout.tsx` | Optional |

Platform: the owner develops on **Windows** (PowerShell scripts). The repo lives at `D:\Projects\Portfolio`; C: is nearly full, so keep caches and build output on D:. `next.config.ts` pins `turbopack.root` to `__dirname` because a stray lockfile in the user profile confused root inference — don't remove it.

## 3. Directory layout

```
src/
  app/                 routes (App Router); layout.tsx = global shell + SEO + JSON-LD
    api/github/        GitHub GraphQL contributions + per-repo commit proxy
  components/
    layout/            Navbar, GlobalFooter, ConditionalFooter
    providers/         LenisProvider, ScrollResetOnRouteChange, GlobalSetup
    ui/                CustomCursor, GrainOverlay, ImageLightbox (generic, cross-page)
    home/ about/ projects/ projects/project-detail/ blogs/ contact/ protosem/
    protosem/weeks/    one WeekNContent.tsx per documented week
    protosem/weeks/blocks/  reusable week-page primitives (barrel: index.ts)
    Grainient.tsx              (root-level, react-bits style import)
  content/blogs/       *.mdx posts
  data/                projects.ts, protosem.ts, socials.ts — the content source of truth
  hooks/               useMediaQuery, useScrollLock, useAssetLoader, useGitHubContributions, useRepoActivity
  lib/                 breakpoints, scrollLock, heroVideo, site, mdx, utils
public/                hero video + poster, resume PDF, assets/<page>/...
```

Placement rules:
- A component used by one page goes in that page's folder. Promote to `components/ui/` only when a second page needs it (that's how `ImageLightbox` got there).
- Note: `ScrollProgressTracker` lives in `components/about/` but is used by projects and blogs too. Import it from there; don't create a copy.
- Data that is content (text, lists, links) goes in `src/data/` if more than one component reads it; otherwise a `SCREAMING_CASE` const at the top of the component file (`SOCIALS`, `HOBBY_CARDS`, `TECH_STACK`, `WORDS`, …) is the house pattern.
- **Social links, handles and the contact email live only in `src/data/socials.ts`.** Each surface picks its own ordered subset (`HERO_SOCIALS`, `FOOTER_SOCIALS`, `CONTACT_SOCIALS`, `SAME_AS`). Never re-inline a profile URL in a component.

## 4. Design system — keep it consistent

**Palette** (light only, by decision: there is no dark mode, and the old unreachable `.dark` tokens were deleted):

| Token | Value | Tailwind utility |
|---|---|---|
| `--bg-base` | `#FBF9F6` warm off-white | `bg-base-bg` |
| `--bg-surface` / `--bg-soft` | `#F6F4F0` / `#EDE9E2` | `bg-base-surface` / `bg-base-soft` |
| `--text-primary` / `--text-secondary` / `--text-muted` | `#1F1F1F` / `#4A4A4A` / `#737373` | `text-text-primary` etc. |
| `--border-subtle` | `#E2E2DF` | `border-border-subtle` |
| `--accent-main` | `#5227FF` purple (also `--accent-soft/glow/hover/text`) | `bg-accent-main` / `text-accent-main` or `var(--accent-main)`. `bg-accent` is shadcn's neutral grey, not the brand purple. |
| `--color-bg-dark` / `--color-text-inv` | `#111111` / `#F5F4F0` | Contact page and footer |
| Semantic aliases | `--color-bg`, `--color-text`, `--color-border` | Used heavily in inline styles |

Translucent tints are written as `color-mix(in srgb, var(--color-text) 10%, transparent)` — prefer this over new literal `rgba(...)` so tints follow the tokens.

**Typography** — use the role classes, not raw font families:

| Class | Font | Use for |
|---|---|---|
| `.f-display` | Cormorant Garamond 300, tight tracking | Page titles, big headings, numbers |
| `.f-mono` | DM Mono | Labels, nav, metadata, small caps-style UI text (often `uppercase tracking-widest`, low opacity) |
| `.f-accent` | Instrument Serif italic | Taglines, soft sub-lines |
| `.f-quote` | Cormorant italic | Quotes |
| body | Inter (`--font-body`) | Prose |

Fluid type scale in `:root`: `--text-xs … --text-3xl`, plus `text-2xs` and `text-hero` in `@theme`. Use `var(--text-*)` or `clamp()`; avoid fixed px font sizes for headings.

**Spacing & layout**
- Horizontal page gutter is always `var(--page-px)` (`clamp(1rem, 5vw, 4rem)`), e.g. `px-[var(--page-px)]`.
- The navbar is fixed; each page owns its top offset (`pt-48`/`pt-32`/`var(--nav-h)` = 5rem). Page titles follow the About/Projects pattern: `absolute top-32 left-[var(--page-px)]`, `f-display text-7xl`.
- Hairline rules: 1px `var(--color-border)` (`.rule`, `.rule-dark`).
- Tap targets ≥ 44px (`minHeight: "44px"`) on interactive text links/buttons.
- Breakpoints are Tailwind stock (640/768/1024/1280). In JS use `useIsMobile` / `useIsDesktop` / `useIsTouch` / `useBreakpointUp|Down` from `@/hooks/useMediaQuery` — never `window.innerWidth < 768`.

**Motion vocabulary**
- Standard easing is expo-out `[0.19, 1, 0.22, 1]` (named `EASE` or `EXPO` locally; `blocks/motion.ts` exports it for ProtoSem).
- Entrances: `initial={{ opacity: 0, y: 10–40 }}` → `whileInView`/`animate` with `viewport={{ once: true }}`, 0.6–0.9 s. Headline reveals use `clipPath: "inset(0 100% 0 0)" → "inset(0 0% 0 0)"`.
- Hover affordances: opacity 0.35–0.55 → 1, small `translateX` nudges.
- Respect reduced motion: `usePrefersReducedMotion()` in JS; the global CSS media query already kills CSS transitions. LenisProvider disables smooth scroll entirely under reduced motion, so consumers must handle `useLenis() === null`.
- Gate hover-only behaviour behind `useIsTouch()` and give touch an equivalent (see `ProjectCard` in-view autoplay, `TechStack` tap-to-toggle).

**Tone of copy:** lowercase mono labels (`all projects`, `philosophy`), short declarative sentences with full stops ("Code. Build. Grow."), bracketed mono links (`[Grid]`, `( Let's talk ↗ )`), arrows `→ ← ↗` in link text.

## 5. Architectural rules and gotchas

1. **Lenis owns window scroll.** `document.body.style.overflow = "hidden"` alone does nothing. To lock scroll use `useScrollLock(locked)` (depth-counted, stops Lenis). Components that hijack wheel/touch (HobbiesSection, overlays) must `lenis.stop()`/`start()` and handle `lenis` being null. Use `data-lenis-prevent` on inner scroll regions.
2. **Scroll restoration is deliberate.** `ScrollResetOnRouteChange` forces top on fresh navigation and leaves back/forward alone. `__rsd_restoreScrollY` is set *only* when leaving home via a project card and is consumed once. Don't collapse it into `__rsd_homeScrollY`.
3. **Home loader contract.** `LoaderScreen` runs once per hard load (module flag `loaderHasRun`), then dispatches `window` event `rsd:loaderDone`. Heavy assets (hero video) must wait for it — check `window.__rsd_loaderDone` too, for SPA returns. Don't make the loader wait on videos.
4. **Hero video** sources live only in `src/lib/heroVideo.ts` (WebM first, MP4 fallback; mobile list may be empty → desktop fallback). Poster is `public/hero.jpg`. `HERO_VIDEO.hasAudio` gates the "sound on" button — keep it `false` unless the files were encoded with `-KeepAudio` (check with `ffprobe -select_streams a`). Sound is only ever enabled by a click (browsers ignore scroll as a gesture) and is cut while the section is off screen. Don't detect source failure from `networkState` right after inserting `<source>` children — it is `NETWORK_NO_SOURCE` during normal selection; use `onError` on the last `<source>`.
   Dev gotcha: `next.config.ts` marks `/_next/static` immutable even in dev, so after editing client code the browser may run a stale chunk. Hard-reload or use a fresh port before concluding a change "didn't work".
5. **MacMonitorSection geometry** constants (`MACBOOK`, `IPHONE`, `DESKTOP_BOX`, `MOBILE_HOLE_*`, `FILL_BUFFER`) are calibrated to the PNG mockups. The CSS clamp and the zoom maths share `DESKTOP_BOX` — change both through that one constant.
6. **ProtoSem routability goes through `isDocumented()`** (`src/data/protosem.ts`). Timeline links, `generateStaticParams`, the sitemap and `WeekNavigation` all derive from it; never hand-code a week list elsewhere.
7. **Server vs client.** Pages are Server Components where possible so they can export `metadata`; interactive sections opt in with `"use client"`. Every route `page.tsx` except `not-found.tsx` is a Server Component; when a page needs state, put it in a client child (e.g. `/projects` → `ProjectsView`) rather than marking the page `"use client"`. Anything using `fs` (`lib/mdx.ts`) is server-only.
8. **GitHub data** goes through the `/api/github*` routes (server token, `revalidate: 86400`) and is cached client-side in `localStorage` for 24 h with versioned keys. Bump the key suffix (`-v1` → `-v2`) if you change the response shape.
9. **SEO.** Every route's metadata comes from `pageMetadata({ path, title, description, eyebrow?, keywords?, article? })` in `src/lib/seo.ts`. It sets the canonical, `og:url`, OG and Twitter tags, and an `/og?title=…` share image. **Never put `alternates.canonical` or `openGraph.url` in the root layout:** Next merges metadata shallowly, so every child inherits them. That's how every page once declared itself a duplicate of `/`. The root layout sets `metadataBase` and the site-wide `Person` + `WebSite` JSON-LD graph. Post and project pages add `BlogPosting` / `SoftwareSourceCode` via `<JsonLd>` (`src/components/seo/JsonLd.tsx`, escapes `<`). JSON-LD needs absolute URLs, so use `absoluteUrl()`. `/llms.txt` and `/llms-full.txt` are generated from the same data (`src/lib/llms.ts`). Never hard-code the domain; changing it should only mean setting `NEXT_PUBLIC_BASE_URL`. Posts use their own prerendered article card (`blogCardUrl(slug)` → `app/og/blog/[slug]`) and declare `alternates` for `/rss.xml` (every page, added by `pageMetadata`) and their `/blogs/<slug>.md` copy. Run `npm run check:seo` after touching any of this.
10. **Content must survive without JavaScript.** framer-motion server-renders entrances at their starting state (`opacity:0` plus a transform). A `<noscript>` stylesheet in `layout.tsx` (`NO_JS_CSS`) resets exactly those, the clip-path headline reveal, and the home loader (`data-loader`). Keep new entrances in that shape (opacity 0 *with* a transform). Hover-only layers must not carry a transform, or they'll show without JS. Verify with `NOJS=1 npm run audit:mobile`.
11. **Hydration safety.** Format date-only strings (`"2026-10-19"`) with `timeZone: "UTC"`. Otherwise the server and a browser west of UTC render different days, and React throws a hydration error. Never nest a `<button>` inside a `<Link>`. Read browser-only APIs (`navigator`, `window`) only in code that runs after a user action or in an effect. Pass `BlogSummary` (`toSummary`), not whole posts, into client components. Every `<video>` carries `suppressHydrationWarning`: browser extensions tag video elements before hydration (`data-video="0"`), which is not our bug. Check a hydration report in a clean browser (`scripts/lib/cdp.mjs` launches one) before chasing it.
12. **Share cards.** `src/lib/artwork.ts` derives a post's artwork from its slug and category (motif table `MOTIF_BY_CATEGORY`). A new category falls back to orbits, so add it to the table. The og:image (static) and the share sheet (animated via `.art-in` / `.art-draw` / `.art-float` in `globals.css`) both draw it with `renderArtwork`. The og route reads fonts from `assets/fonts/` (OFL `.woff`; Satori can't read woff2).
13. **Scroll feel.** Lenis `wheelMultiplier` (0.75) sets site-wide wheel distance. The featured rail's runway is `RAIL_SCROLL_RATIO` (1.6) × its horizontal travel. Tune those two numbers rather than adding per-section wheel handlers.
14. **Images.** Prefer `next/image` (AVIF/WebP configured). A few `<img>` remain where needed (mockup frame, nav hover background, social icons). Right-click/drag on images is blocked globally by `GlobalSetup` + CSS; don't fight it per-component.
15. **Comments** in this codebase explain *why*, often recording a previous bug ("Previously … so …"). Match that: comment non-obvious constraints, not what the code says. File headers use `// src/path/File.tsx` + one-line purpose.

## 6. Recipes

**Add a project**
1. Append an object to `PROJECTS` in `src/data/projects.ts` (fill every required `Project` field; use the next unused `index` string, zero-padded).
2. Put images in `public/assets/projects/<slug>/` (`01.png`, `02.jpg`, …). `images[0]` is the card/hero image. Use `/assets/projects/_shared/placeholder.jpg` only temporarily.
3. `featured: true` puts it on the home horizontal rail (array order is rail and grid order; keep `index` matching position).
4. Omit `repoUrl` for a private repo: cards then say "private repo", and the commit grid and `codeRepository` are skipped. Never link a repo or `liveUrl` you haven't opened yourself. `skillsync.vercel.app` turned out to be someone else's site.
5. `video` (optional) is a short muted demo, used for the card hover preview and on the detail page with `images[0]` as poster. Record it with a scenario in `scripts/demos/` (see §1) rather than by hand, so it can be re-recorded.
6. Static params, sitemap, `/llms.txt`, JSON-LD, prev/next nav and marquee pick it up automatically.

**Add a blog post**
1. Create `src/content/blogs/<slug>.mdx` with frontmatter `title`, `date` (`YYYY-MM-DD`), `excerpt`, `category` (UPPERCASE), `readTime` (`"N MIN READ"`).
2. Use `##` / `###` for headings (they feed the TOC; ids are generated from heading text). Fenced code renders via `CodeBlock`.
3. MDX treats `{`, `}` and `<` in prose as code. Put maths and set notation in backticks. Run `npm run check:blogs`.
4. Attribute sources in the first line (`*Notes on [title](url) by creator.*`), paraphrase rather than transcribe, and only state what the source says. List them in frontmatter too, so they render at the end of the post (`PostSources`) and reach crawlers and LLMs:
   ```yaml
   sources:
     - { type: youtube, id: Uj3_KqkI9Zo, title: "The Infinite Hotel Paradox", creator: TED-Ed }
     - { type: article, url: "https://…", title: "…", author: "…", publisher: "…", date: 2025-10-04, description: "…", image: "https://…/og.jpg" }
   ```
   Invalid entries (bad YouTube id, non-http URL, no title) are skipped with a warning. The blog list groups by the `YYYY-MM` of `date`. The sitemap, `/llms.txt` and the post's JSON-LD pick it up automatically.

**Document a ProtoSem week**
1. In `src/data/protosem.ts`, add the week to `DOCUMENTED_WEEKS` (`status: "completed"` or `"current"`); update `PROGRAM_META.currentWeekId` as the program advances.
2. Create `src/components/protosem/weeks/WeekNContent.tsx` **using `WeekShell` and the `blocks/` primitives** (Week1Content is the shortest example; Week7Content shows the media and technical blocks).
3. Register it in `WEEK_CONTENT` in `src/app/protosem/[slug]/page.tsx`.
4. Assets go in `public/assets/protoSemPage/weekN/`. Compress videos and provide a poster jpg.

**Add a route**
- Server `page.tsx` with a `metadata` export, `<main className="bg-base-bg min-h-screen …">`, page title pattern from §4, add it to the Navbar link arrays (desktop *and* mobile copies) and to `src/app/sitemap.ts`.

## 7. Working agreements

- Keep changes small and in the existing idiom; this is a hand-crafted site, so don't introduce new UI libraries, CSS frameworks or state managers without asking.
- After any change that affects layout, check both ≥ 1024px and ≤ 767px widths, and reduced motion if animation changed.
- Run `npm run lint` and `npm run build` before calling something done.
- Update `FEATURESMAP.md` (routes, component tables, §10 globals, §12 TODOs, §13 inconsistencies) in the same change.
- When you finish a `TODO.md` item, move it under `--- done ---` with `[x]`.
- Don't commit `.env*`, `.next/`, or `tsconfig.tsbuildinfo` (already git-ignored).
- Commits are authored by the owner alone. Don't add AI co-author trailers.

## 8. Open work (mirror of TODO.md + in-code)

- [ ] Verify on a real phone (emulated audit passes).
- [ ] Production `GITHUB_TOKEN` on Vercel is rejected (401); replace it.
- [ ] Google Search Console: verify the site and submit the sitemap.
- [ ] Google Docs Mini two-account demo (owner signs in once; see `scripts/demos/googledocsmini.mjs`).
- [ ] Commit the SatSaathi landing fixes left in the sat_saathi working tree.
- [ ] Move to `sudharshan-r.dev` once bought.
- [ ] New hero montage encoded with `-KeepAudio`, then `hasAudio: true`.
- [ ] Owner review of the 13 posts dated 2026-10-19.
- Later: floating interactive pet; `Navbar.tsx` `WORDS` "Entrepreneur.".
- Dropped: dark mode.

`TODO.md` is the source of truth for the wording; this list is a pointer. See FEATURESMAP §13 for remaining inconsistencies.
