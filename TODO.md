[] Verify on a real phone. `npm run audit:mobile` renders every route at
   375x812 in headless Edge and passes (no overflow, nothing stuck invisible,
   also with JavaScript off), but emulation is not a device: check touch
   scrolling, the pinned MacMonitor zoom and the Hobbies carousel by hand.

[] Fix the production GitHub token. The live /projects page reports
   "GitHub 401": GITHUB_TOKEN on Vercel is missing or expired (the local one
   works). Update it in Vercel → Settings → Environment Variables, then
   redeploy. Visitors now see a quiet "unavailable" line instead of the error.

[] Submit to Google: add the site in Search Console (Domain or URL-prefix
   property), set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION on Vercel, then submit
   https://sudharshan-r.vercel.app/sitemap.xml. Re-run `npm run check:seo`
   against production after each deploy.

[] Demo videos for the remaining projects (Project.video). CodeCritter has its
   launch video; SatSaathi, PeriodyX, PR Eval, SkillSync, Google Docs Mini and
   rsd.exe need a 15–30 s screen recording each (needs real usage, e.g. a
   signed-in walkthrough). Encode small: 720p H.264, no audio.

[] SkillSync and Google Docs Mini have one screenshot each. SkillSync has no
   live deployment of its own (skillsync.vercel.app belongs to an unrelated
   site, so the link was removed); Google Docs Mini's live site only shows a
   Clerk sign-in in development mode. Capture in-app screenshots when signed in.

[] Switch the domain to sudharshan-r.dev once bought: add it in Vercel →
   Domains, set NEXT_PUBLIC_BASE_URL=https://sudharshan-r.dev (or change the
   fallback in src/lib/site.ts), redirect sudharshan-r.vercel.app and
   rsd-exe.vercel.app to it. Later: hello@sudharshan-r.dev via Cloudflare
   Email Routing → rsudharshan2006@gmail.com.

[] New hero video edit (15–20 s montage): encode with
   `npm run compress-video -- -InputPath <master> -KeepAudio`, refresh
   public/hero.jpg, then set hasAudio: true in src/lib/heroVideo.ts so the
   "sound on" button appears.

[] Review the 13 new blog posts before publishing (src/content/blogs/, dated
   2026-10-19). They were drafted from the sources listed in each post and
   spot-checked against them, but they are in your voice: confirm the personal
   lines ("what I take from it") say what you actually think.

[] SatSaathi UI bug (in the sat_saathi repo, not here): the Tamil landing
   headline overflows under the image at 1440px wide.

--- later ---
[] Floating interactive pet (in the spirit of Meta's "dots"). Small, clean and
   subtle; reacts to interaction — a few taps and it looks hurt, keep hitting
   it and it gets offended, and so on. Later stage: give it knowledge about me
   so it can answer questions.
[] Navbar WORDS: add "Entrepreneur." when I start something of my own.

--- done ---
[x] Blogs slug component tracks sub headings and marks the side index
[x] Back to Previous Blog link on blog pages
[x] Scroll Down Hint on the Home Screen working and placed properly
[x] Dark mode: dropped. The unreachable .dark tokens were removed instead.
[x] Overall scroll sensitivity reduced (Lenis wheelMultiplier 0.75)
[x] Featured rail: ~1 card per flick (RAIL_SCROLL_RATIO 1.6)
[x] LeetCode in the home and About hero icon rows and JSON-LD
[x] SEO: per-page canonicals (every page used to claim "/"), OG images,
    BlogPosting / SoftwareSourceCode / Person / WebSite JSON-LD, full sitemap
[x] LLM visibility: /llms.txt and /llms-full.txt, AI crawlers allowed,
    content readable without JavaScript
[x] Content no longer depends on framer-motion running (noscript fallback)
[x] Tech stack: PyTorch, Hugging Face, Scikit-learn, Pandas, W&B, Rust,
    Tauri, PostgreSQL, Vercel, Figma, Claude Code
[x] Blogs grouped by month by default (toggle to flat)
[x] 13 new blog posts from the "Portfolio Blogs" list
[x] CodeCritter and SatSaathi added and featured; SkillSync and rsd.exe
    un-featured; all placeholder images replaced
[x] Mobile pass: all routes clean at 375px (npm run audit:mobile)
[x] Project moved to D:\Projects\Portfolio
