"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { RosterMeter } from "@/components/ui";
import { ME, isFull, name, type Game, type LogKind } from "@/lib/demo/model";
import { POSITIONS, claimSlot, describeNeeds, type NeedKey } from "@/lib/positions";
import { NeedChips, PlayerLine, PosBalance, Status, StyleTag, relTime, secondsLeft, useFmt } from "./bits";
import { formatWhen, keeperPlan, styleLine } from "@/lib/rotation";
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

function inviteText(g: Game, f: ReturnType<typeof useFmt>) {
  const need = g.size - g.roster.length;
  const es = f.lang === "es";
  return [
    `⚽ ${f.title(g)} — ${f.day(g.day)} ${g.time} @ ${g.place}`,
    es
      ? `${g.format} · ${g.roster.length}/${g.size} confirmados · ${need > 0 ? `Faltan ${need}: ${describeNeeds(g.needs, { lang: "es" })}` : "Lleno, lista de espera abierta"}`
      : `${g.format} · ${g.roster.length}/${g.size} in · ${need > 0 ? `Need ${need}: ${describeNeeds(g.needs)}` : "Full, waitlist open"}`,
    styleLine(g.style, g.rotation, g.switchAt ? formatWhen(g.switchAt, f.lang) : null, f.lang),
    `${f.tr("Tap to claim your spot", "Toca para apartar tu lugar")}: https://fullsquad.app/g/${g.id}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function GameDetail({ id }: { id: string }) {
  const { s, dispatch, now, go } = useApp();
  const [copied, setCopied] = useState(false);
  const f = useFmt();
  const { tr, lang } = f;
  const g = s.games.find((x) => x.id === id);
  if (!g)
    return (
      <Empty
        text={tr("That game doesn't exist anymore.", "Ese partido ya no existe.")}
        cta={{ href: "#/games", label: tr("Back to My Games", "Volver a Mis partidos") }}
      />
    );

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
        <Icon name="arrowRight" className="size-4 rotate-180" /> {organizer ? tr("My Games", "Mis partidos") : tr("Games near you", "Partidos cerca de ti")}
      </a>

      <section className="card p-5 md:p-6" aria-labelledby="game-title">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 id="game-title" className="font-serif text-3xl leading-tight">
              {f.title(g)}
            </h1>
            <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
              <span className="inline-flex items-center gap-1">
                <Icon name="calendar" className="size-4" /> {f.day(g.day)} {g.time}
              </span>
              <span className="inline-flex items-center gap-1">
                <Icon name="pin" className="size-4" /> {g.place}
              </span>
            </p>
            <p className="mt-1 text-sm text-muted">
              {g.format} · {f.level(g.level)} · {tr("organized by", "organiza")} {organizer ? tr("you", "tú") : name(s, g.organizerId)}
            </p>
          </div>
          <Status g={g} s={s} />
        </div>

        <div className="mt-5 flex items-end justify-between gap-4" aria-live="polite">
          <p className="font-bold tabular">
            <span className="text-5xl">{g.roster.length}</span>
            <span className="text-xl text-muted">/{g.size}</span>
            <span className="sr-only"> {tr("players confirmed", "jugadores confirmados")}</span>
          </p>
          <p className="text-right text-sm text-muted">
            {isFull(g)
              ? tr("Full. Extra sign-ups wait in line.", "Lleno. Los que se apunten esperan en la fila.")
              : `${tr("Still looking for", "Todavía buscamos")} ${describeNeeds(g.needs, { lang })}`}
          </p>
        </div>
        <RosterMeter filled={g.roster.length} total={g.size} className="mt-3" />
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <StyleTag g={g} />
          <NeedChips g={g} mine={me.positions} />
        </div>

        {g.style === "hybrid" && g.switchAt ? (
          <div className="mt-4 rounded-xl border border-[#f3b0a9] bg-[#fdf1ef] p-3 text-sm text-[#5c1c16] dark:border-[#6b2a24] dark:bg-[#2a1513] dark:text-[#f8d4cf]">
            <p className="flex items-center gap-1.5 font-semibold">
              <Icon name="clock" className="size-4" />
              {tr("Positions held until", "Posiciones reservadas hasta el")} {formatWhen(g.switchAt, lang)}
            </p>
            <p className="mt-0.5 opacity-90">
              {g.rotation === "keeper"
                ? tr(
                    "If nobody claims goalkeeper by then, everyone takes a turn in goal and the open spots open to anyone.",
                    "Si nadie toma el arco antes de esa hora, todos tapan un rato y los cupos libres se abren para cualquiera.",
                  )
                : tr("Then it switches to free rotation and the open spots open to anyone.", "Después pasa a rotación libre y los cupos libres se abren para cualquiera.")}
            </p>
            {organizer ? (
              <button
                type="button"
                className="btn btn-sm btn-secondary mt-3 !min-h-9"
                onClick={() => dispatch({ type: "switch", id: g.id, t: Date.now() })}
              >
                <Icon name="clock" className="size-4" /> {tr("Demo: reach the deadline now", "Demo: llegar a la hora límite ya")}
              </button>
            ) : null}
          </div>
        ) : null}

        {g.offer ? (
          <div className="mt-4 rounded-xl border border-info/40 bg-[#dbeafe] p-3 text-sm text-[#1e3a8a] dark:bg-[#1e3a8a]/40 dark:text-[#dbeafe]" role="status">
            <p className="font-semibold">
              <Icon name="bell" className="mr-1 inline size-4" />
              {tr("Spot offered to", "Cupo ofrecido a")} {g.offer.pid === ME ? tr("you", "ti") : name(s, g.offer.pid)} · {secondsLeft(g.offer.startedAt, now)}
              {tr("s to answer", " s para responder")}
            </p>
            <p className="mt-0.5 opacity-80">
              {g.offer.pid === ME
                ? tr("Tap In or Pass in the prompt. If you don't answer in time, it rolls to the next player.", "Toca Me apunto o Paso en el aviso. Si no respondes a tiempo, pasa al siguiente jugador.")
                : organizer
                  ? tr("If they don't answer, it rolls to the next player automatically. You don't have to do anything.", "Si no responde, pasa automáticamente al siguiente jugador. No tienes que hacer nada.")
                  : tr("If they don't answer, it rolls to the next player in line automatically.", "Si no responde, pasa automáticamente al siguiente de la fila.")}
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
                {g.fillQueue.length ? tr("Filling…", "Llenando…") : isFull(g) ? tr("Game on", "¡A jugar!") : tr("Send to crew", "Enviar a mi grupo")}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={!!g.offer || g.roster.length <= 1 || g.fillQueue.length > 0}
                onClick={() => dispatch({ type: "drop", id: g.id, t: t() })}
              >
                <Icon name="userMinus" className="size-4" /> {tr("Simulate a dropout", "Simular una baja")}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(inviteText(g, f));
                  } catch {}
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                }}
              >
                <Icon name={copied ? "check" : "copy"} className="size-4" /> {copied ? tr("Copied", "Copiado") : tr("Copy for group chat", "Copiar para el chat")}
              </button>
              <button
                type="button"
                className="btn btn-sm text-error hover:bg-bg-alt"
                onClick={() => {
                  dispatch({ type: "delete", id: g.id });
                  go("/games");
                }}
              >
                {tr("Delete", "Eliminar")}
              </button>
            </>
          ) : (
            <>
              {onRoster ? (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => dispatch({ type: "leave", id: g.id, t: t() })}>
                  {tr("Can't make it", "No puedo ir")}
                </button>
              ) : onWaitlist ? (
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => dispatch({ type: "leave", id: g.id, t: t() })}>
                  {tr("Leave waitlist", "Salir de la lista")}
                </button>
              ) : (
                <button type="button" className="btn btn-primary btn-sm" onClick={() => dispatch({ type: "join", id: g.id, t: t() })}>
                  {canClaim ? tr("I'm In", "Me apunto") : tr("Join the waitlist", "Entrar a la lista de espera")}
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={!!g.offer || g.roster.filter((r) => r.pid !== ME && r.pid !== g.organizerId).length === 0}
                onClick={() => dispatch({ type: "drop", id: g.id, t: t() })}
                title={tr("Demo: make someone on the roster drop out", "Demo: hacer que alguien de la lista se baje")}
              >
                <Icon name="userMinus" className="size-4" /> {tr("Demo: someone drops", "Demo: alguien se baja")}
              </button>
            </>
          )}
        </div>
        {!organizer && !onRoster && !onWaitlist && !canClaim && !isFull(g) ? (
          <p className="mt-2 text-sm text-muted">
            {tr(
              `The open spots need ${describeNeeds(g.needs)}. You play ${me.positions.join(", ")}, so you'd join the waitlist. Add positions in your profile to match more games.`,
              `Los cupos libres necesitan ${describeNeeds(g.needs, { lang: "es" })}. Tú juegas ${me.positions.join(", ")}, así que entrarías a la lista de espera. Agrega posiciones en tu perfil para encajar en más partidos.`,
            )}
          </p>
        ) : null}
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="grid content-start gap-5">
          {g.style === "rotating" ? (
            <RotationCard g={g} />
          ) : (
            <section className="card p-5" aria-labelledby="bal-title">
              <h2 id="bal-title" className="mb-3 font-bold">
                {tr("Position balance", "Balance de posiciones")}
              </h2>
              <PosBalance g={g} />
            </section>
          )}

          <section className="card p-5" aria-labelledby="roster-title">
            <h2 id="roster-title" className="mb-3 font-bold">
              {tr("Roster", "Lista")} <span className="font-normal text-muted">· {g.roster.length} {tr("in", "dentro")}</span>
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
                  {tr("Open", "Libre")} · {k === "ANY" ? tr("any position", "cualquier posición") : k}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="grid content-start gap-5">
          <section className="card p-5" aria-labelledby="wl-title">
            <h2 id="wl-title" className="mb-1 font-bold">
              {tr("Waitlist", "Lista de espera")}
            </h2>
            <p className="mb-3 text-sm text-muted">
              {tr(
                "Sign-up order, visible to everyone. When a spot opens, the first person in line who plays that position gets a one-tap offer.",
                "Por orden de inscripción y visible para todos. Cuando se abre un cupo, el primero de la fila que juega esa posición recibe una oferta de un toque.",
              )}
            </p>
            {g.waitlist.length ? (
              <ol className="grid gap-2">
                {g.waitlist.map((pid, i) => (
                  <li key={pid} className="min-w-0">
                    <PlayerLine
                      p={s.players[pid]}
                      pos={s.players[pid].positions[0]}
                      right={
                        g.offer?.pid === pid ? (
                          <span className="text-xs font-bold text-info">{tr("Offered", "Ofrecido")}</span>
                        ) : (
                          <span className="text-sm font-bold text-muted tabular">#{i + 1}</span>
                        )
                      }
                    />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="rounded-lg bg-bg-alt p-3 text-sm text-muted">{tr("Nobody waiting yet.", "Nadie esperando todavía.")}</p>
            )}
          </section>

          <section className="card p-5" aria-labelledby="log-title">
            <h2 id="log-title" className="mb-3 font-bold">
              {tr("What Fullsquad did", "Lo que hizo Fullsquad")}
            </h2>
            {g.log.length ? (
              <ol className="grid gap-3">
                {g.log.map((e, i) => (
                  <li key={`${e.t}-${i}`} className="flex gap-3 text-sm">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-tint text-accent">
                      <Icon name={LOG_ICON[e.kind]} className="size-3.5" strokeWidth={2.5} />
                    </span>
                    <span className="min-w-0 flex-1">
                      {f.t(e.text)}
                      <span className="block text-xs text-muted">{relTime(e.t, now, lang)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted">{tr("Nothing yet.", "Nada todavía.")}</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

/** Rotating games: the keeper schedule, or how free rotation works. */
function RotationCard({ g }: { g: Game }) {
  const { s } = useApp();
  const { tr } = useFmt();
  if (g.rotation === "free") {
    return (
      <section className="card p-5" aria-labelledby="rot-title">
        <h2 id="rot-title" className="mb-2 flex items-center gap-2 font-bold">
          <Icon name="refresh" className="size-5 text-accent" /> {tr("Free rotation", "Rotación libre")}
        </h2>
        <p className="text-sm text-muted">
          {tr(
            "No set positions. Play anywhere and swap whenever; teams are split on the day. Positions on profiles just help split teams evenly.",
            "Sin posiciones fijas. Juega donde quieras y cambien cuando quieran; los equipos se arman ese día. Las posiciones del perfil solo ayudan a armar equipos parejos.",
          )}
        </p>
      </section>
    );
  }
  const roster = g.roster.map((r) => ({ pid: r.pid, goalOk: r.pos === "GK" || !!s.players[r.pid]?.goalOk }));
  const plan = keeperPlan(roster, g.durationMin);
  const volunteers = roster.filter((r) => r.goalOk).length;
  return (
    <section className="card p-5" aria-labelledby="rot-title">
      <h2 id="rot-title" className="mb-1 flex items-center gap-2 font-bold">
        <Icon name="refresh" className="size-5 text-accent" /> {tr("Keeper rotation", "Turno de porteros")}
      </h2>
      <p className="mb-4 text-sm text-muted">
        {tr(
          `Everyone takes a turn in goal across ${g.durationMin} minutes. ${
            volunteers === 0 ? "No volunteers yet, so it follows sign-up order." : volunteers === 1 ? "The volunteer goes first." : `The ${volunteers} volunteers go first.`
          } Suggested split; adjust when you pick teams.`,
          `Todos tapan un rato durante ${g.durationMin} minutos. ${
            volunteers === 0 ? "Aún no hay voluntarios, así que va por orden de inscripción." : volunteers === 1 ? "El voluntario va primero." : `Los ${volunteers} voluntarios van primero.`
          } Es una sugerencia; ajústala al armar equipos.`,
        )}
      </p>
      {g.roster.length < 2 ? (
        <p className="rounded-lg bg-bg-alt p-3 text-sm text-muted">{tr("The schedule appears once players join.", "El turno aparece cuando se apunten jugadores.")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {plan.map((team, ti) => (
            <div key={ti}>
              <p className="caption mb-2 text-muted">
                {tr("Team", "Equipo")} {ti === 0 ? "A" : "B"}
              </p>
              <ol className="grid gap-1.5">
                {team.map((turn) => {
                  const p = s.players[turn.pid];
                  return (
                    <li key={turn.pid} className="flex items-center justify-between gap-2 rounded-lg bg-bg-alt px-3 py-1.5 text-sm">
                      <span className="flex min-w-0 items-center gap-1.5 truncate font-semibold">
                        {p?.goalOk || p?.positions[0] === "GK" ? <span aria-label={tr("volunteer", "voluntario")}>🧤</span> : null}
                        {turn.pid === ME ? tr("You", "Tú") : p?.name}
                      </span>
                      <span className="shrink-0 text-xs font-bold text-muted tabular">
                        {turn.from}&prime;–{turn.to}&prime;
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
