import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://remotecodede.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/api", "/booking", "/setup-instructions", "/checkout"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
