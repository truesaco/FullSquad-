"use client";

import { Icon, type IconName } from "./icons";
import { SectionHeader } from "./ui";
import { useLang, type L } from "@/lib/i18n";

const PATHS: { icon: IconName; who: L; title: L; steps: L[]; href: string; cta: L }[] = [
  {
    icon: "send",
    who: { en: "As an organizer", es: "Si organizas" },
    title: { en: "Post a game and watch it fill", es: "Publica un partido y mira cómo se llena" },
    steps: [
      {
        en: "Pick the format and toggle the positions you need, or any position",
        es: "Elige el formato y activa las posiciones que necesitas, o cualquier posición",
      },
      { en: "Your crew gets it first, then nearby players who fit", es: "Tu grupo lo recibe primero y después jugadores cercanos que encajan" },
      {
        en: "Hit “Simulate a dropout” and watch the backfill roll down the waitlist",
        es: "Toca “Simular una baja” y mira cómo el reemplazo baja por la lista de espera",
      },
    ],
    href: "/app/#/post",
    cta: { en: "Post a demo game", es: "Publica un partido de prueba" },
  },
  {
    icon: "pin",
    who: { en: "As a player", es: "Si juegas" },
    title: { en: "Find a game that needs you", es: "Encuentra un partido que te necesite" },
    steps: [
      { en: "Toggle the positions you play: GK, DEF, MID, FWD", es: "Activa las posiciones que juegas: GK, DEF, MID, FWD" },
      { en: "Games that need you float to the top", es: "Los partidos que te necesitan salen primero" },
      {
        en: "Tap In, or join the waitlist and get a one-tap offer when a spot opens",
        es: "Apúntate, o entra a la lista de espera y recibe una oferta de un toque cuando se abra un cupo",
      },
    ],
    href: "/app/#/feed",
    cta: { en: "Browse demo games", es: "Ver partidos de prueba" },
  },
  {
    icon: "users",
    who: { en: "Your crew", es: "Tu grupo" },
    title: { en: "Your regulars, organized", es: "Los de siempre, organizados" },
    steps: [
      { en: "Every player's positions and how often they show up", es: "Las posiciones de cada jugador y qué tanto llega" },
      { en: "Filter your crew by position in one tap", es: "Filtra tu grupo por posición con un toque" },
      { en: "Add nearby players who fit to your crew", es: "Suma a tu grupo jugadores cercanos que encajan" },
    ],
    href: "/app/#/crew",
    cta: { en: "Open the crew view", es: "Ver mi grupo" },
  },
];

export function AppPreview() {
  const { t, tr } = useLang();
  return (
    <section id="app" className="section bg-bg-alt" aria-labelledby="app-title">
      <div className="container-x">
        <SectionHeader
          id="app-title"
          eyebrow={tr("Try it now", "Pruébalo ya")}
          title={tr("See how the app actually works", "Mira cómo funciona la app de verdad")}
          lead={tr(
            "A working demo of the Fullsquad app with simulated players. It runs in your browser: on your phone it looks like the app, on a laptop it's the web app. Nothing to install and nothing gets sent.",
            "Una demo funcional de la app de Fullsquad con jugadores simulados. Corre en tu navegador: en el celular se ve como la app y en la computadora es la app web. No hay que instalar nada y no se envía nada.",
          )}
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {PATHS.map((p, i) => (
            <li key={p.who.en} className="card reveal flex min-w-0 flex-col p-6" style={{ ["--delay" as string]: `${i * 100}ms` }}>
              <span className="flex size-12 items-center justify-center rounded-xl bg-tint text-accent">
                <Icon name={p.icon} className="size-6" />
              </span>
              <p className="caption mt-5 text-muted">{t(p.who)}</p>
              <h3 className="mt-1 text-xl font-bold">{t(p.title)}</h3>
              <ol className="mb-6 mt-4 grid gap-2 text-[15px] text-muted">
                {p.steps.map((s, n) => (
                  <li key={s.en} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-alt text-xs font-bold text-fg">{n + 1}</span>
                    {t(s)}
                  </li>
                ))}
              </ol>
              <a href={p.href} className="btn btn-secondary mt-auto w-full !whitespace-normal" data-cta="app_demo" data-loc={`app_preview_${i + 1}`}>
                {t(p.cta)} <Icon name="arrowRight" className="size-4" />
              </a>
            </li>
          ))}
        </ul>
        <div className="reveal mt-8 text-center">
          <a href="/app/" className="btn btn-primary btn-lg" data-cta="app_demo" data-loc="app_preview_main">
            {tr("Open the full app demo", "Abrir la app demo completa")}
          </a>
          <p className="mt-3 text-sm text-muted">
            {tr(
              "Works on phones, tablets and desktop browsers. Add it to your home screen to use it like an app.",
              "Funciona en celulares, tablets y computadoras. Agrégala a tu pantalla de inicio para usarla como una app.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
