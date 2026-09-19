import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "সাধারণ প্রশ্ন ও উত্তর",
  description:
    "অ্যাপয়েন্টমেন্ট, চিকিৎসা, প্রোডাক্ট অর্ডার ও Homeopathy Clinic-এর সেবা সম্পর্কে সাধারণ প্রশ্নের উত্তর।",
  path: "/faq",
  keywords: ["হোমিওপ্যাথি প্রশ্ন উত্তর", "homeopathy FAQ"],
});

export default function FaqLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}