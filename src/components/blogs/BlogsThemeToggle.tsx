// src/components/blogs/BlogsThemeToggle.tsx
"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { BLOGS_THEME_KEY, postThemeKey } from "@/lib/blogsTheme";

// The theme lives on <html data-blogs-theme="dark">, so the navbar and page
// background flip too. The root layout sets it before first paint; this
// component keeps it in sync and removes it when the reader leaves, so no
// page outside /blogs ever renders dark.
//
// Without a slug it is the list's toggle. With one it is that post's: the post
// opens in the list's theme unless the reader chose otherwise for this post,
// and toggling here never changes the list's choice.
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

export default function BlogsThemeToggle({ slug, className = "" }: { slug?: string; className?: string }) {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  // Layout effect: moving between the list and a post swaps this attribute
  // within one commit, before paint, so a dark reader never sees a light frame.
  useLayoutEffect(() => {
    try {
      const stored = (slug && localStorage.getItem(postThemeKey(slug))) || localStorage.getItem(BLOGS_THEME_KEY);
      apply(stored === "dark");
    } catch {
      // Storage blocked: stay light.
    }
    return () => apply(false);
  }, [slug]);

  const toggle = () => {
    apply(!dark);
    try {
      localStorage.setItem(slug ? postThemeKey(slug) : BLOGS_THEME_KEY, dark ? "light" : "dark");
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
      aria-label="Dark mode"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex items-center justify-center size-10 rounded-full border border-[color-mix(in_srgb,var(--color-text)_20%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-text)_6%,transparent)] transition-[background-color,opacity] ${className}`}
    >
      <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}
