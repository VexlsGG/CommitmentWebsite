import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const siteUrl =
    rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://") ? rawSiteUrl : `https://${rawSiteUrl}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}

