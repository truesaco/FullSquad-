"use client";

import { useState } from "react";
import { Icon } from "./icons";
import { PostGameButton } from "./PostGame";
import { FAQS } from "@/lib/content";
import { SITE } from "@/lib/site";
import { track } from "@/lib/track";
import { useLang } from "@/lib/i18n";

const ES: Record<string, string> = {
  "Core": "Básico",
  "Find and join games": "Buscar y unirte a partidos",
  "One-tap confirm": "Confirmar con un toque",
  "Waitlist position": "Lugar en la lista de espera",
  "Reminders": "Recordatorios",
  "Matching": "Emparejamiento",
  "Crew-first reach": "Tu grupo primero",
  "Position and skill matching": "Emparejamiento por posición y nivel",
  "Priority fill": "Llenado prioritario",
  "Sharing": "Compartir",
  "Game link works in any chat": "El link funciona en cualquier chat",
  "Calendar and maps": "Calendario y mapas",
  "Organizer tools": "Herramientas para organizar",
  "Unlimited posts": "Publicaciones ilimitadas",
  "Auto waitlist and backfills": "Lista de espera y reemplazos automáticos",
  "Position balance check": "Balance de posiciones",
  "Crew size": "Tamaño del grupo",
  "Up to 60": "Hasta 60",
  "Unlimited": "Ilimitado",
  "Recurring games": "Partidos recurrentes",
  "Reliability stats and gap predictions": "Estadísticas de asistencia y predicción de huecos",
  "Find games": "Buscar partidos",
  "One-tap join and confirm": "Unirte y confirmar con un toque",
  "Profile": "Perfil",
  "Everything in Player, plus:": "Todo lo de Jugador, más:",
  "Crew-first reach and matching": "Tu grupo primero y emparejamiento",
  "Crew of up to 60": "Grupo de hasta 60",
  "Everything in Organizer, plus:": "Todo lo de Organizador, más:",
  "Reliability stats": "Estadísticas de asistencia",
  "Gap predictions": "Predicción de huecos",
  "Unlimited crew": "Grupo ilimitado"
};

/** English label → current language. */
function useX() {
  const { lang } = useLang();
  return (s: string) => (lang === "es" ? ES[s] ?? s : s);
}

type Billing = "monthly" | "annual";

const TABLE: { group: string; rows: [string, string, string, string][] }[] = [
  {
    group: "Core",
    rows: [
      ["Find and join games", "✓", "✓", "✓"],
      ["One-tap confirm", "✓", "✓", "✓"],
      ["Waitlist position", "✓", "✓", "✓"],
      ["Reminders", "✓", "✓", "✓"],
    ],
  },
  {
    group: "Matching",
    rows: [
      ["Crew-first reach", "—", "✓", "✓"],
      ["Position and skill matching", "—", "✓", "✓"],
      ["Priority fill", "—", "—", "✓"],
    ],
  },
  {
    group: "Sharing",
    rows: [
      ["Game link works in any chat", "✓", "✓", "✓"],
      ["Calendar and maps", "✓", "✓", "✓"],
    ],
  },
  {
    group: "Organizer tools",
    rows: [
      ["Unlimited posts", "—", "✓", "✓"],
      ["Auto waitlist and backfills", "—", "✓", "✓"],
      ["Position balance check", "—", "✓", "✓"],
      ["Crew size", "—", "Up to 60", "Unlimited"],
      ["Recurring games", "—", "—", "✓"],
      ["Reliability stats and gap predictions", "—", "—", "✓"],
    ],
  },
];

function CellValue({ v }: { v: string }) {
  const { tr } = useLang();
  const x = useX();
  if (v === "✓")
    return (
      <>
        <Icon name="check" className="mx-auto size-5 text-accent" strokeWidth={2.5} />
        <span className="sr-only">{tr("Included", "Incluido")}</span>
      </>
    );
  if (v === "—")
    return (
      <>
        <span aria-hidden="true" className="text-muted">
          —
        </span>
        <span className="sr-only">{tr("Not included", "No incluido")}</span>
      </>
    );
  return <span className="font-medium">{x(v)}</span>;
}

function Features({ items }: { items: string[] }) {
  const x = useX();
  return (
    <ul className="mb-8 mt-6 grid gap-3 text-[15px]">
      {items.map((f) => (
        <li key={f} className="flex gap-3">
          <Icon name="check" className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={2.5} />
          <span>{x(f)}</span>
        </li>
      ))}
    </ul>
  );
}

