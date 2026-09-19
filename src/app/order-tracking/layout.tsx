import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata;

export default function OrderTrackingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}