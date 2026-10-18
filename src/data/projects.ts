import { SITE_URL } from "@/lib/site";

export interface Project {
  slug:        string;
  index:       string;        // "01", "02", "03"...
  title:       string;
  category:    string;        // "Full Stack · Platform"
  year:        string;
  tagline:     string;        // short, italic quote
  summary:     string;        // 2-3 sentence overview
  problem:     string;        // detailed problem statement
  objective:   string;        // what was built and why
  approach:    string;        // how it was built — decisions made
  solution:    string;        // what the solution does
  achievement: string;        // outcomes, results, recognition
  techStack: {
    category: string;         // "Frontend", "Backend", "Database", etc.
    items: string[];
  }[];
  repoUrl?:    string;        // GitHub repo URL; omit for private repos (a link would 404 for visitors)
  liveUrl?:    string;        // Live demo if available
  status:      string;        // "Completed" | "Ongoing" | "Incubator"
  completion:  number;        // 0-100
  images:      string[];      // Array of image paths (min 3)
  video?:      string;        // Optional video path
  featured:    boolean;       // shown on home page featured section
  tags:        string[];      // for filtering
}

export const PROJECTS: Project[] = [
  {
    slug:       "codecritter",
    index:      "01",
    title:      "CodeCritter",
    category:   "Desktop App · Developer Tools",
    year:       "2026",
    tagline:    "Your code has a new co-worker.",
    summary:    "A free, open-source pixel companion that lives on your desktop, watches you code and reacts to your AI coding agents — thinking along while Claude Code or Codex works, celebrating when they finish, and nudging you to stretch and drink water.",
    problem:    "Coding with AI agents means long stretches of waiting with no ambient signal of what the agent is doing, and long sessions at the keyboard with no reminders to take care of yourself. Desktop pets exist, but none were built for developers or open source, and most ask for more trust than a toy deserves.",
    objective:  "Build a tiny, delightful, privacy-respecting desktop companion that reacts to typing, the cursor and coding agents, works across Windows, macOS and Linux, and installs with one click — without ever recording what you type.",
    approach:   "A Tauri 2 app: a Rust shell around a TypeScript, Canvas and React front end, with all behaviour logic written as pure, unit-tested TypeScript. Agents report thinking, tool, done, error and attention events to a loopback-only HTTP endpoint guarded by a per-user token; idempotent one-click installers (with backups and clean uninstall) wire up Claude Code, Codex CLI, Cursor, Gemini CLI, Antigravity, Kiro, Copilot CLI and OpenCode. Characters are built from small pixel-grid parts and palettes, so colours are fully customisable.",
    solution:   "Five characters (Stitch, Yoda, Mavis, plus an original Cat and Dog) with 18 expressions each: eye-follow across monitors, mochi drag-and-fling, purring pets, keyboard kneading, an overheat state for fast typing, stretch and water reminders, a Pomodoro timer, scheduled messages, a peek mode that hides during fullscreen apps, and a thought bubble while your agent works.",
    achievement:"Released v0.2.1 for Windows, macOS and Linux with a ~2 MB Windows installer and signed auto-updates. Privacy by design: key counts only, no telemetry, no outbound network beyond the loopback server.",
    techStack: [
      { category: "Desktop",    items: ["Tauri 2", "Rust"] },
      { category: "Frontend",   items: ["TypeScript", "React", "Canvas"] },
      { category: "Tooling",    items: ["Vite", "Vitest", "Python (Pillow)"] },
      { category: "Distribution", items: ["GitHub Releases", "Vercel"] },
    ],
    repoUrl:    "https://github.com/rsd-06/codecritter",
    liveUrl:    "https://codecritter.vercel.app",
    status:     "Released",
    completion: 90,
    images:     [
      "/assets/projects/codecritter/01.jpg",
      "/assets/projects/codecritter/02.png",
      "/assets/projects/codecritter/03.png",
      "/assets/projects/codecritter/04.png",
    ],
    video:      "/assets/projects/codecritter/demo.mp4",
    featured:   true,
    tags:       ["desktop-app", "developer-tools", "ai-agents", "tauri", "open-source"],
  },
  {
    slug:       "satsaathi",
    index:      "02",
    title:      "SatSaathi",
    category:   "AI · Remote Sensing",
    year:       "2026",
    tagline:    "Ask the satellite, in your language.",
    summary:    "An interactive vision-language assistant for satellite imagery — Team MidDevz's Smart India Hackathon 2026 entry for ISRO's SatQuery AI problem. Upload a scene, ask a question in English, Hindi, Tamil or Bangla, and get an answer measured from the pixels with every step shown.",
    problem:    "Answering questions from satellite imagery — how far a flood spread, what changed between two dates — usually needs GIS expertise and English-only tools. For officials acting on those answers, a bare number isn't enough: every result has to be traceable to how it was computed.",
    objective:  "Build a multilingual assistant where anyone can upload multimodal remote-sensing imagery, ask in their own language, and get an answer whose full derivation is persisted and exportable as an auditable trace.",
    approach:   "Spec-first: a written architecture spec and phase-by-phase plans before code. A monorepo with a Next.js web app, a FastAPI API, Celery workers, PostgreSQL/PostGIS, Redis and TiTiler for map tiles. Every query is a Job that passes through a fixed eight-step pipeline (ask, imagery, understand, preprocess, compute, vision-language, verify, answer), each step recording its tool, parameters, timing and output. Model-backed steps sit behind a stable tool interface so real weights drop in without touching the rest; full en/hi/ta/bn localisation is shared by the UI and the exported reports.",
    solution:   "Working end to end: image upload with raster inspection and compatibility checks, spectral indices, jobs streamed live over SSE with a step-by-step trace, GeoJSON and trace export, multi-temporal change detection with cross-modal validation, Google sign-in and per-account isolation, all in four languages.",
    achievement:"In active development for SIH 2026: the platform, pipeline runner, API and four-language interface are in place, with CI running lint, type checks, tests and a full compose health check. The vision-language model steps are being wired into the tool seam next.",
    techStack: [
      { category: "Frontend",   items: ["Next.js", "Tailwind CSS", "next-intl", "Lenis"] },
      { category: "Backend",    items: ["FastAPI", "Celery", "Python", "SSE"] },
      { category: "Geo / Data", items: ["PostGIS", "rasterio", "TiTiler", "Redis"] },
      { category: "DevOps",     items: ["Docker Compose", "GitHub Actions", "uv", "pnpm + Turborepo"] },
    ],
    status:     "In Progress",
    completion: 55,
    images:     [
      "/assets/projects/satsaathi/01.jpg",
      "/assets/projects/satsaathi/02.jpg",
      "/assets/projects/satsaathi/03.jpg",
    ],
    featured:   true,
    tags:       ["ai", "remote-sensing", "multilingual", "fastapi", "hackathon"],
  },
  {
    slug:       "periodyx",
    index:      "03",
    title:      "PeriodyX Exoplanet Pipeline",
    category:   "Machine Learning · Astronomy",
    year:       "2026",
    tagline:    "AI-enabled Detection of Exoplanets from Noisy Astronomical Light Curves",
    summary:    "An end-to-end machine learning pipeline that detects exoplanets from raw astronomical light curves, prioritizing physical priors over black-box models to avoid data leakage.",
    problem:    "Astronomical ML pipelines are highly susceptible to data leakage. Existing systems often rely on proprietary vetting flags which the model memorizes rather than learning astrophysics, leading to artificially high baseline scores that plummet on real unvetted data.",
    objective:  "Build a robust, interpretable, end-to-end machine learning pipeline to detect exoplanets strictly avoiding data leakage and prioritizing physical priors over black-box shape matching.",
    approach:   "Engineered a v5 Two-Stage XGBoost classifier. Detrended signals with Wotan, searched for periodicity with BLS/TLS, and extracted physically interpretable priors (stellar density ratio using Kepler's Third Law, centroid motion). Segmented the problem into Transit vs. Not Transit, then Blend vs. EB vs. Other.",
    solution:   "A full-stack web application (FastAPI backend + Vanilla JS frontend) deployed on Hugging Face Spaces. It processes real Kepler/TESS light curves or synthetic data, runs the 7-stage pipeline, and returns physical diagnostics with bootstrap uncertainty bounds.",
    achievement:"Achieved a held-out test accuracy of ~74% (F1-macro 0.67) while rigorously preventing data leakage, proving that physical priors like centroid motion outperform pure geometric shape features.",
    techStack: [
      { category: "Frontend",   items: ["HTML/CSS/JS", "Figma"] },
      { category: "Backend",    items: ["FastAPI", "Python", "Uvicorn"] },
      { category: "ML / Data",  items: ["XGBoost", "Scikit-learn", "Lightkurve", "Wotan", "Pandas", "Numpy"] },
      { category: "DevOps",     items: ["Hugging Face Spaces", "Docker", "GitHub"] },
    ],
    repoUrl:    "https://github.com/rsd-06/periodyx-exoplanet-pipeline",
    liveUrl:    "https://huggingface.co/spaces/rsd-06/periodyx-exoplanet-pipeline?logs=container",
    status:     "Completed",
    completion: 100,
    images:     [
      "/assets/projects/periodyx/01.jpg",
      "/assets/projects/periodyx/02.jpg",
      "/assets/projects/periodyx/03.jpg",
      "/assets/projects/periodyx/04.jpg",
    ],
    featured:   true,
    tags:       ["machine-learning", "astrophysics", "python", "fastapi", "pipeline"],
  },
  {
    slug:       "gitpr-evaluation-env",
    index:      "04",
    title:      "PR Evaluation Env & Model Training",
    category:   "AI · Reinforcement Learning",
    year:       "2026",
    tagline:    "PR descriptions describe the feature. Never the flaw.",
    summary:    "An RL benchmark environment where LLM agents act as senior code reviewers, catching accidental regressions in Pull Requests. Built for the Meta × Scaler OpenEnv Hackathon 2026 with 45 PR entries across 3 difficulty tiers, a multi-agent pipeline, and curriculum learning.",
    problem:    "Every day, developers merge Pull Requests that introduce accidental regressions — unintentional defects entirely unrelated to the feature being shipped. A developer adds Stripe integration and accidentally leaves a hardcoded API key. An ML engineer adds gradient clipping but places it after the optimizer step, rendering it useless. These bugs are invisible in isolation and require a reviewer who understands not just what the code does, but what it interacts with across the existing system.",
    objective:  "Turn the real-world PR code review challenge into a rigorous RL benchmark. Build an environment where LLM agents must distinguish clean PRs from flagged ones, identify the exact defect type and faulty line, and reason across proposed changes and existing system context to catch integration-level regressions.",
    approach:   "Designed a single-step episode RL loop (POST /reset → agent receives observation → POST /step → reward). Built 45 PR entries across Easy/Medium/Hard tiers. Grading is fully deterministic and programmatic — zero LLM judges (RLVR). Implemented a GuardSuite with KeywordStuffingDetector, RepetitionDetector, and TimingGuard to prevent reward hacking. Trained Qwen2.5-1.5B-Instruct using GRPO with Curriculum Learning over 400 steps on A10G/A100.",
    solution:   "PRRegressionAuditEnv: a FastAPI-based RL environment with a 4-agent pipeline (SafetyGateAgent → DefectLocatorAgent → ReviewerRouterAgent → ReviewCommentAgent), live curriculum phase tracking, a Hugging Face Space dashboard, and two trained adapter checkpoints. V2 model achieved 68.7% on Easy, 53% on Medium, and 41.75% on Hard — vs baseline scores of 35.97%, 17.33%, 18.24%.",
    achievement:"Built and deployed at the Meta × Scaler OpenEnv Hackathon 2026. V2 GRPO model trained with Curriculum Learning improved Hard-tier performance by 2.3× over the untrained baseline. Live environment deployed on Hugging Face Spaces. Two public GRPO training datasets and two trained adapter checkpoints published.",
    techStack: [
      { category: "AI / RL",    items: ["GRPO", "Curriculum Learning", "Qwen2.5-1.5B", "RLVR"] },
      { category: "Backend",    items: ["Python", "FastAPI", "Docker", "Uvicorn"] },
      { category: "Infra",      items: ["Hugging Face Spaces", "Weights & Biases", "Groq API"] },
      { category: "Multi-Agent", items: ["SafetyGateAgent", "DefectLocatorAgent", "ReviewerRouterAgent", "ReviewCommentAgent"] },
    ],
    repoUrl:    "https://github.com/rsd-06/GitPRTriageEnv",
    liveUrl:    "https://huggingface.co/spaces/rsd-06/PRRegressionAuditEnv",
    status:     "Completed",
    completion: 100,
    images:     [
      "/assets/projects/gitpr/01.png",
    ],
    featured:   true,
    tags:       ["ai", "reinforcement-learning", "multi-agent", "hackathon"],
  },
  {
    slug:       "skillsync",
    index:      "05",
    title:      "SkillSync",
    category:   "B2B SaaS · Student Platform",
    year:       "2025",
    tagline:    "Where Ideas find their People.",
    summary:    "A closed-loop collaboration platform for engineering students to discover ideas, match based on skills, and execute projects in shared workspaces.",
    problem:    "Every semester, capable students face a disconnect: idea-rich students lack technical partners, skill-rich students lack meaningful projects, and teams operate across fragmented tools with no shared context. Existing platforms like LinkedIn or WhatsApp are too broad or unstructured.",
    objective:  "Build an institution-scoped, skill-indexed, idea-first platform that serves a student's full collaboration lifecycle—from idea discovery to project completion—within a single institution.",
    approach:   "Designed a three-layer architecture: a skill-indexed social feed for discovery, an algorithmic matching engine based on skill overlap, and a lightweight project execution workspace. Engineered for a multi-stage rollout starting with a pilot at KCT.",
    solution:   "A platform where students post ideas, get matched with peers by skill overlap, form teams, and execute projects using built-in team chat, task boards, and GitHub linking. Future iterations will include ML-based matching and a talent marketplace.",
    achievement:"Incubator presentation delivered for KCT Pilot. Developed a comprehensive business model, GTM strategy, and monetization plan targeting Indian Tier-2 cities.",
    techStack: [
      { category: "Frontend",   items: ["Next.js", "Tailwind CSS", "Zustand", "Framer Motion"] },
      { category: "Backend",    items: ["Node.js", "Express.js", "JWT", "Socket.io"] },
      { category: "Database",   items: ["MongoDB", "Mongoose"] },
      { category: "DevOps",     items: ["Vercel", "Render"] },
    ],
    repoUrl:    "https://github.com/rsd-06/skillsync",
    status:     "Concept / Pre-MVP",
    completion: 45,
    images:     [
      "/assets/projects/skillsync/01.png",
    ],
    featured:   false,
    tags:       ["full-stack", "platform", "saas", "education"],
  },
  {
    slug:       "googledocsmini",
    index:      "06",
    title:      "Google Docs Mini",
    category:   "Full Stack · Real-Time Platform",
    year:       "2024",
    tagline:    "A real-time collaborative document editor.",
    summary:    "A full-stack, real-time collaborative document editor inspired by Google Docs. Built to deeply learn modern web engineering, real-time systems, and scalable app architecture.",
    problem:    "Building a real-time collaborative editor requires robust synchronization, conflict resolution, and organization-based document access. Standard CRUD architectures break down when dealing with real-time cursors, presence, and live text editing.",
    objective:  "Build a cloud-based document editor that allows users to create, manage, and collaborate in real time with rich text editing, live cursors, and secure organization-based access control.",
    approach:   "Leveraged Next.js App Router and Server Components. Integrated Clerk for authentication and organization isolation. Used Convex as the real-time database to handle secure queries and mutations. Built the collaboration layer with Liveblocks for presence and TipTap for robust rich-text editing.",
    solution:   "A secure platform where authenticated users can create documents within their organizations, edit them with live multi-user collaboration (showing cursors in real time), and format rich text—all persisted instantly to the cloud.",
    achievement:"Fully functional real-time application deployed on Vercel with real-time auth flows, organization-based access control, and a fully typed TypeScript codebase.",
    techStack: [
      { category: "Frontend",   items: ["Next.js", "React", "Tailwind CSS", "TipTap", "Zustand"] },
      { category: "Backend",    items: ["Convex", "Liveblocks", "Clerk Auth"] },
      { category: "UI / Tools", items: ["shadcn/ui", "Radix UI", "nuqs"] },
      { category: "Infra",      items: ["Vercel", "TypeScript"] },
    ],
    repoUrl:    "https://github.com/rsd-06/googleDocsMini",
    liveUrl:    "https://google-docs-mini.vercel.app/",
    status:     "Completed",
    completion: 100,
    images:     [
      "/assets/projects/googleDocsClone/01.png",
    ],
    featured:   false,
    tags:       ["real-time", "full-stack", "collaboration", "saas"],
  },
  {
    slug:       "portfolio",
    index:      "07",
    title:      "rsd.exe",
    category:   "Design · Frontend",
    year:       "2025",
    tagline:    "A portfolio that doesn't look like one.",
    summary:    "A modern, design-driven showcase of full-stack engineering, creative coding, and AI project development. Every section, animation, and interaction is intentional.",
    problem:    "Most student portfolios look identical—hero image, skills grid, project cards, contact form. The work gets lost in the template. A portfolio for a developer who cares about craft should itself demonstrate craft.",
    objective:  "Design and build a portfolio that reflects personality and technical range. No templates. Every decision—from the typographic system to the seamless page transitions—must be made deliberately.",
    approach:   "Started with a robust design system utilizing Tailwind v4. Built cinematic scroll sequences using native CSS sticky positioning and Framer Motion's scroll-driven animations for buttery smooth 60fps performance without scroll-trapping bugs.",
    solution:   "A premium editorial experience featuring an animated loader, an iMac CSS zoom to fullscreen video, dynamic GitHub contribution integration, horizontal project scrolling, and immersive spatial UI elements.",
    achievement:"Designed and engineered end-to-end. Built custom hooks for real-time GitHub activity tracking and engineered highly optimized SVGs and layouts.",
    techStack: [
      { category: "Framework",  items: ["Next.js 16", "TypeScript"] },
      { category: "Styling",    items: ["Tailwind CSS v4", "CSS Custom Properties"] },
      { category: "Animation",  items: ["Framer Motion", "Lenis"] },
      { category: "Fonts",      items: ["Cormorant Garamond", "DM Mono", "Instrument Serif"] },
    ],
    repoUrl:    "https://github.com/rsd-06/Portfolio",
    liveUrl:    SITE_URL,
    status:     "Ongoing",
    completion: 95,
    images:     [
      "/assets/projects/portfolio/01.png",
      "/assets/projects/portfolio/02.jpg",
    ],
    featured:   false,
    tags:       ["design", "frontend", "portfolio"],
  },
];
