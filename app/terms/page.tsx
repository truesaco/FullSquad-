import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Terms · Fullsquad", alternates: { canonical: "/terms/" } };

export default function Terms() {
  return (
    <LegalPage
      title={{ en: "Terms of Use", es: "Términos de uso" }}
      updated={{ en: "September 2026", es: "septiembre de 2026" }}
      en={
        <>
          <p>
            Fullsquad is pre-launch. This website describes a product in development; features, plans, and prices marked &ldquo;planned&rdquo;
            may change before launch.
          </p>
          <h2>Using this site</h2>
          <p>
            You can use this site to learn about Fullsquad, try the game-post preview, and join the waitlist. Estimates from the Time Back
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
            <li>Don&apos;t use Fullsquad to spam, scrape, or impersonate anyone.</li>
            <li>Don&apos;t post games that don&apos;t exist or collect money through Fullsquad posts.</li>
          </ul>
          <h2>Contact</h2>
          <p>
            Questions? Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
          </p>
        </>
      }
      es={
        <>
          <p>
            Fullsquad todavía no se lanza. Este sitio describe un producto en desarrollo; las funciones, planes y precios marcados como
            &ldquo;próximamente&rdquo; pueden cambiar antes del lanzamiento.
          </p>
          <h2>Uso de este sitio</h2>
          <p>
            Puedes usar este sitio para conocer Fullsquad, probar la vista previa de publicaciones y apuntarte a la lista de espera. Los cálculos de
            la calculadora de tiempo son ilustraciones, no garantías.
          </p>
          <h2 id="community">Normas de la comunidad</h2>
          <ul>
            <li>Juega limpio y llega cuando dices que vas.</li>
            <li>Nada de acoso, odio ni amenazas, ni dentro ni fuera de la cancha.</li>
            <li>Respeta las decisiones del organizador sobre quién juega y cómo se arman los equipos.</li>
          </ul>
          <h2 id="acceptable-use">Uso aceptable</h2>
          <ul>
            <li>No uses Fullsquad para hacer spam, extraer datos ni hacerte pasar por otra persona.</li>
            <li>No publiques partidos que no existen ni cobres dinero a través de publicaciones de Fullsquad.</li>
          </ul>
          <h2>Contacto</h2>
          <p>
            ¿Preguntas? Escribe a <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
          </p>
        </>
      }
    />
  );
}
