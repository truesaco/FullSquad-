import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy · FullSquad", alternates: { canonical: "/privacy/" } };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="September 2026">
      <p>FullSquad is in early access. This page explains, in plain language, what we collect on this website and why.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Your email address, and optionally your ZIP code or city and whether you organize or play, when you join the waitlist.</li>
        <li>If you use the &ldquo;Post a game&rdquo; preview and then join the waitlist, the game details you typed (day, time, place, format).</li>
        <li>Anonymous usage analytics, such as which buttons get clicked and how far people scroll, if analytics are enabled.</li>
      </ul>
      <h2>How we use it</h2>
      <p>
        To email you when FullSquad opens in your area and to understand which parts of this page are useful. We don&apos;t sell your data,
        and we never collect payment details.
      </p>
      <h2>Where it&apos;s stored</h2>
      <p>Waitlist submissions are stored with our hosting provider&apos;s form service. Analytics, if enabled, are processed by Google Analytics.</p>
      <h2 id="cookies">Cookies</h2>
      <p>
        This site stores your light/dark theme choice in your browser. If analytics are enabled, Google Analytics sets cookies to count
        visits. You can block cookies in your browser settings and the site still works.
      </p>
      <h2>Your choices</h2>
      <p>
        Every email has an unsubscribe link. To see or delete what we hold about you, email{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </LegalPage>
  );
}
