import type { ReactNode } from "react";
import { Icon } from "./icons";

/** Segmented roster bar; filled segments share one continuous brand gradient. */
export function RosterMeter({
  filled,
  total,
  className = "",
  size = "md",
}: {
  filled: number;
  total: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-1.5" : "h-2";
  return (
    <div
      className={`flex gap-[3px] ${className}`}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={filled}
      aria-label={`${filled} of ${total} spots filled`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`${h} flex-1 rounded-full transition-colors duration-300`}
          style={
            i < filled
              ? {
                  backgroundImage: "var(--brand-gradient-x)",
                  backgroundSize: `${total * 100}% 100%`,
                  backgroundPosition: `${total > 1 ? (i / (total - 1)) * 100 : 0}% 0`,
                }
              : { background: "var(--border)" }
          }
        />
      ))}
    </div>
  );
}

export function Avatar({ name, className = "size-8 text-xs" }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-turf font-bold text-white ${className}`}
    >
      {initials}
    </span>
  );
}

export function GameOnBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-turf px-2.5 py-1 text-[11px] font-bold tracking-wide text-white ${className}`}
    >
      <Icon name="check" className="size-3" strokeWidth={3} />
      GAME ON
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  center = true,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  center?: boolean;
  id?: string;
}) {
  return (
    <div className={`reveal mb-10 md:mb-14 ${center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}`}>
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h2 id={id} className="h2">
        {title}
      </h2>
      {lead ? <p className="mt-4 text-lg text-muted">{lead}</p> : null}
    </div>
  );
}

/** Phone frame used by the hero and walkthrough mockups. */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[320px] rounded-[44px] border border-white/10 bg-[#1a1a18] dark:border-white/25 p-2.5 shadow-[0_40px_80px_-20px_rgba(15,27,45,.45)] ${className}`}
    >
      <div className="relative overflow-hidden rounded-[36px] bg-bg">
        <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold tabular">
          <span>7:20</span>
          <span className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-[#1a1a18]" aria-hidden="true" />
          <span>5G</span>
        </div>
        {children}
      </div>
    </div>
  );
}
