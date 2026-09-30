"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./icons";
import { PostGameButton } from "./PostGame";
import { GameOnBadge, PhoneFrame, RosterMeter } from "./ui";
import { track } from "@/lib/track";
import { useLang, type L } from "@/lib/i18n";

const STEPS = [
  {
    title: { en: "Post what you need.", es: "Publica lo que necesitas." },
    body: { en: "Day, place, format, and which positions you need, or anyone. One post.", es: "Día, lugar, formato y qué posiciones necesitas, o cualquiera. Una sola publicación." },
  },
  {
    title: { en: "Crew and matched players fill in.", es: "Tu grupo y jugadores compatibles se apuntan." },
    body: { en: "Your regulars see it first, then nearby players who fit.", es: "Los de siempre lo ven primero y después jugadores cercanos que encajan." },
  },
  {
    title: { en: "Overflow goes to the waitlist.", es: "Los que sobran van a la lista de espera." },
    body: { en: "Sign-up order, visible to everyone. Nobody gets cut by you.", es: "Por orden de inscripción y visible para todos. Tú no tienes que dejar a nadie fuera." },
  },
  {
    title: { en: "A dropout gets backfilled.", es: "Una baja se reemplaza sola." },
    body: { en: "The next player taps In. You find out after it's handled.", es: "El siguiente toca Me apunto. Tú te enteras cuando ya está resuelto." },
  },
];

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-2.5 text-sm">
      <span className="text-muted">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}

function GameHeader({ count }: { count: number }) {
  const { tr } = useLang();
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold">{tr("Wednesday Run", "Fútbol del miércoles")}</p>
          <p className="text-xs text-muted">{tr("Wed", "Mié")} 7:30 PM · Piccolo Park · 7v7</p>
        </div>
        {count >= 14 ? <GameOnBadge /> : null}
      </div>
      <p className="mt-3 font-bold tabular">
        <span className="text-4xl">{count}</span>
        <span className="text-muted">/14</span>
      </p>
      <RosterMeter filled={count} total={14} className="mt-2" />
    </>
  );
}

