"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { RosterMeter } from "@/components/ui";
import { ME, isFull, name, type Game, type LogKind } from "@/lib/demo/model";
import { POSITIONS, claimSlot, describeNeeds, type NeedKey } from "@/lib/positions";
import { NeedChips, PlayerLine, PosBalance, Status, relTime, secondsLeft } from "./bits";
import { Empty } from "./screens";
import { useApp } from "./store";

const LOG_ICON: Record<LogKind, IconName> = {
  post: "send",
  join: "check",
  match: "sliders",
  wait: "queue",
  drop: "userMinus",
  offer: "bell",
  pass: "arrowRight",
  in: "check",
  info: "flag",
};

function inviteText(g: Game) {
  const need = g.size - g.roster.length;
  return [
    `⚽ ${g.title} — ${g.day} ${g.time} @ ${g.place}`,
    `${g.format} · ${g.roster.length}/${g.size} in · ${need > 0 ? `Need ${need}: ${describeNeeds(g.needs)}` : "Full, waitlist open"}`,
    `Tap to claim your spot: https://fullsquad.app/g/${g.id}`,
  ].join("\n");
}

export function GameDetail({ id }: { id: string }) {
  const { s, dispatch, now, go } = useApp();
  const [copied, setCopied] = useState(false);
  const g = s.games.find((x) => x.id === id);
  if (!g) return <Empty text="That game doesn't exist anymore." cta={{ href: "#/games", label: "Back to My Games" }} />;

  const me = s.players[ME];
  const organizer = g.organizerId === ME;
  const onRoster = g.roster.some((r) => r.pid === ME);
  const onWaitlist = g.waitlist.includes(ME);
  const canClaim = !isFull(g) && claimSlot(g.needs, me.positions) !== null;
  const t = () => Date.now();

  // Open spots, labelled with the position each one is waiting for.
  const openLabels: NeedKey[] = [...POSITIONS.flatMap((p) => Array<NeedKey>(g.needs[p]).fill(p)), ...Array<NeedKey>(g.needs.ANY).fill("ANY")];

  return (
    <>
      <a href={organizer ? "#/games" : "#/feed"} className="mb-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-accent">
        <Icon name="arrowRight" className="size-4 rotate-180" /> {organizer ? "My Games" : "Games near you"}
      </a>

      <section className="card p-5 md:p-6" aria-labelledby="game-title">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 id="game-title" className="font-serif text-3xl leading-tight">
              {g.title}
            </h1>
            <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
              <span className="inline-flex items-center gap-1">
                <Icon name="calendar" className="size-4" /> {g.day} {g.time}
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon name="pin" className="size-4" /> {g.place}
              </span>
            </p>
            <p className="mt-1 text-sm text-muted">
              {g.format} · {g.level} · organized by {organizer ? "you" : name(s, g.organizerId)}
            </p>
          </div>
          <Status g={g} s={s} />
        </div>

        <div className="mt-5 flex items-end justify-between gap-4" aria-live="polite">
          <p className="font-bold tabular">
            <span className="text-5xl">{g.roster.length}</span>
            <span className="text-xl text-muted">/{g.size}</span>
            <span className="sr-only"> players confirmed</span>
          </p>
          <p className="text-right text-sm text-muted">
            {isFull(g) ? "Full. Extra sign-ups wait in line." : `Still looking for ${describeNeeds(g.needs)}`}
          </p>
        </div>
        <RosterMeter filled={g.roster.length} total={g.size} className="mt-3" />
        <div className="mt-3">
          <NeedChips g={g} mine={me.positions} />
        </div>

        {g.offer ? (
          <div className="mt-4 rounded-xl border border-info/40 bg-[#dbeafe] p-3 text-sm text-[#1e3a8a] dark:bg-[#1e3a8a]/40 dark:text-[#dbeafe]" role="status">
            <p className="font-semibold">
              <Icon name="bell" className="mr-1 inline size-4" />
              Spot offered to {g.offer.pid === ME ? "you" : name(s, g.offer.pid)} · {secondsLeft(g.offer.startedAt, now)}s to answer
            </p>
            <p className="mt-0.5 opacity-80">
              {g.offer.pid === ME
                ? "Tap In or Pass in the prompt. If you don't answer in time, it rolls to the next player."
                : organizer
                  ? "If they don't answer, it rolls to the next player automatically. You don't have to do anything."
                  : "If they don't answer, it rolls to the next player in line automatically."}
            </p>
          </div>
        ) : null}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          {organizer ? (
            <>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={isFull(g) || g.fillQueue.length > 0}
                onClick={() => dispatch({ type: "startFill", id: g.id, t: t() })}
              >
                <Icon name="send" className="size-4" />
                {g.fillQueue.length ? "Filling…" : isFull(g) ? "Game on" : "Send to crew"}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={!!g.offer || g.roster.length <= 1 || g.fillQueue.length > 0}
                onClick={() => dispatch({ type: "drop", id: g.id, t: t() })}
              >
                <Icon name="userMinus" className="size-4" /> Simulate a dropout
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(inviteText(g));
                  } catch {}
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                }}
              >
                <Icon name={copied ? "check" : "copy"} className="size-4" /> {copied ? "Copied" : "Copy for group chat"}
              </button>
              <button
                type="button"
                className="btn btn-sm text-error hover:bg-bg-alt"
                onClick={() => {
                  dispatch({ type: "delete", id: g.id });
                  go("/games");
                }}
              >
                Delete
              </button>
            </>
          ) : (
            <>
              {onRoster ? (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => dispatch({ type: "leave", id: g.id, t: t() })}>
                  Can&apos;t make it
                </button>
              ) : onWaitlist ? (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => dispatch({ type: "leave", id: g.id, t: t() })}>
                  Leave waitlist
                </button>
              ) : (
                <button type="button" className="btn btn-primary btn-sm" onClick={() => dispatch({ type: "join", id: g.id, t: t() })}>
                  {canClaim ? "I'm In" : "Join the waitlist"}
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={!!g.offer || g.roster.filter((r) => r.pid !== ME && r.pid !== g.organizerId).length === 0}
                onClick={() => dispatch({ type: "drop", id: g.id, t: t() })}
                title="Demo: make someone on the roster drop out"
              >
                <Icon name="userMinus" className="size-4" /> Demo: someone drops
              </button>
            </>
          )}
        </div>
        {!organizer && !onRoster && !onWaitlist && !canClaim && !isFull(g) ? (
          <p className="mt-2 text-sm text-muted">
            The open spots need {describeNeeds(g.needs)}. You play {me.positions.join(", ")}, so you&apos;d join the waitlist. Add positions in your
            profile to match more games.
          </p>
        ) : null}
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="grid content-start gap-5">
          <section className="card p-5" aria-labelledby="bal-title">
            <h2 id="bal-title" className="mb-3 font-bold">
              Position balance
            </h2>
            <PosBalance g={g} />
          </section>

          <section className="card p-5" aria-labelledby="roster-title">
            <h2 id="roster-title" className="mb-3 font-bold">
              Roster <span className="font-normal text-muted">· {g.roster.length} in</span>
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {g.roster.map((r) => (
                <li key={r.pid} className="anim-slide min-w-0">
                  <PlayerLine p={s.players[r.pid]} pos={r.pos} />
                </li>
              ))}
              {openLabels.map((k, i) => (
                <li key={`open-${i}`} className="flex min-h-12 items-center gap-3 rounded-lg border border-dashed border-line px-3 text-sm text-muted">
                  <span className="flex size-8 items-center justify-center rounded-full border border-dashed border-line">
                    <Icon name="plus" className="size-4" />
                  </span>
                  Open · {k === "ANY" ? "any position" : k}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="grid content-start gap-5">
          <section className="card p-5" aria-labelledby="wl-title">
            <h2 id="wl-title" className="mb-1 font-bold">
              Waitlist
            </h2>
            <p className="mb-3 text-sm text-muted">Sign-up order, visible to everyone. When a spot opens, the first person in line who plays that position gets a one-tap offer.</p>
            {g.waitlist.length ? (
              <ol className="grid gap-2">
                {g.waitlist.map((pid, i) => (
                  <li key={pid} className="min-w-0">
                    <PlayerLine
                      p={s.players[pid]}
                      pos={s.players[pid].positions[0]}
                      right={
                        g.offer?.pid === pid ? (
                          <span className="text-xs font-bold text-info">Offered</span>
                        ) : (
                          <span className="text-sm font-bold text-muted tabular">#{i + 1}</span>
                        )
                      }
                    />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="rounded-lg bg-bg-alt p-3 text-sm text-muted">Nobody waiting yet.</p>
            )}
          </section>

          <section className="card p-5" aria-labelledby="log-title">
            <h2 id="log-title" className="mb-3 font-bold">
              What FullSquad did
            </h2>
            {g.log.length ? (
              <ol className="grid gap-3">
                {g.log.map((e, i) => (
                  <li key={`${e.t}-${i}`} className="flex gap-3 text-sm">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-tint text-accent">
                      <Icon name={LOG_ICON[e.kind]} className="size-3.5" strokeWidth={2.5} />
                    </span>
                    <span className="min-w-0 flex-1">
                      {e.text}
                      <span className="block text-xs text-muted">{relTime(e.t, now)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted">Nothing yet.</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
