# FEATURESMAP — rsd.exe Portfolio

A navigation map: **route → section → component → data/hook/lib**. Use it to find where any visible feature lives and what it depends on.

> Snapshot taken 2026-10-18 at commit `7a1b08c`, last updated 2026-10-19 (cleanup, SEO/LLM visibility, content, mobile and no-JS passes; see §13). All paths are relative to the repo root. Line counts are approximate.

---

## 0. Quick lookup — "I want to change…"

| I want to change… | Go to |
|---|---|
| Project content (text, stack, images, status, featured flag) | `src/data/projects.ts` |
| Which projects show on the home rail | `featured: true` in `src/data/projects.ts` |
| ProtoSem weeks list / current week / progress % | `src/data/protosem.ts` (`DOCUMENTED_WEEKS`, `PROGRAM_META.currentWeekId`) |
| A ProtoSem week page's content | `src/components/protosem/weeks/WeekNContent.tsx` + register in `src/app/protosem/[slug]/page.tsx` (`WEEK_CONTENT`) |
| A blog post | `src/content/blogs/<slug>.mdx` (frontmatter: title, date, excerpt, category, readTime) |
| Nav links / rotating words | `src/components/layout/Navbar.tsx` (links are inlined twice: desktop + mobile) |
| Social links, handles, icons (all pages + JSON-LD) | `src/data/socials.ts` (`SOCIAL`, then per-surface lists `HERO_SOCIALS`, `FOOTER_SOCIALS`, `CONTACT_SOCIALS`, `SAME_AS`) |
| Contact email | `src/data/socials.ts` (`CONTACT_EMAIL`) |
| Footer words | `src/components/layout/GlobalFooter.tsx` |
| Contact reveal card | `src/components/contact/ContactReveal.tsx` |
| Hero video files | `src/lib/heroVideo.ts` + `npm run compress-video -- -InputPath <master>` |
| Colours, fonts, type scale, spacing tokens | `src/app/globals.css` (`:root`, `@theme`) and `src/app/layout.tsx` (next/font) |
| Breakpoints (JS) | `src/lib/breakpoints.ts` → `src/hooks/useMediaQuery.ts` |
| Site URL (metadataBase, canonicals, OG, JSON-LD, sitemap, robots) | `src/lib/site.ts` (`SITE_URL` ← `NEXT_PUBLIC_BASE_URL`) |
| Tech stack icons (About + Home) | `src/components/about/TechStack.tsx` (`TECH_STACK`) |
| Hobby cards | `src/components/about/HobbiesSection.tsx` (`HOBBY_CARDS`) |
| Page title / description / canonical / OG / Twitter | `pageMetadata()` in `src/lib/seo.ts`, called by every route's `metadata` / `generateMetadata` |
| Share image (og:image) design | `src/app/og/route.tsx` (`/og?title=…&eyebrow=…`) |
| Structured data | `src/app/layout.tsx` (Person + WebSite graph), post and project pages (`<JsonLd>`) |
| What LLMs read | `src/lib/llms.ts` → `/llms.txt`, `/llms-full.txt` |
| No-JavaScript fallback | `NO_JS_CSS` in `src/app/layout.tsx` |
| Scroll sensitivity | `wheelMultiplier` in `LenisProvider.tsx`; `RAIL_SCROLL_RATIO` in `HorizontalProjectsSection.tsx` |

---

## 1. Global shell (every route)

Defined in `src/app/layout.tsx` (Server Component). Render order:

```
<html> (font CSS variables: --font-cormorant, --font-dm-mono, --font-instrument, --font-inter)
 └─ <body class="bg-base-bg text-text-primary">
     ├─ GA scripts (only if NEXT_PUBLIC_GA_MEASUREMENT_ID)
     ├─ JSON-LD Person schema
     └─ LenisProvider ─────────────────── smooth scroll + context
         ├─ ScrollResetOnRouteChange ──── scroll-to-top on navigation
         ├─ GlobalSetup ───────────────── blocks right-click/drag on img/canvas/video
         ├─ GrainOverlay ──────────────── fixed SVG noise (z 9999)
         ├─ Navbar ────────────────────── fixed top nav
         ├─ <div>{children}</div> ─────── page content
         ├─ ConditionalFooter ─────────── GlobalFooter on all routes except /contact
         └─ CustomCursor ──────────────── dot+ring, mix-blend-difference, pointer devices only
     ├─ <SpeedInsights/>  (Vercel)
     └─ <Analytics/>      (Vercel)
```

