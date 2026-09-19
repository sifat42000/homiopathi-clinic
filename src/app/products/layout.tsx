import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "হোমিওপ্যাথিক প্রোডাক্ট ও ওষুধ",
  description:
    "প্রয়োজনীয় হোমিওপ্যাথিক প্রোডাক্টের তথ্য, মূল্য, স্টক এবং ব্যবহারবিধি দেখে অনলাইনে অর্ডার করুন।",
  path: "/products",
  keywords: ["হোমিওপ্যাথিক ওষুধ কিনুন", "হোমিওপ্যাথিক product বাংলাদেশ"],
});

export default function ProductsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}