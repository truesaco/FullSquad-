"use client";

import { Icon } from "./icons";
import { useLang, type L } from "@/lib/i18n";
import { GameOnBadge, RosterMeter } from "./ui";

const CHAT: { who?: string; text: L; me?: boolean; color?: string; meta?: boolean }[] = [
  { who: "Marco", text: { en: "7v7 or 8v8??", es: "¿7v7 u 8v8??" }, color: "text-[#b45309]" },
  { who: "Kevin", text: { en: "👍", es: "👍" }, color: "text-[#2563eb]" },
  { who: "Andrés", text: { en: "prob", es: "creo que sí" }, color: "text-[#15803d]" },
  { who: "Marco", text: { en: "shared a video", es: "compartió un video" }, color: "text-[#b45309]", meta: true },
  { text: { en: "Last call, I need a headcount by 9 PM", es: "Última llamada, necesito saber quién va antes de las 9 PM" }, me: true },
  { who: "Marco", text: { en: "so 7v7?", es: "¿entonces 7v7?" }, color: "text-[#b45309]" },
];

export function Solution() {
  const { t, tr } = useLang();
  return (
    <section id="how-it-works" className="section" aria-labelledby="solution-title">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-[2fr_3fr]">
          <div className="reveal">
            <h2 id="solution-title" className="h2">
              {tr("The game fills itself.", "El partido se llena solo.")}
              <br />
              {tr("You still make the calls.", "Tú sigues decidiendo.")}
            </h2>
            <div className="mt-6 grid gap-4 text-lg text-muted">
              <p>
                {tr(
                  "The bottleneck isn't soccer. It's dispatching: headcounts, rejection texts, remembering who plays keeper, and 7 AM begging.",
                  "El problema no es el fútbol. Es la logística: contar gente, mandar mensajes de \"ya estamos llenos\", acordarte de quién tapa y rogar a las 7 AM.",
                )}
              </p>
              <p>
                {tr(
                  "You post once. Your crew sees it first, then nearby players who fit. The waitlist and backfills run on their own.",
                  "Publicas una vez. Tu grupo lo ve primero y después los jugadores cercanos que encajan. La lista de espera y los reemplazos funcionan solos.",
                )}
              </p>
              <p>
                {tr(
                  "You keep the judgment calls, like who plays and how teams split. And you get to be a ",
                  "Tú sigues decidiendo quién juega y cómo se arman los equipos. Y vuelves a ser ",
                )}
                <strong className="font-semibold text-fg">{tr("player again", "jugador otra vez")}</strong>.
              </p>
            </div>
          </div>

          <div className="reveal grid gap-4 sm:grid-cols-2" style={{ ["--delay" as string]: "100ms" }}>
            <figure>
              <figcaption className="caption mb-2 text-muted">{tr("Before · The group chat", "Antes · El chat del grupo")}</figcaption>
              <div className="overflow-hidden rounded-2xl border border-line bg-[#ece5dd] text-[#1a1a18] shadow-sm dark:bg-[#1b2530] dark:text-[#e9edef]">
                <div className="flex items-center gap-3 bg-white px-4 py-3 dark:bg-[#202c33]">
                  <span className="size-9 rounded-full bg-[#d1d7db] dark:bg-[#3b4a54]" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{tr("Sunday Run", "Fútbol del domingo")}</p>
                    <p className="text-xs opacity-70">{tr("31 members", "31 miembros")} · 11:47 PM</p>
                  </div>
                  <span className="rounded-full bg-[#dc2626] px-2 py-0.5 text-xs font-bold text-white">{tr("143 unread", "143 sin leer")}</span>
                </div>
                <ul className="grid gap-2 p-3 text-sm">
                  {CHAT.map((m, i) => (
                    <li
                      key={i}
                      className={`max-w-[80%] rounded-lg px-3 py-1.5 shadow-sm ${
                        m.me ? "ml-auto bg-[#d9fdd3] dark:bg-[#005c4b]" : "bg-white dark:bg-[#202c33]"
                      } ${m.meta ? "italic opacity-80" : ""}`}
                    >
                      {m.who ? <span className={`block text-xs font-bold ${m.color} dark:brightness-150`}>{m.who}</span> : null}
                      {t(m.text)}
                    </li>
                  ))}
                </ul>
              </div>
            </figure>

            <figure>
              <figcaption className="caption mb-2 text-accent">{tr("After · Fullsquad", "Después · Fullsquad")}</figcaption>
              <div className="card border-2 !border-mint p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{tr("Sunday Run", "Fútbol del domingo")}</p>
                    <p className="text-xs text-muted">{tr("Sun", "Dom")} 8:30 AM · Piccolo · 7v7</p>
                  </div>
                  <GameOnBadge />
                </div>
                <p className="mt-4 font-bold tabular">
                  <span className="text-5xl">14</span>
                  <span className="text-xl text-muted">/14</span>
                </p>
                <RosterMeter filled={14} total={14} className="mt-3" />
                <dl className="mt-5 grid gap-3 text-sm">
                  <div className="flex justify-between border-b border-line pb-3">
                    <dt className="text-muted">{tr("Keeper", "Portero")}</dt>
                    <dd className="flex items-center gap-1 font-semibold text-success">
                      <Icon name="check" className="size-4" strokeWidth={3} /> {tr("Confirmed", "Confirmado")} · Tomás
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-line pb-3">
                    <dt className="text-muted">{tr("Waitlist", "Lista de espera")}</dt>
                    <dd className="font-semibold text-info">{tr("2 in line", "2 en fila")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">{tr("Texts you sent", "Mensajes que enviaste")}</dt>
                    <dd className="font-bold">0</dd>
                  </div>
                </dl>
              </div>
            </figure>
          </div>
        </div>

        <div className="reveal mt-14 flex flex-col gap-4 rounded-2xl bg-[#1a1a18] p-6 text-white sm:flex-row sm:items-center md:p-8">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-mint text-sm font-extrabold text-[#1a1a18]">
            GK
          </span>
          <p className="text-lg leading-relaxed">
            {tr(
              "Unlike group chats and pay-to-play apps, Fullsquad matches players by position and skill from day one, so you don't end up with ",
              "A diferencia de los chats de grupo y las apps donde pagas por jugar, Fullsquad empareja jugadores por posición y nivel desde el primer día, para que no termines con ",
            )}
            <strong className="text-mint">{tr("five strikers and no keeper", "cinco delanteros y ningún portero")}</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