| Component | File | Depends on | Notes |
|---|---|---|---|
| LenisProvider / `useLenis()` | `src/components/providers/LenisProvider.tsx` | `lenis`, `lib/scrollLock.registerLenis` | Skipped entirely under `prefers-reduced-motion`. Exposes `window.__rsd_lenis` debug handle. `stopInertiaOnNavigate`. |
| ScrollResetOnRouteChange | `src/components/providers/ScrollResetOnRouteChange.tsx` | `useLenis`, `usePathname` | Distinguishes back/forward (popstate) from fresh nav; defers to `__rsd_restoreScrollY` when set. |
| GlobalSetup | `src/components/providers/GlobalSetup.tsx` | — | Image protection; pairs with the `img {}` rule in globals.css. |
| GrainOverlay | `src/components/ui/GrainOverlay.tsx` | `.grain-overlay` CSS | |
| Navbar | `src/components/layout/Navbar.tsx` | `useScrollLock`, framer-motion | Links: Projects, About, Blogs, ProtoSem, Contact, Resume (`/Sudharshan_R_Resume.pdf`, new tab). Dark variant on `/contact`. Rotating `WORDS` every 4 s. Mobile overlay locks scroll. |
| ConditionalFooter → GlobalFooter | `src/components/layout/{ConditionalFooter,GlobalFooter}.tsx` | `.footer-*` CSS | Curved top via `.footer-global::before`. "Code. Build. Grow." |
| CustomCursor | `src/components/ui/CustomCursor.tsx` | `useIsTouch`, `.cursor-dot/.cursor-ring` | Returns null on coarse pointers. |

---

## 2. Routes

| Route | File | Rendering | Top-level components |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Server page, client sections | LoaderScreen, HeroStatic, MacMonitorSection, HorizontalProjectsSection, TechStack |
| `/about` | `src/app/about/page.tsx` | Server page + metadata | ScrollProgressTracker, AboutHero, AboutIdentity, AboutPhilosophy, ContentCarousel, HobbiesSection, TechStack, LocationSection |
| `/projects` | `src/app/projects/page.tsx` | Server page + metadata | ProjectsView (client) → ScrollProgressTracker, ProjectsHero, ViewToggle, ProjectsGrid ⇄ MarqueeProjects |
| `/projects/[slug]` | `src/app/projects/[slug]/page.tsx` | SSG via `generateStaticParams(PROJECTS)` | ProjectDetailHero, ProjectDetailBody, ProjectDetailNav |
| `/blogs` | `src/app/blogs/page.tsx` | Server, reads MDX via `getAllBlogs()` | BlogsLayout → BlogCard |
| `/blogs/[slug]` | `src/app/blogs/[slug]/page.tsx` | SSG via `getBlogSlugs()`, `MDXRemote` (rsc) | ScrollProgressTracker, BlogTOC, CodeBlock (as `pre`), prev/next nav |
| `/protosem` | `src/app/protosem/page.tsx` | Server + metadata | ProtoSemHero, ProtoSemTimeline |
| `/protosem/[slug]` | `src/app/protosem/[slug]/page.tsx` | SSG for `isDocumented` weeks; `WEEK_CONTENT` map | Week0Content / Week1Content / Week7Content, WeekNavigation |
| `/contact` | `src/app/contact/page.tsx` | Server page + metadata | ContactHero (client → ContactClock, ContactReveal) + social strip from `CONTACT_SOCIALS` |
| 404 | `src/app/not-found.tsx` | Client | Self-contained (mouse-drift "404", back / home / projects links) |
| `/api/github` | `src/app/api/github/route.ts` | Route handler, `revalidate: 86400` | GitHub GraphQL contributions for `rsd-06` (needs `GITHUB_TOKEN`) |
| `/api/github/repo?owner&repo` | `src/app/api/github/repo/route.ts` | Route handler, `revalidate: 86400` | Last-30-day commit counts (token optional) |
| `/sitemap.xml` | `src/app/sitemap.ts` | Metadata route | Static routes + every project + every blog post (real `lastModified`) + every `DOCUMENTED` week, base = `SITE_URL` |
| `/robots.txt` | `src/app/robots.ts` | Metadata route | Allow all (AI crawlers included), disallow `/api/`; sitemap URL from `SITE_URL` |
| `/og` | `src/app/og/route.tsx` | Route handler (`next/og`) | 1200×630 share card |
| `/llms.txt`, `/llms-full.txt` | `src/app/llms.txt/route.ts`, `src/app/llms-full.txt/route.ts` | Static route handlers | Site summary for LLMs; `-full` adds project write-ups and post bodies |
| `/manifest.webmanifest` | `src/app/manifest.ts` | Metadata route | |

