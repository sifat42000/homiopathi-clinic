import type {
  ReactNode,
} from "react";


import {
  headers,
} from "next/headers";

import {
  redirect,
} from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";

import {
  auth,
} from "@/lib/auth";
import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata;

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const session =
    await auth.api.getSession({
      headers:
        await headers(),
    });

  if (!session) {
    redirect("/login");
  }

  const role =
    session.user.role;

  const isAdmin =
    typeof role === "string" &&
    role
      .split(",")
      .includes("admin");

  if (!isAdmin) {
    redirect("/account");
  }

  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}