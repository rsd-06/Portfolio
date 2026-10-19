// src/lib/blogsTheme.ts
// The /blogs dark theme. Shared by the toggle and the root layout's pre-paint
// script, which must agree on the storage key.

export const BLOGS_THEME_KEY = "blogs-theme";

/** Runs in <head> before first paint so a dark-mode reader never sees a light flash. */
export const BLOGS_THEME_SCRIPT = `try{if(location.pathname==="/blogs"&&localStorage.getItem("${BLOGS_THEME_KEY}")==="dark")document.documentElement.dataset.blogsTheme="dark"}catch(e){}`;
