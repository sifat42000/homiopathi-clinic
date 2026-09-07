"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  Pencil,
  Plus,
  Power,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useAdminCatalogStore } from "@/stores/admin-catalog-store";

type ProductFormState = {
  name: string;
  englishName: string;
  category: string;
  regularPrice: string;
  salePrice: string;
  stock: string;
  size: string;
  badge: string;
  shortDescription: string;
  description: string;
};

const emptyForm: ProductFormState = {
  name: "",
  englishName: "",
  category: "",
  regularPrice: "",
  salePrice: "",
  stock: "",
  size: "",
  badge: "",
  shortDescription: "",
  description: "",
};

function makeSlug(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );

  return (
    slug ||
    `product-${Date.now()}`
  );
}

export default function AdminProductsManager() {
  const products =
    useAdminCatalogStore(
      (state) =>
        state.products
    );

  const categories =
    useAdminCatalogStore(
      (state) =>
        state.categories
    );

  const addProduct =
    useAdminCatalogStore(
      (state) =>
        state.addProduct
    );

  const updateProduct =
    useAdminCatalogStore(
      (state) =>
        state.updateProduct
    );

  const deleteProduct =
    useAdminCatalogStore(
      (state) =>
        state.deleteProduct
    );

  const toggleProductStatus =
    useAdminCatalogStore(
      (state) =>
        state.toggleProductStatus
    );

  const [mounted, setMounted] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [
    editingProductId,
    setEditingProductId,
  ] = useState<number | null>(
    null
  );

  const [search, setSearch] =
    useState("");

  const [form, setForm] =
    useState<ProductFormState>(
      emptyForm
    );

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProducts =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return products;
      }

      return products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(query) ||
          product.englishName
            .toLowerCase()
            .includes(query) ||
          product.sku
            .toLowerCase()
            .includes(query) ||
          product.category
            .toLowerCase()
            .includes(query)
      );
    }, [
      products,
      search,
    ]);

  if (!mounted) {
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Product Management Loading...
      </div>
    );
  }

  const updateField = (
    field: keyof ProductFormState,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);

    setEditingProductId(
      null
    );

    setShowForm(false);

    setError("");
  };

  const startEdit = (
    productId: number
  ) => {
    const product =
      products.find(
        (item) =>
          item.id === productId
      );

    if (!product) {
      return;
    }

    setForm({
      name: product.name,
      englishName:
        product.englishName,
      category:
        product.category,
      regularPrice:
        String(
          product.regularPrice
        ),
      salePrice:
        product.salePrice
          ? String(
              product.salePrice
            )
          : "",
      stock:
        String(product.stock),
      size: product.size,
      badge:
        product.badge ?? "",
      shortDescription:
        product.shortDescription,
      description:
        product.description,
    });

    setEditingProductId(
      product.id
    );

    setShowForm(true);

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const regularPrice =
      Number(
        form.regularPrice
      );

    const salePrice =
      form.salePrice.trim()
        ? Number(
            form.salePrice
          )
        : undefined;

    const stock =
      Number(form.stock);

    if (
      regularPrice <= 0
    ) {
      setError(
        "Regular Price সঠিকভাবে দিন।"
      );

      return;
    }

    if (
      salePrice !== undefined &&
      salePrice >= regularPrice
    ) {
      setError(
        "Sale Price অবশ্যই Regular Price-এর চেয়ে কম হতে হবে।"
      );

      return;
    }

    if (
      stock < 0 ||
      !Number.isInteger(stock)
    ) {
      setError(
        "Stock একটি সঠিক সংখ্যা হতে হবে।"
      );

      return;
    }

    if (!form.category) {
      setError(
        "একটি Category নির্বাচন করুন।"
      );

      return;
    }

    const slug =
      makeSlug(
        form.englishName
      );

    const productData = {
      name:
        form.name.trim(),

      englishName:
        form.englishName.trim(),

      slug,

      shortDescription:
        form.shortDescription.trim(),

      description:
        form.description.trim(),

      regularPrice,

      salePrice,

      stock,

      badge:
        form.badge.trim() ||
        undefined,

      category:
        form.category,

      size:
        form.size.trim(),

      sku:
        editingProductId
          ? products.find(
              (item) =>
                item.id ===
                editingProductId
            )?.sku ??
            `PRD-${Date.now()
              .toString()
              .slice(-6)}`
          : `PRD-${Date.now()
              .toString()
              .slice(-6)}`,

      usageInfo:
        "Product Label এবং প্রয়োজনীয় নির্দেশনা অনুযায়ী ব্যবহার করুন।",
    };

    if (
      editingProductId
    ) {
      updateProduct(
        editingProductId,
        productData
      );

      setSuccess(
        "Product সফলভাবে Update হয়েছে।"
      );
    } else {
      addProduct(
        productData
      );

      setSuccess(
        "নতুন Product সফলভাবে Add হয়েছে।"
      );
    }

    setForm(emptyForm);

    setEditingProductId(
      null
    );

    setShowForm(false);
  };

  const handleDelete = (
    id: number,
    name: string
  ) => {
    const confirmed =
      window.confirm(
        `${name} Product-টি Delete করতে চান?`
      );

    if (!confirmed) {
      return;
    }

    deleteProduct(id);

    setSuccess(
      "Product Delete হয়েছে।"
    );
  };

  return (
    <div>
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#15803D]">
            Catalog
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Product Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Product Add, Edit, Delete এবং Status Manage করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
              setEditingProductId(
                null
              );
              setForm(
                emptyForm
              );
            }
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white"
        >
          {showForm ? (
            <X size={18} />
          ) : (
            <Plus size={18} />
          )}

          {showForm
            ? "Form বন্ধ করুন"
            : "নতুন Product"}
        </button>
      </div>

      {/* =====================
          Product Form
      ====================== */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-7 rounded-[26px] border border-green-100 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900">
            {editingProductId
              ? "Product Edit করুন"
              : "নতুন Product Add করুন"}
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            
            {/* Bengali Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Product Name *
              </label>

              <input
                type="text"
                required
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value
                  )
                }
                placeholder="বাংলা Product Name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* English */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                English Name *
              </label>

              <input
                type="text"
                required
                value={
                  form.englishName
                }
                onChange={(event) =>
                  updateField(
                    "englishName",
                    event.target.value
                  )
                }
                placeholder="Hair Care Tonic"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category *
              </label>

              <select
                required
                value={
                  form.category
                }
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#14532D]"
              >
                <option value="">
                  Category নির্বাচন করুন
                </option>

                {categories
                  .filter(
                    (category) =>
                      category.active
                  )
                  .map(
                    (category) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.name
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}
              </select>
            </div>

            {/* Size */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Package Size *
              </label>

              <input
                type="text"
                required
                value={form.size}
                onChange={(event) =>
                  updateField(
                    "size",
                    event.target.value
                  )
                }
                placeholder="30 ml"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Regular Price */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Regular Price *
              </label>

              <input
                type="number"
                min="1"
                required
                value={
                  form.regularPrice
                }
                onChange={(event) =>
                  updateField(
                    "regularPrice",
                    event.target.value
                  )
                }
                placeholder="500"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Sale */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Sale Price
              </label>

              <input
                type="number"
                min="1"
                value={
                  form.salePrice
                }
                onChange={(event) =>
                  updateField(
                    "salePrice",
                    event.target.value
                  )
                }
                placeholder="Optional"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Stock *
              </label>

              <input
                type="number"
                min="0"
                required
                value={form.stock}
                onChange={(event) =>
                  updateField(
                    "stock",
                    event.target.value
                  )
                }
                placeholder="10"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Badge */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Badge
              </label>

              <input
                type="text"
                value={form.badge}
                onChange={(event) =>
                  updateField(
                    "badge",
                    event.target.value
                  )
                }
                placeholder="New / Offer / Best Seller"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Short */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Short Description *
              </label>

              <textarea
                required
                rows={3}
                value={
                  form.shortDescription
                }
                onChange={(event) =>
                  updateField(
                    "shortDescription",
                    event.target.value
                  )
                }
                placeholder="Product-এর সংক্ষিপ্ত Description"
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Full */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Description *
              </label>

              <textarea
                required
                rows={5}
                value={
                  form.description
                }
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                placeholder="Product সম্পর্কে বিস্তারিত লিখুন"
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-[#14532D] px-6 py-3 text-sm font-semibold text-white"
            >
              {editingProductId
                ? "Update Product"
                : "Save Product"}
            </button>

            <button
              type="button"
              onClick={
                resetForm
              }
              className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Success */}
      {success && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-[#166534]">
          <CheckCircle2 size={18} />

          {success}
        </div>
      )}

      {/* =====================
          Search
      ====================== */}
      <div className="mt-7 rounded-[22px] border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Name, SKU বা Category দিয়ে Search..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-[#14532D]"
          />
        </div>
      </div>

      {/* =====================
          Product Table
      ====================== */}
      <div className="mt-6 overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#F7FBF8]">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">
                  Product
                </th>

                <th className="px-5 py-4">
                  Category
                </th>

                <th className="px-5 py-4">
                  Price
                </th>

                <th className="px-5 py-4">
                  Stock
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(
                (product) => (
                  <tr
                    key={
                      product.id
                    }
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {
                          product.name
                        }
                      </p>

                      <p className="font-english mt-1 text-xs text-gray-400">
                        {
                          product.sku
                        }
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {
                        product.category
                      }
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#14532D]">
                        ৳
                        {product.salePrice ??
                          product.regularPrice}
                      </p>

                      {product.salePrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ৳
                          {
                            product.regularPrice
                          }
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 font-english text-sm font-semibold">
                      {
                        product.stock
                      }
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {product.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        
                        {/* Status */}
                        <button
                          type="button"
                          onClick={() =>
                            toggleProductStatus(
                              product.id
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-green-50 hover:text-[#14532D]"
                          title="Status পরিবর্তন"
                        >
                          <Power
                            size={
                              17
                            }
                          />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() =>
                            startEdit(
                              product.id
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                          title="Edit"
                        >
                          <Pencil
                            size={
                              17
                            }
                          />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              product.id,
                              product.name
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2
                            size={
                              17
                            }
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {filteredProducts.length ===
          0 && (
          <div className="px-6 py-14 text-center text-sm text-gray-400">
            কোনো Product পাওয়া যায়নি।
          </div>
        )}
      </div>

      {/* Notice */}
      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
        Admin Product changes এখন শুধু এই Browser-এর LocalStorage-এ থাকবে।
        Backend-এর পরে MongoDB-তে Save হবে এবং Public Product Page-এ
        automatically দেখা যাবে।
      </div>
    </div>
  );
}