"use client";

import type { ReactNode } from "react";
import { useLang, type L } from "@/lib/i18n";
import { Icon, type IconName } from "./icons";
import { Avatar, SectionHeader } from "./ui";
import { BackfillCountdown } from "./BackfillCountdown";

function Visual({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-bg-alt px-4 py-8 sm:aspect-[4/3] sm:p-8">
      <div
        className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #9cc9ae, transparent 70%)" }}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-[380px]">{children}</div>
    </div>
  );
}

function PostVisual() {
  const { tr } = useLang();
  return (
    <Visual>
      <div className="card p-4">
        <p className="caption text-muted">{tr("Diego posted", "Diego publicó")}</p>
        <p className="mt-1 font-semibold">
          {tr("Sun 8:30 at Piccolo. 7v7. Need 3: 1 GK · 1 DEF · 1 any position.", "Dom 8:30 en Piccolo. 7v7. Faltan 3: 1 GK · 1 DEF · 1 cualquier posición.")}
        </p>
      </div>
      <ol className="mt-4 grid gap-3">
        <li className="card flex items-center gap-3 !border-2 !border-mint p-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-turf text-sm font-bold text-white">1</span>
          <span className="flex-1 font-semibold">{tr("Your crew sees it first", "Tu grupo lo ve primero")}</span>
          <span className="rounded-full bg-tint px-2 py-0.5 text-xs font-bold text-accent">{tr("Now", "Ahora")}</span>
        </li>
        <li className="card flex items-center gap-3 p-3 opacity-80">
          <span className="flex size-8 items-center justify-center rounded-full bg-bg-alt text-sm font-bold">2</span>
          <span className="flex-1 font-semibold">{tr("Nearby players who fit", "Jugadores cercanos que encajan")}</span>
          <span className="rounded-full bg-bg-alt px-2 py-0.5 text-xs font-bold text-muted">{tr("Next", "Después")}</span>
        </li>
      </ol>
    </Visual>
  );
}

