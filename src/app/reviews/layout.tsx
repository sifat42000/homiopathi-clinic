import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "রোগীদের মতামত ও অভিজ্ঞতা",
  description:
    "Homeopathy Clinic-এর রোগীদের মতামত ও চিকিৎসা অভিজ্ঞতা দেখুন এবং আপনার প্রশ্নের উত্তর খুঁজুন।",
  path: "/reviews",
  keywords: ["হোমিওপ্যাথি ডাক্তার review", "রোগীর মতামত"],
});

export default function ReviewsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}