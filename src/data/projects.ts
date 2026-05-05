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
  repoUrl:     string;        // GitHub repo URL
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
    slug:       "skillsync",
    index:      "01",
    title:      "SkillSync",
    category:   "Full Stack · Platform",
    year:       "2025",
    tagline:    "Where engineers find their people.",
    summary:    "A skill-based collaboration platform for engineering students. Smart matching, team workspaces, reputation system, and a project idea feed — built to solve the collaboration gap in Indian engineering colleges.",
    problem:    "Engineering students in India lack a structured way to find collaborators who complement their skill gaps. LinkedIn is too professional, WhatsApp groups are chaotic, and there's nothing purpose-built for project-stage collaboration between students. Good ideas die because the right people never find each other.",
    objective:  "Build a full-stack platform that matches engineering students based on skill complementarity — not just interests — with team workspaces, task management, and a reputation score that rewards actual contribution, not just profile completeness.",
    approach:   "Started with the matching engine — defining a skill graph where nodes are skills and edges are compatibility weights. Built the idea feed first (MVP), then layered in matching, workspaces, and reputation. Used JWT auth with refresh tokens, Zustand for client state, and MongoDB with indexed queries for skill lookups. Hosted on Vercel (frontend) + Render (backend).",
    solution:   "SkillSync lets students post project ideas, get matched with complementary collaborators, form teams in shared workspaces with Kanban task boards, and build a public reputation score based on completed projects and peer endorsements.",
    achievement:"Pitched to KCT College Incubator. Prototype live with complete feature set. Selected for incubator evaluation. 16-slide pitch deck and full technical report published.",
    techStack: [
      { category: "Frontend",   items: ["Next.js", "Tailwind CSS", "Zustand", "Framer Motion"] },
      { category: "Backend",    items: ["Node.js", "Express.js", "JWT", "REST API"] },
      { category: "Database",   items: ["MongoDB", "Mongoose"] },
      { category: "DevOps",     items: ["Vercel", "Render", "Docker"] },
    ],
    repoUrl:    "https://github.com/rsd-exe/skillsync",
    liveUrl:    "https://skillsync.vercel.app",
    status:     "Incubator pitch stage",
    completion: 72,
    images:     [
      "/assets/projects/skillsync/01.jpg",
      "/assets/projects/skillsync/02.jpg",
      "/assets/projects/skillsync/03.jpg",
    ],
    video:      "/assets/projects/skillsync/demo.mp4",
    featured:   true,
    tags:       ["full-stack", "platform", "education"],
  },
  {
    slug:       "dengue-prediction",
    index:      "02",
    title:      "Dengue Prediction",
    category:   "AI · Full Stack",
    year:       "2024",
    tagline:    "Predicting outbreaks before they spread.",
    summary:    "A district-level dengue outbreak prediction platform for Indian Tier-2 cities. Random Forest classifier, interactive Leaflet.js hotspot map, and a Flask API — giving health officials early warning before spikes happen.",
    problem:    "Dengue outbreak data in Indian Tier-2 cities is reactive. Health systems respond after spikes, not before. No district-level predictive tooling exists for early intervention — officials rely on lagging weekly reports that arrive too late to mobilize resources effectively.",
    objective:  "Build an AI web platform that predicts dengue outbreak risk at district level across Indian Tier-2 cities, with a visual hotspot map that health officials can actually use to allocate resources proactively.",
    approach:   "Used historical dengue case data + weather/climate features (rainfall, temperature, humidity) per district. Trained a Random Forest classifier with cross-validated accuracy. Built a Flask API to serve predictions. React frontend with Leaflet.js for the interactive map with color-coded risk zones.",
    solution:   "A web platform where health officials select a district and date range, receive a risk score (Low/Medium/High/Critical), see a hotspot map of surrounding districts, and can export reports. Predictions update weekly via batch inference.",
    achievement:"Six-member team project under Dr. Jeya Daisy's mentorship. Model achieved 87% accuracy on holdout set. Formal project report published. GitHub repo public.",
    techStack: [
      { category: "Frontend",   items: ["React.js", "Leaflet.js", "CSS3"] },
      { category: "Backend",    items: ["Python", "Flask", "REST API"] },
      { category: "ML",         items: ["scikit-learn", "Random Forest", "pandas", "NumPy"] },
      { category: "Data",       items: ["District health records", "IMD weather data"] },
    ],
    repoUrl:    "https://github.com/Sash07-sash/Dengue-Prediction-",
    status:     "Completed",
    completion: 100,
    images:     [
      "/assets/projects/dengue/01.jpg",
      "/assets/projects/dengue/02.jpg",
      "/assets/projects/dengue/03.jpg",
    ],
    video:      "/assets/projects/dengue/demo.mp4",
    featured:   true,
    tags:       ["ai", "machine-learning", "healthcare", "full-stack"],
  },
  {
    slug:       "portfolio",
    index:      "03",
    title:      "rsd.exe",
    category:   "Design · Frontend",
    year:       "2025",
    tagline:    "A portfolio that doesn't look like one.",
    summary:    "Personal portfolio designed and built from scratch. Every section, animation, and interaction is intentional — iMac scroll zoom, horizontal project browsing, depth gallery, and editorial typography throughout.",
    problem:    "Most student portfolios look identical — hero image, skills grid, project cards, contact form. The work gets lost in the template. A portfolio for a developer who cares about craft should itself demonstrate craft.",
    objective:  "Design and build a portfolio that reflects personality and technical range. No templates. Every decision — from the 4-font typographic system to the Lenis scroll interception — made deliberately.",
    approach:   "Started with a design system in globals.css (Tailwind v4 @theme tokens). Built the loader first, then each section as an independent component. Scroll interactions driven by Framer Motion useScroll + Lenis stop/start interception for the horizontal section.",
    solution:   "This site. Sections: animated loader with asset-synced progress, editorial hero with floating labels, iMac CSS zoom → fullscreen video, identity statement, horizontal project scroll with expand overlay, and a multi-depth parallax gallery on the about page.",
    achievement:"End-to-end — concept, design system, component architecture, development. No template used.",
    techStack: [
      { category: "Framework",  items: ["Next.js 16", "TypeScript"] },
      { category: "Styling",    items: ["Tailwind CSS v4", "CSS Custom Properties"] },
      { category: "Animation",  items: ["Framer Motion v12", "Lenis v1.3"] },
      { category: "Fonts",      items: ["Cormorant Garamond", "DM Mono", "Instrument Serif"] },
    ],
    repoUrl:    "https://github.com/rsd-exe/portfolio",
    liveUrl:    "https://rsd.exe",
    status:     "Ongoing",
    completion: 85,
    images:     [
      "/assets/projects/portfolio/01.jpg",
      "/assets/projects/portfolio/02.jpg",
      "/assets/projects/portfolio/03.jpg",
    ],
    featured:   true,
    tags:       ["design", "frontend", "portfolio"],
  },
  {
    slug:       "gitpr-evaluation-env",
    index:      "04",
    title:      "GitPREvaluation Env",
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
      "/assets/projects/gitpr/01.jpg",
      "/assets/projects/gitpr/02.jpg",
      "/assets/projects/gitpr/03.jpg",
    ],
    featured:   false,
    tags:       ["ai", "reinforcement-learning", "multi-agent", "hackathon"],
  },
];
