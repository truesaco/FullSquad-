"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";
import { useLang } from "@/lib/i18n";

/** Pre-headline pill. `?city=Miami` personalizes it for city/park-specific campaigns. */
export function CityBadge() {
  const { tr } = useLang();
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
      {city
        ? tr(`Free for every player · Built for pickup crews in ${city}`, `Gratis para todos los jugadores · Hecho para grupos de fútbol en ${city}`)
        : tr("Free for every player · Built for pickup crews", "Gratis para todos los jugadores · Hecho para grupos de fútbol")}
    </p>
  );
}
