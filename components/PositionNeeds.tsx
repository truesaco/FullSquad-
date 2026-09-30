"use client";

import { Icon } from "./icons";
import { POSITIONS, POS_NAME, describeNeeds, fitNeeds, type Needs, type Pos } from "@/lib/positions";

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
        Game is full. Anyone else who taps In goes on the waitlist.
      </p>
    );

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">
        Who do you need? <span className="font-normal text-muted">({total} open)</span>
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
          Any position
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
              title={POS_NAME[p]}
              onClick={() => toggle(p)}
              className={`inline-flex min-h-11 min-w-14 items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                on ? "border-accent bg-tint text-accent" : "border-line bg-surface hover:bg-bg-alt"
              }`}
            >
              {on ? <Icon name="check" className="size-4" strokeWidth={3} /> : null}
              {p}
              <span className="sr-only"> ({POS_NAME[p]})</span>
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
                {POS_NAME[p]}
              </span>
              <span className="flex items-center gap-1" role="group" aria-label={`${POS_NAME[p]} count`}>
                <button
                  type="button"
                  className="flex size-9 items-center justify-center rounded-md hover:bg-bg-alt disabled:opacity-30"
                  onClick={() => step(p, -1)}
                  disabled={needs[p] <= 1}
                  aria-label={`One fewer ${POS_NAME[p].toLowerCase()}`}
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
                  aria-label={`One more ${POS_NAME[p].toLowerCase()}`}
                >
                  <Icon name="plus" className="size-4" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-2 text-sm text-muted" aria-live="polite">
        Looking for <strong className="font-semibold text-fg">{describeNeeds(needs)}</strong>
        {!anyOnly && needs.ANY > 0 ? ". The rest are open to anyone." : "."}
      </p>
    </fieldset>
  );
}
