[] Verify on a real phone. `npm run audit:mobile` renders every route at
   375x812 in headless Edge and passes (no overflow, nothing stuck invisible,
   also with JavaScript off), but emulation is not a device: check touch
   scrolling, the pinned MacMonitor zoom and the Hobbies carousel by hand.

[] Fix the production GitHub token. The live /projects page reports
   "GitHub 401": GITHUB_TOKEN on Vercel is missing or expired (the local one
   works). Update it in Vercel → Settings → Environment Variables, then
   redeploy. Visitors now see a quiet "unavailable" line instead of the error.

[] Submit to Google: the verification meta tag is in src/app/layout.tsx.
   Click Verify in Search Console, then submit
   https://sudharshan-r.vercel.app/sitemap.xml. For Bing (Edge, DuckDuckGo),
   import the site from Search Console in Bing Webmaster Tools. Re-run `npm run check:seo`
   against production after each deploy.

[] Google Docs Mini demo: two accounts editing one document side by side.
   Needs you to sign in, once:
     GDM_SETUP=1 npm run demo:record -- googledocsmini
   opens two Edge windows on saved profiles (D:\dev-tools\demo-profiles).
   Sign into a different account in each, put both in one Clerk organisation,
   switch both to it, create a document there, close the windows. Then:
     GDM_DOC=<document url> npm run demo:record -- googledocsmini
   and add video + the two new stills to the googledocsmini entry.

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

[] SatSaathi: commit the landing fixes sitting in the sat_saathi working tree
   (Tamil headline overflow at 1440px and on phones, phone header overflow,
   jammed example-trace rows). They are mixed into your uncommitted landing
   restyle, so they were left for you to commit with it.

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
[x] Post sources: YouTube embeds and article cards at the end of posts
[x] Post footer nav: previous left, back to blogs centred, next right
[x] SatSaathi repo public: linked, with its commit grid
[x] Demo videos + stills: SatSaathi, PeriodyX, PR Eval, SkillSync, rsd.exe
    (npm run demo:record); SkillSync screenshots from a local run
