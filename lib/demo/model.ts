// Fullsquad app demo: data model, seed data, and a pure reducer.
// Everything runs in the browser with simulated players; nothing is sent anywhere.
import type { L } from "@/lib/i18n";
import { switchTime, type Rotation, type Style } from "@/lib/rotation";
import { claimSlot, emptyNeeds, fitNeeds, totalNeeds, type NeedKey, type Needs, type Pos } from "@/lib/positions";

export type Skill = "Casual" | "Intermediate" | "Competitive";
export type Player = {
  id: string;
  name: string;
  positions: Pos[]; // first = main position
  skill: Skill;
  miles: number;
  showed: number;
  of: number;
  crew: boolean;
  goalOk: boolean; // happy to take a turn in goal
};
export type Spot = { pid: string; pos: Pos };
export type Offer = { pid: string; pos: Pos; dropped: L; startedAt: number; passed: string[] };
export type LogKind = "post" | "join" | "match" | "wait" | "drop" | "offer" | "pass" | "in" | "info";
export type LogEntry = { t: number; kind: LogKind; text: L };
export type Game = {
  id: string;
  title: string;
  day: string;
  time: string;
  place: string;
  format: string;
  size: number;
  level: string;
  organizerId: string;
  needs: Needs; // open spots still to fill, by position; sums to size - roster.length
  roster: Spot[];
  waitlist: string[];
  offer: Offer | null;
  fillQueue: string[];
  log: LogEntry[];
  style: Style;
  rotation: Rotation;
  switchAt?: number; // "hybrid" games: when unfilled position spots open up / keeper starts rotating
  durationMin: number;
};
export type Toast = { id: number; text: L; sub?: L };
export type State = { players: Record<string, Player>; games: Game[]; toasts: Toast[]; seq: number };

export const ME = "me";
export const OFFER_SECONDS = 15; // demo speed: 15 seconds stands in for 15 minutes
export const FORMAT_SIZE: Record<string, number> = { "5v5": 10, "7v7": 14, "8v8": 16, "11v11": 22 };

const P = (
  id: string,
  name: string,
  positions: Pos[],
  skill: Skill,
  miles: number,
  showed: number,
  of: number,
  crew: boolean,
  goalOk: boolean,
): Player => ({
  id,
  name,
  positions,
  skill,
  miles,
  showed,
  of,
  crew,
  goalOk,
});

const SEED_PLAYERS: Player[] = [
  P(ME, "Diego", ["MID", "FWD"], "Intermediate", 0, 24, 24, true, false),
  // Crew
  P("marco", "Marco", ["DEF"], "Intermediate", 1.2, 20, 21, true, false),
  P("kevin", "Kevin", ["FWD"], "Competitive", 2.4, 15, 18, true, false),
  P("tomas", "Tomás", ["GK"], "Intermediate", 3.0, 11, 12, true, true),
  P("andres", "Andrés", ["MID"], "Casual", 1.8, 12, 17, true, true),
  P("sebastian", "Sebastián", ["MID", "DEF"], "Intermediate", 2.1, 19, 20, true, false),
  P("camilo", "Camilo", ["DEF"], "Casual", 4.2, 9, 11, true, false),
  P("rafa", "Rafa", ["MID"], "Competitive", 0.9, 22, 22, true, false),
  P("jorge", "Jorge", ["FWD"], "Intermediate", 3.3, 13, 15, true, false),
  P("nico", "Nico", ["DEF", "MID"], "Intermediate", 2.7, 16, 16, true, true),
  P("ivan", "Iván", ["MID"], "Casual", 5.1, 7, 10, true, true),
  P("pablo", "Pablo", ["FWD", "MID"], "Intermediate", 1.5, 18, 19, true, false),
  P("mateo", "Mateo", ["DEF"], "Competitive", 2.2, 14, 14, true, false),
  P("julian", "Julián", ["MID"], "Intermediate", 3.8, 10, 12, true, true),
  P("luis", "Luis", ["MID", "FWD"], "Intermediate", 2.0, 17, 18, true, false),
  P("santi", "Santi", ["DEF"], "Casual", 4.5, 8, 9, true, false),
  P("beto", "Beto", ["GK", "DEF"], "Casual", 6.0, 6, 8, true, true),
  P("felipe", "Felipe", ["FWD"], "Casual", 3.1, 9, 12, true, false),
  P("oscar", "Óscar", ["DEF"], "Intermediate", 2.9, 12, 13, true, false),
  // Nearby players who aren't in the crew yet
  P("chris", "Chris", ["GK"], "Intermediate", 2.1, 9, 10, false, true),
  P("jamal", "Jamal", ["DEF"], "Competitive", 3.4, 21, 22, false, false),
  P("wes", "Wes", ["MID"], "Intermediate", 1.7, 8, 9, false, false),
  P("daniel", "Daniel", ["FWD"], "Intermediate", 4.0, 12, 14, false, false),
  P("ali", "Ali", ["MID", "DEF"], "Casual", 2.6, 5, 6, false, false),
  P("marcus", "Marcus", ["DEF"], "Intermediate", 5.5, 10, 13, false, false),
  P("emeka", "Emeka", ["FWD"], "Competitive", 3.9, 16, 16, false, false),
  P("ryan", "Ryan", ["GK"], "Casual", 4.8, 4, 5, false, true),
  P("tyler", "Tyler", ["MID"], "Intermediate", 2.3, 11, 12, false, false),
  P("omar", "Omar", ["DEF", "MID"], "Intermediate", 3.6, 13, 15, false, true),
  P("leo", "Leo", ["FWD"], "Casual", 1.4, 6, 9, false, false),
  P("sam", "Sam", ["MID"], "Intermediate", 6.2, 9, 10, false, true),
];

