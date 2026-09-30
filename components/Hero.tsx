import { CityBadge } from "./CityBadge";
import { HeroPhone } from "./HeroPhone";
import { PostGameButton } from "./PostGame";

const FORMATS = ["5v5", "7v7", "8v8", "11v11", "Futsal", "Co-ed"];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-[60px] lg:pt-[72px]" aria-labelledby="hero-title">
      <div className="pitch-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="glow pointer-events-none absolute -right-40 top-10 size-[520px] rounded-full opacity-25 blur-3xl dark:opacity-20"
        style={{ background: "radial-gradient(circle, #9cc9ae, transparent 65%)" }}
        aria-hidden="true"
      />
      <div
        className="glow pointer-events-none absolute -bottom-40 right-1/4 size-[480px] rounded-full opacity-[0.12] blur-3xl dark:opacity-15"
        style={{ background: "radial-gradient(circle, #E0493E, transparent 65%)", animationDelay: "-7s" }}
        aria-hidden="true"
      />

      <div className="container-x container-wide relative grid min-h-[90vh] items-center gap-12 py-12 lg:grid-cols-[3fr_2fr] lg:gap-8 lg:py-16">
        <div className="max-w-2xl">
          <CityBadge />
          <h1 id="hero-title" className="h1 mt-6">
            Eliminate the group-chat scramble. <span className="text-keeper">Your game fills itself.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">
            Post what your game needs once. Fullsquad fills spots by position and skill, runs the waitlist, and backfills dropouts with one
            tap.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Supported formats">
            {FORMATS.map((f) => (
              <li key={f} className="chip !px-3 !py-1 text-[13px] font-semibold">
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PostGameButton loc="hero" className="btn btn-primary btn-lg">
              Post Your First Game
            </PostGameButton>
            <a href="/app/" className="btn btn-secondary btn-lg" data-cta="app_demo" data-loc="hero">
              Try the App Demo
            </a>
          </div>
          <p className="mt-4 text-sm text-muted">Free for players • No payment setup • Set up in under 5 minutes</p>
        </div>
        <div className="relative lg:justify-self-end">
          <HeroPhone />
        </div>
      </div>
    </section>
  );
}
