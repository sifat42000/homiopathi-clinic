import type { Metadata } from "next";
import { hindSiliguri, inter } from "./fonts";
import "./globals.css";
import {
  WebsiteSettingsProvider,
} from "@/components/layout/WebsiteSettingsProvider";
import {
  clinicStructuredData,
  createPageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "হোমিওপ্যাথিক চিকিৎসা ও স্বাস্থ্যসেবা",
    description:
      "বিশ্বস্ত হোমিওপ্যাথিক চিকিৎসা, অভিজ্ঞ চিকিৎসকের পরামর্শ, সহজ অ্যাপয়েন্টমেন্ট এবং প্রয়োজনীয় হোমিওপ্যাথিক প্রোডাক্ট এক জায়গায়।",
    path: "/",
  }),
  title: {
    default: "হোমিওপ্যাথিক চিকিৎসা ও স্বাস্থ্যসেবা",
    template: "%s | Homeopathy Clinic",
  },
  metadataBase: new URL(
    (
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
    ).replace(/\/$/, "")
  ),
  authors: [{ name: "Homeopathy Clinic" }],
  creator: "Homeopathy Clinic",
  publisher: "Homeopathy Clinic",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${inter.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              clinicStructuredData
            ),
          }}
        />

        <WebsiteSettingsProvider>
          {children}
        </WebsiteSettingsProvider>
      </body>
    </html>
  );
}