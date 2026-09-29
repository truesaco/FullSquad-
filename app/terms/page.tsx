import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Terms · FullSquad", alternates: { canonical: "/terms/" } };

export default function Terms() {
  return (
    <LegalPage title="Terms of Use" updated="September 2026">
      <p>
        FullSquad is pre-launch. This website describes a product in development; features, plans, and prices marked &ldquo;planned&rdquo;
        may change before launch.
      </p>
      <h2>Using this site</h2>
      <p>
        You can use this site to learn about FullSquad, try the game-post preview, and join the waitlist. Estimates from the Time Back
        calculator are illustrations, not guarantees.
      </p>
      <h2 id="community">Community guidelines</h2>
      <ul>
        <li>Play fair and show up when you say you&apos;re in.</li>
        <li>No harassment, hate, or threats, on or off the field.</li>
        <li>Respect organizers&apos; calls on who plays and how teams split.</li>
      </ul>
      <h2 id="acceptable-use">Acceptable use</h2>
      <ul>
        <li>Don&apos;t use FullSquad to spam, scrape, or impersonate anyone.</li>
        <li>Don&apos;t post games that don&apos;t exist or collect money through FullSquad posts.</li>
      </ul>
      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </LegalPage>
  );
}