const spot = (pid: string, players: Record<string, Player>): Spot => ({ pid, pos: players[pid].positions[0] });

function makeGame(
  players: Record<string, Player>,
  g: Omit<Game, "needs" | "roster" | "waitlist" | "offer" | "fillQueue" | "log" | "size" | "style" | "rotation" | "durationMin"> & {
    style?: Style;
    rotation?: Rotation;
    durationMin?: number;
    roster: string[];
    waitlist?: string[];
    want?: Partial<Needs>;
    log?: LogEntry[];
  },
): Game {
  const size = FORMAT_SIZE[g.format] ?? 14;
  const roster = g.roster.map((pid) => spot(pid, players));
  return {
    id: g.id,
    title: g.title,
    day: g.day,
    time: g.time,
    place: g.place,
    format: g.format,
    size,
    level: g.level,
    organizerId: g.organizerId,
    roster,
    needs: fitNeeds({ ...emptyNeeds(), ...g.want }, size - roster.length),
    waitlist: g.waitlist ?? [],
    offer: null,
    fillQueue: [],
    log: g.log ?? [],
    style: g.style ?? "positions",
    rotation: g.rotation ?? "keeper",
    switchAt: g.switchAt,
    durationMin: g.durationMin ?? 60,
  };
}

export function seedState(): State {
  const players = Object.fromEntries(SEED_PLAYERS.map((p) => [p.id, { ...p }]));
  const t = Date.now();
  const games: Game[] = [
    makeGame(players, {
      id: "sunday-run",
      title: "Sunday Run",
      day: "Sun",
      time: "8:30 AM",
      place: "Brian Piccolo Park",
      format: "7v7",
      level: "All levels",
      organizerId: ME,
      roster: [ME, "marco", "kevin", "sebastian", "rafa", "jorge", "nico", "pablo", "mateo", "julian"],
      want: { GK: 1, DEF: 1 },
      style: "hybrid",
      rotation: "keeper",
      switchAt: switchTime("Sun", "8:30 AM", { deadline: "night", custom: "" }),
      log: [{ t, kind: "post", text: B("You posted the game to your crew.", "Publicaste el partido para tu grupo.") }],
    }),
    makeGame(players, {
      id: "wednesday-run",
      title: "Wednesday Run",
      day: "Wed",
      time: "7:30 PM",
      place: "Brian Piccolo Park",
      format: "7v7",
      level: "Intermediate",
      organizerId: ME,
      roster: [ME, "marco", "kevin", "tomas", "andres", "sebastian", "camilo", "rafa", "jorge", "nico", "ivan", "pablo", "mateo", "julian"],
      waitlist: ["luis", "santi", "oscar"],
      log: [
        { t: t - 60000, kind: "info", text: B("Game filled: 14/14. Game on.", "Partido lleno: 14/14. ¡A jugar!") },
        { t, kind: "wait", text: B("Luis, Santi and Óscar are on the waitlist.", "Luis, Santi y Óscar están en la lista de espera.") },
      ],
    }),
    makeGame(players, {
      id: "tue-futsal",
      title: "Tuesday Futsal",
      day: "Tue",
      time: "8:00 PM",
      place: "Miramar Futsal Courts",
      format: "5v5",
      level: "Competitive",
      organizerId: "rafa",
      roster: ["rafa", "kevin", "wes", "emeka", "jamal", "leo", "pablo", "omar"],
      style: "rotating",
      rotation: "keeper",
      durationMin: 60,
    }),
    makeGame(players, {
      id: "sat-11s",
      title: "Saturday 11s",
      day: "Sat",
      time: "9:00 AM",
      place: "Markham Park",
      format: "11v11",
      level: "All levels",
      organizerId: "jamal",
      roster: ["jamal", "chris", "marcus", "omar", "wes", "tyler", "daniel", "emeka", "ali", "sam", "leo", "ryan", "felipe", "oscar", "beto", "camilo", "ivan"],
      want: { DEF: 1, MID: 2, FWD: 1 },
    }),
    makeGame(players, {
      id: "thu-8s",
      title: "Thursday 8s",
      day: "Thu",
      time: "7:00 PM",
      place: "Tradewinds Park",
      format: "8v8",
      level: "Casual",
      organizerId: "tyler",
      roster: ["tyler", "wes", "daniel", "ali", "marcus", "omar", "leo", "sam", "ryan", "emeka", "chris", "andres", "santi", "felipe", "beto", "ivan"],
      waitlist: ["julian"],
      style: "rotating",
      rotation: "free",
      durationMin: 90,
    }),
  ];
  return { players, games, toasts: [], seq: 1 };
}

