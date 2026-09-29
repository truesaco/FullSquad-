"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { Icon } from "@/components/icons";
import { Avatar } from "@/components/ui";
import { ThemeToggle } from "@/components/Nav";
import { PositionNeeds } from "@/components/PositionNeeds";
import { FORMAT_SIZE, ME, involved, type Skill } from "@/lib/demo/model";
import { POSITIONS, claimSlot, emptyNeeds, type Pos } from "@/lib/positions";
import { GameCard, PlayerLine, PosToggles } from "./bits";
import { useApp } from "./store";

export function ScreenTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl leading-tight md:text-4xl">{title}</h1>
        {sub ? <p className="mt-1 text-muted">{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

// ---------- Feed ----------
export function Feed() {
  const { s } = useApp();
  const me = s.players[ME];
  const [pos, setPos] = useState<Pos[]>(me.positions);
  const [onlyMine, setOnlyMine] = useState(false);
  useEffect(() => setPos(me.positions), [me.positions]);

  const games = s.games.filter((g) => g.organizerId !== ME);
  const needsMe = (g: (typeof games)[number]) => g.roster.length < g.size && claimSlot(g.needs, pos) !== null;
  const list = onlyMine ? games.filter(needsMe) : [...games].sort((a, b) => Number(needsMe(b)) - Number(needsMe(a)));

  return (
    <>
      <ScreenTitle title="Games near you" sub="Broward County · within 10 mi" />
      <div className="card mb-5 grid gap-3 p-4">
        <p className="text-sm font-semibold">I can play</p>
        <PosToggles value={pos} onChange={setPos} label="Positions I can play" />
        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-sm">
          <span>Only show games that need me</span>
          <Switch checked={onlyMine} onChange={setOnlyMine} label="Only show games that need me" />
        </label>
      </div>
      {list.length ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {list.map((g) => (
            <li key={g.id} className="min-w-0">
              <GameCard g={g} mine={pos} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty text="No games need those positions right now. Try another position, or join a waitlist." />
      )}
    </>
  );
}

// ---------- My games ----------
export function MyGames() {
  const { s } = useApp();
  const organizing = s.games.filter((g) => g.organizerId === ME);
  const playing = s.games.filter((g) => g.organizerId !== ME && involved(g, ME));
  return (
    <>
      <ScreenTitle
        title="My Games"
        action={
          <a href="#/post" className="btn btn-primary btn-sm">
            <Icon name="plus" className="size-4" /> Post
          </a>
        }
      />
      <h2 className="caption mb-2 text-muted">Organizing</h2>
      {organizing.length ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {organizing.map((g) => (
            <li key={g.id} className="min-w-0">
              <GameCard g={g} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty text="You're not organizing anything yet." cta={{ href: "#/post", label: "Post a game" }} />
      )}
      <h2 className="caption mb-2 mt-8 text-muted">Playing</h2>
      {playing.length ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {playing.map((g) => (
            <li key={g.id} className="min-w-0">
              <GameCard g={g} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty text="Games you join or waitlist for show up here." cta={{ href: "#/feed", label: "Find a game" }} />
      )}
    </>
  );
}

// ---------- Post ----------
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function to12h(t: string) {
  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h)) return t;
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m ?? 0).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export function PostScreen() {
  const { dispatch, go } = useApp();
  const uid = useId();
  const [title, setTitle] = useState("Friday Night Run");
  const [day, setDay] = useState("Fri");
  const [time, setTime] = useState("19:30");
  const [place, setPlace] = useState("Brian Piccolo Park");
  const [format, setFormat] = useState("7v7");
  const [level, setLevel] = useState("All levels");
  const [needs, setNeeds] = useState(emptyNeeds());
  const [send, setSend] = useState(true);
  const open = (FORMAT_SIZE[format] ?? 14) - 1;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const id = `g${Date.now().toString(36)}`;
    const t = Date.now();
    dispatch({ type: "create", id, t, game: { title, day, time: to12h(time), place, format, level, needs } });
    if (send) dispatch({ type: "startFill", id, t });
    go(`/game/${id}`);
  };

  return (
    <>
      <ScreenTitle title="Post a game" sub="One post. FullSquad does the chasing." />
      <form onSubmit={submit} className="card grid gap-5 p-5 md:p-6">
        <Field id={`${uid}-t`} label="Game name">
          <input id={`${uid}-t`} className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={40} required />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field id={`${uid}-d`} label="Day">
            <select id={`${uid}-d`} className="input" value={day} onChange={(e) => setDay(e.target.value)}>
              {DAYS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field id={`${uid}-tm`} label="Kickoff">
            <input id={`${uid}-tm`} type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} required />
          </Field>
        </div>
        <Field id={`${uid}-p`} label="Where">
          <input id={`${uid}-p`} className="input" value={place} onChange={(e) => setPlace(e.target.value)} maxLength={60} required />
        </Field>
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">Format</legend>
          <div className="grid grid-cols-4 gap-1 rounded-lg border border-line bg-bg-alt p-1">
            {Object.keys(FORMAT_SIZE).map((f) => (
              <label
                key={f}
                className={`flex min-h-11 cursor-pointer items-center justify-center rounded-md text-sm font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary ${
                  format === f ? "bg-surface text-fg shadow-sm" : "text-muted"
                }`}
              >
                <input type="radio" className="sr-only" name={`${uid}-f`} checked={format === f} onChange={() => setFormat(f)} />
                {f}
              </label>
            ))}
          </div>
        </fieldset>
        <PositionNeeds total={open} value={needs} onChange={setNeeds} idPrefix={`${uid}-n`} />
        <Field id={`${uid}-l`} label="Skill level">
          <select id={`${uid}-l`} className="input" value={level} onChange={(e) => setLevel(e.target.value)}>
            {["All levels", "Casual", "Intermediate", "Competitive"].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </Field>
        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg bg-bg-alt px-3 text-sm">
          <span>
            <span className="font-semibold">Send to my crew right away</span>
            <span className="block text-muted">Crew sees it first, then nearby players who fit.</span>
          </span>
          <Switch checked={send} onChange={setSend} label="Send to my crew right away" />
        </label>
        <button type="submit" className="btn btn-primary w-full">
          Post game <Icon name="send" className="size-4" />
        </button>
      </form>
    </>
  );
}

// ---------- Crew ----------
export function Crew() {
  const { s, dispatch } = useApp();
  const [filter, setFilter] = useState<Pos | "ALL">("ALL");
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(false);
  const all = Object.values(s.players).filter((p) => p.id !== ME);
  const match = (p: (typeof all)[number]) =>
    (filter === "ALL" || p.positions.includes(filter)) && p.name.toLowerCase().includes(q.trim().toLowerCase());
  const crew = all.filter((p) => p.crew && match(p)).sort((a, b) => b.showed / b.of - a.showed / a.of);
  const nearby = all.filter((p) => !p.crew && match(p)).sort((a, b) => a.miles - b.miles);
  const crewCount = all.filter((p) => p.crew).length;

  return (
    <>
      <ScreenTitle title="Your crew" sub={`${crewCount} regulars · they see your games first`} />
      <div className="card mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Crew invite link</p>
          <p className="truncate text-sm text-accent">fullsquad.app/c/diego-sunday-crew</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText("https://fullsquad.app/c/diego-sunday-crew");
            } catch {}
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          }}
        >
          <Icon name={copied ? "check" : "copy"} className="size-4" /> {copied ? "Copied" : "Copy link"}
        </button>
      </div>
      <div className="mb-4 grid gap-3">
        <label className="sr-only" htmlFor="crew-q">
          Search players
        </label>
        <input id="crew-q" className="input" placeholder="Search players" value={q} onChange={(e) => setQ(e.target.value)} />
        <div role="group" aria-label="Filter by position" className="flex flex-wrap gap-2">
          {(["ALL", ...POSITIONS] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={filter === p}
              onClick={() => setFilter(p)}
              className={`min-h-11 rounded-full border px-4 text-sm font-bold ${filter === p ? "border-primary bg-primary text-on-primary" : "border-line bg-surface hover:bg-bg-alt"}`}
            >
              {p === "ALL" ? "All positions" : p}
            </button>
          ))}
        </div>
      </div>
      <h2 className="caption mb-2 text-muted">Crew · {crew.length}</h2>
      <ul className="grid gap-2 md:grid-cols-2">
        {crew.map((p) => (
          <li key={p.id} className="min-w-0">
            <PlayerLine
              p={p}
              pos={p.positions[0]}
              right={<span className="hidden text-xs text-muted sm:inline">{p.positions.slice(1).map((x) => `also ${x}`).join(", ")}</span>}
            />
          </li>
        ))}
      </ul>
      <h2 className="caption mb-2 mt-8 text-muted">Nearby players who fit · {nearby.length}</h2>
      <ul className="grid gap-2 md:grid-cols-2">
        {nearby.map((p) => (
          <li key={p.id} className="min-w-0">
            <PlayerLine
              p={p}
              pos={p.positions[0]}
              right={
                <button type="button" className="btn btn-sm btn-secondary !min-h-9 !px-3" onClick={() => dispatch({ type: "crew", pid: p.id })}>
                  <Icon name="plus" className="size-4" />
                  <span className="sr-only">Add {p.name} to crew</span>
                </button>
              }
            />
          </li>
        ))}
      </ul>
    </>
  );
}

// ---------- Profile ----------
export function Profile() {
  const { s, dispatch } = useApp();
  const me = s.players[ME];
  const [notif, setNotif] = useState({ crew: true, nearby: true, backfill: true });
  const setPositions = (positions: Pos[]) => positions.length && dispatch({ type: "profile", positions, skill: me.skill });
  return (
    <>
      <ScreenTitle title="Profile" />
      <div className="card grid gap-6 p-5 md:p-6">
        <div className="flex items-center gap-4">
          <Avatar name="Diego R" className="size-14 text-base" />
          <div>
            <p className="text-lg font-bold">Diego R.</p>
            <p className="text-sm text-muted">
              Organizer · shows up {me.showed}/{me.of}
            </p>
          </div>
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold">Positions I play</p>
          <p className="mb-2 text-sm text-muted">Pick every spot you&apos;re happy playing. The first one is your main position.</p>
          <PosToggles value={me.positions} onChange={setPositions} label="Positions I play" />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Skill</p>
          <div className="inline-flex rounded-lg border border-line bg-bg-alt p-1" role="group" aria-label="Skill">
            {(["Casual", "Intermediate", "Competitive"] as Skill[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={me.skill === k}
                onClick={() => dispatch({ type: "profile", positions: me.positions, skill: k })}
                className={`min-h-11 rounded-md px-3 text-sm font-semibold ${me.skill === k ? "bg-surface shadow-sm" : "text-muted"}`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-1">
          <p className="mb-1 text-sm font-semibold">Notify me about</p>
          {(
            [
              ["crew", "New games from my crews"],
              ["nearby", "Nearby games that need my positions"],
              ["backfill", "Backfill offers when I'm on a waitlist"],
            ] as const
          ).map(([k, label]) => (
            <label key={k} className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-sm">
              {label}
              <Switch checked={notif[k]} onChange={(v) => setNotif({ ...notif, [k]: v })} label={label} />
            </label>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-line pt-4 text-sm">
          <span className="font-semibold">Theme</span>
          <ThemeToggle />
        </div>
        <div className="flex flex-wrap gap-3 border-t border-line pt-4">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => dispatch({ type: "reset" })}>
            <Icon name="refresh" className="size-4" /> Reset demo data
          </button>
          <a href="/" className="btn btn-sm text-accent">
            Back to the website
          </a>
        </div>
      </div>
    </>
  );
}

// ---------- small shared ----------
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        onChange(!checked);
      }}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-line"}`}
    >
      <span className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

export function Empty({ text, cta }: { text: string; cta?: { href: string; label: string } }) {
  return (
    <div className="rounded-xl border border-dashed border-line p-8 text-center text-muted">
      <p>{text}</p>
      {cta ? (
        <a href={cta.href} className="btn btn-secondary btn-sm mt-4">
          {cta.label}
        </a>
      ) : null}
    </div>
  );
}
