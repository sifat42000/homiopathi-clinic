import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "যোগাযোগ ও চেম্বারের ঠিকানা",
  description:
    "Homeopathy Clinic-এর ফোন, WhatsApp, ইমেইল, চেম্বারের ঠিকানা ও যোগাযোগের তথ্য দেখুন।",
  path: "/contact",
  keywords: ["হোমিওপ্যাথি clinic contact", "হোমিওপ্যাথি চেম্বার ঠিকানা"],
});

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}