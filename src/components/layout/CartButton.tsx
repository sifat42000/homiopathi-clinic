"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCartStore } from "@/stores/cart-store";

type CartButtonProps = {
  mobile?: boolean;
};

export default function CartButton({
  mobile = false,
}: CartButtonProps) {
  const items = useCartStore((state) => state.items);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <Link
      href="/cart"
      aria-label="কার্ট"
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition ${
        mobile
          ? "text-gray-700"
          : "text-gray-600 hover:bg-green-50 hover:text-[#14532D]"
      }`}
    >
      <ShoppingCart size={20} />

      <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#14532D] px-1 font-sans text-[9px] font-bold text-white">
        {mounted ? totalQuantity : 0}
      </span>
    </Link>
  );
}