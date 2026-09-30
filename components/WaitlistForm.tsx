"use client";

import { useId, useState, type FormEvent } from "react";
import { Icon } from "./icons";
import { track } from "@/lib/track";
import { useLang } from "@/lib/i18n";

type Status = "idle" | "loading" | "success" | "error";

// Netlify Forms: the static form in /public/__forms.html registers the "waitlist" form at deploy time.
async function submitToNetlify(fields: Record<string, string>) {
  const body = new URLSearchParams({ "form-name": "waitlist", ...fields }).toString();
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function WaitlistForm({
  source,
  defaultRole = "Organizer",
  extra = {},
  compact = false,
  submitLabel,
}: {
  source: string;
  defaultRole?: "Organizer" | "Player";
  extra?: Record<string, string>;
  compact?: boolean;
  submitLabel?: string;
}) {
  const { tr } = useLang();
  const uid = useId();
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState<"Organizer" | "Player">(defaultRole);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!EMAIL_RE.test(email.trim())) next.email = tr("Enter a valid email, like you@email.com.", "Escribe un correo válido, como tu@correo.com.");
    if (!consent) next.consent = tr("Check the box so we can email you.", "Marca la casilla para que podamos escribirte.");
    setErrors(next);
    if (Object.keys(next).length) return;

    const honeypot = (e.currentTarget.elements.namedItem("bot-field") as HTMLInputElement | null)?.value;
    setStatus("loading");
    try {
      await submitToNetlify({
        email: email.trim(),
        location: location.trim(),
        role,
        consent: "yes",
        source,
        "bot-field": honeypot || "",
        ...extra,
      });
      setStatus("success");
      track("waitlist_signup", { source, role });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl border border-line bg-surface p-6 text-center">
        <span className="anim-pop mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-turf text-white">
          <Icon name="check" className="size-6" strokeWidth={3} />
        </span>
        <p className="text-lg font-bold">{tr("You're on the list.", "Ya estás en la lista.")}</p>
        <p className="mt-1 text-sm text-muted">{tr("One email when Fullsquad goes live near you. That's it.", "Un solo correo cuando Fullsquad llegue a tu zona. Nada más.")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4" aria-describedby={`${uid}-note`}>
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <label htmlFor={`${uid}-email`} className="mb-1.5 block text-sm font-medium">
            {tr("Email", "Correo")}
          </label>
          <input
            id={`${uid}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={tr("you@email.com", "tu@correo.com")}
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
          />
          {errors.email ? (
            <p id={`${uid}-email-err`} className="mt-1.5 text-sm text-error">
              {errors.email}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor={`${uid}-loc`} className="mb-1.5 block text-sm font-medium">
            {tr("ZIP or city", "Código postal o ciudad")} <span className="font-normal text-muted">{tr("(optional)", "(opcional)")}</span>
          </label>
          <input
            id={`${uid}-loc`}
            autoComplete="postal-code"
            placeholder="33024"
            className="input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">{tr("I'm a", "Soy")}</legend>
        <div className="inline-flex rounded-lg border border-line bg-bg-alt p-1">
          {(["Organizer", "Player"] as const).map((r) => (
            <label
              key={r}
              className={`flex min-h-11 cursor-pointer items-center rounded-md px-5 text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                role === r ? "bg-surface text-fg shadow-sm" : "text-muted"
              }`}
            >
              <input
                type="radio"
                name={`${uid}-role`}
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
                className="sr-only"
              />
              {r === "Organizer" ? tr("Organizer", "Organizador") : tr("Player", "Jugador")}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-[#1f3d2f]"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
          />
          <span id={`${uid}-note`}>
            {tr("I agree to get emails from Fullsquad. See the", "Acepto recibir correos de Fullsquad. Lee la")}{" "}
            <a href="/privacy/" className="font-medium text-accent underline underline-offset-2">
              {tr("Privacy Policy", "Política de privacidad")}
            </a>
            .
          </span>
        </label>
        {errors.consent ? (
          <p id={`${uid}-consent-err`} className="mt-1.5 text-sm text-error">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
            {tr("Saving your spot…", "Guardando tu lugar…")}
          </>
        ) : (
          (submitLabel ?? tr("Notify Me", "Avísame"))
        )}
      </button>
      <div aria-live="polite">
        {status === "error" ? (
          <p className="text-sm text-error">
            {tr("That didn't go through. Check your connection and try again.", "No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.")}
          </p>
        ) : null}
      </div>
    </form>
  );
}
