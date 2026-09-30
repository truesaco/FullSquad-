"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "es";
/** A string in both languages. */
export type L = { en: string; es: string };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Pick the current language: tr("Post a Game", "Publica un partido"). */
  tr: (en: string, es: string) => string;
  /** Pick from a bilingual object. */
  t: (s: L) => string;
};

const LangContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  tr: (en) => en,
  t: (s) => s.en,
});

const KEY = "fs-lang";

export function LangProvider({ children }: { children: ReactNode }) {
  // Always start in English so the static HTML and first client render match; then apply the visitor's language.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    let initial: Lang = "en";
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("lang");
      const saved = localStorage.getItem(KEY);
      if (fromUrl === "es" || fromUrl === "en") initial = fromUrl;
      else if (saved === "es" || saved === "en") initial = saved;
      else if (navigator.language?.toLowerCase().startsWith("es")) initial = "es";
    } catch {}
    setLangState(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      tr: (en, es) => (lang === "es" ? es : en),
      t: (s) => (lang === "es" ? s.es : s.en),
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

/** EN | ES switch. */
export function LangToggle({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language / Idioma"
      className={`inline-flex rounded-full border p-0.5 text-xs font-bold ${dark ? "border-white/25" : "border-line"} ${className}`}
    >
      {(["en", "es"] as const).map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          aria-label={l === "en" ? "English" : "Español"}
          onClick={() => setLang(l)}
          className={`min-h-9 min-w-10 rounded-full px-2.5 uppercase transition-colors ${
            lang === l ? (dark ? "bg-chalk text-pitch" : "bg-accent text-bg") : dark ? "text-chalk/80 hover:text-chalk" : "text-muted hover:text-fg"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
