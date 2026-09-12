"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  PackageSearch,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";

import {
  signOut,
  useSession,
} from "@/lib/auth-client";

import {
  useCartStore,
} from "@/stores/cart-store";

const navItems = [
  {
    label: "হোম",
    href: "/",
  },

  {
    label: "প্রোডাক্ট",
    href: "/products",
  },

  {
    label: "চিকিৎসা",
    href: "/treatments",
  },

  {
    label: "অ্যাপয়েন্টমেন্ট",
    href: "/appointment",
  },

  {
    label: "হেলথ টিপস",
    href: "/health-tips",
  },

  {
    label: "রিভিউ",
    href: "/reviews",
  },

  {
    label: "যোগাযোগ",
    href: "/contact",
  },
];

function hasAdminRole(
  role: unknown
) {
  if (
    typeof role !==
    "string"
  ) {
    return false;
  }

  return role
    .split(",")
    .map(
      (item) =>
        item.trim()
    )
    .includes(
      "admin"
    );
}

export default function Header() {
  const pathname =
    usePathname();

  const router =
    useRouter();

  const {
    data: session,
    isPending,
  } = useSession();

  const [
    accountOpen,
    setAccountOpen,
  ] = useState(false);

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const items =
    useCartStore(
      (state) =>
        state.items
    );

  const cartCount =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        item.quantity,
      0
    );

  const user =
    session?.user;

  const userRole =
    (
      user as
        | {
            role?: unknown;
          }
        | undefined
    )?.role;

  const isAdmin =
    hasAdminRole(
      userRole
    );

  const handleLogout =
    async () => {
      try {
        setAccountOpen(
          false
        );

        setMobileOpen(
          false
        );

        await signOut();

        router.push(
          "/"
        );

        router.refresh();
      } catch (error) {
        console.error(
          "Logout Error:",
          error
        );
      }
    };

  const closeMenus = () => {
    setMobileOpen(
      false
    );

    setAccountOpen(
      false
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">

        {/* =====================
            LOGO
        ===================== */}

        <Link
          href="/"
          onClick={
            closeMenus
          }
          className="shrink-0"
        >
          <h1 className="text-xl font-bold text-[#14532D] sm:text-2xl">
            হোমিও কেয়ার
          </h1>

          <p className="font-english -mt-1 text-[8px] uppercase tracking-[0.19em] text-gray-400">
            Homeopathic Clinic
          </p>
        </Link>

        {/* =====================
            DESKTOP NAV
        ===================== */}

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map(
            (item) => {
              const active =
                item.href ===
                "/"
                  ? pathname ===
                    "/"
                  : pathname.startsWith(
                      item.href
                    );

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-green-50 text-[#14532D]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#14532D]"
                  }`}
                >
                  {
                    item.label
                  }
                </Link>
              );
            }
          )}
        </nav>

        {/* =====================
            DESKTOP ACTIONS
        ===================== */}

        <div className="hidden items-center gap-2 md:flex">

          {/* Tracking */}

          <Link
            href="/order-tracking"
            title="Order Tracking"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-green-200 hover:bg-green-50 hover:text-[#14532D]"
          >
            <PackageSearch
              size={18}
            />
          </Link>

          {/* Cart */}

          <Link
            href="/cart"
            title="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:border-green-200 hover:bg-green-50 hover:text-[#14532D]"
          >
            <ShoppingCart
              size={18}
            />

            {cartCount >
              0 && (
              <span className="font-english absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#14532D] px-1 text-[10px] font-bold text-white">
                {
                  cartCount
                }
              </span>
            )}
          </Link>

          {/* Loading session */}

          {isPending ? (
            <div className="h-10 w-[110px] animate-pulse rounded-xl bg-gray-100" />
          ) : user ? (
            /*
              =========================
              LOGGED IN USER
              =========================
            */
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setAccountOpen(
                    (
                      current
                    ) =>
                      !current
                  )
                }
                className="flex min-h-10 items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-[#14532D] transition hover:bg-green-100"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#14532D] text-white">
                  <UserRound
                    size={15}
                  />
                </div>

                <span className="max-w-[120px] truncate text-sm font-semibold">
                  {user.name ||
                    "My Account"}
                </span>

                <ChevronDown
                  size={15}
                  className={`transition ${
                    accountOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {/* User Dropdown */}

              {accountOpen && (
                <>
                  {/* click outside helper */}

                  <button
                    type="button"
                    aria-label="Close account menu"
                    onClick={() =>
                      setAccountOpen(
                        false
                      )
                    }
                    className="fixed inset-0 z-40 cursor-default"
                  />

                  <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                    {/* User info */}

                    <div className="border-b border-gray-100 bg-[#F7FBF8] p-4">
                      <p className="font-bold text-gray-900">
                        {user.name ||
                          "Customer"}
                      </p>

                      <p className="font-english mt-1 truncate text-xs text-gray-400">
                        {
                          user.email
                        }
                      </p>
                    </div>

                    <div className="p-2">

                      {/* Customer Account */}

                      <Link
                        href="/account"
                        onClick={
                          closeMenus
                        }
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        <UserRound
                          size={17}
                        />

                        আমার Account
                      </Link>

                      <Link
                        href="/account/profile"
                        onClick={
                          closeMenus
                        }
                        className="block rounded-xl px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50"
                      >
                        আমার Profile
                      </Link>

                      <Link
                        href="/account/orders"
                        onClick={
                          closeMenus
                        }
                        className="block rounded-xl px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50"
                      >
                        আমার Orders
                      </Link>

                      <Link
                        href="/account/appointments"
                        onClick={
                          closeMenus
                        }
                        className="block rounded-xl px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50"
                      >
                        আমার Appointments
                      </Link>

                      {/* Admin */}

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={
                            closeMenus
                          }
                          className="mt-1 block rounded-xl bg-green-50 px-3 py-2.5 text-sm font-bold text-[#14532D]"
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <div className="my-2 border-t border-gray-100" />

                      {/* Logout */}

                      <button
                        type="button"
                        onClick={
                          handleLogout
                        }
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut
                          size={17}
                        />

                        Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /*
              =========================
              NOT LOGGED IN
              =========================
            */
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl bg-[#14532D] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <LogIn
                size={17}
              />

              Login
            </Link>
          )}
        </div>

        {/* =====================
            MOBILE BUTTON
        ===================== */}

        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              (
                current
              ) =>
                !current
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 md:hidden"
        >
          {mobileOpen ? (
            <X size={20} />
          ) : (
            <Menu
              size={20}
            />
          )}
        </button>
      </div>

      {/* =====================
          MOBILE MENU
      ===================== */}

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-5 md:hidden">
          <nav className="space-y-1">
            {navItems.map(
              (item) => (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  onClick={
                    closeMenus
                  }
                  className="block rounded-xl px-4 py-3 font-semibold text-gray-700 hover:bg-green-50 hover:text-[#14532D]"
                >
                  {
                    item.label
                  }
                </Link>
              )
            )}
          </nav>

          <div className="my-4 border-t border-gray-100" />

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/order-tracking"
              onClick={
                closeMenus
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold"
            >
              <PackageSearch
                size={17}
              />

              Tracking
            </Link>

            <Link
              href="/cart"
              onClick={
                closeMenus
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold"
            >
              <ShoppingCart
                size={17}
              />

              Cart
              {cartCount >
                0 &&
                ` (${cartCount})`}
            </Link>
          </div>

          <div className="my-4 border-t border-gray-100" />

          {isPending ? (
            <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
          ) : user ? (
            <div>
              <div className="rounded-2xl bg-[#F7FBF8] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14532D] text-white">
                    <UserRound
                      size={19}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold">
                      {user.name ||
                        "Customer"}
                    </p>

                    <p className="font-english mt-0.5 truncate text-xs text-gray-400">
                      {
                        user.email
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <Link
                  href="/account"
                  onClick={
                    closeMenus
                  }
                  className="block rounded-xl px-4 py-3 font-semibold text-gray-700"
                >
                  আমার Account
                </Link>

                <Link
                  href="/account/profile"
                  onClick={
                    closeMenus
                  }
                  className="block rounded-xl px-4 py-3 text-sm text-gray-600"
                >
                  আমার Profile
                </Link>

                <Link
                  href="/account/orders"
                  onClick={
                    closeMenus
                  }
                  className="block rounded-xl px-4 py-3 text-sm text-gray-600"
                >
                  আমার Orders
                </Link>

                <Link
                  href="/account/appointments"
                  onClick={
                    closeMenus
                  }
                  className="block rounded-xl px-4 py-3 text-sm text-gray-600"
                >
                  আমার Appointments
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={
                      closeMenus
                    }
                    className="block rounded-xl bg-green-50 px-4 py-3 font-bold text-[#14532D]"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="mt-2 flex w-full items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-left font-semibold text-red-600"
                >
                  <LogOut
                    size={17}
                  />

                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={
                closeMenus
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532D] px-4 py-3 font-semibold text-white"
            >
              <LogIn
                size={18}
              />

              Login / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
}