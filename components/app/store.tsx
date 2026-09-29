"use client";

import { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import { ME, OFFER_SECONDS, STORAGE_KEY, nextCandidate, reducer, seedState, type Action, type State } from "@/lib/demo/model";
import { takeDraft } from "@/lib/demo/draft";
import { emptyNeeds } from "@/lib/positions";

type Ctx = { s: State; dispatch: (a: Action) => void; now: number; route: string[]; go: (hash: string) => void };
const AppCtx = createContext<Ctx | null>(null);

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}

const parseHash = () => (typeof window === "undefined" ? ["feed"] : window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean));

export function AppProvider({ children }: { children: ReactNode }) {
  const [s, dispatch] = useReducer(reducer, undefined, seedState);
  const [now, setNow] = useState(() => Date.now());
  const [route, setRoute] = useState<string[]>(["feed"]);
  const [loaded, setLoaded] = useState(false);
  const stateRef = useRef(s);
  stateRef.current = s;
  const handled = useRef(new Set<string>());

  const go = useCallback((hash: string) => {
    window.location.hash = hash;
    window.scrollTo({ top: 0 });
  }, []);

  // Load saved demo state, then any game handed over from the landing-page builder.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as State;
        if (saved?.games && saved?.players) dispatch({ type: "load", state: { ...saved, toasts: [] } });
      }
    } catch {}
    const d = takeDraft();
    if (d) {
      const id = `g${Date.now().toString(36)}`;
      dispatch({
        type: "create",
        id,
        t: Date.now(),
        game: { title: d.title, day: d.day.slice(0, 3), time: d.time, place: d.place, format: d.format, level: d.level, needs: d.needs ?? emptyNeeds(), have: d.have },
      });
      window.location.hash = `/game/${id}`;
    }
    setRoute(parseHash().length ? parseHash() : ["feed"]);
    setLoaded(true);
    const onHash = () => setRoute(parseHash().length ? parseHash() : ["feed"]);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...s, toasts: [] }));
    } catch {}
  }, [s, loaded]);

  // Simulated sign-ups arrive one at a time.
  useEffect(() => {
    const id = window.setInterval(() => {
      for (const g of stateRef.current.games) if (g.fillQueue.length) dispatch({ type: "fillNext", id: g.id, t: Date.now() });
    }, 700);
    return () => window.clearInterval(id);
  }, []);

  // Clock for countdowns; simulated players answer backfill offers.
  useEffect(() => {
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      const st = stateRef.current;
      for (const g of st.games) {
        const o = g.offer;
        if (!o) continue;
        const key = `${g.id}:${o.pid}:${o.startedAt}`;
        if (handled.current.has(key)) continue;
        const elapsed = t - o.startedAt;
        if (o.pid === ME) {
          if (elapsed >= OFFER_SECONDS * 1000) {
            handled.current.add(key);
            dispatch({ type: "respond", id: g.id, t, accept: false });
          }
        } else if (elapsed >= 4000) {
          // The first person offered passes when someone else is in line, to show the rollover.
          handled.current.add(key);
          const someoneElse = nextCandidate(g, st, o.pos, [...o.passed, o.pid]);
          dispatch({ type: "respond", id: g.id, t, accept: !(o.passed.length === 0 && someoneElse) });
        }
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Toasts disappear on their own.
  useEffect(() => {
    if (!s.toasts.length) return;
    const first = s.toasts[0];
    const id = window.setTimeout(() => dispatch({ type: "dismiss", toastId: first.id }), 3800);
    return () => window.clearTimeout(id);
  }, [s.toasts]);

  return <AppCtx.Provider value={{ s, dispatch, now, route, go }}>{children}</AppCtx.Provider>;
}
