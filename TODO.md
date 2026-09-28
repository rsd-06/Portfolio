[] Build a real dark-mode toggle. globals.css already has ~66 lines of `.dark`
   theme tokens plus the `@custom-variant dark` declaration, but nothing ever
   adds the `.dark` class, so none of it is reachable today. Needs: a toggle,
   system-preference detection, no flash on first paint, and an audit of the
   literal rgba values in components that won't follow the theme.

[] Verify the sub-768px layouts on a real phone. They were fixed and checked
   against the emitted CSS, but never observed at an actual phone viewport.

[] Replace the project placeholder images. 9 image references in
   src/data/projects.ts now point at /assets/projects/_shared/placeholder.jpg
   because the real files were missing (gitpr had none at all). Drop the real
   screenshots in and update the paths.

[] Reconsider gating page content behind framer-motion entrance animations.
   Every section starts at opacity:0 and is revealed by JS, so if the animation
   does not run the page renders blank. Consider a MotionConfig with
   reducedMotion="user", or a CSS fallback that shows content without JS.

--- done ---
[x] Blogs slug component tracks sub headings and marks the side index
[x] Back to Previous Blog link on blog pages
[x] Scroll Down Hint on the Home Screen working and placed properly
