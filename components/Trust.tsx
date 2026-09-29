import { Icon, type IconName } from "./icons";

const CHIPS = ["WhatsApp", "GroupMe", "iMessage", "Instagram DMs", "Google Calendar", "Apple Calendar", "Google Maps", "Apple Maps"];
const RULES: { icon: IconName; text: string }[] = [
  { icon: "lock", text: "Phone numbers stay private" },
  { icon: "eye", text: "You control who sees each post" },
  { icon: "flag", text: "Report and block" },
  { icon: "card", text: "No payment details are ever collected" },
];

export function Trust() {
  return (
    <section id="trust" className="bg-bg-alt py-[60px] md:py-[100px]" aria-label="Integrations and trust">
      <div className="container-x grid gap-6 md:grid-cols-2">
        <div className="card reveal p-6 md:p-10">
          <h2 className="h2">Works with the chat you already have</h2>
          <p className="mt-3 text-lg text-muted">Drop the game link into your existing chat. Your crew taps it and they&apos;re in.</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <li key={c} className="chip">
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xl bg-[#e7f6ec] p-4 text-[#0f1b2d] dark:bg-[#12301f] dark:text-[#e8f5ed]" aria-label="Example chat message">
            <p className="text-sm">Trying something new. Tap to claim your spot or you&apos;re not on the list.</p>
            <p className="mt-3 flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 text-sm font-semibold text-turf dark:bg-black/30 dark:text-mint">
              <Icon name="link" className="size-4" />
              fullsquad.app/g/wed-piccolo
            </p>
          </div>
        </div>
        <div className="card reveal p-6 md:p-10" style={{ ["--delay" as string]: "100ms" }}>
          <h2 className="h2">Your crew, your rules</h2>
          <ul className="mt-6 grid gap-4">
            {RULES.map((r) => (
              <li key={r.text} className="flex items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-tint text-accent">
                  <Icon name={r.icon} className="size-5" />
                </span>
                <span className="text-lg font-medium">{r.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
