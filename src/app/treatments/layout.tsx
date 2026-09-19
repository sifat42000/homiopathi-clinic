import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "হোমিওপ্যাথিক চিকিৎসা ও পরামর্শ সেবা",
  description:
    "Homeopathy Clinic-এর consultation service, চিকিৎসা সেবা, ফি এবং সময়কাল সম্পর্কে বিস্তারিত জানুন।",
  path: "/treatments",
  keywords: ["হোমিওপ্যাথিক চিকিৎসা সেবা", "homeopathy consultation"],
});

export default function TreatmentsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}