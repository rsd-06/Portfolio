// src/components/contact/ContactClock.tsx
// rsd.exe — Live IST clock shown top-right on the Contact page.
// Ticks every second; uses tabular-nums to prevent layout shift.

"use client";

import { useState, useEffect } from "react";

export default function ContactClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const ist = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
      setTime(ist);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <p
      className="f-mono"
      style={{
        fontSize: "var(--text-2xs)",
        letterSpacing: "0.14em",
        opacity: 0.65,
        textTransform: "uppercase",
        fontVariantNumeric: "tabular-nums",
        color: "var(--color-text-inv)",
      }}
      aria-label="Current time in India Standard Time"
    >
      IST — {time || "——:——:——"}
    </p>
  );
}
