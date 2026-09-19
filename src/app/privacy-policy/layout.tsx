import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "Homeopathy Clinic-এর Privacy Policy এবং তথ্য ব্যবহারের নীতিমালা।",
  path: "/privacy-policy",
});

export default function PrivacyPolicyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}