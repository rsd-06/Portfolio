# rsd.exe — Portfolio

A modern, design-driven showcase of full-stack engineering, creative coding, and AI project development by Sudharshan R. 

![Portfolio Preview](/public/assets/projects/portfolio.jpg)

## ⚡ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Smooth Scrolling:** Lenis
- **Language:** TypeScript
- **Icons:** React Icons

## ✨ Key Features

- **Premium Editorial Aesthetic:** Carefully curated typography (Cormorant Garamond, DM Mono, Instrument Serif, Inter) with a minimalist, content-first layout.
- **Cinematic Scroll Sequences:** Custom-built native CSS sticky + scroll-driven horizontal carousels for Featured Projects and Tech Stack sections, providing buttery smooth 60fps performance without scroll-trapping bugs.
- **Interactive 3D Elements:** Complex spatial UI elements including immersive photo galleries and interactive hardware mockups.
- **Live GitHub Integration:** Dynamic fetching and visualization of real-time GitHub contribution graphs and repository activity.
- **Optimized Assets:** Smartly loaded `.webp` images, localized videos, and performant SVG rendering using CSS masks and `content-visibility: auto`.

## 🚀 Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Directory Structure

- `src/app/` — Next.js App Router pages and layout configuration.
- `src/components/` — Modular React components.
  - `/home/` — Components specific to the landing page (Hero, Horizontal Projects, Identity Statement).
  - `/about/` — Components for the About page (Tech Stack, Interactive Map, Philosophy).
  - `/projects/` — Components for the projects listing and GitHub activity integration.
  - `/global/` — Shared UI elements like Navigation, Footer, and Custom Cursors.
  - `/providers/` — Global context providers (Lenis smooth scroll).
- `src/data/` — Static data stores for projects and configuration.
- `public/assets/` — Centralized storage for all static media (images, videos, SVGs).

## 👨‍💻 Author

**Sudharshan R**  
Aspiring SDE | Full-Stack Developer | Creative Coder

- Website: [rsd.exe](https://rsd.exe)
- GitHub: [@rsd-exe](https://github.com/rsd-exe)
