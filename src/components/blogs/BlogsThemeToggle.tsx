// src/components/blogs/BlogsThemeToggle.tsx
"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { BLOGS_THEME_KEY } from "@/lib/blogsTheme";

// The theme lives on <html data-blogs-theme="dark">, so the navbar and page
// background flip with the list. The root layout sets it before first paint
// on /blogs; this component keeps it in sync and removes it when the reader
// leaves, so no other page ever renders dark.
const root = () => document.documentElement;
const isDark = () => root().dataset.blogsTheme === "dark";
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ["data-blogs-theme"] });
  return () => observer.disconnect();
};

function apply(dark: boolean) {
  if (dark) root().dataset.blogsTheme = "dark";
  else delete root().dataset.blogsTheme;
}

export default function BlogsThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  useEffect(() => {
    // Client-side navigation to /blogs skips the layout's pre-paint script.
    try {
      apply(localStorage.getItem(BLOGS_THEME_KEY) === "dark");
    } catch {
      // Storage blocked: stay light.
    }
    return () => apply(false);
  }, []);

  const toggle = () => {
    apply(!dark);
    try {
      localStorage.setItem(BLOGS_THEME_KEY, dark ? "light" : "dark");
    } catch {
      // Storage blocked: the choice lasts for this visit only.
    }
  };

  const Icon = dark ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      className="inline-flex items-center gap-2.5 f-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-[color-mix(in_srgb,var(--color-text)_20%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-text)_6%,transparent)] transition-colors"
    >
      <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
      {dark ? "Light mode" : "Dark mode"}
    </button>
  );
}
