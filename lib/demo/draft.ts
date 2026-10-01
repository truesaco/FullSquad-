import type { Needs } from "@/lib/positions";
import type { Rotation, Style } from "@/lib/rotation";

// Hand-off from the landing-page "Post a game" builder to the app demo.
export type Draft = {
  title: string;
  day: string;
  time: string;
  place: string;
  format: string;
  have: number;
  needs: Needs;
  level: string;
  style?: Style;
  rotation?: Rotation;
  switchAt?: number;
  durationMin?: number;
};

const KEY = "fs-demo-draft";

export function saveDraft(d: Draft) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {}
}

export function takeDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    localStorage.removeItem(KEY);
    return JSON.parse(raw) as Draft;
  } catch {
    return null;
  }
}
