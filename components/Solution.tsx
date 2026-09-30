import { Icon } from "./icons";
import { GameOnBadge, RosterMeter } from "./ui";

const CHAT: { who?: string; text: string; me?: boolean; color?: string }[] = [
  { who: "Marco", text: "7v7 or 8v8??", color: "text-[#b45309]" },
  { who: "Kevin", text: "👍", color: "text-[#2563eb]" },
  { who: "Andrés", text: "prob", color: "text-[#15803d]" },
  { who: "Marco", text: "shared a video", color: "text-[#b45309]" },
  { text: "Last call, I need a headcount by 9 PM", me: true },
  { who: "Marco", text: "so 7v7?", color: "text-[#b45309]" },
];

export function Solution() {
  return (
    <section id="how-it-works" className="section" aria-labelledby="solution-title">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-[2fr_3fr]">
          <div className="reveal">
            <h2 id="solution-title" className="h2">
              The game fills itself.
              <br />
              You still make the calls.
            </h2>
            <div className="mt-6 grid gap-4 text-lg text-muted">
              <p>
                The bottleneck isn&apos;t soccer. It&apos;s dispatching: headcounts, rejection texts, remembering who plays keeper, and 7 AM
                begging.
              </p>
              <p>You post once. Your crew sees it first, then nearby players who fit. The waitlist and backfills run on their own.</p>
              <p>
                You keep the judgment calls, like who plays and how teams split. And you get to be a{" "}
                <strong className="font-semibold text-fg">player again</strong>.
              </p>
            </div>
          </div>

          <div className="reveal grid gap-4 sm:grid-cols-2" style={{ ["--delay" as string]: "100ms" }}>
            <figure>
              <figcaption className="caption mb-2 text-muted">Before · The group chat</figcaption>
              <div className="overflow-hidden rounded-2xl border border-line bg-[#ece5dd] text-[#1a1a18] shadow-sm dark:bg-[#1b2530] dark:text-[#e9edef]">
                <div className="flex items-center gap-3 bg-white px-4 py-3 dark:bg-[#202c33]">
                  <span className="size-9 rounded-full bg-[#d1d7db] dark:bg-[#3b4a54]" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">Sunday Run</p>
                    <p className="text-xs opacity-70">31 members · 11:47 PM</p>
                  </div>
                  <span className="rounded-full bg-[#dc2626] px-2 py-0.5 text-xs font-bold text-white">143 unread</span>
                </div>
                <ul className="grid gap-2 p-3 text-sm">
                  {CHAT.map((m, i) => (
                    <li
                      key={i}
                      className={`max-w-[80%] rounded-lg px-3 py-1.5 shadow-sm ${
                        m.me ? "ml-auto bg-[#d9fdd3] dark:bg-[#005c4b]" : "bg-white dark:bg-[#202c33]"
                      } ${m.text === "shared a video" ? "italic opacity-80" : ""}`}
                    >
                      {m.who ? <span className={`block text-xs font-bold ${m.color} dark:brightness-150`}>{m.who}</span> : null}
                      {m.text}
                    </li>
                  ))}
                </ul>
              </div>
            </figure>

            <figure>
              <figcaption className="caption mb-2 text-accent">After · Fullsquad</figcaption>
              <div className="card border-2 !border-mint p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">Sunday Run</p>
                    <p className="text-xs text-muted">Sun 8:30 AM · Piccolo · 7v7</p>
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
                    <dt className="text-muted">Keeper</dt>
                    <dd className="flex items-center gap-1 font-semibold text-success">
                      <Icon name="check" className="size-4" strokeWidth={3} /> Confirmed · Tomás
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-line pb-3">
                    <dt className="text-muted">Waitlist</dt>
                    <dd className="font-semibold text-info">2 in line</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Texts you sent</dt>
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
            Unlike group chats and pay-to-play apps, Fullsquad matches players by position and skill from day one, so you don&apos;t end up
            with <strong className="text-mint">five strikers and no keeper</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