function Screen({ step }: { step: number }) {
  const { tr } = useLang();
  if (step === 0)
    return (
      <div className="anim-slide p-4">
        <p className="font-serif text-xl">{tr("Post a game", "Publica un partido")}</p>
        <div className="mt-3">
          <Row k={tr("When", "Cuándo")} v={tr("Wed 7:30 PM", "Mié 7:30 PM")} />
          <Row k={tr("Where", "Dónde")} v="Piccolo Park" />
          <Row k={tr("Need", "Faltan")} v={tr("14 players", "14 jugadores")} />
          <Row k={tr("Positions", "Posiciones")} v={tr("1 GK · 1 DEF · any", "1 GK · 1 DEF · cualquiera")} />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-1 rounded-lg bg-bg-alt p-1 text-center text-xs font-semibold">
          {["5v5", "7v7", "8v8", "11v11"].map((f) => (
            <span key={f} className={`rounded-md py-2 ${f === "7v7" ? "bg-turf text-white" : "text-muted"}`}>
              {f}
            </span>
          ))}
        </div>
        <span className="btn btn-primary mt-5 w-full">{tr("Post to crew", "Enviar a mi grupo")}</span>
      </div>
    );
  if (step === 1) {
    const people: [string, string, "Crew" | "Matched"][] = [
      ["Diego", "MID", "Crew"],
      ["Marco", "DEF", "Crew"],
      ["Kevin", "FWD", "Crew"],
      ["Andrés", "MID", "Crew"],
      ["Tomás", "GK", "Matched"],
      ["Rafa", "MID", "Matched"],
    ];
    return (
      <div className="anim-slide p-4">
        <GameHeader count={11} />
        <ul className="mt-4 grid gap-1.5">
          {people.map(([n, p, s]) => (
            <li key={n} className="flex items-center justify-between rounded-lg bg-bg-alt px-3 py-2 text-sm">
              <span className="font-semibold">
                {n} <span className="pos ml-1">{p}</span>
              </span>
              <span className={`text-xs font-bold ${s === "Crew" ? "text-accent" : "text-info"}`}>
                {s === "Crew" ? tr("Crew", "Grupo") : tr("Matched", "Compatible")}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-center text-xs text-muted">{tr("8 from your crew · 3 matched nearby", "8 de tu grupo · 3 compatibles cercanos")}</p>
      </div>
    );
  }
  if (step === 2)
    return (
      <div className="anim-slide p-4">
        <GameHeader count={14} />
        <p className="caption mt-5 text-muted">{tr("Waitlist · auto-promotes", "Lista de espera · sube sola")}</p>
        <ol className="mt-2 grid gap-1.5">
          {[
            ["Luis", tr("Next up", "Sigue")],
            ["Santi", "#2"],
            ["Beto", "#3"],
          ].map(([n, s], i) => (
            <li key={n} className="flex items-center justify-between rounded-lg bg-bg-alt px-3 py-2 text-sm">
              <span>
                <span className="mr-2 font-bold text-muted">#{i + 1}</span>
                <span className="font-semibold">{n}</span>
              </span>
              <span className="text-xs font-semibold text-info">{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-center text-xs text-muted">{tr("0 “sorry, we're full” texts sent", "0 mensajes de “perdón, ya estamos llenos”")}</p>
      </div>
    );
  return (
    <div className="anim-slide p-4">
      <GameHeader count={14} />
      <ul className="mt-4 grid gap-1.5 text-sm">
        <li className="flex items-center justify-between rounded-lg bg-bg-alt px-3 py-2 line-through opacity-60">
          <span className="font-semibold">Andrés</span>
          <span className="text-xs">{tr("Dropped", "Se bajó")}</span>
        </li>
        <li className="flex items-center justify-between rounded-lg bg-mint/25 px-3 py-2 ring-1 ring-mint">
          <span className="font-semibold">Luis</span>
          <span className="text-xs font-bold text-accent">{tr("Tapped In", "Se apuntó")}</span>
        </li>
      </ul>
      <div className="anim-toast mt-5 flex items-center gap-2.5 rounded-xl bg-[#1a1a18] px-3 py-2.5 text-white">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-mint text-[#1a1a18]">
          <Icon name="check" className="size-4" strokeWidth={3} />
        </span>
        <span className="text-[13px] leading-tight">
          <span className="block font-bold">{tr("Andrés dropped · Luis is in", "Andrés se bajó · Luis entra")}</span>
          <span className="text-white/70">{tr("Spot filled. You're good.", "Cupo lleno. Todo listo.")}</span>
        </span>
      </div>
    </div>
  );
}

export function Walkthrough() {
  const { t, tr } = useLang();
  const [step, setStep] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const go = (i: number, focus = false) => {
    const n = (i + STEPS.length) % STEPS.length;
    setStep(n);
    track("walkthrough_step", { step: n + 1 });
    if (focus) tabs.current[n]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      go(step + 1, true);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(step - 1, true);
    }
  };

  return (
    <section id="walkthrough" className="section" aria-labelledby="walkthrough-title">
      <div className="container-x">
        <div className="reveal mx-auto mb-12 max-w-3xl text-center">
          <h2 id="walkthrough-title" className="h2">
            {tr("See Fullsquad in Action", "Mira Fullsquad en acción")}
          </h2>
          <p className="mt-3 text-lg text-muted">{tr("Four steps. Tap through them.", "Cuatro pasos. Tócalos uno por uno.")}</p>
        </div>
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="reveal grid gap-3">
          <div role="tablist" aria-label={tr("Walkthrough steps", "Pasos del recorrido")} aria-orientation="vertical" className="grid gap-3" onKeyDown={onKey}>
            {STEPS.map((s, i) => (
              <button
                key={s.title.en}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`wt-tab-${i}`}
                aria-selected={step === i}
                aria-controls="wt-panel"
                tabIndex={step === i ? 0 : -1}
                onClick={() => go(i)}
                className={`flex gap-4 rounded-xl border p-5 text-left transition-colors duration-300 ${
                  step === i ? "border-accent bg-tint" : "border-line hover:bg-bg-alt"
                }`}
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full font-bold ${
                    step === i ? "bg-turf text-white" : "bg-bg-alt text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block text-lg font-bold">{t(s.title)}</span>
                  <span className="block text-muted">{t(s.body)}</span>
                </span>
              </button>
            ))}
          </div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => go(step + 1)}>
                {step === STEPS.length - 1 ? tr("Start over", "Empezar de nuevo") : tr("Next step", "Siguiente paso")} <Icon name="arrowRight" className="size-4" />
              </button>
            </div>
          </div>
          <div id="wt-panel" role="tabpanel" aria-labelledby={`wt-tab-${step}`} aria-live="polite" className="reveal">
            <p className="sr-only">
              {tr("Step", "Paso")} {step + 1}: {t(STEPS[step].title)} {t(STEPS[step].body)}
            </p>
            <div aria-hidden="true">
              <PhoneFrame>
                <div className="min-h-[430px]">
                  <Screen key={step} step={step} />
                </div>
              </PhoneFrame>
            </div>
          </div>
        </div>
        <p className="reveal mt-12 text-center text-lg">
          {tr("Ready to try it with your crew?", "¿Listo para probarlo con tu grupo?")}{" "}
          <PostGameButton loc="walkthrough" className="font-semibold text-accent underline-offset-4 hover:underline">
            {tr("Post your first game →", "Publica tu primer partido →")}
          </PostGameButton>
        </p>
      </div>
    </section>
  );
}
