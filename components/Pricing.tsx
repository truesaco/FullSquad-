"use client";

import { useState } from "react";
import { Icon } from "./icons";
import { PostGameButton } from "./PostGame";
import { FAQS } from "@/lib/content";
import { SITE } from "@/lib/site";
import { track } from "@/lib/track";

type Billing = "monthly" | "annual";

const TABLE: { group: string; rows: [string, string, string, string][] }[] = [
  {
    group: "Core",
    rows: [
      ["Find and join games", "✓", "✓", "✓"],
      ["One-tap confirm", "✓", "✓", "✓"],
      ["Waitlist position", "✓", "✓", "✓"],
      ["Reminders", "✓", "✓", "✓"],
    ],
  },
  {
    group: "Matching",
    rows: [
      ["Crew-first reach", "—", "✓", "✓"],
      ["Position and skill matching", "—", "✓", "✓"],
      ["Priority fill", "—", "—", "✓"],
    ],
  },
  {
    group: "Sharing",
    rows: [
      ["Game link works in any chat", "✓", "✓", "✓"],
      ["Calendar and maps", "✓", "✓", "✓"],
    ],
  },
  {
    group: "Organizer tools",
    rows: [
      ["Unlimited posts", "—", "✓", "✓"],
      ["Auto waitlist and backfills", "—", "✓", "✓"],
      ["Position balance check", "—", "✓", "✓"],
      ["Crew size", "—", "Up to 60", "Unlimited"],
      ["Recurring games", "—", "—", "✓"],
      ["Reliability stats and gap predictions", "—", "—", "✓"],
    ],
  },
];

function CellValue({ v }: { v: string }) {
  if (v === "✓")
    return (
      <>
        <Icon name="check" className="mx-auto size-5 text-accent" strokeWidth={2.5} />
        <span className="sr-only">Included</span>
      </>
    );
  if (v === "—")
    return (
      <>
        <span aria-hidden="true" className="text-muted">
          —
        </span>
        <span className="sr-only">Not included</span>
      </>
    );
  return <span className="font-medium">{v}</span>;
}

