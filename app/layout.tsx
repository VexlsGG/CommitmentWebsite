import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://") ? rawSiteUrl : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Commit — Waitlist",
    template: "%s — Commit"
  },
  description: "Join the Commit waitlist.",
  applicationName: "Commit",
  keywords: ["habit tracker", "habit tracking", "consistency", "streaks", "productivity", "waitlist", "Commit app"],
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Commit — Waitlist",
    description: "Join the Commit waitlist.",
    siteName: "Commit",
    images: [{ url: "/assets/FinalImage.svg" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Commit — Waitlist",
    description: "Join the Commit waitlist.",
    images: ["/assets/FinalImage.svg"],
    creator: "@vexlsgg"
  },
  icons: {
    icon: "/assets/CommitLogo.png",
    apple: "/assets/CommitLogo.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}

