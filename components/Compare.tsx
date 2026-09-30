"use client";

import { Icon } from "./icons";
import { SectionHeader } from "./ui";
import { useLang, type L } from "@/lib/i18n";

type Cell = { v: "yes" | "no" | "partial"; note?: L };
const y = (en?: string, es?: string): Cell => ({ v: "yes", note: en ? { en, es: es ?? en } : undefined });
const n = (en?: string, es?: string): Cell => ({ v: "no", note: en ? { en, es: es ?? en } : undefined });
const p = (en?: string, es?: string): Cell => ({ v: "partial", note: en ? { en, es: es ?? en } : undefined });

const COLS: L[] = [
  { en: "Group chat", es: "Chat del grupo" },
  { en: "Pay-to-play pickup apps", es: "Apps donde pagas por jugar" },
  { en: "Hosting & ticketing apps", es: "Apps de eventos y boletos" },
  { en: "Fullsquad", es: "Fullsquad" },
];
const COLS_SHORT: L[] = [
  { en: "Group chat", es: "Chat" },
  { en: "Pay-to-play", es: "Pagar por jugar" },
  { en: "Hosting apps", es: "Apps de eventos" },
  { en: "Fullsquad", es: "Fullsquad" },
];

const ROWS: { label: L; cells: Cell[] }[] = [
  {
    label: { en: "Free for every player", es: "Gratis para todos los jugadores" },
    cells: [y(), n("Pay per game", "Pagas cada partido"), p("Organizer sets a price, plus fees", "El organizador pone precio, más comisiones"), y("$0 forever", "$0 para siempre")],
  },
  {
    label: { en: "Your own crew gets first dibs", es: "Tu grupo tiene prioridad" },
    cells: [y(), n("Open to strangers", "Abierto a desconocidos"), p("Varies", "Depende"), y("Crew first, then nearby", "Tu grupo primero, luego cercanos")],
  },
  {
    label: { en: "Fills by position and skill", es: "Llena por posición y nivel" },
    cells: [n(), p("Skill labels at most", "Solo etiquetas de nivel"), n(), y("Pick any position, or anyone", "Elige posiciones o cualquiera")],
  },
  {
    label: { en: "Automatic, visible waitlist", es: "Lista de espera automática y visible" },
    cells: [n("Manual cuts", "Cortes a mano"), y(), y(), y("Sign-up order, visible to all", "Por orden de inscripción, visible para todos")],
  },
  {
    label: { en: "Dropouts backfilled with a timed rollover", es: "Reemplazo de bajas con tiempo límite" },
    cells: [n("You beg on the thread", "Ruegas en el chat"), p("First to grab it", "El primero que lo agarre"), p("Auto-promote", "Sube automático"), y("One tap, auto-rolls", "Un toque, pasa solo")],
  },
  {
    label: { en: "Crew joins from a link, no download", es: "Tu grupo entra con un link, sin descargar" },
    cells: [y(), n("App required", "Requiere app"), p("Varies", "Depende"), y("Works in any chat", "Funciona en cualquier chat")],
  },
  {
    label: { en: "No cancellation fees or refund fights", es: "Sin cargos por cancelar ni peleas por reembolsos" },
    cells: [y(), n("24-hour policies common", "Políticas de 24 horas"), p("Organizer's rules", "Reglas del organizador"), y("No payments at all", "Sin pagos, punto")],
  },
];

function Mark({ c, highlight }: { c: Cell; highlight?: boolean }) {
  const { t, tr } = useLang();
  const label = c.v === "yes" ? tr("Yes", "Sí") : c.v === "no" ? "No" : tr("Partly", "En parte");
  return (
    <span className="flex flex-col items-center gap-1 text-center">
      {c.v === "yes" ? (
        <span className={`flex size-7 items-center justify-center rounded-full ${highlight ? "bg-turf text-white" : "bg-tint text-accent"}`}>
          <Icon name="check" className="size-4" strokeWidth={3} />
        </span>
      ) : c.v === "no" ? (
        <span className="flex size-7 items-center justify-center rounded-full bg-bg-alt text-muted">
          <Icon name="x" className="size-4" strokeWidth={2.5} />
        </span>
      ) : (
        <span className="flex size-7 items-center justify-center rounded-full bg-bg-alt text-muted">
          <Icon name="minus" className="size-4" strokeWidth={3} />
        </span>
      )}
      <span className="sr-only">{label}.</span>
      {c.note ? <span className={`text-xs leading-snug ${highlight ? "font-semibold text-fg" : "text-muted"}`}>{t(c.note)}</span> : null}
    </span>
  );
}

