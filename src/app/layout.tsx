import type { Metadata } from "next";
import { hindSiliguri, inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Homeopathy Clinic",
  description:
    "বিশ্বস্ত হোমিওপ্যাথিক চিকিৎসা, প্রয়োজনীয় পণ্য এবং সহজ অ্যাপয়েন্টমেন্ট সেবা।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}