function Features({ items }: { items: string[] }) {
  return (
    <ul className="mb-8 mt-6 grid gap-3 text-[15px]">
      {items.map((f) => (
        <li key={f} className="flex gap-3">
          <Icon name="check" className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={2.5} />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("annual");

  return (
    <section id="pricing" className="section" aria-labelledby="pricing-title">
      <div className="container-x container-wide">
        <div className="reveal mx-auto mb-10 max-w-3xl text-center">
          <p className="eyebrow mb-3">Pricing</p>
          <h2 id="pricing-title" className="h2">
            Is it really free? Yes.
          </h2>
        </div>

        <div className="reveal mb-10 flex flex-col items-center gap-2">
          <div className="inline-flex rounded-full border border-line bg-bg-alt p-1" role="group" aria-label="Organizer Pro billing period">
            {(["monthly", "annual"] as const).map((b) => (
              <button
                key={b}
                type="button"
                aria-pressed={billing === b}
                onClick={() => {
                  setBilling(b);
                  track("billing_toggle", { billing: b });
                }}
                className={`flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors ${
                  billing === b ? "bg-surface text-fg shadow-sm" : "text-muted"
                }`}
              >
                {b === "monthly" ? "Monthly" : "Annual"}
                {b === "annual" ? (
                  <span className="rounded-full bg-volt px-2 py-0.5 text-[11px] font-bold text-[#1a1a18]">Save 25%</span>
                ) : null}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted">Billing toggle applies to Organizer Pro only.</p>
        </div>

        <div className="mx-auto grid max-w-[1200px] items-start gap-6 lg:grid-cols-3">
          {/* Player */}
          <div className="card reveal order-2 flex h-full flex-col p-8 transition-transform duration-300 hover:-translate-y-1 lg:order-1">
            <h3 className="text-xl font-bold">Player</h3>
            <p className="text-sm text-muted">Anyone who wants a game</p>
            <p className="mt-6">
              <span className="text-4xl font-bold">$0</span> <span className="text-muted">forever</span>
            </p>
            <Features items={["Find games", "One-tap join and confirm", "Waitlist position", "Profile", "Reminders"]} />
            <a
              href="#waitlist"
              className="btn btn-secondary mt-auto w-full"
              data-cta="pricing_player"
              data-loc="pricing"
              onClick={() => track("pricing_tier_click", { tier: "player" })}
            >
              Find a Game
            </a>
          </div>

          {/* Organizer */}
          <div className="card reveal relative order-1 flex h-full flex-col !border-2 !border-accent p-8 shadow-xl transition-transform duration-300 hover:-translate-y-3 lg:order-2 lg:-translate-y-2">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-turf px-3 py-1 text-xs font-bold tracking-wide text-white">
              MOST POPULAR
            </span>
            <h3 className="text-xl font-bold">Organizer</h3>
            <p className="text-sm text-muted">The person who keeps the game alive</p>
            <p className="mt-6">
              <span className="text-4xl font-bold">$0</span> <span className="text-muted">forever</span>
            </p>
            <Features
              items={[
                "Everything in Player, plus:",
                "Unlimited posts",
                "Crew-first reach and matching",
                "Auto waitlist and backfills",
                "Position balance check",
                "Crew of up to 60",
              ]}
            />
            <div className="mt-auto" onClick={() => track("pricing_tier_click", { tier: "organizer" })}>
              <PostGameButton loc="pricing" className="btn btn-primary w-full">
                Post Your First Game
              </PostGameButton>
            </div>
          </div>

          {/* Pro */}
          <div className="card reveal order-3 flex h-full flex-col p-8 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">Organizer Pro</h3>
              <span className="rounded-full bg-bg-alt px-2 py-0.5 text-[11px] font-bold tracking-wide text-muted">PLANNED</span>
            </div>
            <p className="text-sm text-muted">People running several games a week</p>
            <p className="mt-6" aria-live="polite">
              <span className="text-4xl font-bold">{billing === "annual" ? "$36" : "$4"}</span>{" "}
              <span className="text-muted">{billing === "annual" ? "/yr" : "/mo"}</span>
              <span className="block text-sm text-muted">
                {billing === "annual" ? "Works out to $3/mo" : "Or $36/yr, save 25%"}
              </span>
            </p>
            <Features
              items={["Everything in Organizer, plus:", "Recurring games", "Reliability stats", "Gap predictions", "Priority fill", "Unlimited crew"]}
            />
            <a
              href="#waitlist"
              className="btn btn-secondary mt-auto w-full"
              data-cta="pricing_pro"
              data-loc="pricing"
              onClick={() => track("pricing_tier_click", { tier: "pro", billing })}
            >
              Get Notified
            </a>
          </div>
        </div>

        <p className="mt-10 text-center text-sm font-medium text-muted">No credit card • Players never pay • Leave anytime</p>
        <p id="leagues" className="mt-3 text-center">
          Running a league or tournament?{" "}
          <a
            href={`mailto:${SITE.contactEmail}?subject=Leagues%20%26%20tournaments`}
            className="font-semibold text-accent underline-offset-4 hover:underline"
            data-cta="leagues_talk"
            data-loc="pricing"
          >
            Talk to us →
          </a>
        </p>

        <details className="disclosure reveal mx-auto mt-12 max-w-[1000px] rounded-2xl border border-line bg-surface">
          <summary className="flex min-h-14 items-center justify-between gap-4 px-6 py-4 font-bold">
            Compare all features
            <Icon name="plus" className="disclosure-icon size-5 transition-transform duration-300" />
          </summary>
          <div className="overflow-x-auto px-2 pb-4 md:px-6">
            <table className="w-full min-w-[520px] text-sm">
              <caption className="sr-only">Feature comparison across Player, Organizer and Organizer Pro</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="py-3 pr-3 text-left">
                    Feature
                  </th>
                  <th scope="col" className="px-3 py-3 text-center">
                    Player
                  </th>
                  <th scope="col" className="px-3 py-3 text-center text-accent">
                    Organizer
                  </th>
                  <th scope="col" className="px-3 py-3 text-center">
                    Pro (planned)
                  </th>
                </tr>
              </thead>
              {TABLE.map((g) => (
                <tbody key={g.group}>
                  <tr>
                    <th scope="colgroup" colSpan={4} className="caption pt-5 pb-2 text-left text-muted">
                      {g.group}
                    </th>
                  </tr>
                  {g.rows.map(([label, ...vals]) => (
                    <tr key={label} className="border-b border-line last:border-0">
                      <th scope="row" className="py-3 pr-3 text-left font-normal">
                        {label}
                      </th>
                      {vals.map((v, i) => (
                        <td key={i} className="px-3 py-3 text-center">
                          <CellValue v={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </details>

        <div className="mx-auto mt-16 max-w-[900px]">
          <h3 className="h3 reveal mb-6 text-center">Questions</h3>
          <div className="grid gap-3">
            {FAQS.map((f, i) => (
              <details key={f.q} className="disclosure card reveal !shadow-none" open={i === 0}>
                <summary className="flex min-h-14 items-center justify-between gap-4 px-6 py-4 text-lg font-semibold">
                  {f.q}
                  <Icon name="plus" className="disclosure-icon size-5 shrink-0 transition-transform duration-300" />
                </summary>
                <p className="px-6 pb-6 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
