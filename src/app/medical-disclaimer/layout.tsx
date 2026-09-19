import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Medical Disclaimer",
  description:
    "Homeopathy Clinic-এর স্বাস্থ্য তথ্য ও অনলাইন সেবার Medical Disclaimer পড়ুন।",
  path: "/medical-disclaimer",
});

export default function MedicalDisclaimerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}