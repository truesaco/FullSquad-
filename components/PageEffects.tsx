"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/** Scroll reveals for every `.reveal` element, plus scroll-depth and CTA click analytics. */
export function PageEffects() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));

    const marks = [25, 50, 75, 100];
    const seen = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 100;
      for (const m of marks) {
        if (pct >= m - 1 && !seen.has(m)) {
          seen.add(m);
          track("scroll_depth", { percent: m });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Any element with data-cta="name" reports a click.
    const onClick = (ev: MouseEvent) => {
      const el = (ev.target as HTMLElement | null)?.closest<HTMLElement>("[data-cta]");
      if (el) track("cta_click", { cta: el.dataset.cta, location: el.dataset.loc });
    };
    document.addEventListener("click", onClick);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return null;
}