---

## 3. Home `/`

```
page.tsx
├─ LoaderScreen ─────────── useAssetLoader, useLenis, Grainient (OGL WebGL)
│    fires window event "rsd:loaderDone" on exit; consumes __rsd_restoreScrollY
├─ HeroStatic ──────────── "rsd.exe" clip-reveal title, socials, scroll hint
├─ MacMonitorSection ───── MacBook / iPhone PNG mockup that scroll-zooms into fullscreen video
│    └─ HeroVideo ──────── lib/heroVideo (sources), useIsMobile, usePrefersReducedMotion
├─ HorizontalProjectsSection (~1000 lines)
│    ├─ IdentityStatement ─ usePrefersReducedMotion
│    ├─ ProjectCard (local) ─ 3D tilt + spotlight; click → ExpandedOverlay
│    ├─ ExpandedOverlay (portal) ─ useScrollLock, focus trap, Esc
│    │    └─ OverlayTextPanel ─ own lerp scroll + hairline progress
│    └─ EndCard (local)
│    data: PROJECTS.filter(featured)
└─ TechStack ───────────── shared with /about (horizontal scroll-pinned grid)
```

| Component | File | Key mechanics |
|---|---|---|
| LoaderScreen | `src/components/home/LoaderScreen.tsx` | Module flag `loaderHasRun` → shows once per hard load. `MIN_MS = 1500`. RAF-lerped counter → "rsd.exe" logo → clip-path exit. Locks Lenis while visible. |
| Grainient | `src/components/Grainient.tsx` | OGL fragment-shader gradient (grain/warp props). Only used by LoaderScreen. |
| useAssetLoader | `src/hooks/useAssetLoader.ts` | Preloads images only (videos intentionally excluded); writes `--loader-progress` CSS var. |
| HeroStatic | `src/components/home/HeroStatic.tsx` | Scroll-linked label drift, hint fades at 100px. |
| MacMonitorSection | `src/components/home/MacMonitorSection.tsx` | Constants `MACBOOK`, `IPHONE`, `DESKTOP_BOX`, `MOBILE_REST_SIDE`, `FILL_BUFFER` calibrate the screen hole. Spring-smoothed scale over scroll `[0, 0.55]`. Video src withheld until `rsd:loaderDone`. **Sound toggle** (bottom-right pill, Volume2/VolumeX) shows once progress > 0.5, only if `HERO_VIDEO.hasAudio` and not reduced motion; click-only unmute, auto-muted while the section is out of view (`useInView`). |
| HeroVideo | `src/components/home/HeroVideo.tsx` | `useLoaderDone` via `useSyncExternalStore` on `window.__rsd_loaderDone`. `muted` prop written to the element in an effect (React only sets the attribute on mount). Poster on reduced motion, `<video>` error, or error on the **last** `<source>`. Mobile sources fall back to desktop if empty. |
| HorizontalProjectsSection | `src/components/home/HorizontalProjectsSection.tsx` | Vertical scroll → horizontal rail. Writes `__rsd_homeScrollY` continuously; `saveHomeScroll()` sets `__rsd_restoreScrollY` only when leaving via a project card. |
| IdentityStatement | `src/components/home/IdentityStatement.tsx` | Variant factories that animate to *resting* opacity (not always 1). |

