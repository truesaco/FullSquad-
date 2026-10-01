"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { Icon } from "@/components/icons";
import { Avatar } from "@/components/ui";
import { ThemeToggle } from "@/components/Nav";
import { LangToggle } from "@/lib/i18n";
import { PositionNeeds } from "@/components/PositionNeeds";
import { GameStylePicker } from "@/components/GameStylePicker";
import { defaultStyle, switchTime } from "@/lib/rotation";
import { FORMAT_SIZE, ME, involved, type Skill } from "@/lib/demo/model";
import { POSITIONS, claimSlot, emptyNeeds, type Pos } from "@/lib/positions";
import { GameCard, PlayerLine, PosToggles, useFmt } from "./bits";
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
  const { tr } = useFmt();
  const me = s.players[ME];
  const [pos, setPos] = useState<Pos[]>(me.positions);
  const [onlyMine, setOnlyMine] = useState(false);
  useEffect(() => setPos(me.positions), [me.positions]);

  const games = s.games.filter((g) => g.organizerId !== ME);
  const needsMe = (g: (typeof games)[number]) => g.roster.length < g.size && claimSlot(g.needs, pos) !== null;
  const list = onlyMine ? games.filter(needsMe) : [...games].sort((a, b) => Number(needsMe(b)) - Number(needsMe(a)));

  return (
    <>
      <ScreenTitle title={tr("Games near you", "Partidos cerca de ti")} sub={tr("Broward County · within 10 mi", "Condado de Broward · a menos de 10 mi")} />
      <div className="card mb-5 grid gap-3 p-4">
        <p className="text-sm font-semibold">{tr("I can play", "Puedo jugar de")}</p>
        <PosToggles value={pos} onChange={setPos} label={tr("Positions I can play", "Posiciones que puedo jugar")} />
        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-sm">
          <span>{tr("Only show games that need me", "Solo partidos que me necesitan")}</span>
          <Switch checked={onlyMine} onChange={setOnlyMine} label={tr("Only show games that need me", "Solo partidos que me necesitan")} />
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
        <Empty
          text={tr(
            "No games need those positions right now. Try another position, or join a waitlist.",
            "Ningún partido necesita esas posiciones ahora. Prueba otra posición o entra a una lista de espera.",
          )}
        />
      )}
    </>
  );
}

