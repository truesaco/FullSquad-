"use client";

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Icon } from "./icons";
import { GameOnBadge, RosterMeter } from "./ui";
import { WaitlistForm } from "./WaitlistForm";
import { FORMATS } from "@/lib/content";
import { track } from "@/lib/track";

type Ctx = { open: (source: string) => void };
const PostGameContext = createContext<Ctx>({ open: () => {} });

export function usePostGame() {
  return useContext(PostGameContext);
}

/** Primary CTA that opens the "Post a game" builder. */
export function PostGameButton({
  children,
  className = "btn btn-primary",
  loc,
}: {
  children: ReactNode;
  className?: string;
  loc: string;
}) {
  const { open } = usePostGame();
  return (
    <button type="button" className={className} data-cta="post_game" data-loc={loc} onClick={() => open(loc)}>
      {children}
    </button>
  );
}

export function PostGameProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [source, setSource] = useState("hero");
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((src: string) => {
    setSource(src);
    const d = ref.current;
    if (d && !d.open) {
      d.showModal();
      setIsOpen(true);
      document.documentElement.style.overflow = "hidden";
      track("game_post_start", { location: src });
    }
  }, []);

  const close = useCallback(() => ref.current?.close(), []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClose = () => {
      setIsOpen(false);
      document.documentElement.style.overflow = "";
    };
    // Click on the backdrop (the dialog element itself, outside its content) closes it.
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close();
    };
    d.addEventListener("close", onClose);
    d.addEventListener("click", onClick);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("click", onClick);
    };
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <PostGameContext.Provider value={value}>
      {children}
      <dialog ref={ref} className="sheet" aria-labelledby="post-game-title">
        {isOpen ? <PostGameBuilder onClose={close} source={source} /> : null}
      </dialog>
    </PostGameContext.Provider>
  );
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const LEVELS = ["All levels", "Casual", "Intermediate", "Competitive"];

