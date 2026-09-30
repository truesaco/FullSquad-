import { Avatar } from "./ui";

const THEMES = [
  { theme: "Reliability", quote: "A thumbs-up is not a confirmation.", answer: "Answered by one-tap confirm and automatic backfills" },
  { theme: "Guilt", quote: "I felt like I'd uninvited a friend from a birthday party.", answer: "Answered by the automatic, fair waitlist" },
  {
    theme: "Adoption",
    quote: "Getting 30 grown men to download something is like herding cats in cleats.",
    answer: "Answered by a game link that works in any chat",
  },
];

const STATS = [
  ["$0", "for players"],
  ["<5 min", "to post"],
  ["1 tap", "to confirm"],
  ["4", "positions balanced"],
];

export function Story() {
  return (
    <section className="section bg-bg-alt !pt-0" aria-labelledby="story-title">
      <div className="container-x">
        <h2 id="story-title" className="sr-only">
          Who we built it for
        </h2>
        <article className="card reveal grid gap-8 p-6 md:grid-cols-[1.4fr_1fr] md:p-10">
          <div>
            <div className="flex items-center gap-4">
              <Avatar name="Diego R" className="size-14 text-base" />
              <div>
                <p className="text-lg font-bold">Diego R., 29</p>
                <p className="text-sm text-muted">Organizer · Broward County, FL</p>
              </div>
            </div>
            <blockquote className="mt-6">
              <p className="font-serif text-3xl leading-tight md:text-4xl">&ldquo;I&apos;m so tired of being angry at people I love.&rdquo;</p>
              <p className="mt-4 text-lg text-muted">&ldquo;I&apos;m not the secretary anymore. I&apos;m a player again.&rdquo;</p>
            </blockquote>
            <p className="mt-6 inline-block rounded-md bg-bg-alt px-3 py-1.5 text-xs text-muted">
              Composite persona from customer research. This isn&apos;t a real testimonial.
            </p>
          </div>
          <dl className="grid content-center gap-4">
            {[
              ["Before", "Midnight headcounts"],
              ["Wants", "A full game with his phone in his bag"],
              ["Needs", "Free for players and faster than WhatsApp"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-line p-4">
                <dt className="caption text-accent">{k}</dt>
                <dd className="mt-1 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </article>

        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((t, i) => (
            <li key={t.theme} className="card reveal flex flex-col p-8" style={{ ["--delay" as string]: `${i * 100}ms` }}>
              <p className="caption text-muted">Research theme · {t.theme}</p>
              <p className="mt-4 flex-1 font-serif text-2xl leading-snug">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-6 border-t border-line pt-4 text-sm font-semibold text-accent">{t.answer}</p>
            </li>
          ))}
        </ul>

        <dl className="reveal mt-6 grid grid-cols-2 overflow-hidden rounded-2xl bg-[#1a1a18] text-white md:grid-cols-4">
          {STATS.map(([v, l]) => (
            <div key={l} className="border-white/10 p-6 text-center [&:not(:last-child)]:border-r max-md:[&:nth-child(2)]:border-r-0 max-md:[&:nth-child(-n+2)]:border-b">
              <dt className="sr-only">{l}</dt>
              <dd>
                <span className="block text-3xl font-bold text-mint tabular md:text-4xl">{v}</span>
                <span className="mt-1 block text-sm text-white/75" aria-hidden="true">
                  {l}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
