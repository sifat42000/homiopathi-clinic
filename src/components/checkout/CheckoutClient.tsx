"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Loader2,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
} from "lucide-react";

import {
  useCartStore,
} from "@/stores/cart-store";

type ValidatedItem = {
  productId: number;

  name: string;

  englishName: string;

  slug: string;

  sku: string;

  quantity: number;

  stock: number;

  unitPrice: number;

  lineTotal: number;

  imageUrl?: string;
};

type CartValidation = {
  success: boolean;

  valid: boolean;

  shopEnabled: boolean;

  items: ValidatedItem[];

  issues: {
    productId?: number;

    code: string;

    message: string;
  }[];

  subtotal: number;

  deliveryCharge: number;

  total: number;

  checkedAt: string;
};

const divisions = [
  "ঢাকা",
  "চট্টগ্রাম",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "সিলেট",
  "রংপুর",
  "ময়মনসিংহ",
];

export default function CheckoutClient() {
  const router =
    useRouter();

  const items =
    useCartStore(
      (state) =>
        state.items
    );

  const clearCart =
    useCartStore(
      (state) =>
        state.clearCart
    );

  const [
    validation,
    setValidation,
  ] = useState<
    CartValidation | null
  >(null);

  const [
    syncing,
    setSyncing,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const validateCart =
    useCallback(
      async (
        showError = true
      ): Promise<CartValidation | null> => {
        if (
          items.length === 0
        ) {
          setValidation(
            null
          );

          return null;
        }

        try {
          setSyncing(true);

          if (showError) {
            setError("");
          }

          const response =
            await fetch(
              "/api/cart/validate",
              {
                method:
                  "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify({
                    items:
                      items.map(
                        (item) => ({
                          productId:
                            item.id,

                          quantity:
                            item.quantity,
                        })
                      ),
                  }),

                cache:
                  "no-store",
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Cart check করা যায়নি।"
            );
          }

          setValidation(
            data
          );

          if (
            showError &&
            data.issues?.length >
              0
          ) {
            setError(
              data.issues
                .map(
                  (
                    issue: {
                      message: string;
                    }
                  ) =>
                    issue.message
                )
                .join(" ")
            );
          }

          return data;
        } catch (error) {
          if (showError) {
            setError(
              error instanceof Error
                ? error.message
                : "Cart check করা যায়নি।"
            );
          }

          return null;
        } finally {
          setSyncing(false);
        }
      },
      [items]
    );

  useEffect(() => {
    validateCart(false);
  }, [validateCart]);

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (
      items.length === 0
    ) {
      setError(
        "আপনার Cart খালি।"
      );

      return;
    }

    /*
      Order দেওয়ার ঠিক আগে
      আবার MongoDB থেকে
      Price + Stock check।
    */
    const latest =
      await validateCart(
        false
      );

    if (!latest) {
      setError(
        "Latest Product Information Check করা যায়নি। আবার চেষ্টা করুন।"
      );

      return;
    }

    if (
      !latest.shopEnabled
    ) {
      setError(
        "বর্তমানে নতুন Product Order সাময়িকভাবে বন্ধ আছে।"
      );

      return;
    }

    if (
      !latest.valid
    ) {
      setError(
        latest.issues
          .map(
            (issue) =>
              issue.message
          )
          .join(" ")
      );

      return;
    }

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const payload = {
      customer: {
        name:
          String(
            formData.get(
              "name"
            ) ?? ""
          ).trim(),

        phone:
          String(
            formData.get(
              "phone"
            ) ?? ""
          ).trim(),

        email:
          String(
            formData.get(
              "email"
            ) ?? ""
          ).trim(),
      },

      shippingAddress: {
        division:
          String(
            formData.get(
              "division"
            ) ?? ""
          ).trim(),

        district:
          String(
            formData.get(
              "district"
            ) ?? ""
          ).trim(),

        area:
          String(
            formData.get(
              "area"
            ) ?? ""
          ).trim(),

        address:
          String(
            formData.get(
              "address"
            ) ?? ""
          ).trim(),
      },

      orderNote:
        String(
          formData.get(
            "orderNote"
          ) ?? ""
        ).trim(),

      /*
        Price পাঠানো হচ্ছে না।
        Server আবার final price
        calculate করবে।
      */
      items:
        latest.items.map(
          (item) => ({
            productId:
              item.productId,

            quantity:
              item.quantity,
          })
        ),
    };

    try {
      setSubmitting(true);

      const response =
        await fetch(
          "/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload
              ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Order করা যায়নি।"
        );
      }

      clearCart();

      router.push(
        `/order-success?order=${encodeURIComponent(
          data.order
            .orderNumber
        )}`
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Order করার সময় সমস্যা হয়েছে।"
      );

      await validateCart(
        false
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (
    items.length === 0
  ) {
    return (
      <div className="rounded-[28px] border border-gray-100 bg-white p-10 text-center shadow-sm">
        <ShoppingBag
          size={45}
          className="mx-auto text-[#14532D]"
        />

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          আপনার Cart খালি
        </h1>

        <Link
          href="/products"
          className="mt-6 inline-flex rounded-xl bg-[#14532D] px-6 py-3 font-semibold text-white"
        >
          Product দেখুন
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-6"
      >
        {/* Customer */}
        <section className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Customer Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                পূর্ণ নাম *
              </label>

              <input
                name="name"
                required
                minLength={2}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                মোবাইল নম্বর *
              </label>

              <input
                name="phone"
                type="tel"
                required
                maxLength={11}
                inputMode="numeric"
                placeholder="01XXXXXXXXX"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email (Optional)
              </label>

              <input
                name="email"
                type="email"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPin
              size={21}
              className="text-[#14532D]"
            />

            <h2 className="text-xl font-bold text-gray-900">
              Delivery Address
            </h2>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <select
              name="division"
              required
              defaultValue=""
              className="rounded-xl border border-gray-200 bg-white px-4 py-3"
            >
              <option
                value=""
                disabled
              >
                বিভাগ নির্বাচন করুন
              </option>

              {divisions.map(
                (division) => (
                  <option
                    key={
                      division
                    }
                    value={
                      division
                    }
                  >
                    {division}
                  </option>
                )
              )}
            </select>

            <input
              name="district"
              required
              placeholder="জেলা"
              className="rounded-xl border border-gray-200 px-4 py-3"
            />

            <input
              name="area"
              required
              placeholder="এলাকা / থানা"
              className="rounded-xl border border-gray-200 px-4 py-3"
            />

            <textarea
              name="address"
              required
              minLength={5}
              rows={3}
              placeholder="বিস্তারিত ঠিকানা"
              className="resize-none rounded-xl border border-gray-200 px-4 py-3 sm:col-span-2"
            />

            <textarea
              name="orderNote"
              maxLength={500}
              rows={3}
              placeholder="Order Note (Optional)"
              className="resize-none rounded-xl border border-gray-200 px-4 py-3 sm:col-span-2"
            />
          </div>
        </section>

        {/* COD */}
        <section className="rounded-[26px] border border-green-200 bg-green-50 p-6">
          <div className="flex items-start gap-4">
            <Banknote
              size={25}
              className="text-[#14532D]"
            />

            <div>
              <h2 className="font-bold">
                Cash on Delivery
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Product Delivery পাওয়ার সময় Payment করবেন।
              </p>
            </div>

            <CheckCircle2
              size={20}
              className="ml-auto text-green-600"
            />
          </div>
        </section>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-600">
            <AlertTriangle
              size={19}
              className="mt-1 shrink-0"
            />

            <span>
              {error}
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={
            submitting ||
            syncing ||
            !validation?.valid
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <Loader2
              size={19}
              className="animate-spin"
            />
          ) : (
            <Package
              size={19}
            />
          )}

          {submitting
            ? "Order Processing..."
            : "Order Confirm করুন"}
        </button>
      </form>

      {/* SUMMARY */}
      <aside>
        <div className="sticky top-24 rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <button
              type="button"
              onClick={() =>
                validateCart(
                  true
                )
              }
              disabled={
                syncing
              }
              className="rounded-lg p-2 text-[#14532D] hover:bg-green-50 disabled:opacity-50"
              title="Latest Price & Stock Check"
            >
              <RefreshCw
                size={18}
                className={
                  syncing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>

          {syncing &&
            !validation && (
              <div className="mt-5 flex items-center gap-2 text-sm text-gray-400">
                <Loader2
                  size={17}
                  className="animate-spin"
                />

                Latest Price & Stock Checking...
              </div>
            )}

          {validation && (
            <>
              <div className="mt-5 space-y-4">
                {validation.items.map(
                  (item) => (
                    <div
                      key={
                        item.productId
                      }
                      className="flex justify-between gap-4 border-b border-gray-100 pb-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {
                            item.name
                          }
                        </p>

                        <p className="font-english mt-1 text-xs text-gray-400">
                          Qty:{" "}
                          {
                            item.quantity
                          }{" "}
                          • Stock:{" "}
                          {
                            item.stock
                          }
                        </p>

                        <p className="mt-1 text-xs text-[#15803D]">
                          ৳
                          {
                            item.unitPrice
                          }{" "}
                          / item
                        </p>
                      </div>

                      <p className="font-semibold">
                        ৳
                        {
                          item.lineTotal
                        }
                      </p>
                    </div>
                  )
                )}
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span>
                    ৳
                    {
                      validation.subtotal
                    }
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Truck
                      size={15}
                    />

                    Delivery
                  </span>

                  <span>
                    ৳
                    {
                      validation.deliveryCharge
                    }
                  </span>
                </div>

                <div className="flex justify-between border-t border-gray-100 pt-4 text-lg font-bold">
                  <span>
                    Total
                  </span>

                  <span className="text-[#14532D]">
                    ৳
                    {
                      validation.total
                    }
                  </span>
                </div>
              </div>

              <div
                className={`mt-5 rounded-xl p-3 text-xs leading-6 ${
                  validation.valid
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-800"
                }`}
              >
                {validation.valid
                  ? "Price এবং Stock MongoDB থেকে Check করা হয়েছে।"
                  : "Cart-এর কিছু Product পরিবর্তন হয়েছে। উপরের Message দেখে Cart ঠিক করুন।"}
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}