export function Compare() {
  const { t, tr } = useLang();
  return (
    <section id="compare" className="section bg-bg-alt" aria-labelledby="compare-title">
      <div className="container-x">
        <SectionHeader
          id="compare-title"
          eyebrow={tr("Why not just use…", "¿Por qué no usar…")}
          title={tr("Built for the game you already run", "Hecho para el partido que ya organizas")}
          lead={tr(
            "Most pickup apps sell spots in their games, with strangers at booked fields. Fullsquad is for your crew, your field, and your rules. Free.",
            "La mayoría de las apps venden cupos en sus partidos, con desconocidos y en canchas alquiladas. Fullsquad es para tu grupo, tu cancha y tus reglas. Gratis.",
          )}
        />

        {/* Desktop / tablet: table */}
        <div className="reveal hidden overflow-hidden rounded-2xl border border-line bg-surface md:block">
          <table className="w-full table-fixed text-sm">
            <caption className="sr-only">{tr("How Fullsquad compares to group chats, pay-to-play pickup apps, and hosting apps", "Cómo se compara Fullsquad con los chats de grupo, las apps donde pagas por jugar y las apps de eventos")}</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="w-[28%] p-4 text-left font-semibold text-muted">
                  <span className="sr-only">{tr("Feature", "Función")}</span>
                </th>
                {COLS.map((c0, i) => ({ c: t(c0), i })).map(({ c, i }) => (
                  <th
                    key={c}
                    scope="col"
                    className={`p-4 text-center font-bold ${i === 3 ? "bg-tint text-accent" : ""}`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label.en} className="border-b border-line last:border-0">
                  <th scope="row" className="p-4 text-left font-semibold">
                    {t(r.label)}
                  </th>
                  {r.cells.map((c, i) => (
                    <td key={i} className={`p-4 align-top ${i === 3 ? "bg-tint" : ""}`}>
                      <Mark c={c} highlight={i === 3} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: compact icon grid */}
        <div className="reveal overflow-hidden rounded-2xl border border-line bg-surface md:hidden">
          <table className="w-full table-fixed text-sm">
            <caption className="sr-only">{tr("How Fullsquad compares to group chats, pay-to-play pickup apps, and hosting apps", "Cómo se compara Fullsquad con los chats de grupo, las apps donde pagas por jugar y las apps de eventos")}</caption>
            <thead>
              <tr className="border-b border-line text-[11px] leading-tight">
                <th scope="col" className="w-[40%] p-2 text-left">
                  <span className="sr-only">{tr("Feature", "Función")}</span>
                </th>
                {COLS_SHORT.map((c0) => t(c0)).map((c, i) => (
                  <th key={c} scope="col" className={`p-2 text-center font-bold ${i === 3 ? "bg-tint text-accent" : "text-muted"}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label.en} className="border-b border-line last:border-0">
                  <th scope="row" className="p-3 text-left align-middle text-[13px] font-semibold leading-snug">
                    {t(r.label)}
                    <span className="mt-0.5 block text-[11px] font-medium text-accent">{r.cells[3].note ? t(r.cells[3].note) : null}</span>
                  </th>
                  {r.cells.map((c, i) => (
                    <td key={i} className={`p-1 text-center align-middle ${i === 3 ? "bg-tint" : ""}`}>
                      <Mark c={{ v: c.v }} highlight={i === 3} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          {tr(
            "Compares product categories, not specific brands, based on public websites and app-store listings reviewed in September 2026. Individual apps vary.",
            "Compara categorías de productos, no marcas específicas, según sitios web públicos y tiendas de apps revisados en septiembre de 2026. Cada app es diferente.",
          )}
        </p>
      </div>
    </section>
  );
}