**Cross-component contract (home):**
`LoaderScreen` → dispatches `rsd:loaderDone` → `MacMonitorSection` / `HeroVideo` start fetching video.
`HorizontalProjectsSection` → sets `__rsd_restoreScrollY` → `LoaderScreen` + `ScrollResetOnRouteChange` honour it on return.

---

## 4. About `/about`

| Order | Component | File | Data / deps |
|---|---|---|---|
| — | ScrollProgressTracker | `src/components/about/ScrollProgressTracker.tsx` | Fixed right-edge 1px progress line. **Also reused by** /projects, /blogs, /blogs/[slug]. |
| 1 | AboutHero | `src/components/about/AboutHero.tsx` | `HERO_SOCIALS` from `src/data/socials.ts` |
| 2 | AboutIdentity | `src/components/about/AboutIdentity.tsx` | `ELABORATIONS` rotate every 2.8 s; parallax desktop-only |
| 3 | AboutPhilosophy | `src/components/about/AboutPhilosophy.tsx` | `STATEMENTS`, hover-line emphasis |
| 4 | ContentCarousel | `src/components/about/ContentCarousel.tsx` | `CAROUSEL_ITEMS` (JSX content), play/pause, prev/next |
| 5 | HobbiesSection (~750 lines) | `src/components/about/HobbiesSection.tsx` | `HOBBY_CARDS`, `getCardWidth()`. Intercepts wheel/touch/keyboard, stops/starts Lenis, auto-advance (respects reduced motion), progress bar, `EndHobbyCard`. Images: `public/assets/aboutPageImages/hobbyImages/*`, icons: `public/assets/aboutPage/hobbyIcons/*` |
| 6 | TechStack | `src/components/about/TechStack.tsx` | `TECH_STACK` (react-icons `Si*`, `Fa*`), `useIsDesktop`, `useIsTouch`, tap-to-toggle on touch |
| 7 | LocationSection | `src/components/about/LocationSection.tsx` | `public/assets/aboutPageImages/coimbatoreNorthMap.svg` |

---

## 5. Projects `/projects` and `/projects/[slug]`

**Data:** `src/data/projects.ts` → `interface Project`, `PROJECTS[]`.

| Slug | index | featured | Media | Repo |
|---|---|---|---|---|
| `codecritter` | 01 | ✔ | launch poster + 3 screenshots, `demo.mp4` (20 s) | public |
| `satsaathi` | 02 | ✔ | 3 screenshots (EN, HI landing; sign-in) | **private** (no `repoUrl`) |
| `periodyx` | 03 | ✔ | 4 jpgs (+ unused `01.gif`) | public |
| `gitpr-evaluation-env` | 04 | ✔ | `gitpr/01.png` | public |
| `skillsync` | 05 | — | 1 screenshot; no live URL | public |
| `googledocsmini` | 06 | — | 1 screenshot | public |
| `portfolio` | 07 | — | home + About captures | public |

`repoUrl` is optional: when absent, cards say "private repo", and the commit grid and JSON-LD `codeRepository` are skipped.

Listing page:

```
projects/page.tsx (server, metadata)
└─ ProjectsView (client, useState viewMode)
   ├─ ScrollProgressTracker
   ├─ ProjectsHero ──── GitHubActivityGrid ── useGitHubContributions ── /api/github (localStorage 24 h cache "gh-contributions-gql-v1")
   ├─ ViewToggle ────── [Grid] / [Marquee]
   └─ AnimatePresence
      ├─ ProjectsGrid ── ProjectCard (hover video preview; in-view autoplay on touch)
      └─ MarqueeProjects (two rows, 4× duplicated, 60 s linear loop)
```

