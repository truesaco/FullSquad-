"use client";

import { Icon, type IconName } from "./icons";
import { useLang, type L } from "@/lib/i18n";

const CHIPS = ["WhatsApp", "GroupMe", "iMessage", "Instagram DMs", "Google Calendar", "Apple Calendar", "Google Maps", "Apple Maps"];
const RULES: { icon: IconName; text: L }[] = [
  { icon: "lock", text: { en: "Phone numbers stay private", es: "Los números de teléfono son privados" } },
  { icon: "eye", text: { en: "You control who sees each post", es: "Tú decides quién ve cada publicación" } },
  { icon: "flag", text: { en: "Report and block", es: "Reportar y bloquear" } },
  { icon: "card", text: { en: "No payment details are ever collected", es: "Nunca pedimos datos de pago" } },
];

export function Trust() {
  const { t, tr } = useLang();
  return (
    <section id="trust" className="bg-bg-alt py-[60px] md:py-[100px]" aria-label={tr("Integrations and trust", "Integraciones y confianza")}>
      <div className="container-x grid gap-6 md:grid-cols-2">
        <div className="card reveal p-6 md:p-10">
          <h2 className="h2">{tr("Works with the chat you already have", "Funciona con el chat que ya usas")}</h2>
          <p className="mt-3 text-lg text-muted">
            {tr(
              "Drop the game link into your existing chat. Your crew taps it and they're in.",
              "Pega el link del partido en el chat de siempre. Tu grupo lo toca y ya está dentro.",
            )}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <li key={c} className="chip">
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xl bg-[#e7f6ec] p-4 text-[#1a1a18] dark:bg-[#12301f] dark:text-[#e8f5ed]" aria-label={tr("Example chat message", "Ejemplo de mensaje en el chat")}>
            <p className="text-sm">
              {tr(
                "Trying something new. Tap to claim your spot or you're not on the list.",
                "Vamos a probar algo nuevo. Toca para apartar tu lugar o no estás en la lista.",
              )}
            </p>
            <p className="mt-3 flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 text-sm font-semibold text-turf dark:bg-black/30 dark:text-mint">
              <Icon name="link" className="size-4" />
              fullsquad.app/g/wed-piccolo
            </p>
          </div>
        </div>
        <div className="card reveal p-6 md:p-10" style={{ ["--delay" as string]: "100ms" }}>
          <h2 className="h2">{tr("Your crew, your rules", "Tu grupo, tus reglas")}</h2>
          <ul className="mt-6 grid gap-4">
            {RULES.map((r) => (
              <li key={r.text.en} className="flex items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-tint text-accent">
                  <Icon name={r.icon} className="size-5" />
                </span>
                <span className="text-lg font-medium">{t(r.text)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
