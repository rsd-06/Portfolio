// src/components/layout/ConditionalFooter.tsx
// rsd.exe — Renders GlobalFooter on all pages EXCEPT /contact.
// The contact page shares the same dark bg (#111) as the footer,
// so the curved seam is invisible and the footer is redundant there.

"use client";

import { usePathname } from "next/navigation";
import GlobalFooter from "./GlobalFooter";

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/contact") return null;
  return <GlobalFooter />;
}