// ---------- helpers ----------
export const name = (s: State, pid: string) => (pid === ME ? "You" : s.players[pid]?.name ?? "Someone");
/** A player's name in both languages ("You" / "Tú" for the current user). */
export const nameL = (s: State, pid: string): L => (pid === ME ? B("You", "Tú") : B(s.players[pid]?.name ?? "Someone", s.players[pid]?.name ?? "Alguien"));
export const B = (en: string, es: string): L => ({ en, es });
export const DAY_ES: Record<string, string> = { Mon: "Lun", Tue: "Mar", Wed: "Mié", Thu: "Jue", Fri: "Vie", Sat: "Sáb", Sun: "Dom" };
export const LEVEL_ES: Record<string, string> = { "All levels": "Todos los niveles", Casual: "Casual", Intermediate: "Intermedio", Competitive: "Competitivo" };
export const TITLE_ES: Record<string, string> = {
  "Sunday Run": "Fútbol del domingo",
  "Wednesday Run": "Fútbol del miércoles",
  "Tuesday Futsal": "Futsal del martes",
  "Saturday 11s": "Fútbol 11 del sábado",
  "Thursday 8s": "Fútbol 8 del jueves",
  "Friday Night Run": "Fútbol del viernes",
};
export const isFull = (g: Game) => g.roster.length >= g.size;
export const openSpots = (g: Game) => g.size - g.roster.length;
export const posCounts = (g: Game) => {
  const c: Record<Pos, number> = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  for (const r of g.roster) c[r.pos]++;
  return c;
};
export const involved = (g: Game, pid: string) => g.roster.some((r) => r.pid === pid) || g.waitlist.includes(pid);

/** Next person on the waitlist for a spot: first in line who plays that position, else first in line. */
export function nextCandidate(g: Game, s: State, pos: Pos, skip: string[]): string | null {
  const line = g.waitlist.filter((pid) => !skip.includes(pid));
  return line.find((pid) => s.players[pid]?.positions.includes(pos)) ?? line[0] ?? null;
}

