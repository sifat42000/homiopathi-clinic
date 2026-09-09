import type { ReactNode } from "react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <>
      <AnnouncementBar />

      <Header />

      <main>
        {children}
      </main>

      <Footer />
    </>
  );
}