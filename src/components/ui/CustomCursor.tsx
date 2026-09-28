// src/components/ui/CustomCursor.tsx
"use client";

import { useEffect, useState } from "react";
import { useIsTouch } from "@/hooks/useMediaQuery";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  // A custom cursor is meaningless without a pointer. Previously this read
  // `isMobile` from the render *before* checkMobile() ran, so the listeners were
  // attached on touch devices anyway on first mount.
  const isTouch = useIsTouch();

  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div 
        className="cursor-dot hidden md:block" 
        style={{ left: pos.x, top: pos.y }}
      />
      <div 
        className="cursor-ring hidden md:block" 
        style={{ 
          left: pos.x, 
          top: pos.y, 
          transform: `translate(-50%, -50%) scale(${clicked ? 0.8 : 1})` 
        }}
      />
    </>
  );
}
