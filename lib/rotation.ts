// Game styles: set positions, rotating, or positions that switch to rotating at a deadline.
import type { L } from "./i18n";

export type Style = "positions" | "rotating" | "hybrid";
export type Rotation = "keeper" | "free";
export type Deadline = "morning" | "night" | "custom";

/** Everything the "Game style" picker collects. */
export type StyleChoice = {
  style: Style;
  rotation: Rotation;
  deadline: Deadline;
  custom: string; // datetime-local value, used when deadline = "custom"
  durationMin: number;
};

export const defaultStyle = (): StyleChoice => ({ style: "positions", rotation: "keeper", deadline: "night", custom: "", durationMin: 60 });

const DAY_INDEX: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };

/** "19:30", "7:30 PM" or "8:30 AM" → [hours, minutes] in 24h. */
export function parseTime(t: string): [number, number] {
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return [12, 0];
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ap = m[3]?.toUpperCase();
  if (ap === "PM" && h < 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return [h, min];
}

/** "19:30" → "7:30 PM". */
export function to12h(t: string) {
  const [h, m] = parseTime(t);
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

/** Next date the game happens, from a day name ("Sun", "Sunday") and a time. */
export function nextGameDate(day: string, time: string, from = new Date()): Date {
  const target = DAY_INDEX[day.slice(0, 3).toLowerCase()] ?? from.getDay();
  const [h, m] = parseTime(time);
  const d = new Date(from);
  d.setHours(h, m, 0, 0);
  let add = (target - from.getDay() + 7) % 7;
  if (add === 0 && d.getTime() <= from.getTime()) add = 7;
  d.setDate(d.getDate() + add);
  return d;
}

/** When a "positions, then rotate" game switches. */
export function switchTime(day: string, time: string, c: Pick<StyleChoice, "deadline" | "custom">, from = new Date()): number {
  const game = nextGameDate(day, time, from);
  if (c.deadline === "custom" && c.custom) {
    const t = new Date(c.custom).getTime();
    if (!Number.isNaN(t)) return t;
  }
  if (c.deadline === "night") {
    const d = new Date(game);
    d.setDate(d.getDate() - 1);
    d.setHours(20, 0, 0, 0);
    return d.getTime();
  }
  // Game-day morning: 8 AM, or one hour before kickoff for early games.
  const d = new Date(game);
  d.setHours(8, 0, 0, 0);
  return Math.min(d.getTime(), game.getTime() - 60 * 60 * 1000);
}

export function formatWhen(ms: number, lang: "en" | "es") {
  return new Date(ms).toLocaleString(lang === "es" ? "es-US" : "en-US", { weekday: "short", hour: "numeric", minute: "2-digit" });
}

/** Short badge for game cards. */
export function styleBadge(style: Style, rotation: Rotation): L | null {
  if (style === "rotating") return rotation === "keeper" ? { en: "Rotating GK", es: "Portero rotativo" } : { en: "Free rotation", es: "Rotación libre" };
  if (style === "hybrid") return { en: "Positions, then rotate", es: "Posiciones, luego rotación" };
  return null;
}

/** One line for the group-chat message. */
export function styleLine(style: Style, rotation: Rotation, switchLabel: string | null, lang: "en" | "es"): string | null {
  const es = lang === "es";
  if (style === "rotating") {
    return rotation === "keeper"
      ? es
        ? "🧤 Portero rotativo: todos tapan un rato"
        : "🧤 Rotating keeper: everyone takes a turn in goal"
      : es
        ? "🔄 Rotación libre: juega donde quieras"
        : "🔄 Free rotation: play anywhere";
  }
  if (style === "hybrid") {
    const when = switchLabel ?? (es ? "el día del partido" : "game day");
    return rotation === "keeper"
      ? es
        ? `🧤 Buscamos portero. Si nadie lo toma antes del ${when}, rotamos el arco.`
        : `🧤 Keeper wanted. If nobody claims it by ${when}, we rotate in goal.`
      : es
        ? `🔄 Posiciones hasta el ${when}; después, rotación libre.`
        : `🔄 Set positions until ${when}, then free rotation.`;
  }
  return null;
}

export type Turn = { pid: string; from: number; to: number };

/**
 * Fair keeper rotation: players happy to go in goal first, then everyone else, alternating teams.
 * Each team splits the game evenly so everyone on it gets one turn.
 */
export function keeperPlan(roster: { pid: string; goalOk: boolean }[], durationMin: number): [Turn[], Turn[]] {
  const order = [...roster.filter((r) => r.goalOk), ...roster.filter((r) => !r.goalOk)];
  const teams: [string[], string[]] = [[], []];
  order.forEach((r, i) => teams[i % 2].push(r.pid));
  const plan = teams.map((t) => {
    const shift = t.length ? durationMin / t.length : durationMin;
    return t.map((pid, i) => ({ pid, from: Math.round(i * shift), to: Math.round((i + 1) * shift) }));
  });
  return [plan[0], plan[1]];
}
