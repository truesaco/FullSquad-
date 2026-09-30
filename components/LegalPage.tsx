"use client";

import type { ReactNode } from "react";
import { Logo } from "./icons";
import { LangToggle, useLang, type L } from "@/lib/i18n";

export function LegalPage({ title, updated, en, es }: { title: L; updated: L; en: ReactNode; es: ReactNode }) {
  const { t, tr, lang } = useLang();
  return (
    <>
      <header className="border-b border-line">
        <div className="container-x flex h-[60px] items-center justify-between gap-3 lg:h-[72px]">
          <a href="/" className="flex items-center" aria-label={tr("Fullsquad home", "Inicio de Fullsquad")}>
            <Logo />
          </a>
          <div className="flex items-center gap-3">
            <LangToggle />
            <a href="/" className="text-sm font-semibold text-accent">
              {tr("← Back to home", "← Volver al inicio")}
            </a>
          </div>
        </div>
      </header>
      <main id="main" className="container-x container-narrow py-16">
        <h1 className="h2">{t(title)}</h1>
        <p className="mt-2 text-sm text-muted">
          {tr("Last updated", "Última actualización:")} {t(updated)}
        </p>
        <div className="mt-10 grid gap-6 text-[17px] leading-relaxed [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_a]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6">
          {lang === "es" ? es : en}
        </div>
      </main>
    </>
  );
}
