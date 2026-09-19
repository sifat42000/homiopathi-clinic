import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "স্বাস্থ্য বিষয়ক তথ্য ও হোমিওপ্যাথি টিপস",
  description:
    "স্বাস্থ্য সচেতনতা, সাধারণ রোগের তথ্য এবং হোমিওপ্যাথিক জীবনযাপন নিয়ে সহজ ভাষায় স্বাস্থ্য টিপস পড়ুন।",
  path: "/health-tips",
  keywords: ["স্বাস্থ্য টিপস বাংলা", "হোমিওপ্যাথি স্বাস্থ্য তথ্য"],
});

export default function HealthTipsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}