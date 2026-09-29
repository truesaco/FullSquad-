"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";

/** Pre-headline pill. `?city=Miami` personalizes it for city/park-specific campaigns. */
export function CityBadge() {
  const [city, setCity] = useState<string | null>(null);
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("city");
    if (raw) setCity(raw.replace(/[^\p{L}\p{N} .,'-]/gu, "").slice(0, 40));
  }, []);
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur">
      <span className="flex size-5 items-center justify-center rounded-full bg-turf text-white">
        <Icon name="check" className="size-3" strokeWidth={3} />
      </span>
      Free for every player · Built for {city ? `pickup crews in ${city}` : "pickup crews"}
    </p>
  );
}
