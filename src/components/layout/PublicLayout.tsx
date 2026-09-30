import type { ReactNode } from "react";

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppLink from "@/components/contact/WhatsAppLink";

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
      <WhatsAppLink />
    </>
  );
}