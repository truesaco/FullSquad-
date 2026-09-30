"use client";

import { useEffect, useState } from "react";
import { Icon, Logo } from "./icons";
import { PostGameButton } from "./PostGame";
import { LangToggle, useLang, type L } from "@/lib/i18n";

const LINKS: { href: string; label: L }[] = [
  { href: "#how-it-works", label: { en: "How it Works", es: "Cómo funciona" } },
  { href: "#features", label: { en: "Features", es: "Funciones" } },
  { href: "#time-back", label: { en: "Time Back", es: "Tu tiempo" } },
  { href: "#pricing", label: { en: "Pricing", es: "Precios" } },
  { href: "#leagues", label: { en: "Leagues", es: "Ligas" } },
  { href: "/app/", label: { en: "Try the App", es: "Prueba la app" } },
];

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { tr } = useLang();
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as "light" | "dark") || "light");
  }, []);
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className={`flex size-11 items-center justify-center rounded-full text-fg hover:bg-bg-alt ${className}`}
      aria-label={next === "dark" ? tr("Switch to dark mode", "Cambiar a modo oscuro") : tr("Switch to light mode", "Cambiar a modo claro")}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("fs-theme", next);
        } catch {}
        setTheme(next);
      }}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} />
    </button>
  );
}

export function Nav() {
  const { t, tr } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[1000] transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled || open ? "border-b border-line bg-bg/90 shadow-sm backdrop-blur-md" : "border-b border-transparent bg-transparent"
        }`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2"
        >
          {tr("Skip to content", "Saltar al contenido")}
        </a>
        <nav className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between gap-4 px-4 md:px-8 lg:h-[72px]" aria-label="Main">
          <a href="#top" className="flex items-center" aria-label="Fullsquad home">
            <Logo className="text-[22px] lg:text-[24px]" />
          </a>

          <ul className="hidden items-center gap-1 whitespace-nowrap xl:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-md px-3 py-2 text-[15px] font-medium text-fg/80 hover:bg-bg-alt hover:text-fg">
                  {t(l.label)}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1 sm:gap-2">
            <LangToggle />
            <ThemeToggle />
            <a href="#waitlist" className="hidden whitespace-nowrap px-3 py-2 text-[15px] font-medium hover:text-accent 2xl:inline" data-cta="sign_in" data-loc="nav">
              {tr("Sign In", "Entrar")}
            </a>
            <PostGameButton loc="nav" className="btn btn-primary btn-sm hidden sm:inline-flex">
              {tr("Post a Game", "Publica un partido")}
            </PostGameButton>
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-full hover:bg-bg-alt xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              aria-label={open ? tr("Close menu", "Cerrar menú") : tr("Open menu", "Abrir menú")}
              onClick={() => setOpen((o) => !o)}
            >
              <Icon name={open ? "x" : "menu"} className="size-6" />
            </button>
          </div>
        </nav>
      </header>
      {/* Mobile slide-out drawer */}
      <div
        className={`fixed inset-0 top-[60px] z-[1001] lg:top-[72px] xl:hidden ${open ? "visible" : "invisible"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          id="mobile-drawer"
          className={`absolute right-0 top-0 flex h-full w-[min(85vw,360px)] flex-col gap-2 overflow-y-auto border-l border-line bg-bg p-6 transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <ul className="grid gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-lg px-3 text-lg font-semibold hover:bg-bg-alt"
                >
                  {t(l.label)}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto grid gap-3 border-t border-line pt-6" onClick={() => setOpen(false)}>
            <PostGameButton loc="drawer" className="btn btn-primary w-full">
              {tr("Post a Game", "Publica un partido")}
            </PostGameButton>
            <a href="#waitlist" tabIndex={open ? 0 : -1} className="btn btn-secondary w-full" data-cta="sign_in" data-loc="drawer">
              {tr("Sign In", "Entrar")}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
