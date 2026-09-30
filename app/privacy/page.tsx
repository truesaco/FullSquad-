import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy · Fullsquad", alternates: { canonical: "/privacy/" } };

export default function Privacy() {
  return (
    <LegalPage
      title={{ en: "Privacy Policy", es: "Política de privacidad" }}
      updated={{ en: "September 2026", es: "septiembre de 2026" }}
      en={
        <>
          <p>Fullsquad is in early access. This page explains, in plain language, what we collect on this website and why.</p>
          <h2>What we collect</h2>
          <ul>
            <li>Your email address, and optionally your ZIP code or city and whether you organize or play, when you join the waitlist.</li>
            <li>If you use the &ldquo;Post a game&rdquo; preview and then join the waitlist, the game details you typed (day, time, place, format).</li>
            <li>Anonymous usage analytics, such as which buttons get clicked and how far people scroll, if analytics are enabled.</li>
          </ul>
          <h2>How we use it</h2>
          <p>
            To email you when Fullsquad opens in your area and to understand which parts of this page are useful. We don&apos;t sell your data,
            and we never collect payment details.
          </p>
          <h2>Where it&apos;s stored</h2>
          <p>Waitlist submissions are stored with our hosting provider&apos;s form service. Analytics, if enabled, are processed by Google Analytics.</p>
          <h2 id="cookies">Cookies</h2>
          <p>
            This site stores your light/dark theme and language choice in your browser. If analytics are enabled, Google Analytics sets cookies to count
            visits. You can block cookies in your browser settings and the site still works.
          </p>
          <h2>Your choices</h2>
          <p>
            Every email has an unsubscribe link. To see or delete what we hold about you, email{" "}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
          </p>
        </>
      }
      es={
        <>
          <p>Fullsquad está en acceso anticipado. Esta página explica, en palabras sencillas, qué datos recogemos en este sitio y por qué.</p>
          <h2>Qué recogemos</h2>
          <ul>
            <li>Tu correo y, si quieres, tu código postal o ciudad y si organizas o juegas, cuando te apuntas a la lista de espera.</li>
            <li>Si usas la vista previa de &ldquo;Publica un partido&rdquo; y luego te apuntas, los datos del partido que escribiste (día, hora, lugar, formato).</li>
            <li>Estadísticas de uso anónimas, como qué botones se tocan y hasta dónde se desplaza la gente, si la analítica está activada.</li>
          </ul>
          <h2>Para qué lo usamos</h2>
          <p>
            Para avisarte cuando Fullsquad llegue a tu zona y para entender qué partes de esta página son útiles. No vendemos tus datos y nunca
            pedimos datos de pago.
          </p>
          <h2>Dónde se guarda</h2>
          <p>Las inscripciones se guardan en el servicio de formularios de nuestro proveedor de hosting. La analítica, si está activada, la procesa Google Analytics.</p>
          <h2 id="cookies">Cookies</h2>
          <p>
            Este sitio guarda en tu navegador tu tema (claro u oscuro) y tu idioma. Si la analítica está activada, Google Analytics usa cookies para
            contar visitas. Puedes bloquear las cookies en tu navegador y el sitio sigue funcionando.
          </p>
          <h2>Tus opciones</h2>
          <p>
            Cada correo tiene un enlace para darte de baja. Para ver o borrar lo que tenemos sobre ti, escribe a{" "}
            <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
          </p>
        </>
      }
    />
  );
}
