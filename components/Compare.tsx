import { Icon } from "./icons";
import { SectionHeader } from "./ui";

type Cell = { v: "yes" | "no" | "partial"; note?: string };
const y = (note?: string): Cell => ({ v: "yes", note });
const n = (note?: string): Cell => ({ v: "no", note });
const p = (note?: string): Cell => ({ v: "partial", note });

const COLS = ["Group chat", "Pay-to-play pickup apps", "Hosting & ticketing apps", "FullSquad"];

const ROWS: { label: string; cells: Cell[] }[] = [
  { label: "Free for every player", cells: [y(), n("Pay per game"), p("Organizer sets a price, plus fees"), y("$0 forever")] },
  { label: "Your own crew gets first dibs", cells: [y(), n("Open to strangers"), p("Varies"), y("Crew first, then nearby")] },
  { label: "Fills by position and skill", cells: [n(), p("Skill labels at most"), n(), y("Keeper preferred reaches keepers")] },
  { label: "Automatic, visible waitlist", cells: [n("Manual cuts"), y(), y(), y("Sign-up order, visible to all")] },
  { label: "Dropouts backfilled with a timed rollover", cells: [n("You beg on the thread"), p("First to grab it"), p("Auto-promote"), y("One tap, auto-rolls")] },
  { label: "Crew joins from a link, no download", cells: [y(), n("App required"), p("Varies"), y("Works in any chat")] },
  { label: "No cancellation fees or refund fights", cells: [y(), n("24-hour policies common"), p("Organizer's rules"), y("No payments at all")] },
];

function Mark({ c, highlight }: { c: Cell; highlight?: boolean }) {
  const label = c.v === "yes" ? "Yes" : c.v === "no" ? "No" : "Partly";
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
      {c.note ? <span className={`text-xs leading-snug ${highlight ? "font-semibold text-fg" : "text-muted"}`}>{c.note}</span> : null}
    </span>
  );
}

export function Compare() {
  return (
    <section id="compare" className="section bg-bg-alt" aria-labelledby="compare-title">
      <div className="container-x">
        <SectionHeader
          id="compare-title"
          eyebrow="Why not just use…"
          title="Built for the game you already run"
          lead="Most pickup apps sell spots in their games, with strangers at booked fields. FullSquad is for your crew, your field, and your rules. Free."
        />

        {/* Desktop / tablet: table */}
        <div className="reveal hidden overflow-hidden rounded-2xl border border-line bg-surface md:block">
          <table className="w-full table-fixed text-sm">
            <caption className="sr-only">How FullSquad compares to group chats, pay-to-play pickup apps, and hosting apps</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="w-[28%] p-4 text-left font-semibold text-muted">
                  <span className="sr-only">Feature</span>
                </th>
                {COLS.map((c, i) => (
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
                <tr key={r.label} className="border-b border-line last:border-0">
                  <th scope="row" className="p-4 text-left font-semibold">
                    {r.label}
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
            <caption className="sr-only">How FullSquad compares to group chats, pay-to-play pickup apps, and hosting apps</caption>
            <thead>
              <tr className="border-b border-line text-[11px] leading-tight">
                <th scope="col" className="w-[40%] p-2 text-left">
                  <span className="sr-only">Feature</span>
                </th>
                {["Group chat", "Pay-to-play", "Hosting apps", "FullSquad"].map((c, i) => (
                  <th key={c} scope="col" className={`p-2 text-center font-bold ${i === 3 ? "bg-tint text-accent" : "text-muted"}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-0">
                  <th scope="row" className="p-3 text-left align-middle text-[13px] font-semibold leading-snug">
                    {r.label}
                    <span className="mt-0.5 block text-[11px] font-medium text-accent">{r.cells[3].note}</span>
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
          Compares product categories, not specific brands, based on public websites and app-store listings reviewed in September 2026.
          Individual apps vary.
        </p>
      </div>
    </section>
  );
}