Detail page:

```
projects/[slug]/page.tsx (server, SSG)
├─ ProjectDetailHero ── RepoActivityGrid ── useRepoActivity ── /api/github/repo (localStorage 24 h "gh-repo-<owner>-<repo>-v1")
├─ ProjectDetailBody ── Section (local) × problem/objective/approach/solution/achievement, scroll progress %
│                    └─ ProjectDetailMedia ── VideoPlayer (local), gallery, ImageLightbox, useScrollLock
└─ ProjectDetailNav ─── prev/next by array order (falls back to "All Projects")
```

Files: `src/components/projects/{ProjectsView,ProjectsHero,GitHubActivityGrid,ViewToggle,ProjectsGrid,ProjectCard,MarqueeProjects}.tsx`, `src/components/projects/project-detail/{ProjectDetailHero,ProjectDetailBody,ProjectDetailMedia,ProjectDetailNav,RepoActivityGrid}.tsx`.

---

## 6. Blogs `/blogs` and `/blogs/[slug]`

| Piece | File | Notes |
|---|---|---|
| Loader | `src/lib/mdx.ts` | `getBlogSlugs`, `getBlogBySlug`, `getAllBlogs` (date desc). Reads `src/content/blogs/*.mdx` with gray-matter. Defaults for missing frontmatter. |
| List UI | `src/components/blogs/BlogsLayout.tsx` | Search (title+excerpt), category chips (one swipeable row on phones), newest/oldest sort, grouped by month by default (`groupByMonth`, keyed on `YYYY-MM`) with a flat toggle. |
| Card | `src/components/blogs/BlogCard.tsx` | Suppresses navigation while text is selected. |
| Detail | `src/app/blogs/[slug]/page.tsx` | Headings parsed from raw markdown (`## `, `### `) → ids via `generateId`; custom `h2`/`h3`/`pre` MDX components; typography via arbitrary `[&_p]:` variants on `<article>`. |
| TOC | `src/components/blogs/BlogTOC.tsx` | Single IntersectionObserver; topmost visible heading wins. `lg+` only. |
| Code | `src/components/blogs/CodeBlock.tsx` | Copy button. (Different from the ProtoSem `CodeBlock`.) |

Posts (15): `the-architecture-of-modern-portfolio` (2026-07-24), `www-vs-internet` (2026-08-02), and 13 dated 2026-10-19: `the-infinite-hotel-paradox`, `the-mom-test`, `why-warm-countries-are-poorer`, `justice-sandel-lectures-1-6`, `india-at-50-arundhati-roy-salman-rushdie`, `hinduism-is-actually-cool`, `universe-25-calhoun`, `on-the-heights-of-despair`, `what-claude-thinks-beneath-the-surface`, `cisc-vs-risc-von-neumann-vs-harvard`, `spec-driven-development`, `github-actions-explained`, `how-a-tyre-company-invented-michelin-stars`. Each opens with its source link. Validate with `npm run check:blogs`.

---

## 7. ProtoSem `/protosem` and `/protosem/[slug]`

**Data:** `src/data/protosem.ts`

| Export | Meaning |
|---|---|
| `DOCUMENTED_WEEKS` (private) | Weeks with a real page: 0, 1, 7 |
| `PROTOSEM_WEEKS` | 20 weeks: documented + generated `makePlaceholder(id)` ("Coming Soon", status `upcoming`) |
| `PROGRAM_META` | company, location, paradigm, focus, `totalWeeks: 20`, `currentWeekId: 10` |
| `isDocumented(w)` | `status !== "upcoming"` — **the** gate for routability/clickability |
| `DOCUMENTED` | Filtered list (used by sitemap, timeline, WeekNavigation) |
| `PROGRESS_WEEKS`, `PROGRESS_PCT` | Derived from `currentWeekId` |

