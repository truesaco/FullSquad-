import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Pre-launch: ask every crawler to stay out so the site is only reachable by people who have the link.
// At launch, allow "/" again and add back `sitemap: `${SITE.url}/sitemap.xml``.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
