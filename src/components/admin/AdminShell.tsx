"use client";

import type { ReactNode } from "react";

import { useState } from "react";
import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  CalendarDays,
  ExternalLink,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Package,
  Settings,
  ShoppingCart,
  Stethoscope,
  Tags,
  Users,
  X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  useWebsiteSettings,
} from "@/components/layout/WebsiteSettingsProvider";

type AdminShellProps = {
  children: ReactNode;
};

const adminLinks = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    disabled: false,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
    disabled: false,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Tags,
    disabled: false,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    disabled: false,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
    disabled: false,
  },
  {
    label: "Appointments",
    href: "/admin/appointments",
    icon: CalendarDays,
    disabled: false,
  },
  {
    label: "Treatments",
    href: "/admin/treatments",
    icon: Stethoscope,
    disabled: false,
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquareText,
    disabled: false,
  },
  {
    label: "Health Tips",
    href: "/admin/health-tips",
    icon: FileText,
    disabled: false,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    disabled: false,
  },
];

export default function AdminShell({
  children,
}: AdminShellProps) {
  const settings = useWebsiteSettings();

  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const {
    data: session,
  } = authClient.useSession();

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await authClient.signOut();

    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5]">
      {/* =====================
          Mobile Overlay
      ====================== */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Sidebar বন্ধ করুন"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* =====================
          Sidebar
      ====================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-gray-100 bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-5">
          <Link
            href="/admin"
            onClick={closeSidebar}
          >
            <h2 className="text-xl font-bold text-[#14532D]">
              {settings.clinicName}
            </h2>

            <p className="font-english mt-1 text-[9px] uppercase tracking-[0.18em] text-gray-400">
              Admin Panel
            </p>
          </Link>

          <button
            type="button"
            onClick={closeSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 lg:hidden"
            aria-label="Sidebar বন্ধ করুন"
          >
            <X size={19} />
          </button>
        </div>

        {/* Admin Profile */}
        <div className="mx-4 mt-5 rounded-2xl bg-[#F1F8F3] p-4">
          <p className="text-xs font-medium text-[#15803D]">
            Administrator
          </p>

          <p className="mt-1 font-semibold text-gray-900">
            {session?.user.name ?? "Admin"}
          </p>

          <p className="font-english mt-1 text-[11px] text-gray-400">
            {session?.user.email ?? ""}
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 overflow-y-auto px-3 pb-5">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
            Management
          </p>

          <div className="space-y-1">
            {adminLinks.map((item) => {
              const Icon = item.icon;

              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(
                      item.href
                    );

              if (item.disabled) {
                return (
                  <div
                    key={item.href}
                    className="flex cursor-not-allowed items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-gray-300"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />

                      {item.label}
                    </div>

                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-semibold text-gray-400">
                      Soon
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[#14532D] text-white"
                      : "text-gray-600 hover:bg-green-50 hover:text-[#14532D]"
                  }`}
                >
                  <Icon size={18} />

                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Bottom */}
        <div className="border-t border-gray-100 p-4">
          <Link
            href="/"
            className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 transition hover:bg-green-50 hover:text-[#14532D]"
          >
            <div className="flex items-center gap-3">
              <Home size={18} />

              Website দেখুন
            </div>

            <ExternalLink size={14} />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={18} />

            Logout
          </button>
        </div>
      </aside>

      {/* =====================
          Main Area
      ====================== */}
      <div className="lg:pl-[280px]">
        {/* Admin Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-100 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 lg:hidden"
              aria-label="Admin Menu খুলুন"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-xs text-gray-400">
                Admin Panel
              </p>

              <p className="font-semibold text-gray-900">
                Management Dashboard
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="hidden items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-green-200 hover:bg-green-50 hover:text-[#14532D] sm:flex"
          >
            Website

            <ExternalLink size={15} />
          </Link>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}