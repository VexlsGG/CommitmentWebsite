import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const siteUrl =
    rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://") ? rawSiteUrl : `https://${rawSiteUrl}`;

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    }
  ];
}

