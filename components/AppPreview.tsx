import { Icon, type IconName } from "./icons";
import { SectionHeader } from "./ui";

const PATHS: { icon: IconName; who: string; title: string; steps: string[]; href: string; cta: string }[] = [
  {
    icon: "send",
    who: "As an organizer",
    title: "Post a game and watch it fill",
    steps: [
      "Pick the format and toggle the positions you need, or any position",
      "Your crew gets it first, then nearby players who fit",
      "Hit “Simulate a dropout” and watch the backfill roll down the waitlist",
    ],
    href: "/app/#/post",
    cta: "Post a demo game",
  },
  {
    icon: "pin",
    who: "As a player",
    title: "Find a game that needs you",
    steps: [
      "Toggle the positions you play: GK, DEF, MID, FWD",
      "Games that need you float to the top",
      "Tap In, or join the waitlist and get a one-tap offer when a spot opens",
    ],
    href: "/app/#/feed",
    cta: "Browse demo games",
  },
  {
    icon: "users",
    who: "Your crew",
    title: "Your regulars, organized",
    steps: [
      "Every player's positions and how often they show up",
      "Filter your crew by position in one tap",
      "Add nearby players who fit to your crew",
    ],
    href: "/app/#/crew",
    cta: "Open the crew view",
  },
];

export function AppPreview() {
  return (
    <section id="app" className="section bg-bg-alt" aria-labelledby="app-title">
      <div className="container-x">
        <SectionHeader
          id="app-title"
          eyebrow="Try it now"
          title="See how the app actually works"
          lead="A working demo of the Fullsquad app with simulated players. It runs in your browser: on your phone it looks like the app, on a laptop it's the web app. Nothing to install and nothing gets sent."
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {PATHS.map((p, i) => (
            <li key={p.who} className="card reveal flex flex-col p-6" style={{ ["--delay" as string]: `${i * 100}ms` }}>
              <span className="flex size-12 items-center justify-center rounded-xl bg-tint text-accent">
                <Icon name={p.icon} className="size-6" />
              </span>
              <p className="caption mt-5 text-muted">{p.who}</p>
              <h3 className="mt-1 text-xl font-bold">{p.title}</h3>
              <ol className="mb-6 mt-4 grid gap-2 text-[15px] text-muted">
                {p.steps.map((s, n) => (
                  <li key={s} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-alt text-xs font-bold text-fg">{n + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <a href={p.href} className="btn btn-secondary mt-auto w-full" data-cta="app_demo" data-loc={`app_preview_${i + 1}`}>
                {p.cta} <Icon name="arrowRight" className="size-4" />
              </a>
            </li>
          ))}
        </ul>
        <div className="reveal mt-8 text-center">
          <a href="/app/" className="btn btn-primary btn-lg" data-cta="app_demo" data-loc="app_preview_main">
            Open the full app demo
          </a>
          <p className="mt-3 text-sm text-muted">Works on phones, tablets and desktop browsers. Add it to your home screen to use it like an app.</p>
        </div>
      </div>
    </section>
  );
}
