export const POSITIONS = ["GK", "DEF", "MID", "FWD"] as const;
export type Pos = (typeof POSITIONS)[number];
export type NeedKey = Pos | "ANY";
export type Needs = Record<NeedKey, number>;

export const POS_NAME: Record<Pos, string> = {
  GK: "Goalkeeper",
  DEF: "Defender",
  MID: "Midfielder",
  FWD: "Forward",
};

export const emptyNeeds = (): Needs => ({ GK: 0, DEF: 0, MID: 0, FWD: 0, ANY: 0 });

export const totalNeeds = (n: Needs) => n.GK + n.DEF + n.MID + n.FWD + n.ANY;

/** Keep specific positions within `total` and put the remainder in ANY. */
export function fitNeeds(n: Needs, total: number): Needs {
  const out = emptyNeeds();
  let left = Math.max(0, total);
  for (const p of POSITIONS) {
    const v = Math.min(Math.max(0, n[p]), left);
    out[p] = v;
    left -= v;
  }
  out.ANY = left;
  return out;
}

/** "1 GK · 2 DEF · 1 any position" or "any position". */
export function describeNeeds(n: Needs, { short = false }: { short?: boolean } = {}) {
  const parts = POSITIONS.filter((p) => n[p] > 0).map((p) => `${n[p]} ${p}`);
  if (n.ANY > 0) parts.push(parts.length ? `${n.ANY} any` : short ? "any position" : `${n.ANY} any position`);
  return parts.join(" · ");
}

/** Can a player who plays `positions` claim one of these open needs? Returns the slot they'd take. */
export function claimSlot(n: Needs, positions: Pos[]): NeedKey | null {
  for (const p of positions) if (n[p] > 0) return p;
  if (n.ANY > 0) return "ANY";
  return null;
}
