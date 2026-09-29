"use client";

import { useEffect, useState } from "react";

/** Decorative countdown for the backfill prompt; loops from 14:32. */
export function BackfillCountdown() {
  const [s, setS] = useState(14 * 60 + 32);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setS((v) => (v <= 0 ? 15 * 60 : v - 1)), 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="font-bold text-flood tabular">
      {Math.floor(s / 60)}:{String(s % 60).padStart(2, "0")}
    </span>
  );
}
