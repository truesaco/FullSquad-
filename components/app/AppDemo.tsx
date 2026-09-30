"use client";

import { Icon, Logo, type IconName } from "@/components/icons";
import { ThemeToggle } from "@/components/Nav";
import { LangToggle, useLang, type L } from "@/lib/i18n";
import { Avatar } from "@/components/ui";
import { ME } from "@/lib/demo/model";
import { BackfillSheet, Toasts } from "./bits";
import { GameDetail } from "./GameDetail";
import { Crew, Feed, MyGames, PostScreen, Profile } from "./screens";
import { AppProvider, useApp } from "./store";

const TABS: { id: string; label: L; icon: IconName }[] = [
  { id: "feed", label: { en: "Feed", es: "Partidos" }, icon: "pin" },
  { id: "games", label: { en: "My Games", es: "Mis partidos" }, icon: "calendar" },
  { id: "post", label: { en: "Post", es: "Publicar" }, icon: "plus" },
  { id: "crew", label: { en: "Crew", es: "Grupo" }, icon: "users" },
  { id: "profile", label: { en: "Profile", es: "Perfil" }, icon: "sliders" },
];

export function AppDemo() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}

function Shell() {
  const { route, s, dispatch } = useApp();
  const { t: tl, tr } = useLang();
  const [screen, param] = route;
  const active = screen === "game" ? (s.games.find((g) => g.id === param)?.organizerId === ME ? "games" : "feed") : screen;
  const waiting = s.games.filter((g) => g.organizerId === ME && g.roster.length < g.size).length;

  let body: React.ReactNode;
  switch (screen) {
    case "games":
      body = <MyGames />;
      break;
    case "post":
      body = <PostScreen />;
      break;
    case "crew":
      body = <Crew />;
      break;
    case "profile":
      body = <Profile />;
      break;
    case "game":
      body = <GameDetail id={param} />;
      break;
    default:
      body = <Feed />;
  }

  return (
    <div className="min-h-dvh bg-bg-alt md:flex">
      {/* Desktop / tablet sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-bg p-4 md:flex lg:w-64">
        <a href="/" className="mb-6 flex items-center px-2" aria-label={tr("Fullsquad website", "Sitio web de Fullsquad")}>
          <Logo />
        </a>
        <nav aria-label="App">
          <ul className="grid gap-1">
            {TABS.map((t) => (
              <li key={t.id}>
                <a
                  href={`#/${t.id}`}
                  aria-current={active === t.id ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-lg px-3 font-semibold ${
                    active === t.id ? "bg-tint text-accent" : "text-fg/80 hover:bg-bg-alt"
                  }`}
                >
                  <Icon name={t.icon} className="size-5" />
                  {tl(t.label)}
                  {t.id === "games" && waiting ? (
                    <span className="ml-auto rounded-full bg-[#fef3c7] px-2 text-xs font-bold text-[#92400e]">{waiting}</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto grid gap-2 border-t border-line pt-4 text-sm">
          <div className="flex items-center justify-between px-2">
            <span className="flex items-center gap-2">
              <Avatar name="Diego R" className="size-7 text-[10px]" /> Diego R.
            </span>
            <div className="flex items-center gap-1">
              <LangToggle />
              <ThemeToggle />
            </div>
          </div>
          <a href="/" className="px-2 py-2 text-muted hover:text-fg">
            {tr("← Back to the website", "← Volver al sitio web")}
          </a>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3 bg-[#1a1a18] px-4 py-2 text-xs text-white md:px-8">
          <p>
            <span className="mr-2 rounded bg-mint px-1.5 py-0.5 font-bold text-[#1a1a18]">DEMO</span>
            {tr("Simulated players. Nothing is sent to anyone.", "Jugadores simulados. No se envía nada a nadie.")}
          </p>
          <button type="button" onClick={() => dispatch({ type: "reset" })} className="shrink-0 font-semibold underline underline-offset-2">
            {tr("Reset", "Reiniciar")}
          </button>
        </div>

        {/* Phone top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-bg/90 px-4 backdrop-blur md:hidden">
          <a href="/" className="flex items-center" aria-label={tr("Fullsquad website", "Sitio web de Fullsquad")}>
            <Logo className="text-[20px]" />
          </a>
          <div className="flex items-center">
            <LangToggle className="mr-1" />
            <ThemeToggle />
            <a href="#/profile" aria-label={tr("Profile", "Perfil")}>
              <Avatar name="Diego R" className="size-8 text-[11px]" />
            </a>
          </div>
        </header>

        <main id="main" className="mx-auto max-w-5xl px-4 pb-32 pt-5 md:px-8 md:pb-12 md:pt-8">
          {body}
        </main>
      </div>

      {/* Phone bottom tab bar */}
      <nav
        aria-label="App"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-bg/95 backdrop-blur md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-5">
          {TABS.map((t) => (
            <li key={t.id}>
              <a
                href={`#/${t.id}`}
                aria-current={active === t.id ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${active === t.id ? "text-accent" : "text-muted"}`}
              >
                {t.id === "post" ? (
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg">
                    <Icon name="plus" className="size-6" />
                  </span>
                ) : (
                  <Icon name={t.icon} className="size-6" />
                )}
                <span className={t.id === "post" ? "sr-only" : ""}>{tl(t.label)}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Toasts />
      <BackfillSheet />
    </div>
  );
}
