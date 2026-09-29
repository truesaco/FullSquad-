import { PostGameButton } from "./PostGame";

export function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden py-[80px] text-[#0f1b2d] md:py-[150px]"
      style={{ background: "linear-gradient(135deg, #3DDC84 0%, #C6F432 35%, #FFD23F 65%, #FF8C42 100%)" }}
      aria-labelledby="final-title"
    >
      <div className="container-x reveal relative text-center">
        <h2 id="final-title" className="font-serif text-[2.5rem] leading-[1.1] md:text-[4rem]">
          Run it back. Every week.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg md:text-xl">
          Post your next game in under five minutes and let FullSquad handle the headcount. Free for you and every player you invite.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <PostGameButton loc="final" className="btn btn-dark btn-lg">
            Post Your First Game
          </PostGameButton>
          <a
            href="#walkthrough"
            className="btn btn-lg border-2 border-[#0f1b2d] text-[#0f1b2d] hover:bg-[#0f1b2d]/10"
            data-cta="watch_walkthrough"
            data-loc="final"
          >
            Watch the Walkthrough
          </a>
        </div>
        <p className="mt-6 text-sm font-medium">Free forever • No credit card • Works with your group chat • Set up in 5 minutes</p>
      </div>
    </section>
  );
}
