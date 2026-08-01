<div align="center">
  <h1>rsd.exe — Portfolio</h1>
  <p>Building through Software</p>
  
  <p align="center">
    A highly optimized, interactive, and modern portfolio showcasing my journey as a Full-Stack Developer, Machine Learning enthusiast, and Project-Based Learner.
  </p>
</div>

<br />

## 🌟 Introduction

Welcome to the source code of **[rsd.exe](https://rsd.exe)**! This portfolio is designed to be more than just a resume—it's a digital reflection of my design philosophy, engineering skills, and my continuous learning journey (including my time at KCT and the ProtoSem ASADI apprenticeship).

## 🎨 Design Philosophy & Inspiration

The site is built with a deep appreciation for **minimalism, bold typography, and smooth micro-interactions**. 
- **Aesthetic:** Clean, slightly brutalist but highly polished. It uses a carefully selected monochromatic/off-white color palette contrasted with striking deep typography and fluid WebGL gradient backgrounds.
- **Inspiration:** Heavily inspired by modern Awwwards-winning sites, Apple's product landing pages, and sleek developer portfolios. It emphasizes a cinematic feel—especially the opening loader sequence which serves as a memorable entrance rather than just a loading spinner.
- **Performance First:** Despite the heavy visual elements (custom fonts, WebGL shaders, and high-quality video), the architecture is optimized for near-instant Largest Contentful Paint (LCP) through smart asset deferral, lazy loading, and aggressive media compression.

## 💻 Tech Stack

This project leverages a cutting-edge modern web stack:

- **Framework:** [Next.js (v16.1.6)](https://nextjs.org/) — App Router architecture, Server Components, and static generation.
- **UI Library:** [React (v19)](https://react.dev/)
- **Styling:** [Tailwind CSS (v4)](https://tailwindcss.com/) with `clsx` and `tailwind-merge`.
- **Animations & Scrolling:** 
  - [Framer Motion](https://www.framer.com/motion/) — For layout animations, page transitions, and complex UI micro-interactions.
  - [Lenis](https://lenis.studiofreight.com/) — For buttery-smooth, native-feeling smooth scrolling.
  - [GSAP](https://gsap.com/) — For specialized timeline animations.
- **3D & WebGL:** 
  - [Three.js](https://threejs.org/) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/)
  - [OGL](https://github.com/oframe/ogl) — For lightweight WebGL shaders (the Grainient background).
- **Content:** `next-mdx-remote` and `gray-matter` for parsing markdown blogs/projects.
- **Icons & Assets:** `lucide-react`, `react-icons`, and `next-video` for seamless video handling.
- **Analytics:** Vercel Analytics & Speed Insights.

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── about/            # About page (Server Component)
│   ├── blogs/            # Markdown-driven blog system
│   ├── contact/          # Contact page and forms
│   ├── projects/         # Portfolio projects gallery
│   ├── protosem/         # (ProtosemDev branch) ASADI Apprenticeship logs
│   ├── layout.tsx        # Global layout, fonts, and SEO JSON-LD
│   └── page.tsx          # Home page entry
├── components/           # Reusable UI components
│   ├── home/             # Home page specific sections (Loader, Hero, etc.)
│   ├── ui/               # Generic UI elements (buttons, inputs)
│   └── ...
├── data/                 # Static data (projects, timelines, etc.)
├── hooks/                # Custom React hooks (e.g., useAssetLoader)
└── lib/                  # Utilities and helper functions
public/                   # Static assets (images, highly compressed WebM/MP4 videos)
```

## 🛠️ Helpful Commands

Here is a quick reference for common tasks in this repository:

### Start the Development Server
```bash
npm run dev
```
> *Note: This command also runs `next-video sync` in the background.*

### Compress a New Hero Video
If you ever change the placeholder hero video, drop the new raw `.mp4` into the `/public` directory (named `heroVideo.mp4` or `heroVideoMobile.mp4`) and run:
```bash
npm run compress-video
```
> *This automatically invokes FFmpeg via a PowerShell script to generate highly compressed WebM and MP4 formats, reducing a 64MB video to ~8MB for lightning-fast loading.*

### Build for Production
```bash
npm run build
```

### Run the Linter
```bash
npm run lint
```

---

<p align="center">
  <i>Designed and developed by <a href="https://github.com/rsd-06">Sudharshan R</a>.</i>
</p>
