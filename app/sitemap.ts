import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://remotecodede.com";

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/how-it-works`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/supported-vehicles`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/features`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/pricing`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/faq`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/login`, changeFrequency: "weekly", priority: 0.3 },
    { url: `${baseUrl}/signup`, changeFrequency: "weekly", priority: 0.3 },
  ];
}