```
protosem/page.tsx
├─ ProtoSemHero ──── PROGRAM_META, PROGRESS_WEEKS, PROGRESS_PCT
└─ ProtoSemTimeline ─ TuxIcon (inline SVG travels with scroll), WeekCard, CardTag (Link vs div), UpcomingTail, StatusBadge

protosem/[slug]/page.tsx
├─ WEEK_CONTENT[slug]  (week-0 | week-1 | week-7)
└─ WeekNavigation ─── prev/next over DOCUMENTED
```

**Week page building blocks** — `src/components/protosem/weeks/blocks/` (barrel `index.ts`):

| Module | Exports |
|---|---|
| `WeekShell.tsx` | `WeekShell` — back link, status badge (from data), title, subtitle, divider, stagger column |
| `text.tsx` | `Prose`, `Term`, `WeekSection`, `ArrowList`, `Callout`, `CardGrid` (+`Card` type), `ChipRow` |
| `media.tsx` | `Figure`, `VideoFigure`, `Gallery` (→ `ImageLightbox`) |
| `technical.tsx` | `CodeBlock` (filename bar, copy, keyboard-scrollable), `SpecList`, `Pipeline`, `StatRow` |
| `motion.ts` | `EASE`, `fadeUp`, `stagger` |

| Week | File | Uses blocks? | Assets |
|---|---|---|---|
| 0 — Orientation & Reflection | `weeks/Week0Content.tsx` | Yes (WeekShell, WeekSection, Prose + local InlineLink/MoreLink) | `public/assets/protoSemPage/{personalityTest,zenComic}.png` |
| 1 — Tech-Talk & 5S | `weeks/Week1Content.tsx` | Yes (WeekShell, WeekSection, Prose, ArrowList, CardGrid, ChipRow, Callout) | — |
| 7 — IoT & Embedded Systems | `weeks/Week7Content.tsx` | Yes (fullest example: media + technical blocks) | `public/assets/protoSemPage/week7/*` (jpeg, mp4 + poster) |

---

## 8. Contact `/contact`

```
contact/page.tsx (server, metadata) — one-viewport shell when ≥ 48rem wide AND ≥ 40rem tall, scrollable otherwise
├─ <main> dark (--color-bg-dark)
│   └─ ContactHero
│       ├─ ContactClock ── live IST (Asia/Kolkata), 1 s tick
│       └─ ContactReveal ─ "( Let's talk ↗ )" → Email (`CONTACT_EMAIL`) + Instagram card
└─ social strip (CONTACT_SOCIALS: LinkedIn, GitHub, Instagram, Threads, Twitter)
```
Footer hidden here (ConditionalFooter); Navbar switches to `.nav-dark`.

---

## 9. Shared hooks & libs

