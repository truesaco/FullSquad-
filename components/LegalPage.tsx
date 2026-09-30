import type { ReactNode } from "react";
import { Logo } from "./icons";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <header className="border-b border-line">
        <div className="container-x flex h-[60px] items-center justify-between lg:h-[72px]">
          <a href="/" className="flex items-center" aria-label="Fullsquad home">
            <Logo />
          </a>
          <a href="/" className="text-sm font-semibold text-accent">
            ← Back to home
          </a>
        </div>
      </header>
      <main id="main" className="container-x container-narrow py-16">
        <h1 className="h2">{title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated {updated}</p>
        <div className="mt-10 grid gap-6 text-[17px] leading-relaxed [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_a]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </main>
    </>
  );
}
