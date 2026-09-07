"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  PackageOpen,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { DELIVERY_CHARGE } from "@/lib/shop-config";
import { useCartStore } from "@/stores/cart-store";
import { useOrderStore } from "@/stores/order-store";

import type { FrontendOrder } from "@/types/order";

export default function CheckoutClient() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const setLastOrder = useOrderStore(
    (state) => state.setLastOrder
  );

  const [mounted, setMounted] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState<"cod" | "online">("cod");

  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <p className="text-sm text-gray-400">
          Checkout Loading...
        </p>
      </div>
    );
  }

  const subtotal = items.reduce(
    (total, item) => {
      const price =
        item.salePrice ?? item.regularPrice;

      return total + price * item.quantity;
    },
    0
  );

  const deliveryCharge =
    items.length > 0 ? DELIVERY_CHARGE : 0;

  const total =
    subtotal + deliveryCharge;

  const totalQuantity = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const createOrderNumber = () => {
    const timestamp = Date.now()
      .toString()
      .slice(-8);

    return `HC-${timestamp}`;
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (items.length === 0) {
      setError(
        "আপনার Cart খালি। আগে Product Cart-এ যোগ করুন।"
      );

      return;
    }

    if (paymentMethod === "online") {
      setError(
        "Online Payment Backend Phase-এ চালু করা হবে। আপাতত Cash on Delivery নির্বাচন করুন।"
      );

      return;
    }

    const formData =
      new FormData(event.currentTarget);

    const name = String(
      formData.get("name") ?? ""
    ).trim();

    const phone = String(
      formData.get("phone") ?? ""
    ).trim();

    const email = String(
      formData.get("email") ?? ""
    ).trim();

    const division = String(
      formData.get("division") ?? ""
    ).trim();

    const district = String(
      formData.get("district") ?? ""
    ).trim();

    const area = String(
      formData.get("area") ?? ""
    ).trim();

    const address = String(
      formData.get("address") ?? ""
    ).trim();

    const orderNote = String(
      formData.get("orderNote") ?? ""
    ).trim();

    const phoneRegex = /^01[3-9]\d{8}$/;

    if (!phoneRegex.test(phone)) {
      setError(
        "সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন। যেমন: 017XXXXXXXX"
      );

      return;
    }

    const orderNumber =
      createOrderNumber();

    const order: FrontendOrder = {
      orderNumber,

      customer: {
        name,
        phone,
        email: email || undefined,
      },

      shippingAddress: {
        division,
        district,
        area,
        address,
      },

      items: [...items],

      subtotal,
      deliveryCharge,
      total,

      paymentMethod,

      orderNote:
        orderNote || undefined,

      status: "pending",

      createdAt:
        new Date().toISOString(),
    };

    setLastOrder(order);

    clearCart();

    router.push(
      `/order-success?order=${orderNumber}`
    );
  };

  if (items.length === 0) {
    return (
      <div className="rounded-[28px] border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
          <ShoppingBag
            size={40}
            className="text-[#14532D]"
          />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Checkout করার মতো কোনো Product নেই
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
          প্রথমে আপনার প্রয়োজনীয় Product Cart-এ যোগ করুন।
        </p>

        <Link
          href="/products"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white"
        >
          প্রোডাক্ট দেখুন
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid items-start gap-8 lg:grid-cols-[1fr_390px]"
    >
      {/* =====================
          Customer Information
      ====================== */}
      <div className="space-y-6">
        
        {/* Contact */}
        <section className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="font-english text-xs font-semibold uppercase tracking-[0.12em] text-[#15803D]">
              Step 01
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Customer Information
            </h2>

            <p className="mt-2 text-sm leading-7 text-gray-500">
              Order Confirmation এবং Delivery-এর জন্য প্রয়োজনীয় তথ্য দিন।
            </p>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                পূর্ণ নাম *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="আপনার পূর্ণ নাম"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#14532D]"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                মোবাইল নম্বর *
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                required
                maxLength={11}
                placeholder="01XXXXXXXXX"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#14532D]"
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email{" "}
                <span className="font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#14532D]"
              />
            </div>
          </div>
        </section>

        {/* Shipping */}
        <section className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="font-english text-xs font-semibold uppercase tracking-[0.12em] text-[#15803D]">
              Step 02
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              Delivery Address
            </h2>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            
            {/* Division */}
            <div>
              <label
                htmlFor="division"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                বিভাগ *
              </label>

              <select
                id="division"
                name="division"
                required
                defaultValue=""
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#14532D]"
              >
                <option
                  value=""
                  disabled
                >
                  বিভাগ নির্বাচন করুন
                </option>

                <option value="Dhaka">
                  ঢাকা
                </option>

                <option value="Chattogram">
                  চট্টগ্রাম
                </option>

                <option value="Rajshahi">
                  রাজশাহী
                </option>

                <option value="Khulna">
                  খুলনা
                </option>

                <option value="Barishal">
                  বরিশাল
                </option>

                <option value="Sylhet">
                  সিলেট
                </option>

                <option value="Rangpur">
                  রংপুর
                </option>

                <option value="Mymensingh">
                  ময়মনসিংহ
                </option>
              </select>
            </div>

            {/* District */}
            <div>
              <label
                htmlFor="district"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                জেলা *
              </label>

              <input
                id="district"
                name="district"
                type="text"
                required
                placeholder="যেমন: ঢাকা"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#14532D]"
              />
            </div>

            {/* Area */}
            <div className="sm:col-span-2">
              <label
                htmlFor="area"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                এলাকা / থানা *
              </label>

              <input
                id="area"
                name="area"
                type="text"
                required
                placeholder="যেমন: উত্তরা, সেক্টর ৭"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#14532D]"
              />
            </div>

            {/* Full Address */}
            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                সম্পূর্ণ ঠিকানা *
              </label>

              <textarea
                id="address"
                name="address"
                required
                rows={3}
                placeholder="বাসা/রোড/এলাকা সহ সম্পূর্ণ ঠিকানা লিখুন"
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#14532D]"
              />
            </div>

            {/* Order Note */}
            <div className="sm:col-span-2">
              <label
                htmlFor="orderNote"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Order Note{" "}
                <span className="font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <textarea
                id="orderNote"
                name="orderNote"
                rows={3}
                placeholder="Delivery বা Order সম্পর্কে বিশেষ কোনো নির্দেশনা থাকলে লিখুন"
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-[#14532D]"
              />
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="font-english text-xs font-semibold uppercase tracking-[0.12em] text-[#15803D]">
            Step 03
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            Payment Method
          </h2>

          <div className="mt-6 grid gap-3">
            
            {/* COD */}
            <label
              className={`cursor-pointer rounded-2xl border p-5 transition ${
                paymentMethod === "cod"
                  ? "border-[#14532D] bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={
                    paymentMethod === "cod"
                  }
                  onChange={() =>
                    setPaymentMethod("cod")
                  }
                  className="h-4 w-4 accent-[#14532D]"
                />

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#14532D] shadow-sm">
                  <Banknote size={22} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Cash on Delivery
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Product হাতে পাওয়ার পর Payment করুন
                  </p>
                </div>
              </div>
            </label>

            {/* Online */}
            <label
              className={`cursor-pointer rounded-2xl border p-5 transition ${
                paymentMethod === "online"
                  ? "border-[#14532D] bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={
                    paymentMethod === "online"
                  }
                  onChange={() =>
                    setPaymentMethod("online")
                  }
                  className="h-4 w-4 accent-[#14532D]"
                />

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#14532D] shadow-sm">
                  <CreditCard size={22} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Online Payment
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Backend Phase-এ bKash / Card Payment যুক্ত হবে
                  </p>
                </div>
              </div>
            </label>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* =====================
          Order Summary
      ====================== */}
      <aside className="sticky top-32 rounded-[28px] border border-green-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          আপনার Order
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          মোট {totalQuantity} টি Item
        </p>

        {/* Products */}
        <div className="mt-6 max-h-[300px] space-y-4 overflow-y-auto pr-1">
          {items.map((item) => {
            const price =
              item.salePrice ??
              item.regularPrice;

            return (
              <div
                key={item.id}
                className="flex gap-3"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#EEF8F0]">
                  <PackageOpen
                    size={24}
                    className="text-[#14532D]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {item.name}
                  </p>

                  <p className="font-english mt-1 text-xs text-gray-400">
                    {item.quantity} × ৳{price}
                  </p>
                </div>

                <p className="text-sm font-bold text-gray-800">
                  ৳{price * item.quantity}
                </p>
              </div>
            );
          })}
        </div>

        <div className="my-6 h-px bg-gray-100" />

        {/* Costs */}
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">
              Subtotal
            </span>

            <span className="font-semibold text-gray-900">
              ৳{subtotal}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1.5 text-gray-500">
              <Truck size={15} />
              Delivery
            </span>

            <span className="font-semibold text-gray-900">
              ৳{deliveryCharge}
            </span>
          </div>

          <div className="h-px bg-gray-100" />

          <div className="flex items-end justify-between">
            <span className="font-semibold text-gray-700">
              সর্বমোট
            </span>

            <span className="text-3xl font-bold text-[#14532D]">
              ৳{total}
            </span>
          </div>
        </div>

        {/* Place Order */}
        <button
          type="submit"
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-4 font-semibold text-white transition hover:bg-[#166534]"
        >
          <LockKeyhole size={18} />

          Order Confirm করুন
        </button>

        {/* Security */}
        <div className="mt-5 flex items-start gap-2 rounded-xl bg-green-50 px-4 py-3">
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-[#15803D]"
          />

          <p className="text-xs leading-6 text-gray-500">
            আপনার Order Information শুধুমাত্র Order এবং Delivery পরিচালনার
            জন্য ব্যবহার করা হবে।
          </p>
        </div>

        <Link
          href="/cart"
          className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#14532D]"
        >
          <ArrowLeft size={16} />

          Cart-এ ফিরে যান
        </Link>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#15803D]">
          <CheckCircle2 size={15} />

          Secure Checkout
        </div>
      </aside>
    </form>
  );
}