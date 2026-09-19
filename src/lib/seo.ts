import type { Metadata } from "next";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const siteName = "Homeopathy Clinic";

export const defaultKeywords = [
  "হোমিওপ্যাথিক চিকিৎসা",
  "হোমিওপ্যাথি ডাক্তার",
  "হোমিওপ্যাথিক ক্লিনিক",
  "অনলাইন অ্যাপয়েন্টমেন্ট",
  "হোমিওপ্যাথিক ওষুধ",
  "homeopathy clinic Bangladesh",
];

export const privateMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const canonicalPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return {
    title,
    description,
    keywords: [
      ...keywords,
      ...defaultKeywords,
    ],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      url: canonicalPath,
      siteName,
      title: `${title} | ${siteName}`,
      description,
      locale: "bn_BD",
      images: [
        {
          url: "/logo.jpg",
          alt: `${siteName} logo`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${title} | ${siteName}`,
      description,
      images: ["/logo.jpg"],
    },
  };
}

export const clinicStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalClinic",
      "@id": `${siteUrl}/#clinic`,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/logo.jpg`,
      image: `${siteUrl}/logo.jpg`,
      description:
        "বাংলাদেশে সহজ অ্যাপয়েন্টমেন্ট, স্বাস্থ্য পরামর্শ এবং হোমিওপ্যাথিক সেবা প্রদানকারী ক্লিনিক।",
      medicalSpecialty: " https://schema.org/Homeopathic ".trim(),
      areaServed: {
        "@type": "Country",
        name: "Bangladesh",
      },
      availableLanguage: [
        "Bangla",
        "English",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      publisher: {
        "@id": `${siteUrl}/#clinic`,
      },
      inLanguage: "bn-BD",
    },
  ],
};