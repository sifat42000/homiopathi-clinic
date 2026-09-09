"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  CalendarDays,
  Home,
  LogOut,
  MessageSquareText,
  Package,
  UserRound,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const accountLinks = [
  {
    label: "Dashboard",
    href: "/account",
    icon: Home,
  },
  {
    label: "My Orders",
    href: "/account/orders",
    icon: Package,
  },
  {
    label: "My Appointments",
    href: "/account/appointments",
    icon: CalendarDays,
  },
  {
    label: "My Reviews",
    href: "/account/reviews",
    icon: MessageSquareText,
  },
  {
    label: "Profile",
    href: "/account/profile",
    icon: UserRound,
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    data: session,
  } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();

    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="rounded-3xl border border-gray-100 bg-white p-3 shadow-sm lg:sticky lg:top-24 lg:p-4">
      {/* User */}
      <div className="rounded-2xl bg-[#F1F8F3] p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#14532D] shadow-sm">
          <UserRound size={23} />
        </div>

        <p className="mt-4 font-bold text-gray-900">
          {session?.user.name ?? "Customer"}
        </p>

        <p className="font-english mt-1 text-xs text-gray-400">
          {session?.user.email ?? ""}
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-4 grid grid-cols-2 gap-1 lg:block lg:space-y-1">
        {accountLinks.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
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

        <button
          type="button"
          onClick={handleLogout}
          className="col-span-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 lg:col-span-1"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>
    </aside>
  );
}