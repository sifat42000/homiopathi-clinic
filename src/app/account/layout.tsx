import type {
  ReactNode,
} from "react";

import {
  headers,
} from "next/headers";

import {
  redirect,
} from "next/navigation";

import {
  auth,
} from "@/lib/auth";

type AccountRootLayoutProps = {
  children: ReactNode;
};

export default async function AccountRootLayout({
  children,
}: AccountRootLayoutProps) {
  const session =
    await auth.api.getSession({
      headers:
        await headers(),
    });

  if (!session) {
    redirect("/login");
  }

  return children;
}