| Module | Exports | Used by |
|---|---|---|
| `src/hooks/useMediaQuery.ts` | `useMediaQuery`, `useBreakpointUp/Down`, `useIsMobile` (<768), `useIsDesktop` (≥1024), `useIsTouch`, `usePrefersReducedMotion` | Most interactive components |
| `src/hooks/useScrollLock.ts` | `useScrollLock(locked)` | Navbar, ExpandedOverlay, ProjectDetailMedia, ImageLightbox |
| `src/hooks/useAssetLoader.ts` | `useAssetLoader` | LoaderScreen |
| `src/hooks/useGitHubContributions.ts` | `useGitHubContributions` | GitHubActivityGrid |
| `src/hooks/useRepoActivity.ts` | `useRepoActivity(repoUrl)` | RepoActivityGrid |
| `src/lib/scrollLock.ts` | `registerLenis`, `lockScroll`, `unlockScroll` (depth-counted) | LenisProvider, useScrollLock |
| `src/lib/breakpoints.ts` | `BREAKPOINTS`, `up()`, `below()` (−0.02px) | useMediaQuery |
| `src/lib/heroVideo.ts` | `HERO_VIDEO` (poster, desktop[], mobile[]) | HeroVideo |
| `src/lib/site.ts` | `SITE_URL` | layout (`metadataBase`, JSON-LD), sitemap, robots, `data/projects.ts` |
| `src/lib/mdx.ts` | `BlogPost`, `getBlogSlugs`, `getBlogBySlug`, `getAllBlogs` | blogs routes, sitemap, llms |
| `src/lib/seo.ts` | `pageMetadata()`, `ogImageUrl()`, `absoluteUrl()`, `SITE_NAME`, `AUTHOR` | every route, `/og`, JSON-LD |
| `src/lib/llms.ts` | `buildLlmsTxt()`, `llmsResponse()` | `/llms.txt`, `/llms-full.txt` |
| `src/components/seo/JsonLd.tsx` | `JsonLd` (escapes `<`) | layout, post and project pages |
| `src/lib/utils.ts` | `cn()` (clsx + tailwind-merge) | *unused today; kept because shadcn components (components.json) import it* |
| `src/components/ui/ImageLightbox.tsx` | `ImageLightbox` | ProjectDetailMedia, ProtoSem `Gallery` |
| `src/data/socials.ts` | `SOCIAL`, `HERO_SOCIALS`, `FOOTER_SOCIALS`, `CONTACT_SOCIALS`, `SAME_AS`, `CONTACT_EMAIL` | HeroStatic, AboutHero, GlobalFooter, contact page, ContactReveal, layout JSON-LD |

---

## 10. Window globals & events (cross-component state)

| Name | Writer | Reader | Purpose |
|---|---|---|---|
| `rsd:loaderDone` (CustomEvent) | LoaderScreen | MacMonitorSection, HeroVideo | Start fetching hero video after loader |
| `window.__rsd_loaderDone` | MacMonitorSection, HeroVideo | same | Event already fired (SPA return to home) |
| `window.__rsd_homeScrollY` | HorizontalProjectsSection | `saveHomeScroll()` | Live home scroll cache |
| `window.__rsd_restoreScrollY` | `saveHomeScroll()` (project-card exit) | LoaderScreen, ScrollResetOnRouteChange | One-shot restore request, deleted on use |
| `window.__rsd_lenis` | LenisProvider | console | Debug handle |
| `--loader-progress` CSS var | useAssetLoader | CSS | Loader progress |
| `localStorage` `gh-contributions-gql-v1`, `gh-repo-*-v1` | GitHub hooks | same | 24 h client cache |

---

## 11. Static assets (`public/`)

