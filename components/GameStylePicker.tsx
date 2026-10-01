"use client";

import type { ReactNode } from "react";
import { Icon, type IconName } from "./icons";
import { useLang } from "@/lib/i18n";
import { formatWhen, switchTime, type Deadline, type Rotation, type Style, type StyleChoice } from "@/lib/rotation";

const STYLES: { id: Style; icon: IconName; title: [string, string]; body: [string, string] }[] = [
  {
    id: "positions",
    icon: "users",
    title: ["Set positions", "Posiciones fijas"],
    body: ["Reserve spots for the positions you need.", "Reserva cupos para las posiciones que necesitas."],
  },
  {
    id: "rotating",
    icon: "refresh",
    title: ["Rotating", "Rotativo"],
    body: ["No set positions. Everyone rotates.", "Sin posiciones fijas. Todos rotan."],
  },
  {
    id: "hybrid",
    icon: "clock",
    title: ["Positions, then rotate", "Posiciones, luego rotación"],
    body: ["Hold positions until a deadline, then open it up.", "Guarda posiciones hasta una hora límite y luego abre los cupos."],
  },
];

/** "Game style" picker: set positions, rotating, or positions that switch to rotating at a deadline. */
export function GameStylePicker({
  value,
  onChange,
  positions,
  day,
  time,
  idPrefix,
}: {
  value: StyleChoice;
  onChange: (v: StyleChoice) => void;
  /** The position picker, shown for "Set positions" and "Positions, then rotate". */
  positions: ReactNode;
  day: string;
  time: string;
  idPrefix: string;
}) {
  const { tr, lang } = useLang();
  const set = (patch: Partial<StyleChoice>) => onChange({ ...value, ...patch });
  const switchLabel = value.style === "hybrid" ? formatWhen(switchTime(day, time, value), lang) : null;

  return (
    <div className="grid gap-5">
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">{tr("Game style", "Estilo de juego")}</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {STYLES.map((s) => {
            const on = value.style === s.id;
            return (
              <label
                key={s.id}
                className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent sm:flex-col sm:gap-1.5 ${
                  on ? "border-accent bg-tint" : "border-line bg-surface hover:bg-bg-alt"
                }`}
              >
                <input type="radio" className="sr-only" name={`${idPrefix}-style`} checked={on} onChange={() => set({ style: s.id })} />
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${on ? "bg-accent text-bg" : "bg-bg-alt text-muted"}`}>
                  <Icon name={s.icon} className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{lang === "es" ? s.title[1] : s.title[0]}</span>
                  <span className="block text-xs text-muted">{lang === "es" ? s.body[1] : s.body[0]}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {value.style !== "rotating" ? positions : null}

      {value.style !== "positions" ? (
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">
            {value.style === "hybrid" ? tr("After the deadline", "Después de la hora límite") : tr("How do you rotate?", "¿Cómo rotan?")}
          </legend>
          <div className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-bg-alt p-1">
            {(
              [
                ["keeper", tr("Rotating keeper", "Portero rotativo")],
                ["free", tr("Free rotation", "Rotación libre")],
              ] as [Rotation, string][]
            ).map(([id, label]) => (
              <label
                key={id}
                className={`flex min-h-11 cursor-pointer items-center justify-center rounded-md px-2 text-center text-sm font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                  value.rotation === id ? "bg-surface text-fg shadow-sm" : "text-muted"
                }`}
              >
                <input type="radio" className="sr-only" name={`${idPrefix}-rot`} checked={value.rotation === id} onChange={() => set({ rotation: id })} />
                {label}
              </label>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted">
            {value.rotation === "keeper"
              ? value.style === "hybrid"
                ? tr(
                    "If nobody claims goalkeeper by the deadline, everyone takes a turn in goal. Other open spots open to anyone.",
                    "Si nadie toma el arco antes de la hora límite, todos tapan un rato. Los demás cupos se abren para cualquiera.",
                  )
                : tr("Everyone takes a turn in goal. Fullsquad builds a fair keeper schedule.", "Todos tapan un rato. Fullsquad arma un turno justo de porteros.")
              : tr("Play anywhere and swap whenever. Teams are split on the day.", "Juega donde quieras y cambien cuando quieran. Los equipos se arman ese día.")}
          </p>
        </fieldset>
      ) : null}

      {value.style === "hybrid" ? (
        <div>
          <label htmlFor={`${idPrefix}-deadline`} className="mb-1.5 block text-sm font-medium">
            {tr("Switch if spots aren't filled by", "Cambiar si los cupos no se llenan antes de")}
          </label>
          <select
            id={`${idPrefix}-deadline`}
            className="input"
            value={value.deadline}
            onChange={(e) => set({ deadline: e.target.value as Deadline })}
          >
            <option value="night">{tr("The night before (8 PM)", "La noche anterior (8 PM)")}</option>
            <option value="morning">{tr("Game-day morning", "La mañana del partido")}</option>
            <option value="custom">{tr("Pick a date and time…", "Elegir fecha y hora…")}</option>
          </select>
          {value.deadline === "custom" ? (
            <>
              <label htmlFor={`${idPrefix}-custom`} className="sr-only">
                {tr("Deadline date and time", "Fecha y hora límite")}
              </label>
              <input
                id={`${idPrefix}-custom`}
                type="datetime-local"
                className="input mt-2"
                value={value.custom}
                onChange={(e) => set({ custom: e.target.value })}
              />
            </>
          ) : null}
          {switchLabel ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-accent" aria-live="polite">
              <Icon name="clock" className="size-3.5" /> {tr("Switches", "Cambia el")} {switchLabel}
            </p>
          ) : null}
        </div>
      ) : null}

      {value.style !== "positions" && value.rotation === "keeper" ? (
        <div>
          <label htmlFor={`${idPrefix}-len`} className="mb-1.5 block text-sm font-medium">
            {tr("Game length (for the keeper schedule)", "Duración del partido (para el turno de porteros)")}
          </label>
          <select id={`${idPrefix}-len`} className="input" value={value.durationMin} onChange={(e) => set({ durationMin: Number(e.target.value) })}>
            {[60, 75, 90, 120].map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