// ---------- My games ----------
export function MyGames() {
  const { s } = useApp();
  const { tr } = useFmt();
  const organizing = s.games.filter((g) => g.organizerId === ME);
  const playing = s.games.filter((g) => g.organizerId !== ME && involved(g, ME));
  return (
    <>
      <ScreenTitle
        title={tr("My Games", "Mis partidos")}
        action={
          <a href="#/post" className="btn btn-primary btn-sm">
            <Icon name="plus" className="size-4" /> {tr("Post", "Publicar")}
          </a>
        }
      />
      <h2 className="caption mb-2 text-muted">{tr("Organizing", "Organizo")}</h2>
      {organizing.length ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {organizing.map((g) => (
            <li key={g.id} className="min-w-0">
              <GameCard g={g} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty
          text={tr("You're not organizing anything yet.", "Todavía no organizas ningún partido.")}
          cta={{ href: "#/post", label: tr("Post a game", "Publica un partido") }}
        />
      )}
      <h2 className="caption mb-2 mt-8 text-muted">{tr("Playing", "Juego")}</h2>
      {playing.length ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {playing.map((g) => (
            <li key={g.id} className="min-w-0">
              <GameCard g={g} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty
          text={tr("Games you join or waitlist for show up here.", "Aquí aparecen los partidos a los que te apuntas o donde esperas.")}
          cta={{ href: "#/feed", label: tr("Find a game", "Buscar partido") }}
        />
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
  const { tr, lang, day: dayLabel, level: levelLabel } = useFmt();
  const uid = useId();
  const [title, setTitle] = useState(() => (lang === "es" ? "Fútbol del viernes" : "Friday Night Run"));
  const [day, setDay] = useState("Fri");
  const [time, setTime] = useState("19:30");
  const [place, setPlace] = useState("Brian Piccolo Park");
  const [format, setFormat] = useState("7v7");
  const [level, setLevel] = useState("All levels");
  const [needs, setNeeds] = useState(emptyNeeds());
  const [styleChoice, setStyleChoice] = useState(defaultStyle);
  const [send, setSend] = useState(true);
  const open = (FORMAT_SIZE[format] ?? 14) - 1;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const id = `g${Date.now().toString(36)}`;
    const t = Date.now();
    const { style, rotation, durationMin } = styleChoice;
    const switchAt = style === "hybrid" ? switchTime(day, time, styleChoice) : undefined;
    dispatch({ type: "create", id, t, game: { title, day, time: to12h(time), place, format, level, needs, style, rotation, switchAt, durationMin } });
    if (send) dispatch({ type: "startFill", id, t });
    go(`/game/${id}`);
  };

  return (
    <>
      <ScreenTitle title={tr("Post a game", "Publica un partido")} sub={tr("One post. Fullsquad does the chasing.", "Una publicación. Fullsquad se encarga del resto.")} />
      <form onSubmit={submit} className="card grid gap-5 p-5 md:p-6">
        <Field id={`${uid}-t`} label={tr("Game name", "Nombre del partido")}>
          <input id={`${uid}-t`} className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={40} required />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field id={`${uid}-d`} label={tr("Day", "Día")}>
            <select id={`${uid}-d`} className="input" value={day} onChange={(e) => setDay(e.target.value)}>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {dayLabel(d)}
                </option>
              ))}
            </select>
          </Field>
          <Field id={`${uid}-tm`} label={tr("Kickoff", "Hora")}>
            <input id={`${uid}-tm`} type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} required />
          </Field>
        </div>
        <Field id={`${uid}-p`} label={tr("Where", "Dónde")}>
          <input id={`${uid}-p`} className="input" value={place} onChange={(e) => setPlace(e.target.value)} maxLength={60} required />
        </Field>
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium">{tr("Format", "Formato")}</legend>
          <div className="grid grid-cols-4 gap-1 rounded-lg border border-line bg-bg-alt p-1">
            {Object.keys(FORMAT_SIZE).map((f) => (
              <label
                key={f}
                className={`flex min-h-11 cursor-pointer items-center justify-center rounded-md text-sm font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                  format === f ? "bg-surface text-fg shadow-sm" : "text-muted"
                }`}
              >
                <input type="radio" className="sr-only" name={`${uid}-f`} checked={format === f} onChange={() => setFormat(f)} />
                {f}
              </label>
            ))}
          </div>
        </fieldset>
        <GameStylePicker
          value={styleChoice}
          onChange={setStyleChoice}
          day={day}
          time={time}
          idPrefix={`${uid}-st`}
          positions={<PositionNeeds total={open} value={needs} onChange={setNeeds} idPrefix={`${uid}-n`} />}
        />
        <Field id={`${uid}-l`} label={tr("Skill level", "Nivel")}>
          <select id={`${uid}-l`} className="input" value={level} onChange={(e) => setLevel(e.target.value)}>
            {["All levels", "Casual", "Intermediate", "Competitive"].map((l) => (
              <option key={l} value={l}>
                {levelLabel(l)}
              </option>
            ))}
          </select>
        </Field>
        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg bg-bg-alt px-3 text-sm">
          <span>
            <span className="font-semibold">{tr("Send to my crew right away", "Enviar a mi grupo ahora")}</span>
            <span className="block text-muted">{tr("Crew sees it first, then nearby players who fit.", "Tu grupo lo ve primero y después jugadores cercanos que encajan.")}</span>
          </span>
          <Switch checked={send} onChange={setSend} label={tr("Send to my crew right away", "Enviar a mi grupo ahora")} />
        </label>
        <button type="submit" className="btn btn-primary w-full">
          {tr("Post game", "Publicar partido")} <Icon name="send" className="size-4" />
        </button>
      </form>
    </>
  );
}

// ---------- Crew ----------
export function Crew() {
  const { s, dispatch } = useApp();
  const { tr } = useFmt();
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
      <ScreenTitle
        title={tr("Your crew", "Tu grupo")}
        sub={tr(`${crewCount} regulars · they see your games first`, `${crewCount} de siempre · ven tus partidos primero`)}
      />
      <div className="card mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{tr("Crew invite link", "Link de invitación al grupo")}</p>
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
          <Icon name={copied ? "check" : "copy"} className="size-4" /> {copied ? tr("Copied", "Copiado") : tr("Copy link", "Copiar link")}
        </button>
      </div>
      <div className="mb-4 grid gap-3">
        <label className="sr-only" htmlFor="crew-q">
          {tr("Search players", "Buscar jugadores")}
        </label>
        <input id="crew-q" className="input" placeholder={tr("Search players", "Buscar jugadores")} value={q} onChange={(e) => setQ(e.target.value)} />
        <div role="group" aria-label={tr("Filter by position", "Filtrar por posición")} className="flex flex-wrap gap-2">
          {(["ALL", ...POSITIONS] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={filter === p}
              onClick={() => setFilter(p)}
              className={`min-h-11 rounded-full border px-4 text-sm font-bold ${filter === p ? "border-accent bg-accent text-bg" : "border-line bg-surface hover:bg-bg-alt"}`}
            >
              {p === "ALL" ? tr("All positions", "Todas") : p}
            </button>
          ))}
        </div>
      </div>
      <h2 className="caption mb-2 text-muted">
        {tr("Crew", "Grupo")} · {crew.length}
      </h2>
      <ul className="grid gap-2 md:grid-cols-2">
        {crew.map((p) => (
          <li key={p.id} className="min-w-0">
            <PlayerLine
              p={p}
              pos={p.positions[0]}
              right={<span className="hidden text-xs text-muted sm:inline">{p.positions.slice(1).map((x) => `${tr("also", "también")} ${x}`).join(", ")}</span>}
            />
          </li>
        ))}
      </ul>
      <h2 className="caption mb-2 mt-8 text-muted">
        {tr("Nearby players who fit", "Jugadores cercanos que encajan")} · {nearby.length}
      </h2>
      <ul className="grid gap-2 md:grid-cols-2">
        {nearby.map((p) => (
          <li key={p.id} className="min-w-0">
            <PlayerLine
              p={p}
              pos={p.positions[0]}
              right={
                <button type="button" className="btn btn-sm btn-secondary !min-h-9 !px-3" onClick={() => dispatch({ type: "crew", pid: p.id })}>
                  <Icon name="plus" className="size-4" />
                  <span className="sr-only">{tr(`Add ${p.name} to crew`, `Agregar a ${p.name} al grupo`)}</span>
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
  const { tr, level: levelLabel } = useFmt();
  const me = s.players[ME];
  const [notif, setNotif] = useState({ crew: true, nearby: true, backfill: true });
  const setPositions = (positions: Pos[]) => positions.length && dispatch({ type: "profile", positions, skill: me.skill });
  return (
    <>
      <ScreenTitle title={tr("Profile", "Perfil")} />
      <div className="card grid gap-6 p-5 md:p-6">
        <div className="flex items-center gap-4">
          <Avatar name="Diego R" className="size-14 text-base" />
          <div>
            <p className="text-lg font-bold">Diego R.</p>
            <p className="text-sm text-muted">
              {tr("Organizer", "Organizador")} · {tr("shows up", "asiste")} {me.showed}/{me.of}
            </p>
          </div>
        </div>
        <div>
          <p className="mb-1 text-sm font-semibold">{tr("Positions I play", "Posiciones que juego")}</p>
          <p className="mb-2 text-sm text-muted">
            {tr("Pick every spot you're happy playing. The first one is your main position.", "Elige todas las posiciones que te gusta jugar. La primera es tu posición principal.")}
          </p>
          <PosToggles value={me.positions} onChange={setPositions} label={tr("Positions I play", "Posiciones que juego")} />
          <label className="mt-3 flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg bg-bg-alt px-3 text-sm">
            <span>
              <span className="font-semibold">{tr("Happy to take a turn in goal", "Puedo tapar un rato")}</span>
              <span className="block text-muted">
                {tr("In rotating-keeper games you'll go in goal first.", "En partidos con portero rotativo te toca primero.")}
              </span>
            </span>
            <Switch
              checked={me.goalOk}
              onChange={(v) => dispatch({ type: "profile", positions: me.positions, skill: me.skill, goalOk: v })}
              label={tr("Happy to take a turn in goal", "Puedo tapar un rato")}
            />
          </label>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">{tr("Skill", "Nivel")}</p>
          <div className="inline-flex rounded-lg border border-line bg-bg-alt p-1" role="group" aria-label={tr("Skill", "Nivel")}>
            {(["Casual", "Intermediate", "Competitive"] as Skill[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={me.skill === k}
                onClick={() => dispatch({ type: "profile", positions: me.positions, skill: k })}
                className={`min-h-11 rounded-md px-3 text-sm font-semibold ${me.skill === k ? "bg-surface shadow-sm" : "text-muted"}`}
              >
                {levelLabel(k)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-1">
          <p className="mb-1 text-sm font-semibold">{tr("Notify me about", "Avísame sobre")}</p>
          {(
            [
              ["crew", tr("New games from my crews", "Partidos nuevos de mis grupos")],
              ["nearby", tr("Nearby games that need my positions", "Partidos cercanos que necesitan mis posiciones")],
              ["backfill", tr("Backfill offers when I'm on a waitlist", "Ofertas de cupo cuando estoy en lista de espera")],
            ] as const
          ).map(([k, label]) => (
            <label key={k} className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-sm">
              {label}
              <Switch checked={notif[k]} onChange={(v) => setNotif({ ...notif, [k]: v })} label={label} />
            </label>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-line pt-4 text-sm">
          <span className="font-semibold">{tr("Theme", "Tema")}</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between border-t border-line pt-4 text-sm">
          <span className="font-semibold">{tr("Language", "Idioma")}</span>
          <LangToggle />
        </div>
        <div className="flex flex-wrap gap-3 border-t border-line pt-4">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => dispatch({ type: "reset" })}>
            <Icon name="refresh" className="size-4" /> {tr("Reset demo data", "Reiniciar datos de la demo")}
          </button>
          <a href="/" className="btn btn-sm text-accent">
            {tr("Back to the website", "Volver al sitio web")}
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
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-accent" : "bg-line"}`}
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