export function Pricing() {
  const { t, tr } = useLang();
  const x = useX();
  const [billing, setBilling] = useState<Billing>("annual");

  return (
    <section id="pricing" className="section" aria-labelledby="pricing-title">
      <div className="container-x container-wide">
        <div className="reveal mx-auto mb-10 max-w-3xl text-center">
          <p className="eyebrow mb-3">{tr("Pricing", "Precios")}</p>
          <h2 id="pricing-title" className="h2">
            {tr("Is it really free? Yes.", "¿De verdad es gratis? Sí.")}
          </h2>
        </div>

        <div className="reveal mb-10 flex flex-col items-center gap-2">
          <div className="inline-flex rounded-full border border-line bg-bg-alt p-1" role="group" aria-label={tr("Organizer Pro billing period", "Periodo de pago de Organizador Pro")}>
            {(["monthly", "annual"] as const).map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={billing === b}
                onClick={() => {
                  setBilling(b);
                  track("billing_toggle", { billing: b });
                }}
                className={`flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors ${
                  billing === b ? "bg-surface text-fg shadow-sm" : "text-muted"
                }`}
              >
                {b === "monthly" ? tr("Monthly", "Mensual") : tr("Annual", "Anual")}
                {b === "annual" ? (
                  <span className="rounded-full bg-volt px-2 py-0.5 text-[11px] font-bold text-[#1a1a18]">{tr("Save 25%", "Ahorra 25%")}</span>
                ) : null}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted">{tr("Billing toggle applies to Organizer Pro only.", "El periodo de pago solo aplica a Organizador Pro.")}</p>
        </div>

        <div className="mx-auto grid max-w-[1200px] items-start gap-6 lg:grid-cols-3">
          {/* Player */}
          <div className="card reveal order-2 flex h-full flex-col p-8 transition-transform duration-300 hover:-translate-y-1 lg:order-1">
            <h3 className="text-xl font-bold">{tr("Player", "Jugador")}</h3>
            <p className="text-sm text-muted">{tr("Anyone who wants a game", "Cualquiera que quiera jugar")}</p>
            <p className="mt-6">
              <span className="text-4xl font-bold">$0</span> <span className="text-muted">forever</span>
            </p>
            <Features items={["Find games", "One-tap join and confirm", "Waitlist position", "Profile", "Reminders"]} />
            <a
              href="#waitlist"
              className="btn btn-secondary mt-auto w-full"
              data-cta="pricing_player"
              data-loc="pricing"
              onClick={() => track("pricing_tier_click", { tier: "player" })}
            >
              {tr("Find a Game", "Buscar partido")}
            </a>
          </div>

          {/* Organizer */}
          <div className="card reveal relative order-1 flex h-full flex-col !border-2 !border-accent p-8 shadow-xl transition-transform duration-300 hover:-translate-y-3 lg:order-2 lg:-translate-y-2">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-turf px-3 py-1 text-xs font-bold tracking-wide text-white">
              {tr("MOST POPULAR", "MÁS POPULAR")}
            </span>
            <h3 className="text-xl font-bold">{tr("Organizer", "Organizador")}</h3>
            <p className="text-sm text-muted">{tr("The person who keeps the game alive", "Quien mantiene vivo el partido")}</p>
            <p className="mt-6">
              <span className="text-4xl font-bold">$0</span> <span className="text-muted">forever</span>
            </p>
            <Features
              items={[
                "Everything in Player, plus:",
                "Unlimited posts",
                "Crew-first reach and matching",
                "Auto waitlist and backfills",
                "Position balance check",
                "Crew of up to 60",
              ]}
            />
            <div className="mt-auto" onClick={() => track("pricing_tier_click", { tier: "organizer" })}>
              <PostGameButton loc="pricing" className="btn btn-primary w-full">
                {tr("Post Your First Game", "Publica tu primer partido")}
              </PostGameButton>
            </div>
          </div>

          {/* Pro */}
          <div className="card reveal order-3 flex h-full flex-col p-8 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{tr("Organizer Pro", "Organizador Pro")}</h3>
              <span className="rounded-full bg-bg-alt px-2 py-0.5 text-[11px] font-bold tracking-wide text-muted">{tr("PLANNED", "PRÓXIMAMENTE")}</span>
            </div>
            <p className="text-sm text-muted">{tr("People running several games a week", "Para quien organiza varios partidos por semana")}</p>
            <p className="mt-6" aria-live="polite">
              <span className="text-4xl font-bold">{billing === "annual" ? "$36" : "$4"}</span>{" "}
              <span className="text-muted">{billing === "annual" ? tr("/yr", "/año") : tr("/mo", "/mes")}</span>
              <span className="block text-sm text-muted">
                {billing === "annual" ? tr("Works out to $3/mo", "Sale a $3/mes") : tr("Or $36/yr, save 25%", "O $36/año, ahorra 25%")}
              </span>
            </p>
            <Features
              items={["Everything in Organizer, plus:", "Recurring games", "Reliability stats", "Gap predictions", "Priority fill", "Unlimited crew"]}
            />
            <a
              href="#waitlist"
              className="btn btn-secondary mt-auto w-full"
              data-cta="pricing_pro"
              data-loc="pricing"
              onClick={() => track("pricing_tier_click", { tier: "pro", billing })}
            >
              {tr("Get Notified", "Avísame")}
            </a>
          </div>
        </div>

        <p className="mt-10 text-center text-sm font-medium text-muted">{tr("No credit card • Players never pay • Leave anytime", "Sin tarjeta • Los jugadores nunca pagan • Te vas cuando quieras")}</p>
        <p id="leagues" className="mt-3 text-center">
          {tr("Running a league or tournament?", "¿Organizas una liga o torneo?")}{" "}
          <a
            href={`mailto:${SITE.contactEmail}?subject=Leagues%20%26%20tournaments`}
            className="font-semibold text-accent underline-offset-4 hover:underline"
            data-cta="leagues_talk"
            data-loc="pricing"
          >
            {tr("Talk to us →", "Hablemos →")}
          </a>
        </p>

        <details className="disclosure reveal mx-auto mt-12 max-w-[1000px] rounded-2xl border border-line bg-surface">
          <summary className="flex min-h-14 items-center justify-between gap-4 px-6 py-4 font-bold">
            {tr("Compare all features", "Comparar todas las funciones")}
            <Icon name="plus" className="disclosure-icon size-5 transition-transform duration-300" />
          </summary>
          <div className="overflow-x-auto px-2 pb-4 md:px-6">
            <table className="w-full min-w-[520px] text-sm">
              <caption className="sr-only">{tr("Feature comparison across Player, Organizer and Organizer Pro", "Comparación de funciones entre Jugador, Organizador y Organizador Pro")}</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="py-3 pr-3 text-left">
                    {tr("Feature", "Función")}
                  </th>
                  <th scope="col" className="px-3 py-3 text-center">
                    {tr("Player", "Jugador")}
                  </th>
                  <th scope="col" className="px-3 py-3 text-center text-accent">
                    {tr("Organizer", "Organizador")}
                  </th>
                  <th scope="col" className="px-3 py-3 text-center">
                    {tr("Pro (planned)", "Pro (próximamente)")}
                  </th>
                </tr>
              </thead>
              {TABLE.map((g) => (
                <tbody key={g.group}>
                  <tr>
                    <th scope="colgroup" colSpan={4} className="caption pt-5 pb-2 text-left text-muted">
                      {x(g.group)}
                    </th>
                  </tr>
                  {g.rows.map(([label, ...vals]) => (
                    <tr key={label} className="border-b border-line last:border-0">
                      <th scope="row" className="py-3 pr-3 text-left font-normal">
                        {x(label)}
                      </th>
                      {vals.map((v, i) => (
                        <td key={i} className="px-3 py-3 text-center">
                          <CellValue v={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </details>

        <div className="mx-auto mt-16 max-w-[900px]">
          <h3 className="h3 reveal mb-6 text-center">{tr("Questions", "Preguntas")}</h3>
          <div className="grid gap-3">
            {FAQS.map((f, i) => (
              <details key={f.q.en} className="disclosure card reveal !shadow-none" open={i === 0}>
                <summary className="flex min-h-14 items-center justify-between gap-4 px-6 py-4 text-lg font-semibold">
                  {t(f.q)}
                  <Icon name="plus" className="disclosure-icon size-5 shrink-0 transition-transform duration-300" />
                </summary>
                <p className="px-6 pb-6 text-muted">{t(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