/** Order of who gets pinged: crew first (most reliable first), then nearby players (closest first). */
function fillOrder(g: Game, s: State): string[] {
  const taken = new Set([...g.roster.map((r) => r.pid), ...g.waitlist]);
  const pool = Object.values(s.players).filter((p) => p.id !== ME && !taken.has(p.id));
  const crew = pool.filter((p) => p.crew).sort((a, b) => b.showed / b.of - a.showed / a.of);
  const nearby = pool.filter((p) => !p.crew).sort((a, b) => a.miles - b.miles);
  const needs = { ...g.needs };
  const queue: string[] = [];
  for (const p of [...crew, ...nearby]) {
    if (totalNeeds(needs) === 0) break;
    const slot = claimSlot(needs, p.positions);
    if (slot) {
      needs[slot]--;
      queue.push(p.id);
    }
  }
  // Two late sign-ups to show the waitlist forming.
  const extra = [...crew, ...nearby].filter((p) => !queue.includes(p.id)).slice(0, 2);
  return [...queue, ...extra.map((p) => p.id)];
}

// ---------- reducer ----------
export type Action =
  | { type: "load"; state: State }
  | { type: "reset" }
  | {
      type: "create";
      t: number;
      id: string;
      game: {
        title: string;
        day: string;
        time: string;
        place: string;
        format: string;
        level: string;
        needs: Needs;
        have?: number;
        style?: Style;
        rotation?: Rotation;
        switchAt?: number;
        durationMin?: number;
      };
    }
  | { type: "switch"; id: string; t: number }
  | { type: "startFill"; id: string; t: number }
  | { type: "fillNext"; id: string; t: number }
  | { type: "join"; id: string; t: number }
  | { type: "leave"; id: string; t: number }
  | { type: "drop"; id: string; t: number; pid?: string }
  | { type: "respond"; id: string; t: number; accept: boolean }
  | { type: "delete"; id: string }
  | { type: "profile"; positions: Pos[]; skill: Skill; goalOk?: boolean }
  | { type: "crew"; pid: string }
  | { type: "toast"; text: L; sub?: L }
  | { type: "dismiss"; toastId: number };

const log = (g: Game, t: number, kind: LogKind, text: L): Game => ({ ...g, log: [{ t, kind, text }, ...g.log].slice(0, 40) });

function withToast(s: State, text: L, sub?: L): State {
  return { ...s, toasts: [...s.toasts, { id: s.seq, text, sub }].slice(-3), seq: s.seq + 1 };
}

function updateGame(s: State, id: string, fn: (g: Game) => Game): State {
  return { ...s, games: s.games.map((g) => (g.id === id ? fn(g) : g)) };
}

