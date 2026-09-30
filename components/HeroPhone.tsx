"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { Avatar, GameOnBadge, PhoneFrame, RosterMeter } from "./ui";
import { useLang } from "@/lib/i18n";

const ROSTER: [string, string][] = [
  ["Diego", "MID"],
  ["Marco", "DEF"],
  ["Kevin", "FWD"],
  ["Tomás", "GK"],
  ["Andrés", "MID"],
  ["Sebastián", "MID"],
  ["Camilo", "DEF"],
  ["Rafa", "MID"],
  ["Jorge", "FWD"],
  ["Nico", "DEF"],
  ["Iván", "MID"],
  ["Pablo", "FWD"],
  ["Mateo", "DEF"],
  ["Julián", "MID"],
];
const WAITLIST: [string, string][] = [
  ["Luis", "MID"],
  ["Santi", "DEF"],
];
const TOTAL = 14;

type Frame = { count: number; wait: number; dropped: boolean };

// ~18s loop: roster fills 3 → 14, GAME ON, waitlist forms, a dropout gets backfilled.
const TIMELINE: [Frame, number][] = [
  [{ count: 3, wait: 0, dropped: false }, 1200],
  ...Array.from({ length: 11 }, (_, i): [Frame, number] => [{ count: 4 + i, wait: 0, dropped: false }, i === 10 ? 1800 : 650]),
  [{ count: 14, wait: 1, dropped: false }, 900],
  [{ count: 14, wait: 2, dropped: false }, 2000],
  [{ count: 14, wait: 2, dropped: true }, 5200],
];
const FINAL = TIMELINE[TIMELINE.length - 1][0];

export function HeroPhone() {
  const [idx, setIdx] = useState(TIMELINE.length - 1);
  const { tr } = useLang();
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    if (!mq.matches) setIdx(0);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => {
      mq.removeEventListener("change", onChange);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (paused || !visible || reduced) return;
    const t = window.setTimeout(() => setIdx((i) => (i + 1) % TIMELINE.length), TIMELINE[idx][1]);
    return () => window.clearTimeout(t);
  }, [idx, paused, visible, reduced]);

  const f = reduced ? FINAL : TIMELINE[idx][0];
  const full = f.count >= TOTAL;
  const roster = ROSTER.slice(0, f.count).map(([n, p]) => (f.dropped && n === "Andrés" ? (["Luis", "MID"] as [string, string]) : [n, p]));
  const waitlist = f.dropped ? WAITLIST.slice(1) : WAITLIST.slice(0, f.wait);

  return (
    <div ref={rootRef} className="relative">
      <p className="sr-only">
        {tr(
          "Animated example: a Fullsquad game card for the Wednesday Run fills from 3 to 14 of 14 players and shows Game On. Two players join the waitlist. When Andrés drops, Luis is automatically promoted from the waitlist.",
          "Ejemplo animado: la tarjeta de un partido en Fullsquad se llena de 3 a 14 de 14 jugadores y muestra ¡A jugar! Dos jugadores entran a la lista de espera. Cuando Andrés se baja, Luis sube automáticamente desde la lista de espera.",
        )}
      </p>
      <div aria-hidden="true">
        <PhoneFrame>
          <div className="px-4 pb-5">
            <div className="flex items-center justify-between py-2">
              <p className="font-serif text-xl">{tr("My Games", "Mis partidos")}</p>
              <Avatar name="Diego R" className="size-7 text-[10px]" />
            </div>
            <div className="rounded-2xl border border-line bg-surface p-3.5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[15px] font-bold leading-tight">{tr("Wednesday Run", "Fútbol del miércoles")}</p>
                  <p className="text-[11px] text-muted">{tr("Wed", "Mié")} 7:30 PM · Brian Piccolo Park</p>
                </div>
                <span className="pos">7v7</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="font-bold tabular">
                  <span className="text-3xl">{f.count}</span>
                  <span className="text-muted">/{TOTAL}</span>
                </p>
                {full ? (
                  <GameOnBadge className="anim-pop" />
                ) : (
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                    <span className="live-dot" /> {tr("Filling", "Llenando")}
                  </span>
                )}
              </div>
              <RosterMeter filled={f.count} total={TOTAL} size="sm" className="mt-2" />
              <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1">
                {Array.from({ length: TOTAL }, (_, i) => {
                  const p = roster[i];
                  const promoted = f.dropped && p?.[0] === "Luis";
                  return (
                    <li
                      key={i}
                      className={`flex h-[22px] items-center justify-between rounded-md px-1.5 text-[11px] ${
                        p ? (promoted ? "anim-slide bg-mint/25 ring-1 ring-mint" : "anim-slide bg-bg-alt") : "border border-dashed border-line"
                      }`}
                    >
                      {p ? (
                        <>
                          <span className="truncate font-semibold">{p[0]}</span>
                          <span className="pos !min-w-0 !bg-transparent !p-0 !text-[9px]">{p[1]}</span>
                        </>
                      ) : (
                        <span className="text-muted/70">{tr("Open", "Libre")}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 min-h-[46px] border-t border-line pt-2">
                <p className="text-[9px] font-bold tracking-[0.1em] text-muted">{tr("WAITLIST · AUTO-PROMOTES", "LISTA DE ESPERA · SUBE SOLA")}</p>
                <ul className="mt-1 grid gap-1">
                  {waitlist.map(([n, p], i) => (
                    <li key={n} className="anim-slide flex items-center justify-between text-[11px]">
                      <span>
                        <span className="mr-2 font-bold text-muted">#{i + 1}</span>
                        <span className="font-semibold">{n}</span>
                      </span>
                      <span className="pos !text-[9px]">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-3 h-[52px]">
              {f.dropped ? (
                <div className="anim-toast flex items-center gap-2.5 rounded-xl bg-[#1a1a18] px-3 py-2 text-white shadow-lg">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-mint text-[#1a1a18]">
                    <Icon name="check" className="size-4" strokeWidth={3} />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[12px] font-bold">{tr("Andrés dropped · Luis is in", "Andrés se bajó · Luis entra")}</span>
                    <span className="block text-[11px] text-white/70">{tr("Spot filled. You're good.", "Cupo lleno. Todo listo.")}</span>
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </PhoneFrame>
      </div>
      {!reduced ? (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="absolute -bottom-2 right-2 flex size-11 items-center justify-center rounded-full border border-line bg-surface shadow-md hover:bg-bg-alt sm:right-8"
          aria-label={paused ? tr("Play the game card animation", "Reproducir la animación") : tr("Pause the game card animation", "Pausar la animación")}
        >
          <Icon name={paused ? "play" : "pause"} className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
