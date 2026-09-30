"use client";

import { Icon, type IconName } from "./icons";
import { useLang, type L } from "@/lib/i18n";

const PAINS: { stat: L; title: L; body: L; icon: IconName }[] = [
  {
    stat: { en: "12/14", es: "12/14" },
    title: { en: "The Midnight Headcount", es: "El conteo de medianoche" },
    body: { en: "It's 11:47 PM Saturday and the game is two players short.", es: "Son las 11:47 PM del sábado y al partido le faltan dos." },
    icon: "moon",
  },
  {
    stat: { en: "143", es: "143" },
    title: { en: "Unread Messages, Zero Answers", es: "Mensajes sin leer, cero respuestas" },
    body: { en: "The four names he needs are buried under memes.", es: "Los cuatro nombres que necesita están enterrados entre memes." },
    icon: "chat",
  },
  {
    stat: { en: "1 hr", es: "1 h" },
    title: { en: "Before Kickoff, Someone Bails", es: "Una hora antes, alguien se baja" },
    body: { en: "He has to beg the same friend he cut on Tuesday.", es: "Le toca rogarle al mismo amigo que dejó fuera el martes." },
    icon: "userMinus",
  },
];

export function Problem() {
  const { t, tr } = useLang();
  return (
    <section className="section bg-bg-alt" aria-labelledby="problem-title">
      <div className="container-x">
        <h2 id="problem-title" className="h2 reveal mx-auto max-w-3xl text-center">
          {tr(
            "Still running your game out of a group chat and hoping people show up?",
            "¿Todavía organizas tu partido por el chat del grupo y rezas para que la gente llegue?",
          )}
        </h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {PAINS.map((p, i) => (
            <li key={p.title.en} className="card reveal p-8" style={{ ["--delay" as string]: `${i * 100}ms` }}>
              <span className="flex size-12 items-center justify-center rounded-xl bg-tint text-accent">
                <Icon name={p.icon} className="size-6" />
              </span>
              <p className="mt-6 text-5xl font-bold tracking-tight tabular">{t(p.stat)}</p>
              <h3 className="mt-3 text-xl font-bold">{t(p.title)}</h3>
              <p className="mt-2 text-muted">{t(p.body)}</p>
            </li>
          ))}
        </ul>
        <p className="caption reveal mt-8 text-center text-muted">{tr("Scenario from organizer research", "Escenario de la investigación con organizadores")}</p>
      </div>
    </section>
  );
}