/** Open a spot after a dropout: offer it to the waitlist, or re-post to crew and nearby. */
function afterDrop(s: State, g: Game, t: number, pos: Pos, droppedName: L): Game {
  const cand = nextCandidate(g, s, pos, []);
  if (cand) {
    const who = nameL(s, cand);
    const fits = s.players[cand].positions.includes(pos);
    return log(
      { ...g, offer: { pid: cand, pos, dropped: droppedName, startedAt: t, passed: [] } },
      t,
      "offer",
      B(
        `Spot offered to ${who.en}${fits ? ` (first ${pos} in line)` : " (next in line)"}.`,
        `Cupo ofrecido a ${who.es}${fits ? ` (primer ${pos} en la fila)` : " (siguiente en la fila)"}.`,
      ),
    );
  }
  const g2 = log(
    g,
    t,
    "info",
    B(
      `Waitlist is empty. Re-posted the open ${pos} spot to crew and nearby players.`,
      `La lista de espera está vacía. El cupo de ${pos} se volvió a publicar para tu grupo y jugadores cercanos.`,
    ),
  );
  return { ...g2, fillQueue: fillOrder(g2, s).slice(0, openSpots(g2)) };
}

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "load":
      return a.state;
    case "reset":
      return seedState();
    case "toast":
      return withToast(s, a.text, a.sub);
    case "dismiss":
      return { ...s, toasts: s.toasts.filter((x) => x.id !== a.toastId) };
    case "profile":
      return {
        ...s,
        players: { ...s.players, [ME]: { ...s.players[ME], positions: a.positions, skill: a.skill, goalOk: a.goalOk ?? s.players[ME].goalOk } },
      };
    case "crew": {
      const p = s.players[a.pid];
      if (!p || p.id === ME) return s;
      const s2 = { ...s, players: { ...s.players, [p.id]: { ...p, crew: !p.crew } } };
      return withToast(s2, p.crew ? B(`${p.name} removed from your crew`, `${p.name} salió de tu grupo`) : B(`${p.name} added to your crew`, `${p.name} se unió a tu grupo`));
    }
    case "delete":
      return { ...s, games: s.games.filter((g) => g.id !== a.id) };

    case "create": {
      const size = FORMAT_SIZE[a.game.format] ?? 14;
      const me = s.players[ME];
      const roster: Spot[] = [{ pid: ME, pos: me.positions[0] }];
      // Regulars already confirmed (from the landing-page builder hand-off).
      const already = Math.max(0, Math.min(size, a.game.have ?? 1) - 1);
      const crew = Object.values(s.players)
        .filter((p) => p.crew && p.id !== ME)
        .sort((x, y) => y.showed / y.of - x.showed / x.of);
      for (const p of crew.slice(0, already)) roster.push({ pid: p.id, pos: p.positions[0] });
      const g: Game = {
        id: a.id,
        title: a.game.title || "Pickup game",
        day: a.game.day,
        time: a.game.time,
        place: a.game.place || "TBD",
        format: a.game.format,
        size,
        level: a.game.level,
        organizerId: ME,
        roster,
        // Rotating games have no position slots: every open spot is "any position".
        needs: fitNeeds(a.game.style === "rotating" ? emptyNeeds() : a.game.needs, size - roster.length),
        waitlist: [],
        offer: null,
        fillQueue: [],
        style: a.game.style ?? "positions",
        rotation: a.game.rotation ?? "keeper",
        switchAt: a.game.style === "hybrid" ? a.game.switchAt : undefined,
        durationMin: a.game.durationMin ?? 60,
        log: [{ t: a.t, kind: "post", text: B("You posted the game. Tap “Send to crew” to start filling it.", "Publicaste el partido. Toca “Enviar a mi grupo” para empezar a llenarlo.") }],
      };
      return withToast({ ...s, games: [g, ...s.games] }, B("Game posted", "Partido publicado"), B("Now send it to your crew.", "Ahora envíalo a tu grupo."));
    }

    case "switch": {
      const g = s.games.find((x) => x.id === a.id);
      if (!g || g.style !== "hybrid") return s;
      // Unfilled position spots open to anyone.
      const reserved = g.needs.GK + g.needs.DEF + g.needs.MID + g.needs.FWD;
      const needs = { ...emptyNeeds(), ANY: g.needs.ANY + reserved };
      const hasKeeper = g.roster.some((r) => r.pos === "GK");
      let next: Game;
      let toast: [L, L];
      if (g.rotation === "free") {
        next = log({ ...g, needs, style: "rotating", switchAt: undefined }, a.t, "info", B("Deadline reached. Switched to free rotation, so open spots are open to anyone.", "Llegó la hora límite. Pasamos a rotación libre: los cupos quedan abiertos para cualquiera."));
        toast = [B("Switched to free rotation", "Cambio a rotación libre"), B("Open spots are open to anyone now.", "Los cupos ahora son para cualquiera.")];
      } else if (!hasKeeper) {
        next = log({ ...g, needs, style: "rotating", rotation: "keeper", switchAt: undefined }, a.t, "info", B("Nobody claimed keeper by the deadline. Switched to rotating keepers, and open spots are open to anyone.", "Nadie tomó el arco antes de la hora límite. Pasamos a portero rotativo y los cupos quedan abiertos para cualquiera."));
        toast = [B("Switched to rotating keepers", "Cambio a portero rotativo"), B("Everyone takes a turn in goal.", "Todos tapan un rato.")];
      } else {
        next = log({ ...g, needs, style: "positions", switchAt: undefined }, a.t, "info", B(reserved ? "Deadline reached. You have a keeper, so it stays set positions; the other open spots are now open to anyone." : "Deadline reached. You have a keeper, so it stays set positions.", reserved ? "Llegó la hora límite. Ya hay portero, así que siguen las posiciones fijas; los demás cupos quedan abiertos para cualquiera." : "Llegó la hora límite. Ya hay portero, así que siguen las posiciones fijas."));
        toast = [B("Keeper's covered", "Ya hay portero"), B("Positions stay set for this game.", "Las posiciones se mantienen en este partido.")];
      }
      return withToast(updateGame(s, a.id, () => next), toast[0], toast[1]);
    }

    case "startFill":
      return updateGame(s, a.id, (g) => {
        if (g.fillQueue.length || isFull(g)) return g;
        return log(
          { ...g, fillQueue: fillOrder(g, s) },
          a.t,
          "post",
          B("Sent to your crew first. Nearby players who fit get it next.", "Enviado primero a tu grupo. Después les llega a jugadores cercanos que encajan."),
        );
      });

    case "fillNext": {
      const g = s.games.find((x) => x.id === a.id);
      if (!g || !g.fillQueue.length) return s;
      const [pid, ...rest] = g.fillQueue;
      const p = s.players[pid];
      let next: Game = { ...g, fillQueue: rest };
      if (involved(g, pid)) return updateGame(s, a.id, () => next);
      const slot = claimSlot(g.needs, p.positions);
      if (slot && !isFull(g)) {
        const pos = slot === "ANY" ? p.positions[0] : slot;
        next = { ...next, roster: [...g.roster, { pid, pos }], needs: { ...g.needs, [slot]: g.needs[slot] - 1 } };
        next = log(
          next,
          a.t,
          p.crew ? "join" : "match",
          p.crew
            ? B(`${p.name} (${pos}) tapped In. Crew.`, `${p.name} (${pos}) se apuntó. Grupo.`)
            : B(`${p.name} (${pos}) matched nearby, ${p.miles} mi away, and tapped In.`, `${p.name} (${pos}) es compatible, está a ${p.miles} mi y se apuntó.`),
        );
        if (isFull(next)) {
          next = log(next, a.t, "info", B(`Game filled: ${next.size}/${next.size}. Game on.`, `Partido lleno: ${next.size}/${next.size}. ¡A jugar!`));
          const title = next.title;
          return withToast(
            updateGame(s, a.id, () => next),
            B(`${title} is full`, `${TITLE_ES[title] ?? title} está lleno`),
            B(`${next.size}/${next.size}. Game on.`, `${next.size}/${next.size}. ¡A jugar!`),
          );
        }
      } else {
        next = log(
          { ...next, waitlist: [...g.waitlist, pid] },
          a.t,
          "wait",
          B(`${p.name} joined the waitlist at #${g.waitlist.length + 1}.`, `${p.name} entró a la lista de espera en el #${g.waitlist.length + 1}.`),
        );
      }
      return updateGame(s, a.id, () => next);
    }

    case "join": {
      const g = s.games.find((x) => x.id === a.id);
      if (!g || involved(g, ME)) return s;
      const me = s.players[ME];
      const slot = isFull(g) ? null : claimSlot(g.needs, me.positions);
      if (slot) {
        const pos = slot === "ANY" ? me.positions[0] : slot;
        const s2 = updateGame(s, a.id, (x) =>
          log({ ...x, roster: [...x.roster, { pid: ME, pos }], needs: { ...x.needs, [slot]: x.needs[slot] - 1 } }, a.t, "join", B(`You tapped In as ${pos}.`, `Te apuntaste como ${pos}.`)),
        );
        return withToast(s2, B("You're in", "Estás dentro"), B(`${g.title} · ${g.day} ${g.time}`, `${TITLE_ES[g.title] ?? g.title} · ${DAY_ES[g.day] ?? g.day} ${g.time}`));
      }
      const why = isFull(g) ? B("The game is full", "El partido está lleno") : B("The open spots need other positions", "Los cupos libres son para otras posiciones");
      const s2 = updateGame(s, a.id, (x) => log({ ...x, waitlist: [...x.waitlist, ME] }, a.t, "wait", B(`You joined the waitlist at #${x.waitlist.length + 1}.`, `Entraste a la lista de espera en el #${x.waitlist.length + 1}.`)));
      const n = g.waitlist.length + 1;
      return withToast(
        s2,
        B(`You're #${n} on the waitlist`, `Eres el #${n} en la lista de espera`),
        B(`${why.en}. You'll get a one-tap offer if a spot opens.`, `${why.es}. Te llegará una oferta de un toque si se abre un cupo.`),
      );
    }

    case "leave": {
      const g = s.games.find((x) => x.id === a.id);
      if (!g) return s;
      if (g.waitlist.includes(ME)) {
        return updateGame(s, a.id, (x) =>
          log({ ...x, waitlist: x.waitlist.filter((p) => p !== ME), offer: x.offer?.pid === ME ? null : x.offer }, a.t, "info", B("You left the waitlist.", "Saliste de la lista de espera.")),
        );
      }
      return reducer(s, { type: "drop", id: a.id, t: a.t, pid: ME });
    }

    case "drop": {
      const g = s.games.find((x) => x.id === a.id);
      if (!g || g.offer) return s;
      const choices = g.roster.filter((r) => r.pid !== ME && r.pid !== g.organizerId);
      const target = a.pid ? g.roster.find((r) => r.pid === a.pid) : choices[Math.floor(Math.random() * choices.length)];
      if (!target) return s;
      const who = nameL(s, target.pid);
      let next: Game = {
        ...g,
        roster: g.roster.filter((r) => r.pid !== target.pid),
        needs: { ...g.needs, [target.pos]: g.needs[target.pos] + 1 },
      };
      next = log(next, a.t, "drop", target.pid === ME ? B(`You dropped out (${target.pos}).`, `Te bajaste (${target.pos}).`) : B(`${who.en} dropped out (${target.pos}).`, `${who.es} se bajó (${target.pos}).`));
      next = afterDrop(s, next, a.t, target.pos, who);
      return updateGame(s, a.id, () => next);
    }

    case "respond": {
      const g = s.games.find((x) => x.id === a.id);
      if (!g || !g.offer) return s;
      const o = g.offer;
      const who = nameL(s, o.pid);
      if (a.accept) {
        const p = s.players[o.pid];
        const pos = p.positions.includes(o.pos) ? o.pos : p.positions[0];
        let next: Game = {
          ...g,
          offer: null,
          waitlist: g.waitlist.filter((pid) => pid !== o.pid),
          roster: [...g.roster, { pid: o.pid, pos }],
          needs: { ...g.needs, [o.pos]: Math.max(0, g.needs[o.pos] - 1) },
        };
        next = log(next, a.t, "in", o.pid === ME ? B("You tapped In. Spot filled.", "Te apuntaste. Cupo lleno.") : B(`${who.en} tapped In. Spot filled.`, `${who.es} se apuntó. Cupo lleno.`));
        const s2 = updateGame(s, a.id, () => next);
        return withToast(
          s2,
          B(
            `${o.dropped.en} dropped · ${o.pid === ME ? "you're" : who.en + " is"} in`,
            `${o.dropped.es} se bajó · ${o.pid === ME ? "entras tú" : "entra " + who.es}`,
          ),
          B("Spot filled. You're good.", "Cupo lleno. Todo listo."),
        );
      }
      const passed = [...o.passed, o.pid];
      let next = log(g, a.t, "pass", o.pid === ME ? B("You passed. Rolling to the next player.", "Pasaste. Va para el siguiente jugador.") : B(`${who.en} passed. Rolling to the next player.`, `${who.es} pasó. Va para el siguiente jugador.`));
      const cand = nextCandidate(next, s, o.pos, passed);
      if (cand) {
        next = log({ ...next, offer: { ...o, pid: cand, startedAt: a.t, passed } }, a.t, "offer", B(`Spot offered to ${nameL(s, cand).en}.`, `Cupo ofrecido a ${nameL(s, cand).es}.`));
      } else {
        next = log({ ...next, offer: null }, a.t, "info", B("Nobody left in line. Re-posted to crew and nearby players.", "No queda nadie en la fila. Se volvió a publicar para tu grupo y jugadores cercanos."));
        next = { ...next, fillQueue: fillOrder(next, s).slice(0, openSpots(next)) };
      }
      return updateGame(s, a.id, () => next);
    }
  }
}

export const STORAGE_KEY = "fs-demo-v3";
export type { NeedKey };
