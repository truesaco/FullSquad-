"use client";

import { Icon } from "@/components/icons";
import { Avatar, RosterMeter } from "@/components/ui";
import { ME, OFFER_SECONDS, isFull, name, posCounts, type Game, type Player, type State } from "@/lib/demo/model";
import { POSITIONS, POS_NAME, type Pos } from "@/lib/positions";
import { useApp } from "./store";

export function NeedChips({ g, mine = [] }: { g: Game; mine?: Pos[] }) {
  if (isFull(g)) return null;
  const chips = [
    ...POSITIONS.filter((p) => g.needs[p] > 0).map((p) => ({ key: p, label: `${g.needs[p]} ${p}`, match: mine.includes(p) })),
    ...(g.needs.ANY > 0 ? [{ key: "ANY", label: `${g.needs.ANY} any position`, match: mine.length > 0 }] : []),
  ];
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Open spots">
      {chips.map((c) => (
        <li
          key={c.key}
          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${c.match ? "bg-tint text-accent ring-1 ring-primary" : "bg-bg-alt text-muted"}`}
        >
          Need {c.label}
        </li>
      ))}
    </ul>
  );
}

export function Status({ g }: { g: Game; s?: State }) {
  const onRoster = g.roster.some((r) => r.pid === ME);
  const wl = g.waitlist.indexOf(ME);
  if (g.organizerId !== ME && onRoster) return <Badge tone="success" icon="check">You&apos;re in</Badge>;
  if (wl >= 0) return <Badge tone="info" icon="queue">You&apos;re #{wl + 1} in line</Badge>;
  if (isFull(g)) return <Badge tone="success" icon="check">Game on</Badge>;
  if (g.fillQueue.length) return <Badge tone="info" icon="refresh">Filling…</Badge>;
  return <Badge tone="warning" icon="warning">Need {g.size - g.roster.length}</Badge>;
}

export function Badge({ tone, icon, children }: { tone: "success" | "info" | "warning" | "muted"; icon?: Parameters<typeof Icon>[0]["name"]; children: React.ReactNode }) {
  const cls = {
    success: "bg-turf text-white",
    info: "bg-[#dbeafe] text-[#1e40af] dark:bg-[#1e3a8a] dark:text-[#dbeafe]",
    warning: "bg-[#fef3c7] text-[#92400e] dark:bg-[#78350f] dark:text-[#fef3c7]",
    muted: "bg-bg-alt text-muted",
  }[tone];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${cls}`}>
      {icon ? <Icon name={icon} className="size-3.5" strokeWidth={2.5} /> : null}
      {children}
    </span>
  );
}

export function GameCard({ g, mine = [] }: { g: Game; mine?: Pos[] }) {
  const { s } = useApp();
  return (
    <a href={`#/game/${g.id}`} className="card block p-4 transition-transform hover:-translate-y-0.5 hover:shadow-md md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold">{g.title}</p>
          <p className="truncate text-sm text-muted">
            {g.day} {g.time} · {g.place}
          </p>
        </div>
        <Status g={g} s={s} />
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="font-bold tabular">
          <span className="text-2xl">{g.roster.length}</span>
          <span className="text-muted">/{g.size}</span>
        </p>
        <p className="text-xs text-muted">
          {g.format} · {g.level}
          {g.waitlist.length ? ` · ${g.waitlist.length} waiting` : ""}
        </p>
      </div>
      <RosterMeter filled={g.roster.length} total={g.size} size="sm" className="mt-2" />
      <div className="mt-3">
        <NeedChips g={g} mine={mine} />
      </div>
      {g.organizerId !== ME ? <p className="mt-3 text-xs text-muted">Organized by {name(s, g.organizerId)}</p> : null}
    </a>
  );
}

export function PosBalance({ g }: { g: Game }) {
  const c = posCounts(g);
  const warn =
    c.GK === 0 && g.needs.GK === 0
      ? "No keeper yet"
      : c.FWD > c.DEF + 2
        ? "Top-heavy: more forwards than defenders"
        : c.DEF === 0 && g.roster.length > 4
          ? "No defenders yet"
          : null;
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {POSITIONS.map((p) => (
          <div key={p} className="rounded-lg bg-bg-alt p-2 text-center">
            <p className="text-xl font-bold tabular">{c[p]}</p>
            <p className="caption text-muted" title={POS_NAME[p]}>
              {p}
            </p>
            {g.needs[p] > 0 ? <p className="text-[11px] font-semibold text-warning">+{g.needs[p]} needed</p> : null}
          </div>
        ))}
      </div>
      {warn ? (
        <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-[#fef3c7] px-3 py-2 text-sm font-semibold text-[#92400e] dark:bg-[#78350f] dark:text-[#fef3c7]">
          <Icon name="warning" className="size-4" /> {warn}
        </p>
      ) : (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-success">
          <Icon name="check" className="size-4" strokeWidth={2.5} /> Positions look balanced
        </p>
      )}
    </div>
  );
}

export function PlayerLine({ p, pos, right }: { p: Player; pos?: Pos; right?: React.ReactNode }) {
  const pct = Math.round((p.showed / p.of) * 100);
  return (
    <div className="flex min-h-12 items-center gap-3 rounded-lg bg-bg-alt px-3 py-2">
      <Avatar name={p.id === ME ? "You" : p.name} className="size-8 text-[11px]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {p.id === ME ? `${p.name} (you)` : p.name}
          {pos ? <span className="pos ml-2">{pos}</span> : null}
        </p>
        <p className="truncate text-xs text-muted">
          {p.crew ? "Crew" : `Nearby · ${p.miles} mi`} · shows up {p.showed}/{p.of} ({pct}%)
        </p>
      </div>
      {right}
    </div>
  );
}

export function relTime(t: number, now: number) {
  const s = Math.max(0, Math.round((now - t) / 1000));
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.round(m / 60)}h ago`;
}

export function secondsLeft(startedAt: number, now: number) {
  return Math.max(0, OFFER_SECONDS - Math.floor((now - startedAt) / 1000));
}

export function Toasts() {
  const { s, dispatch } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-4 top-16 z-[1100] grid justify-items-center gap-2 md:inset-x-auto md:right-6 md:top-auto md:bottom-6" aria-live="polite">
      {s.toasts.map((t) => (
        <div key={t.id} className="anim-toast pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl bg-[#0f1b2d] px-4 py-3 text-white shadow-xl">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-mint text-[#0f1b2d]">
            <Icon name="check" className="size-4" strokeWidth={3} />
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block text-sm font-bold">{t.text}</span>
            {t.sub ? <span className="block text-xs text-white/70">{t.sub}</span> : null}
          </span>
          <button type="button" onClick={() => dispatch({ type: "dismiss", toastId: t.id })} className="flex size-8 items-center justify-center rounded-full hover:bg-white/10" aria-label="Dismiss">
            <Icon name="x" className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

/** The one-tap backfill prompt, shown when a spot is offered to you. */
export function BackfillSheet() {
  const { s, dispatch, now, go } = useApp();
  const g = s.games.find((x) => x.offer?.pid === ME);
  if (!g || !g.offer) return null;
  const left = secondsLeft(g.offer.startedAt, now);
  return (
    <div className="fixed inset-x-0 bottom-0 z-[1200] p-3 md:bottom-6 md:left-auto md:right-6 md:w-[400px] md:p-0" role="alertdialog" aria-labelledby="bf-title" aria-describedby="bf-desc">
      <div className="anim-toast rounded-2xl bg-[#0f1b2d] p-5 text-white shadow-2xl ring-1 ring-white/10">
        <p className="flex items-center gap-2 text-xs text-white/70">
          <Icon name="bell" className="size-4" /> FullSquad · now
        </p>
        <p id="bf-title" className="mt-2 text-lg font-bold">
          A spot opened for {g.title}, {g.day} {g.time}
        </p>
        <p id="bf-desc" className="mt-1 text-sm text-white/75">
          {g.offer.dropped} dropped. You&apos;re next in line. Rolls to the next player in{" "}
          <span className="font-bold text-flood tabular">0:{String(left).padStart(2, "0")}</span>
          <span className="text-white/50"> (demo speed)</span>
        </p>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/15">
          <div className="h-full bg-flood transition-[width] duration-1000 ease-linear" style={{ width: `${(left / OFFER_SECONDS) * 100}%` }} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" className="btn btn-sm border border-white/25 text-white hover:bg-white/10" onClick={() => dispatch({ type: "respond", id: g.id, t: Date.now(), accept: false })}>
            Pass
          </button>
          <button
            type="button"
            className="btn btn-sm bg-mint text-[#0f1b2d] hover:brightness-95"
            onClick={() => {
              dispatch({ type: "respond", id: g.id, t: Date.now(), accept: true });
              go(`/game/${g.id}`);
            }}
          >
            I&apos;m In
          </button>
        </div>
      </div>
    </div>
  );
}

export function PosToggles({
  value,
  onChange,
  label,
}: {
  value: Pos[];
  onChange: (v: Pos[]) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {POSITIONS.map((p) => {
        const on = value.includes(p);
        return (
          <button
            key={p}
            type="button"
            aria-pressed={on}
            title={POS_NAME[p]}
            onClick={() => onChange(on ? value.filter((x) => x !== p) : [...value, p])}
            className={`inline-flex min-h-11 min-w-14 items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-bold transition-colors ${
              on ? "border-primary bg-tint text-accent" : "border-line bg-surface hover:bg-bg-alt"
            }`}
          >
            {on ? <Icon name="check" className="size-4" strokeWidth={3} /> : null}
            {p}
            <span className="sr-only"> ({POS_NAME[p]})</span>
          </button>
        );
      })}
    </div>
  );
}
