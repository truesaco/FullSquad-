import { Icon, type IconName } from "./icons";

const PAINS: { stat: string; title: string; body: string; icon: IconName }[] = [
  { stat: "12/14", title: "The Midnight Headcount", body: "It's 11:47 PM Saturday and the game is two players short.", icon: "moon" },
  { stat: "143", title: "Unread Messages, Zero Answers", body: "The four names he needs are buried under memes.", icon: "chat" },
  { stat: "1 hr", title: "Before Kickoff, Someone Bails", body: "He has to beg the same friend he cut on Tuesday.", icon: "userMinus" },
];

export function Problem() {
  return (
    <section className="section bg-bg-alt" aria-labelledby="problem-title">
      <div className="container-x">
        <h2 id="problem-title" className="h2 reveal mx-auto max-w-3xl text-center">
          Still running your game out of a group chat and hoping people show up?
        </h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {PAINS.map((p, i) => (
            <li key={p.title} className="card reveal p-8" style={{ ["--delay" as string]: `${i * 100}ms` }}>
              <span className="flex size-12 items-center justify-center rounded-xl bg-tint text-accent">
                <Icon name={p.icon} className="size-6" />
              </span>
              <p className="mt-6 text-5xl font-bold tracking-tight tabular">{p.stat}</p>
              <h3 className="mt-3 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
        <p className="caption reveal mt-8 text-center text-muted">Scenario from organizer research</p>
      </div>
    </section>
  );
}
