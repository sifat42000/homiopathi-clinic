import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "অনলাইন অ্যাপয়েন্টমেন্ট বুক করুন",
  description:
    "Homeopathy Clinic-এ সহজে অনলাইন অ্যাপয়েন্টমেন্ট বুক করুন এবং আপনার সুবিধাজনক সময়ে চিকিৎসকের পরামর্শ নিন।",
  path: "/appointment",
  keywords: ["হোমিওপ্যাথি appointment", "অনলাইন ডাক্তার appointment"],
});

export default function AppointmentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}