// src/lib/blogsTheme.ts
// The blogs dark theme. /blogs keeps one choice; each post starts from it and
// can keep its own, which never touches the list's. Shared by the toggle and
// the root layout's pre-paint script, which must agree on the storage keys.

export const BLOGS_THEME_KEY = "blogs-theme";
export const postThemeKey = (slug: string) => `${BLOGS_THEME_KEY}:${slug}`;

/** Runs in <head> before first paint so a dark-mode reader never sees a light flash. */
export const BLOGS_THEME_SCRIPT = `try{var p=location.pathname,s=localStorage,t=null;if(p==="/blogs")t=s.getItem("${BLOGS_THEME_KEY}");else if(/^\\/blogs\\/[^/]+$/.test(p))t=s.getItem("${BLOGS_THEME_KEY}:"+p.slice(7))||s.getItem("${BLOGS_THEME_KEY}");if(t==="dark")document.documentElement.dataset.blogsTheme="dark"}catch(e){}`;
