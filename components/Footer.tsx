"use client";

import { Logo, SocialIcon } from "./icons";
import { useLang } from "@/lib/i18n";

const ES: Record<string, string> = {
  "Product": "Producto",
  "How it Works": "Cómo funciona",
  "Features": "Funciones",
  "Pricing": "Precios",
  "Trust & Safety": "Confianza y seguridad",
  "Changelog": "Novedades",
  "Community": "Comunidad",
  "Find a Game": "Buscar partido",
  "Organizer Guide": "Guía para organizar",
  "Blog": "Blog",
  "Help Center": "Ayuda",
  "Leagues": "Ligas",
  "Company": "Empresa",
  "About": "Nosotros",
  "Careers": "Empleos",
  "Contact": "Contacto",
  "Press Kit": "Prensa",
  "Partners": "Alianzas",
  "Legal": "Legal",
  "Privacy": "Privacidad",
  "Terms": "Términos",
  "Cookies": "Cookies",
  "Community Guidelines": "Normas de la comunidad",
  "Acceptable Use": "Uso aceptable"
};
import { WaitlistForm } from "./WaitlistForm";
import { SITE } from "@/lib/site";

type L = { label: string; href?: string };
const COLS: { title: string; links: L[] }[] = [
  {
    title: "Product",
    links: [
      { label: "How it Works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Trust & Safety", href: "#trust" },
      { label: "Changelog" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Find a Game", href: "#waitlist" },
      { label: "Organizer Guide" },
      { label: "Blog" },
      { label: "Help Center", href: `mailto:${SITE.contactEmail}` },
      { label: "Leagues", href: "#leagues" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#how-it-works" },
      { label: "Careers" },
      { label: "Contact", href: `mailto:${SITE.contactEmail}` },
      { label: "Press Kit" },
      { label: "Partners", href: `mailto:${SITE.contactEmail}?subject=Partnerships` },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy/" },
      { label: "Terms", href: "/terms/" },
      { label: "Cookies", href: "/privacy/#cookies" },
      { label: "Community Guidelines", href: "/terms/#community" },
      { label: "Acceptable Use", href: "/terms/#acceptable-use" },
    ],
  },
];

export function Footer() {
  const { tr, lang } = useLang();
  const x = (s: string) => (lang === "es" ? ES[s] ?? s : s);
  return (
    <footer className="bg-pitch pt-20 pb-28 text-[14px] text-[#c9d6cd] md:pb-10" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        {tr("Footer", "Pie de página")}
      </h2>
      <div className="container-x container-wide">
        <div
          id="waitlist"
          className="grid scroll-mt-24 gap-8 rounded-2xl border border-[#2f5443] bg-[#183226] p-6 text-chalk md:p-10 lg:grid-cols-[1fr_1.3fr]"
          data-theme="dark"
        >
          <div>
            <p className="font-serif text-3xl leading-tight md:text-4xl">{tr("Get told when Fullsquad opens near you.", "Entérate cuando Fullsquad llegue a tu zona.")}</p>
            <p className="mt-3 text-[#c9d6cd]">{tr("One email when your area goes live. That's it.", "Un solo correo cuando tu zona esté activa. Nada más.")}</p>
          </div>
          <WaitlistForm source="footer" />
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
            <a href="#top" className="inline-flex items-center" aria-label="Fullsquad home">
              <Logo className="text-[26px] !text-chalk" />
            </a>
            <p className="mt-3">{tr(SITE.tagline, "Partidos que se llenan solos")}</p>
            <ul className="mt-5 flex gap-2">
              {(Object.keys(SITE.social) as (keyof typeof SITE.social)[]).map((k) => (
                <li key={k}>
                  <a
                    href={SITE.social[k]}
                    className="flex size-11 items-center justify-center rounded-full border border-[#2f5443] text-chalk hover:border-keeper hover:text-chalk hover:bg-keeper"
                    aria-label={`Fullsquad ${tr("on", "en")} ${k === "tiktok" ? "TikTok" : k === "youtube" ? "YouTube" : k === "linkedin" ? "LinkedIn" : "Instagram"}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <SocialIcon name={k} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {COLS.map((c) => (
            <nav key={c.title} aria-label={x(c.title)}>
              <p className="caption text-chalk">{x(c.title)}</p>
              <ul className="mt-4 grid gap-1">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {l.href ? (
                      <a href={l.href} className="inline-flex min-h-9 items-center hover:text-chalk hover:underline">
                        {x(l.label)}
                      </a>
                    ) : (
                      <span className="inline-flex min-h-9 items-center gap-2 text-[#c9d6cd]/70">
                        {x(l.label)}
                        <span className="rounded bg-[#2f5443] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-[#c9d6cd]">{tr("SOON", "PRONTO")}</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-16 border-t border-[#2f5443] pt-8">© {new Date().getFullYear()} Fullsquad. {tr("All rights reserved.", "Todos los derechos reservados.")}</p>
      </div>
    </footer>
  );
}
