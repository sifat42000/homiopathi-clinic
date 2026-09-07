import type { ReactNode } from "react";

import AccountSidebar from "@/components/account/AccountSidebar";

type AccountLayoutProps = {
  children: ReactNode;
};

export default function AccountLayout({
  children,
}: AccountLayoutProps) {
  return (
    <div className="grid items-start gap-7 lg:grid-cols-[260px_1fr]">
      <AccountSidebar />

      <div className="min-w-0">
        {children}
      </div>
    </div>
  );
}