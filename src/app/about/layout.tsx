import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "আমাদের সম্পর্কে ও চিকিৎসক পরিচিতি",
  description:
    "Homeopathy Clinic-এর চিকিৎসক, যোগ্যতা, চেম্বার এবং রোগীসেবার উদ্দেশ্য সম্পর্কে জানুন।",
  path: "/about",
  keywords: ["হোমিওপ্যাথিক ডাক্তার পরিচিতি", "চিকিৎসকের যোগ্যতা"],
});

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}