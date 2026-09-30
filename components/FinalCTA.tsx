"use client";

import { LogoMark } from "./icons";
import { useLang } from "@/lib/i18n";
import { PostGameButton } from "./PostGame";

export function FinalCTA() {
  const { tr } = useLang();
  return (
    <section
      className="relative overflow-hidden bg-pitch py-[80px] text-chalk md:py-[150px]"
      aria-labelledby="final-title"
    >
      <LogoMark className="pointer-events-none absolute -bottom-16 -right-16 hidden h-[360px] w-auto text-chalk opacity-[0.07] lg:block" />
      <div className="container-x reveal relative text-center">
        <h2 id="final-title" className="font-serif text-[2.5rem] leading-[1.05] md:text-[3.75rem]">
          {tr("Run it back. Every week.", "Otra vez. Cada semana.")}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-chalk/85 md:text-xl">
          {tr(
            "Post your next game in under five minutes and let Fullsquad handle the headcount. Free for you and every player you invite.",
            "Publica tu próximo partido en menos de cinco minutos y deja que Fullsquad se encargue de contar gente. Gratis para ti y para cada jugador que invites.",
          )}
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <PostGameButton loc="final" className="btn btn-primary btn-lg">
            {tr("Post Your First Game", "Publica tu primer partido")}
          </PostGameButton>
          <a
            href="#walkthrough"
            className="btn btn-lg border-2 border-chalk text-chalk hover:bg-chalk/10"
            data-cta="watch_walkthrough"
            data-loc="final"
          >
            {tr("Watch the Walkthrough", "Ver el recorrido")}
          </a>
        </div>
        <p className="mt-6 text-sm font-medium text-chalk/80">{tr(
            "Free forever • No credit card • Works with your group chat • Set up in 5 minutes",
            "Gratis para siempre • Sin tarjeta • Funciona con tu chat de grupo • Listo en 5 minutos",
          )}
        </p>
      </div>
    </section>
  );
}