function to12h(t: string) {
  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h)) return t;
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m ?? 0).padStart(2, "0")} ${suffix}`;
}

function PostGameBuilder({ onClose, source }: { onClose: () => void; source: string }) {
  const uid = useId();
  const [step, setStep] = useState<"build" | "share">("build");
  const [name, setName] = useState("Sunday Run");
  const [day, setDay] = useState("Sunday");
  const [time, setTime] = useState("08:30");
  const [place, setPlace] = useState("Brian Piccolo Park");
  const [format, setFormat] = useState<(typeof FORMATS)[number]["id"]>("7v7");
  const size = FORMATS.find((f) => f.id === format)!.size;
  const [have, setHave] = useState(12);
  const [keeper, setKeeper] = useState(true);
  const [level, setLevel] = useState("All levels");
  const [copied, setCopied] = useState(false);

  const inCount = Math.min(have, size);
  const need = Math.max(0, size - inCount);

  const message = useMemo(() => {
    const lines = [
      `⚽ ${name || "Pickup game"} — ${day.slice(0, 3)} ${to12h(time)} @ ${place || "TBD"}`,
      `${format} · ${inCount}/${size} in · ${need > 0 ? `Need ${need}` : "Full, waitlist open"}${keeper ? " · 🧤 keeper preferred" : ""}`,
      level !== "All levels" ? `Level: ${level}` : "All levels welcome",
      "",
      `Reply "IN" to grab a spot. First come, first in. Overflow goes on the waitlist in order, no hard feelings.`,
    ];
    return lines.join("\n");
  }, [name, day, time, place, format, inCount, size, need, keeper, level]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = message;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    track("game_message_copied", { format });
    window.setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="flex max-h-[inherit] flex-col">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-8">
        <div>
          <p className="caption text-muted">{step === "build" ? "Step 1 of 2" : "Step 2 of 2"}</p>
          <h2 id="post-game-title" className="text-xl font-bold">
            {step === "build" ? "Post what your game needs" : "Drop it in the chat"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-11 items-center justify-center rounded-full hover:bg-bg-alt"
          aria-label="Close"
        >
          <Icon name="x" className="size-6" />
        </button>
      </div>

      <div className="grid flex-1 gap-8 overflow-y-auto px-5 py-6 md:grid-cols-[1.1fr_1fr] md:px-8">
        {step === "build" ? (
          <form
            className="grid content-start gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              setStep("share");
              track("game_post_preview", { format, need, keeper, location: source });
            }}
          >
            <div>
              <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm font-medium">
                Game name
              </label>
              <input id={`${uid}-name`} className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${uid}-day`} className="mb-1.5 block text-sm font-medium">
                  Day
                </label>
                <select id={`${uid}-day`} className="input" value={day} onChange={(e) => setDay(e.target.value)}>
                  {DAYS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`${uid}-time`} className="mb-1.5 block text-sm font-medium">
                  Kickoff
                </label>
                <input id={`${uid}-time`} type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor={`${uid}-place`} className="mb-1.5 block text-sm font-medium">
                Where
              </label>
              <input id={`${uid}-place`} className="input" value={place} onChange={(e) => setPlace(e.target.value)} maxLength={60} />
            </div>
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium">Format</legend>
              <div className="grid grid-cols-4 gap-1 rounded-lg border border-line bg-bg-alt p-1">
                {FORMATS.map((f) => (
                  <label
                    key={f.id}
                    className={`flex min-h-11 cursor-pointer items-center justify-center rounded-md text-sm font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary ${
                      format === f.id ? "bg-surface text-fg shadow-sm" : "text-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      name={`${uid}-format`}
                      checked={format === f.id}
                      onChange={() => {
                        setFormat(f.id);
                        setHave((h) => Math.min(h, f.size));
                      }}
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex items-center justify-between gap-4">
              <span id={`${uid}-have-l`} className="text-sm font-medium">
                Already confirmed
              </span>
              <div className="flex items-center gap-1" role="group" aria-labelledby={`${uid}-have-l`}>
                <button
                  type="button"
                  className="flex size-11 items-center justify-center rounded-lg border border-line hover:bg-bg-alt disabled:opacity-40"
                  onClick={() => setHave((h) => Math.max(0, h - 1))}
                  disabled={inCount <= 0}
                  aria-label="One fewer confirmed"
                >
                  <Icon name="minus" />
                </button>
                <output className="w-16 text-center text-lg font-bold tabular" aria-live="polite">
                  {inCount}/{size}
                </output>
                <button
                  type="button"
                  className="flex size-11 items-center justify-center rounded-lg border border-line hover:bg-bg-alt disabled:opacity-40"
                  onClick={() => setHave((h) => Math.min(size, h + 1))}
                  disabled={inCount >= size}
                  aria-label="One more confirmed"
                >
                  <Icon name="plus" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-line px-3 text-sm font-medium">
                <input type="checkbox" className="size-5 accent-[#0b6e4f]" checked={keeper} onChange={(e) => setKeeper(e.target.checked)} />
                Keeper preferred
              </label>
              <div>
                <label htmlFor={`${uid}-level`} className="sr-only">
                  Skill level
                </label>
                <select id={`${uid}-level`} className="input" value={level} onChange={(e) => setLevel(e.target.value)}>
                  {LEVELS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Preview my post <Icon name="arrowRight" />
            </button>
          </form>
        ) : (
          <div className="grid content-start gap-5">
            <p className="text-muted">
              Here&apos;s a clean &ldquo;who&apos;s in?&rdquo; post for your crew. Paste it in the group chat today. It already beats a
              thread of thumbs-ups.
            </p>
            <pre className="whitespace-pre-wrap rounded-xl border border-line bg-[#e7f6ec] p-4 font-sans text-[15px] leading-relaxed text-[#0f1b2d] dark:bg-[#12301f] dark:text-[#e8f5ed]">
              {message}
            </pre>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={copy} className="btn btn-primary">
                <Icon name={copied ? "check" : "copy"} />
                {copied ? "Copied" : "Copy for group chat"}
              </button>
              <button type="button" onClick={() => setStep("build")} className="btn btn-secondary">
                Edit game
              </button>
            </div>
            <p className="sr-only" aria-live="polite">
              {copied ? "Message copied to clipboard" : ""}
            </p>
            <div className="rounded-xl border border-line bg-bg-alt p-5">
              <p className="font-bold">Want FullSquad to run this game for you?</p>
              <p className="mb-4 mt-1 text-sm text-muted">
                We&apos;re opening organizer access area by area. Get one email when it&apos;s live near you. Then this post gets a join link,
                a live roster, a fair waitlist, and one-tap backfills.
              </p>
              <WaitlistForm
                source={`post_game_${source}`}
                compact
                submitLabel="Save my organizer spot"
                extra={{ game: message.replace(/\n+/g, " | ") }}
              />
            </div>
          </div>
        )}

        <aside aria-label="Live preview" className={step === "share" ? "hidden md:block" : ""}>
          <p className="caption mb-3 text-muted">Live preview</p>
          <div className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-lg font-bold">{name || "Pickup game"}</p>
                <p className="flex items-center gap-1 text-sm text-muted">
                  <Icon name="calendar" className="size-4 shrink-0" />
                  {day.slice(0, 3)} {to12h(time)}
                </p>
                <p className="flex items-center gap-1 truncate text-sm text-muted">
                  <Icon name="pin" className="size-4 shrink-0" />
                  <span className="truncate">{place || "TBD"}</span>
                </p>
              </div>
              <span className="pos shrink-0 !text-xs">{format}</span>
            </div>
            <div className="mt-5 flex items-end justify-between">
              <p className="font-bold tabular">
                <span className="text-4xl">{inCount}</span>
                <span className="text-lg text-muted">/{size}</span>
              </p>
              {need === 0 ? (
                <GameOnBadge />
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3c7] px-2.5 py-1 text-xs font-bold text-[#92400e]">
                  <Icon name="warning" className="size-3.5" />
                  Need {need}
                </span>
              )}
            </div>
            <RosterMeter filled={inCount} total={size} className="mt-3" />
            <ul className="mt-4 grid gap-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted">Keeper</span>
                <span className="font-medium">{keeper ? "Wanted" : "Not needed"}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Level</span>
                <span className="font-medium">{level}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Who sees it first</span>
                <span className="font-medium">Your crew</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
