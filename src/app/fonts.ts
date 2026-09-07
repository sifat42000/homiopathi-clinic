import { Hind_Siliguri, Inter } from "next/font/google";

export const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-english",
  display: "swap",
});