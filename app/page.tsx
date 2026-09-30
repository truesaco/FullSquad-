import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Solution } from "@/components/Solution";
import { Features } from "@/components/Features";
import { TimeBackCalculator } from "@/components/TimeBackCalculator";
import { Compare } from "@/components/Compare";
import { Story } from "@/components/Story";
import { Pricing } from "@/components/Pricing";
import { Trust } from "@/components/Trust";
import { Walkthrough } from "@/components/Walkthrough";
import { AppPreview } from "@/components/AppPreview";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { MobileFab } from "@/components/MobileFab";
import { PageEffects } from "@/components/PageEffects";
import { PostGameProvider } from "@/components/PostGame";
import { FAQS } from "@/lib/content";
import { SITE } from "@/lib/site";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon-512.png`,
    email: SITE.contactEmail,
    sameAs: Object.values(SITE.social),
  },
  {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: SITE.name,
    operatingSystem: "iOS, Android, Web",
    applicationCategory: "SportsApplication",
    description: SITE.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q.en, acceptedAnswer: { "@type": "Answer", text: f.a.en } })),
  },
];

export default function Home() {
  return (
    <PostGameProvider>
      <Nav />
      <main id="main">
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <TimeBackCalculator />
        <Compare />
        <Story />
        <Pricing />
        <Trust />
        <Walkthrough />
        <AppPreview />
        <FinalCTA />
      </main>
      <Footer />
      <MobileFab />
      <PageEffects />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </PostGameProvider>
  );
}
