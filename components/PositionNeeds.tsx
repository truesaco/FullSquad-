"use client";

import { Icon } from "./icons";
import { POSITIONS, describeNeeds, fitNeeds, posName, type Needs, type Pos } from "@/lib/positions";
import { useLang } from "@/lib/i18n";

/**
 * "Who do you need?" picker: a toggle per position, each with a count.
 * Spots not assigned to a position are open to any position.
 */
export function PositionNeeds({
  total,
  value,
  onChange,
  idPrefix,
}: {
  total: number;
  value: Needs;
  onChange: (n: Needs) => void;
  idPrefix: string;
}) {
  const { tr, lang } = useLang();
  const needs = fitNeeds(value, total);
  const specific = total - needs.ANY;
  const anyOnly = specific === 0;

  const toggle = (p: Pos) => {
    if (needs[p] > 0) onChange(fitNeeds({ ...needs, [p]: 0 }, total));
    else if (needs.ANY > 0) onChange(fitNeeds({ ...needs, [p]: 1 }, total));
  };
  const step = (p: Pos, d: number) => onChange(fitNeeds({ ...needs, [p]: Math.max(1, needs[p] + d) }, total));

  if (total <= 0)
    return (
      <p className="rounded-lg bg-bg-alt px-3 py-3 text-sm text-muted">
        {tr("Game is full. Anyone else who taps In goes on the waitlist.", "El partido está lleno. Quien más se apunte va a la lista de espera.")}
      </p>
    );

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">
        {tr("Who do you need?", "¿A quién necesitas?")} <span className="font-normal text-muted">({total} {tr("open", "libres")})</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={anyOnly}
          onClick={() => onChange(fitNeeds({ GK: 0, DEF: 0, MID: 0, FWD: 0, ANY: 0 }, total))}
          className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors ${
            anyOnly ? "border-accent bg-accent text-bg" : "border-line bg-surface hover:bg-bg-alt"
          }`}
        >
          {anyOnly ? <Icon name="check" className="size-4" strokeWidth={3} /> : null}
          {tr("Any position", "Cualquier posición")}
        </button>
        {POSITIONS.map((p) => {
          const on = needs[p] > 0;
          const disabled = !on && needs.ANY === 0;
          return (
            <button
              key={p}
              type="button"
              aria-pressed={on}
              disabled={disabled}
              title={posName(p, lang)}
              onClick={() => toggle(p)}
              className={`inline-flex min-h-11 min-w-14 items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                on ? "border-accent bg-tint text-accent" : "border-line bg-surface hover:bg-bg-alt"
              }`}
            >
              {on ? <Icon name="check" className="size-4" strokeWidth={3} /> : null}
              {p}
              <span className="sr-only"> ({posName(p, lang)})</span>
            </button>
          );
        })}
      </div>

      {!anyOnly ? (
        <ul className="mt-3 grid gap-2">
          {POSITIONS.filter((p) => needs[p] > 0).map((p) => (
            <li key={p} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-1.5">
              <span className="text-sm">
                <span className="pos mr-2">{p}</span>
                {posName(p, lang)}
              </span>
              <span className="flex items-center gap-1" role="group" aria-label={tr(`${posName(p)} count`, `Cantidad de ${posName(p, "es").toLowerCase()}`)}>
                <button
                  type="button"
                  className="flex size-9 items-center justify-center rounded-md hover:bg-bg-alt disabled:opacity-30"
                  onClick={() => step(p, -1)}
                  disabled={needs[p] <= 1}
                  aria-label={tr(`One fewer ${posName(p).toLowerCase()}`, `Un ${posName(p, "es").toLowerCase()} menos`)}
                >
                  <Icon name="minus" className="size-4" />
                </button>
                <output id={`${idPrefix}-${p}`} className="w-6 text-center font-bold tabular">
                  {needs[p]}
                </output>
                <button
                  type="button"
                  className="flex size-9 items-center justify-center rounded-md hover:bg-bg-alt disabled:opacity-30"
                  onClick={() => step(p, 1)}
                  disabled={needs.ANY === 0}
                  aria-label={tr(`One more ${posName(p).toLowerCase()}`, `Un ${posName(p, "es").toLowerCase()} más`)}
                >
                  <Icon name="plus" className="size-4" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-2 text-sm text-muted" aria-live="polite">
        {tr("Looking for", "Buscamos")} <strong className="font-semibold text-fg">{describeNeeds(needs, { lang })}</strong>
        {!anyOnly && needs.ANY > 0 ? tr(". The rest are open to anyone.", ". El resto queda abierto para cualquiera.") : "."}
      </p>
    </fieldset>
  );
}
