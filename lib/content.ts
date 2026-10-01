import type { L } from "./i18n";

export const FAQS: { q: L; a: L }[] = [
  {
    q: { en: "Do players ever pay?", es: "¿Los jugadores pagan algo?" },
    a: {
      en: "No. Players use Fullsquad free, forever. Joining, confirming, and waitlists never cost anything.",
      es: "No. Los jugadores usan Fullsquad gratis, para siempre. Apuntarse, confirmar y la lista de espera nunca cuestan nada.",
    },
  },
  {
    q: { en: "Do you collect field fees?", es: "¿Cobran el alquiler de la cancha?" },
    a: {
      en: "No. Fullsquad never touches money. If your crew splits a field rental, keep doing it however you do today. We don't take a cut and we never ask for payment details.",
      es: "No. Fullsquad nunca toca dinero. Si tu grupo divide el alquiler de la cancha, sigan haciéndolo como siempre. No cobramos comisión y nunca pedimos datos de pago.",
    },
  },
  {
    q: { en: "Can I switch plans?", es: "¿Puedo cambiar de plan?" },
    a: {
      en: "Yes. Player and Organizer are free forever. When Organizer Pro launches you can try it, and drop back to free any time without losing your crew or your games.",
      es: "Sí. Jugador y Organizador son gratis para siempre. Cuando salga Organizador Pro podrás probarlo y volver al plan gratis cuando quieras, sin perder tu grupo ni tus partidos.",
    },
  },
  {
    q: { en: "Do I have to say which positions I need?", es: "¿Tengo que decir qué posiciones necesito?" },
    a: {
      en: 'No. Leave it on "Any position" and anyone who fits your level can grab a spot. Or toggle exactly what you\'re short on, like 1 keeper and 2 defenders, and the rest stay open to anyone.',
      es: 'No. Déjalo en "Cualquier posición" y cualquiera de tu nivel puede tomar un cupo. O activa exactamente lo que te falta, como 1 portero y 2 defensas, y el resto queda abierto para cualquiera.',
    },
  },
  {
    q: { en: "We rotate positions, even in goal. Does Fullsquad work for us?", es: "Rotamos posiciones, hasta en el arco. ¿Fullsquad sirve para nosotros?" },
    a: {
      en: "Yes. Pick \"Rotating\" when you post: rotating keeper (Fullsquad builds a fair keeper schedule, volunteers first) or free rotation. Or choose \"Positions, then rotate\": hold a keeper spot until a deadline you pick, like the night before. If nobody claims it by then, the game switches to rotating keepers on its own.",
      es: "Sí. Elige \"Rotativo\" al publicar: portero rotativo (Fullsquad arma un turno justo de porteros, los voluntarios primero) o rotación libre. O elige \"Posiciones, luego rotación\": reserva el arco hasta la hora límite que elijas, como la noche anterior. Si nadie lo toma, el partido pasa solo a portero rotativo.",
    },
  },
  {
    q: { en: "What if my crew won't download another app?", es: "¿Y si mi grupo no quiere descargar otra app?" },
    a: {
      en: "They don't have to. Every game gets a link you drop into the chat you already use. Your crew taps it, says In or Pass, and they're on the roster or the waitlist.",
      es: "No tienen que hacerlo. Cada partido tiene un link que pegas en el chat de siempre. Tu grupo lo toca, dice Me apunto o Paso, y ya están en la lista o en la lista de espera.",
    },
  },
  {
    q: { en: "How is this different from pay-to-play pickup apps?", es: "¿En qué se diferencia de las apps donde pagas por jugar?" },
    a: {
      en: "Those apps sell spots in games they run, usually with strangers at booked fields, and charge per game with strict cancellation windows. Fullsquad is for the game you already run with your crew. It's free, it fills your crew first, and there's nothing to refund.",
      es: "Esas apps venden cupos en partidos que ellas organizan, casi siempre con desconocidos en canchas alquiladas, y cobran por partido con reglas estrictas de cancelación. Fullsquad es para el partido que ya armas con tu grupo. Es gratis, llena primero con tu grupo y no hay nada que reembolsar.",
    },
  },
];

export const FORMATS = [
  { id: "5v5", label: "5v5", size: 10 },
  { id: "7v7", label: "7v7", size: 14 },
  { id: "8v8", label: "8v8", size: 16 },
  { id: "11v11", label: "11v11", size: 22 },
] as const;
