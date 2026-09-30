import { LogoMark } from "./icons";
import { PostGameButton } from "./PostGame";

export function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden bg-pitch py-[80px] text-chalk md:py-[150px]"
      aria-labelledby="final-title"
    >
      <LogoMark className="pointer-events-none absolute -bottom-16 -right-16 hidden h-[360px] w-auto text-chalk opacity-[0.07] lg:block" />
      <div className="container-x reveal relative text-center">
        <h2 id="final-title" className="font-serif text-[2.5rem] leading-[1.05] md:text-[3.75rem]">
          Run it back. Every week.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-chalk/85 md:text-xl">
          Post your next game in under five minutes and let Fullsquad handle the headcount. Free for you and every player you invite.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <PostGameButton loc="final" className="btn btn-primary btn-lg">
            Post Your First Game
          </PostGameButton>
          <a
            href="#walkthrough"
            className="btn btn-lg border-2 border-chalk text-chalk hover:bg-chalk/10"
            data-cta="watch_walkthrough"
            data-loc="final"
          >
            Watch the Walkthrough
          </a>
        </div>
        <p className="mt-6 text-sm font-medium text-chalk/80">Free forever • No credit card • Works with your group chat • Set up in 5 minutes</p>
      </div>
    </section>
  );
}