function MatchVisual() {
  const { tr } = useLang();
  const rows = [
    [tr("Position", "Posición"), "GK"],
    [tr("Skill", "Nivel"), tr("Intermediate", "Intermedio")],
    [tr("Distance", "Distancia"), "3 mi"],
    [tr("Shows up", "Asistencia"), tr("11 of 12", "11 de 12")],
  ];
  return (
    <Visual>
      <div className="card p-5">
        <div className="flex items-center gap-3">
          <Avatar name="Tomás M" className="size-11 text-sm" />
          <div className="flex-1">
            <p className="font-bold">Tomás</p>
            <p className="text-sm text-muted">{tr("Matched for your game", "Ideal para tu partido")}</p>
          </div>
          <span className="rounded-full bg-mint px-2.5 py-1 text-[11px] font-bold tracking-wide text-[#1a1a18]">{tr("KEEPER", "PORTERO")}</span>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3">
          {rows.map(([k, v]) => (
            <div key={k} className="rounded-lg bg-bg-alt p-3">
              <dt className="caption text-muted">{k}</dt>
              <dd className="mt-1 font-bold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Visual>
  );
}

function WaitlistVisual() {
  const { tr } = useLang();
  const q = [
    { n: "Luis", s: tr("Next up", "Sigue"), you: false },
    { n: tr("You", "Tú"), s: tr("You're #2", "Eres el #2"), you: true },
    { n: "Santi", s: tr("Waiting", "Esperando"), you: false },
  ];
  return (
    <Visual>
      <div className="card p-5">
        <div className="flex items-baseline justify-between">
          <p className="font-bold">{tr("Waitlist", "Lista de espera")}</p>
          <p className="text-sm text-muted">{tr("In sign-up order", "En orden de inscripción")}</p>
        </div>
        <ol className="mt-4 grid gap-2">
          {q.map((p, i) => (
            <li
              key={p.n}
              className={`flex items-center gap-3 rounded-lg p-3 ${p.you ? "bg-tint ring-2 ring-accent" : "bg-bg-alt"}`}
            >
              <span className="w-7 font-bold text-muted tabular">#{i + 1}</span>
              <span className="flex-1 font-semibold">{p.n}</span>
              <span className={`text-sm font-semibold ${p.you ? "text-accent" : i === 0 ? "text-info" : "text-muted"}`}>{p.s}</span>
            </li>
          ))}
        </ol>
      </div>
    </Visual>
  );
}

function BackfillVisual() {
  const { tr } = useLang();
  return (
    <Visual>
      <div className="rounded-2xl bg-[#1a1a18] p-5 text-white shadow-xl">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Icon name="bell" className="size-4" /> Fullsquad · {tr("now", "ahora")}
        </div>
        <p className="mt-2 text-lg font-bold">{tr("A spot opened for Sunday 8:30 at Piccolo", "Se abrió un cupo para el domingo 8:30 en Piccolo")}</p>
        <p className="mt-1 text-sm text-white/70">
          {tr("Rolls to the next player in", "Pasa al siguiente jugador en")} <BackfillCountdown />
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <span className="btn btn-sm border border-white/25 text-white">{tr("Pass", "Paso")}</span>
          <span className="btn btn-sm btn-primary">{tr("I'm In", "Me apunto")}</span>
        </div>
      </div>
    </Visual>
  );
}

function PitchVisual() {
  const { tr } = useLang();
  // Positions on a vertical half-pitch (percent coordinates).
  const players = [
    { p: "DEF", x: 30, y: 72 },
    { p: "DEF", x: 70, y: 72 },
    { p: "MID", x: 50, y: 52 },
    { p: "FWD", x: 25, y: 28 },
    { p: "FWD", x: 50, y: 22 },
    { p: "FWD", x: 75, y: 28 },
  ];
  return (
    <Visual>
      <div className="card p-4">
        <p className="flex items-center gap-2 rounded-lg bg-[#fef3c7] px-3 py-2 text-sm font-bold text-[#92400e]">
          <Icon name="warning" className="size-4" /> {tr("No keeper yet", "Todavía no hay portero")}
        </p>
        <div className="relative mx-auto mt-3 aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#2e5a45]">
          <div className="absolute inset-2 rounded border-2 border-white/60" />
          <div className="absolute bottom-2 left-1/2 h-[22%] w-[44%] -translate-x-1/2 border-2 border-b-0 border-white/60" />
          <div className="absolute left-1/2 top-2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60" />
          {players.map((pl, i) => (
            <span
              key={i}
              className="absolute flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-[#1a1a18] shadow"
              style={{ left: `${pl.x}%`, top: `${pl.y}%` }}
            >
              {pl.p}
            </span>
          ))}
          <span
            className="absolute bottom-[6%] left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border-2 border-dashed border-[#f3b0a9] bg-[#1a1a18]/40 text-[10px] font-extrabold text-[#f3b0a9]"
          >
            GK?
          </span>
        </div>
        <p className="mt-3 text-center text-sm font-semibold tabular">GK 0 · DEF 2 · MID 1 · FWD 3</p>
      </div>
    </Visual>
  );
}

const FEATURES: { n: string; title: L; body: L; metric: L; icon: IconName; visual: ReactNode; alt: L }[] = [
  {
    n: "01",
    title: { en: "Post once, crew first", es: "Publica una vez, tu grupo primero" },
    body: {
      en: "One plain-language post reaches the regulars first, then nearby players who fit. No re-posting or chasing.",
      es: "Una publicación sencilla les llega primero a los de siempre y después a jugadores cercanos que encajan. Sin volver a publicar ni perseguir a nadie.",
    },
    metric: { en: "1 post replaces a night of texting", es: "1 publicación reemplaza una noche de mensajes" },
    icon: "send",
    visual: <PostVisual />,
    alt: { en: "A game post reaching your crew first, then nearby players", es: "Una publicación que llega primero a tu grupo y luego a jugadores cercanos" },
  },
  {
    n: "02",
    title: { en: "Position & skill matching", es: "Emparejamiento por posición y nivel" },
    body: {
      en: "Toggle the positions you need (keeper, defender, midfielder, forward) or leave it open to anyone. Matching uses position, skill, distance, and attendance history, so each spot reaches players who actually fit it.",
      es: "Activa las posiciones que necesitas (portero, defensa, mediocampista, delantero) o déjalo abierto a cualquiera. El emparejamiento usa posición, nivel, distancia e historial de asistencia, así cada cupo le llega a quien de verdad encaja.",
    },
    metric: { en: "4 signals", es: "4 señales" },
    icon: "sliders",
    visual: <MatchVisual />,
    alt: { en: "A matched player card showing position, skill, distance and attendance", es: "Tarjeta de un jugador con posición, nivel, distancia y asistencia" },
  },
  {
    n: "03",
    title: { en: "Automatic, fair waitlist", es: "Lista de espera automática y justa" },
    body: {
      en: 'Overflow gets in line by sign-up order and everyone can see their spot, so there are no "sorry bro, we\'re full" texts.',
      es: 'Los que sobran hacen fila por orden de inscripción y todos ven su lugar, así que se acabaron los mensajes de "perdón, ya estamos llenos".',
    },
    metric: { en: "0 rejection texts", es: "0 mensajes de rechazo" },
    icon: "queue",
    visual: <WaitlistVisual />,
    alt: { en: "A waitlist in sign-up order where you are number 2", es: "Una lista de espera por orden de inscripción donde eres el número 2" },
  },
  {
    n: "04",
    title: { en: "One-tap backfills", es: "Reemplazos con un toque" },
    body: {
      en: "When someone drops, the next person gets a notification and taps In or Pass. If they don't answer, it rolls to the next person automatically.",
      es: "Cuando alguien se baja, al siguiente le llega una notificación y toca Me apunto o Paso. Si no responde, pasa automáticamente al siguiente.",
    },
    metric: { en: "1 tap", es: "1 toque" },
    icon: "refresh",
    visual: <BackfillVisual />,
    alt: { en: "A notification that a spot opened with In and Pass buttons and a countdown", es: "Una notificación de cupo libre con botones Me apunto y Paso y una cuenta regresiva" },
  },
  {
    n: "05",
    title: { en: "Position balance check", es: "Balance de posiciones" },
    body: {
      en: 'A mini pitch view flags gaps like "No keeper yet" before game day.',
      es: 'Una mini cancha te avisa de huecos como "Todavía no hay portero" antes del partido.',
    },
    metric: { en: "GK · DEF · MID · FWD at a glance", es: "GK · DEF · MID · FWD de un vistazo" },
    icon: "users",
    visual: <PitchVisual />,
    alt: { en: "A mini pitch with defenders, a midfielder and three forwards, flagging no keeper", es: "Una mini cancha con defensas, un mediocampista y tres delanteros, que avisa que falta portero" },
  },
];

export function Features() {
  const { t, tr } = useLang();
  return (
    <section id="features" className="section" aria-labelledby="features-title">
      <div className="container-x">
        <SectionHeader
          id="features-title"
          eyebrow={tr("Features", "Funciones")}
          title={
            <>
              {tr("Stop chasing headcounts.", "Deja de perseguir gente.")}
              <br className="hidden sm:block" /> {tr("Here's what does the chasing for you.", "Esto lo hace por ti.")}
            </>
          }
        />
        <div className="grid gap-16 md:gap-[100px]">
          {FEATURES.map((f, i) => (
            <article key={f.n} className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
              <div className={`reveal ${i % 2 ? "md:order-2" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-tint text-accent">
                    <Icon name={f.icon} className="size-6" />
                  </span>
                  <span className="font-serif text-3xl text-muted/60">{f.n}</span>
                </div>
                <h3 className="h3 mt-5">{t(f.title)}</h3>
                <p className="mt-3 text-lg text-muted">{t(f.body)}</p>
                <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold">
                  <span className="size-2 rounded-full bg-mint" aria-hidden="true" />
                  {t(f.metric)}
                </p>
              </div>
              <div className="reveal" style={{ ["--delay" as string]: "100ms" }} role="img" aria-label={t(f.alt)}>
                <div aria-hidden="true">{f.visual}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
