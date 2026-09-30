"use client";

import { Avatar } from "./ui";
import { useLang, type L } from "@/lib/i18n";

const THEMES: { theme: L; quote: L; answer: L }[] = [
  {
    theme: { en: "Reliability", es: "Confianza" },
    quote: { en: "A thumbs-up is not a confirmation.", es: "Un pulgar arriba no es una confirmación." },
    answer: { en: "Answered by one-tap confirm and automatic backfills", es: "Lo resuelve la confirmación con un toque y los reemplazos automáticos" },
  },
  {
    theme: { en: "Guilt", es: "Culpa" },
    quote: { en: "I felt like I'd uninvited a friend from a birthday party.", es: "Sentí que había desinvitado a un amigo de un cumpleaños." },
    answer: { en: "Answered by the automatic, fair waitlist", es: "Lo resuelve la lista de espera automática y justa" },
  },
  {
    theme: { en: "Adoption", es: "Adopción" },
    quote: {
      en: "Getting 30 grown men to download something is like herding cats in cleats.",
      es: "Lograr que 30 adultos descarguen algo es como arrear gatos con tacos.",
    },
    answer: { en: "Answered by a game link that works in any chat", es: "Lo resuelve un link del partido que funciona en cualquier chat" },
  },
];

const STATS: [string, L][] = [
  ["$0", { en: "for players", es: "para jugadores" }],
  ["<5 min", { en: "to post", es: "para publicar" }],
  ["1 tap", { en: "to confirm", es: "para confirmar" }],
  ["4", { en: "positions balanced", es: "posiciones balanceadas" }],
];

const PROFILE: [L, L][] = [
  [
    { en: "Before", es: "Antes" },
    { en: "Midnight headcounts", es: "Contar gente a medianoche" },
  ],
  [
    { en: "Wants", es: "Quiere" },
    { en: "A full game with his phone in his bag", es: "Un partido lleno con el celular en la mochila" },
  ],
  [
    { en: "Needs", es: "Necesita" },
    { en: "Free for players and faster than WhatsApp", es: "Gratis para jugadores y más rápido que WhatsApp" },
  ],
];

export function Story() {
  const { t, tr } = useLang();
  return (
    <section className="section bg-bg-alt !pt-0" aria-labelledby="story-title">
      <div className="container-x">
        <h2 id="story-title" className="sr-only">
          {tr("Who we built it for", "Para quién lo hicimos")}
        </h2>
        <article className="card reveal grid gap-8 p-6 md:grid-cols-[1.4fr_1fr] md:p-10">
          <div>
            <div className="flex items-center gap-4">
              <Avatar name="Diego R" className="size-14 text-base" />
              <div>
                <p className="text-lg font-bold">Diego R., 29</p>
                <p className="text-sm text-muted">{tr("Organizer · Broward County, FL", "Organizador · Condado de Broward, FL")}</p>
              </div>
            </div>
            <blockquote className="mt-6">
              <p className="font-serif text-3xl leading-tight md:text-4xl">
                &ldquo;{tr("I'm so tired of being angry at people I love.", "Estoy cansado de estar enojado con la gente que quiero.")}&rdquo;
              </p>
              <p className="mt-4 text-lg text-muted">
                &ldquo;{tr("I'm not the secretary anymore. I'm a player again.", "Ya no soy el secretario. Vuelvo a ser jugador.")}&rdquo;
              </p>
            </blockquote>
            <p className="mt-6 inline-block rounded-md bg-bg-alt px-3 py-1.5 text-xs text-muted">
              {tr(
                "Composite persona from customer research. This isn't a real testimonial.",
                "Persona compuesta a partir de la investigación con usuarios. No es un testimonio real.",
              )}
            </p>
          </div>
          <dl className="grid content-center gap-4">
            {PROFILE.map(([k, v]) => (
              <div key={k.en} className="rounded-xl border border-line p-4">
                <dt className="caption text-accent">{t(k)}</dt>
                <dd className="mt-1 font-semibold">{t(v)}</dd>
              </div>
            ))}
          </dl>
        </article>

        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((th, i) => (
            <li key={th.theme.en} className="card reveal flex flex-col p-8" style={{ ["--delay" as string]: `${i * 100}ms` }}>
              <p className="caption text-muted">
                {tr("Research theme", "Tema de investigación")} · {t(th.theme)}
              </p>
              <p className="mt-4 flex-1 font-serif text-2xl leading-snug">&ldquo;{t(th.quote)}&rdquo;</p>
              <p className="mt-6 border-t border-line pt-4 text-sm font-semibold text-accent">{t(th.answer)}</p>
            </li>
          ))}
        </ul>

        <dl className="reveal mt-6 grid grid-cols-2 overflow-hidden rounded-2xl bg-[#1a1a18] text-white md:grid-cols-4">
          {STATS.map(([v, l]) => (
            <div
              key={l.en}
              className="border-white/10 p-6 text-center [&:not(:last-child)]:border-r max-md:[&:nth-child(2)]:border-r-0 max-md:[&:nth-child(-n+2)]:border-b"
            >
              <dt className="sr-only">{t(l)}</dt>
              <dd>
                <span className="block text-3xl font-bold text-mint tabular md:text-4xl">{v === "1 tap" ? tr("1 tap", "1 toque") : v}</span>
                <span className="mt-1 block text-sm text-white/75" aria-hidden="true">
                  {t(l)}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