| Path | Used by |
|---|---|
| `hero.jpg`, `heroVideo.{webm,mp4}`, `heroVideoMobile.{webm,mp4}` | `lib/heroVideo.ts` |
| `assets/homePageImages/{macbook,iPhone14}.png` | MacMonitorSection |
| `assets/projects/<slug>/*` (incl. `codecritter/demo.mp4`) | `data/projects.ts` (`_shared/placeholder.jpg` is no longer referenced) |
| `assets/aboutPageImages/**`, `assets/aboutPage/hobbyIcons/*` | About sections |
| `assets/protoSemPage/**` | Week 0 / Week 7 |
| `assets/socialMediaIcons/*_icon.png` (incl. `leetcode_icon.png`) | HeroStatic, AboutHero, contact strip |
| `Sudharshan_R_Resume.pdf` | Navbar "Resume" |
| `logo.svg` | *not referenced in src* |
| `assets/projects/periodyx/01.gif` | *not referenced* (1.5 MB; candidate for the project's demo `video`) |

Repo-only (not served): `docs/blog-sources/*.md` — research notes for future blog posts.

---

## 12. Open TODOs

`TODO.md` is the source of truth. Open as of 2026-10-19:

1. **Real-phone check.** The emulated audit (`npm run audit:mobile`, with and without JS) passes on every route.
2. **Production `GITHUB_TOKEN`** on Vercel is rejected (live /projects reported GitHub 401). Owner must replace it.
3. **Google Search Console** verification and sitemap submission (owner).
4. **Demo videos** for every project except CodeCritter; more screenshots for SkillSync and Google Docs Mini.
5. **Domain move** to `sudharshan-r.dev` once bought.
6. **New hero montage** with `-KeepAudio`, then `HERO_VIDEO.hasAudio = true`.
7. **Owner review** of the 13 posts dated 2026-10-19.
8. **SatSaathi** (other repo): the Tamil landing headline overflows at 1440px.

Later: floating interactive pet; `Navbar.tsx` `WORDS` "Entrepreneur.". Dropped: dark mode.

---

## 13. Known inconsistencies

### Resolved (2026-10-19)

| # | Was | Fix |
|---|---|---|
| 1 | `https://rsd.exe` (non-resolvable) hard-coded in layout, about, protosem, robots, `portfolio.liveUrl` | All derive from `SITE_URL`; layout sets `metadataBase`, so page canonicals/OG URLs are relative (`"/about"`). |
| 2 | LoaderScreen preloaded non-existent `/assets/hero.jpg`; inline asset array restarted preload every render | Uses `HERO_VIDEO.poster` via module-level `LOADER_ASSETS`. |
| 3 | `gitpr-evaluation-env` reused `index: "03"`; pointed at placeholder although `gitpr/01.png` existed | Index `"05"`; uses `gitpr/01.png`. |
| 4 | `three`, `@react-three/fiber`, `gsap` installed but unused; README listed `next-video`, wrong dev/compress commands | Packages uninstalled; README tech stack + commands corrected. |
| 5 | `tsconfig.json` included missing `video.d.ts` | Removed. |
| 6 | `--color-accent` defined twice (project purple vs shadcn grey) | Project token renamed `--color-accent-main` (`bg-accent-main`); `--color-accent` is shadcn's. |
| 7 | Week 0 / Week 1 hand-rolled chrome + motion consts | Both built on `WeekShell` + `blocks/`. |
| 8 | `/projects`, `/contact` were client pages without metadata | Server pages with `metadata`; `/projects` interactivity in `ProjectsView`. No-op hover handlers on the contact strip removed. |
| 9 | Socials copied into 6 places | `src/data/socials.ts`. |
| 10 | `CountUp.tsx` unused | Deleted. |

### Still open

| # | Where | Observation |
|---|---|---|
| A | whole repo | `npm run lint` fails on a pre-existing baseline (37 errors, 34 warnings: `no-explicit-any`, `react-hooks/set-state-in-effect`, `no-unescaped-entities`, `static-components` in ProjectDetailMedia, unused vars). Build passes. Don't add to it; fix files as you touch them. |
| B | `public/logo.svg`, `public/assets/projects/periodyx/01.gif` | Unreferenced assets (kept; see §11). |
| D | Navbar | Link list is still written out twice (desktop + mobile overlay). |

### Fixed 2026-10-19 (second pass)

- **Hero reel never played** — `HeroVideo` checked `networkState === NETWORK_NO_SOURCE` right after inserting `<source>` elements, but inserting a source sets exactly that state synchronously while selection begins, so the component always fell back to the poster. Failure is now detected via `onError` on the last `<source>`.

### Fixed 2026-10-19 (third pass)

- **Every page claimed to be the homepage.** The root layout's `alternates.canonical: "/"` and `openGraph.url` were inherited by every route. Metadata now comes from `pageMetadata()` per route. `scripts/check-seo.mjs` went from 42 failures to 0, and now covers 29 URLs.
- **Project titles showed "— rsd.exe" twice** (explicit suffix plus the layout template).
- **No-JS render was blank** for project cards, the blog list and the footer, and the home loader never lifted. Fixed with `NO_JS_CSS`.
- **`skillsync.vercel.app` is an unrelated site.** The link is removed.
- **Production leaked a dev hint** ("GitHub 401 · Add GITHUB_TOKEN to .env.local"). Visitors now see a quiet fallback.
- **`next.config.ts` sent `immutable` for `/_next/static` in dev too**, pinning stale client code. The rule is removed, since Next handles production itself.
