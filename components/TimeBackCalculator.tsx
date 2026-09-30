"use client";

import { useEffect, useRef, useState } from "react";
import { PostGameButton } from "./PostGame";
import { track } from "@/lib/track";
import { useLang } from "@/lib/i18n";

// Logic as specified in the Landing PRD.
export const calculateTimeBack = (games: number, coordMin: number, dropouts: number, overflow: number) => {
  const weeks = 52,
    scrambleMin = 15,
    fullSquadMin = 10;
  const nowHours = (games * weeks * (coordMin + dropouts * scrambleMin)) / 60;
  const fullSquadHrs = (games * weeks * fullSquadMin) / 60;
  const coordSaved = Math.max(0, (games * weeks * (coordMin - fullSquadMin)) / 60);
  const scrambleSaved = (games * weeks * dropouts * scrambleMin) / 60;
  const textsAvoided = games * weeks * overflow;
  return { hoursSaved: coordSaved + scrambleSaved, nowHours, fullSquadHrs, textsAvoided, coordSaved, scrambleSaved, scrambles: games * weeks * dropouts };
};

function useAnimatedNumber(target: number, duration = 500) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      fromRef.current = target;
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (target - from) * eased;
      setValue(v);
      fromRef.current = v;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

const fmt = (n: number, d = 0) => n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: d });

function Slider({
  name,
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  name: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  const id = name;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[15px] font-medium">
          {label}
        </label>
        <output htmlFor={id} className="font-bold tabular">
          {value}
          {suffix}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${value}${suffix}`}
        style={{ ["--pct" as string]: `${((value - min) / (max - min)) * 100}%` }}
      />
    </div>
  );
}

export function TimeBackCalculator() {
  const [games, setGames] = useState(2);
  const [coord, setCoord] = useState(45);
  const [drops, setDrops] = useState(2);
  const [overflow, setOverflow] = useState(2);
  const { tr } = useLang();
  const [summary, setSummary] = useState("");
  const touched = useRef(false);

  const r = calculateTimeBack(games, coord, drops, overflow);
  const hours = useAnimatedNumber(r.hoursSaved);
  const maxBar = Math.max(r.nowHours, r.fullSquadHrs, 1);

  // Announce results once the user stops dragging.
  useEffect(() => {
    if (!touched.current) return;
    const t = window.setTimeout(
      () =>
        setSummary(
          tr(
            `About ${fmt(r.hoursSaved)} hours back per year, roughly ${fmt(r.hoursSaved / 8, 1)} full Saturdays. ${fmt(r.textsAvoided)} rejection texts avoided.`,
            `Unas ${fmt(r.hoursSaved)} horas recuperadas al año, más o menos ${fmt(r.hoursSaved / 8, 1)} sábados completos. ${fmt(r.textsAvoided)} mensajes de rechazo evitados.`,
          ),
        ),
      600,
    );
    return () => window.clearTimeout(t);
  }, [r.hoursSaved, r.textsAvoided, tr]);

  const set = (fn: (v: number) => void, name: string) => (v: number) => {
    fn(v);
    if (!touched.current) {
      touched.current = true;
      track("calculator_interaction", { input: name });
    }
  };

  return (
    <section id="time-back" className="section" aria-labelledby="timeback-title">
      <div className="container-x">
        <div className="reveal mx-auto mb-10 max-w-3xl text-center">
          <p className="eyebrow mb-3">{tr("Time back", "Tu tiempo")}</p>
          <h2 id="timeback-title" className="h2">
            {tr("How much of your week does the group chat eat?", "¿Cuánto de tu semana se come el chat del grupo?")}
          </h2>
        </div>

        <div className="card reveal mx-auto grid max-w-[900px] overflow-hidden md:grid-cols-2">
          <div className="grid content-start gap-5 p-6 md:p-8">
            <Slider name="games-organized-per-week" label={tr("Games organized per week", "Partidos que organizas por semana")} value={games} min={1} max={5} onChange={set(setGames, "games")} />
            <Slider name="minutes-coordinating" label={tr("Minutes coordinating per game", "Minutos organizando cada partido")} value={coord} min={10} max={120} step={5} suffix=" min" onChange={set(setCoord, "coord")} />
            <Slider name="dropouts" label={tr("Last-minute dropouts per game", "Bajas de último minuto por partido")} value={drops} min={0} max={5} onChange={set(setDrops, "dropouts")} />
            <Slider name="turned-away" label={tr("People turned away per game", "Gente que se queda fuera por partido")} value={overflow} min={0} max={6} onChange={set(setOverflow, "overflow")} />
          </div>

          <div className="grid content-start gap-5 bg-bg-alt p-6 md:p-8">
            <div>
              <p className="text-6xl font-bold leading-none text-accent tabular md:text-[60px]">{fmt(hours)}</p>
              <p className="mt-2 text-lg font-bold">{tr("hours back per year", "horas recuperadas al año")}</p>
              <p className="text-sm text-muted">
                {tr(`That's about ${fmt(r.hoursSaved / 8, 1)} full Saturdays.`, `Son como ${fmt(r.hoursSaved / 8, 1)} sábados completos.`)}
              </p>
            </div>

            <div className="grid gap-3" role="img" aria-label={tr(
                `Group chat: ${fmt(r.nowHours)} hours per year. Fullsquad: ${fmt(r.fullSquadHrs, 1)} hours per year.`,
                `Chat del grupo: ${fmt(r.nowHours)} horas al año. Fullsquad: ${fmt(r.fullSquadHrs, 1)} horas al año.`,
              )}>
              {[
                { label: tr("Group chat", "Chat del grupo"), v: r.nowHours, cls: "bg-[#5e5d58] dark:bg-[#a9b8ae]" },
                { label: "Fullsquad", v: r.fullSquadHrs, cls: "bg-brand-gradient" },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{b.label}</span>
                    <span className="font-bold tabular">{fmt(b.v, b.v < 100 ? 1 : 0)} {tr("hrs/yr", "h/año")}</span>
                  </div>
                  <div className="mt-1 h-3 overflow-hidden rounded-full bg-line">
                    <div
                      className={`h-full rounded-full transition-[width] duration-500 ${b.cls}`}
                      style={{ width: `${Math.max(2, (b.v / maxBar) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <dl className="grid gap-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">{tr("Coordination time saved", "Tiempo de organización ahorrado")}</dt>
                <dd className="font-bold tabular">{fmt(r.coordSaved, 1)} h</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">{tr("Dropout scrambles avoided", "Carreras por bajas evitadas")}</dt>
                <dd className="font-bold tabular">
                  {fmt(r.scrambles)} ({fmt(r.scrambleSaved)} h)
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">{tr("Rejection texts avoided", "Mensajes de rechazo evitados")}</dt>
                <dd className="font-bold tabular">{fmt(r.textsAvoided)}</dd>
              </div>
            </dl>

            <PostGameButton loc="calculator" className="btn btn-primary w-full">
              {tr("Get These Hours Back", "Recupera esas horas")}
            </PostGameButton>
            <p className="text-xs text-muted">
              {tr(
                "Estimates, not guarantees. Assumes 15 minutes per dropout scramble and 10 minutes per game with Fullsquad, over 52 weeks.",
                "Son estimados, no garantías. Supone 15 minutos por cada baja y 10 minutos por partido con Fullsquad, durante 52 semanas.",
              )}
            </p>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {summary}
        </p>
      </div>
    </section>
  );
}
