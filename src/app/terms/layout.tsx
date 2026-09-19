import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Terms and Conditions",
  description: "Homeopathy Clinic-এর Terms and Conditions পড়ুন।",
  path: "/terms",
});

export default function TermsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}