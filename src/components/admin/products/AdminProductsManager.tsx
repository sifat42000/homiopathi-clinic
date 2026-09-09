"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  Loader2,
  Pencil,
  Plus,
  Power,
  Search,
  Trash2,
  X,
} from "lucide-react";

import ProductImageField from "@/components/admin/products/ProductImageField";

import type {
  Category,
} from "@/types/category";

import type {
  DatabaseProduct,
} from "@/types/product";

import type {
  ProductImage,
} from "@/types/product-image";

type ProductForm = {
  name: string;

  englishName: string;

  categoryId: string;

  regularPrice: string;

  salePrice: string;

  stock: string;

  size: string;

  badge: string;

  shortDescription: string;

  description: string;

  usageInfo: string;

  discountEnabled: boolean;

  discountPrice: string;

  discountStartAt: string;

  discountEndAt: string;
};

const emptyForm: ProductForm = {
  name: "",

  englishName: "",

  categoryId: "",

  regularPrice: "",

  salePrice: "",

  stock: "",

  size: "",

  badge: "",

  shortDescription: "",

  description: "",

  usageInfo:
    "Product Label এবং প্রয়োজনীয় নির্দেশনা অনুসরণ করুন।",

  discountEnabled:
    false,

  discountPrice: "",

  discountStartAt: "",

  discountEndAt: "",
};

function toDateTimeLocalValue(
  iso?: string
) {
  if (!iso) {
    return "";
  }

  const date =
    new Date(iso);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const offset =
    date.getTimezoneOffset();

  const localDate =
    new Date(
      date.getTime() -
        offset * 60 * 1000
    );

  return localDate
    .toISOString()
    .slice(0, 16);
}

export default function AdminProductsManager() {
  const [
    products,
    setProducts,
  ] = useState<
    DatabaseProduct[]
  >([]);

  const [
    categories,
    setCategories,
  ] = useState<
    Category[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [
    editingId,
    setEditingId,
  ] = useState<
    string | null
  >(null);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [form, setForm] =
    useState<ProductForm>(
      emptyForm
    );

  const [
    existingImages,
    setExistingImages,
  ] = useState<
    ProductImage[]
  >([]);

  const [
    newImageFiles,
    setNewImageFiles,
  ] = useState<File[]>(
    []
  );

  const [
    removedPublicIds,
    setRemovedPublicIds,
  ] = useState<string[]>(
    []
  );

  /* =========================
     LOAD PRODUCTS + CATEGORIES
  ========================= */

  const loadData =
    useCallback(async () => {
      try {
        setLoading(true);

        setError("");

        const [
          productsResponse,
          categoriesResponse,
        ] =
          await Promise.all([
            fetch(
              "/api/products?admin=1",
              {
                cache:
                  "no-store",
              }
            ),

            fetch(
              "/api/categories?admin=1",
              {
                cache:
                  "no-store",
              }
            ),
          ]);

        const productsData =
          await productsResponse.json();

        const categoriesData =
          await categoriesResponse.json();

        if (
          !productsResponse.ok
        ) {
          throw new Error(
            productsData.message ||
              "Products load failed."
          );
        }

        if (
          !categoriesResponse.ok
        ) {
          throw new Error(
            categoriesData.message ||
              "Categories load failed."
          );
        }

        setProducts(
          productsData.products ??
            []
        );

        setCategories(
          categoriesData.categories ??
            []
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Data load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* =========================
     SEARCH
  ========================= */

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
          product.category
            .toLowerCase()
            .includes(query) ||
          product.sku
            .toLowerCase()
            .includes(query)
      );
    }, [
      products,
      search,
    ]);

  /* =========================
     FORM HELPERS
  ========================= */

  const updateField = (
    field:
      keyof ProductForm,

    value:
      string | boolean
  ) => {
    setForm(
      (current) => ({
        ...current,

        [field]:
          value,
      })
    );
  };

  const resetForm = () => {
    setForm(
      emptyForm
    );

    setEditingId(
      null
    );

    setExistingImages(
      []
    );

    setNewImageFiles(
      []
    );

    setRemovedPublicIds(
      []
    );

    setShowForm(
      false
    );

    setError("");
  };

  /* =========================
     START EDIT
  ========================= */

  const startEdit = (
    product:
      DatabaseProduct
  ) => {
    setForm({
      name:
        product.name,

      englishName:
        product.englishName,

      categoryId:
        product.categoryId,

      regularPrice:
        String(
          product.regularPrice
        ),

      salePrice:
        product.salePrice !==
        undefined
          ? String(
              product.salePrice
            )
          : "",

      stock:
        String(
          product.stock
        ),

      size:
        product.size,

      badge:
        product.badge ??
        "",

      shortDescription:
        product.shortDescription,

      description:
        product.description,

      usageInfo:
        product.usageInfo,

      discountEnabled:
        product.discountEnabled ??
        false,

      discountPrice:
        product.discountPrice !==
        undefined
          ? String(
              product.discountPrice
            )
          : "",

      discountStartAt:
        toDateTimeLocalValue(
          product.discountStartAt
        ),

      discountEndAt:
        toDateTimeLocalValue(
          product.discountEndAt
        ),
    });

    setExistingImages(
      product.images ??
      []
    );

    setNewImageFiles(
      []
    );

    setRemovedPublicIds(
      []
    );

    setEditingId(
      product.databaseId
    );

    setShowForm(
      true
    );

    setError("");

    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     IMAGE HELPERS
  ========================= */

  const addImageFiles = (
    files: File[]
  ) => {
    setNewImageFiles(
      (current) => [
        ...current,
        ...files,
      ]
    );
  };

  const removeNewImage = (
    index: number
  ) => {
    setNewImageFiles(
      (current) =>
        current.filter(
          (_, itemIndex) =>
            itemIndex !==
            index
        )
    );
  };

  const removeExistingImage = (
    image:
      ProductImage
  ) => {
    setExistingImages(
      (current) =>
        current.filter(
          (item) =>
            item.publicId !==
            image.publicId
        )
    );

    setRemovedPublicIds(
      (current) => {
        if (
          current.includes(
            image.publicId
          )
        ) {
          return current;
        }

        return [
          ...current,
          image.publicId,
        ];
      }
    );
  };

  const uploadNewImages =
    async (): Promise<
      ProductImage[]
    > => {
      if (
        newImageFiles.length ===
        0
      ) {
        return [];
      }

      const imageFormData =
        new FormData();

      newImageFiles.forEach(
        (file) => {
          imageFormData.append(
            "images",
            file
          );
        }
      );

      const response =
        await fetch(
          "/api/uploads/products",
          {
            method: "POST",

            body:
              imageFormData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Image Upload failed."
        );
      }

      return (
        data.images ??
        []
      );
    };

  const deleteUploadedImages =
    async (
      publicIds: string[]
    ) => {
      if (
        publicIds.length ===
        0
      ) {
        return;
      }

      try {
        const response =
          await fetch(
            "/api/uploads/products",
            {
              method:
                "DELETE",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  publicIds,
                }),
            }
          );

        if (
          !response.ok
        ) {
          console.error(
            "Cloudinary cleanup failed"
          );
        }
      } catch (error) {
        console.error(
          "Cloudinary cleanup error:",
          error
        );
      }
    };

  /* =========================
     SAVE PRODUCT
  ========================= */

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    setSuccess("");

    let newlyUploaded:
      ProductImage[] = [];

    try {
      setSaving(true);

      if (
        existingImages.length +
          newImageFiles.length >
        5
      ) {
        throw new Error(
          "একটি Product-এ সর্বোচ্চ ৫টি Image রাখা যাবে।"
        );
      }

      if (
        form.discountEnabled
      ) {
        const discountPrice =
          Number(
            form.discountPrice
          );

        const regularPrice =
          Number(
            form.regularPrice
          );

        if (
          !discountPrice ||
          discountPrice >=
            regularPrice
        ) {
          throw new Error(
            "Discount Price Regular Price-এর চেয়ে কম হতে হবে।"
          );
        }

        if (
          !form.discountStartAt ||
          !form.discountEndAt
        ) {
          throw new Error(
            "Discount Start এবং End Time দিন।"
          );
        }

        const start =
          new Date(
            form.discountStartAt
          );

        const end =
          new Date(
            form.discountEndAt
          );

        if (
          end <= start
        ) {
          throw new Error(
            "Discount End Time অবশ্যই Start Time-এর পরে হতে হবে।"
          );
        }
      }

      newlyUploaded =
        await uploadNewImages();

      const finalImages = [
        ...existingImages,
        ...newlyUploaded,
      ];

      const payload = {
        name:
          form.name,

        englishName:
          form.englishName,

        categoryId:
          form.categoryId,

        regularPrice:
          Number(
            form.regularPrice
          ),

        salePrice:
          form.salePrice
            ? Number(
                form.salePrice
              )
            : "",

        stock:
          Number(
            form.stock
          ),

        size:
          form.size,

        badge:
          form.badge,

        shortDescription:
          form.shortDescription,

        description:
          form.description,

        usageInfo:
          form.usageInfo,

        images:
          finalImages,

        discountEnabled:
          form.discountEnabled,

        discountPrice:
          form.discountEnabled &&
          form.discountPrice
            ? Number(
                form.discountPrice
              )
            : undefined,

        discountStartAt:
          form.discountEnabled &&
          form.discountStartAt
            ? new Date(
                form.discountStartAt
              ).toISOString()
            : undefined,

        discountEndAt:
          form.discountEnabled &&
          form.discountEndAt
            ? new Date(
                form.discountEndAt
              ).toISOString()
            : undefined,
      };

      const response =
        await fetch(
          editingId
            ? `/api/products/${editingId}`
            : "/api/products",
          {
            method:
              editingId
                ? "PATCH"
                : "POST",

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
        await deleteUploadedImages(
          newlyUploaded.map(
            (image) =>
              image.publicId
          )
        );

        throw new Error(
          data.message ||
            "Product Save failed."
        );
      }

      if (
        removedPublicIds.length >
        0
      ) {
        await deleteUploadedImages(
          removedPublicIds
        );
      }

      setSuccess(
        editingId
          ? "Product সফলভাবে Update হয়েছে।"
          : "Product সফলভাবে Add হয়েছে।"
      );

      resetForm();

      await loadData();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Product Save করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     STATUS
  ========================= */

  const toggleStatus =
    async (
      product:
        DatabaseProduct
    ) => {
      try {
        setError("");

        const response =
          await fetch(
            `/api/products/${product.databaseId}`,
            {
              method:
                "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  active:
                    !product.active,
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message
          );
        }

        await loadData();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Status পরিবর্তন করা যায়নি।"
        );
      }
    };

  /* =========================
     DELETE PRODUCT
  ========================= */

  const handleDelete =
    async (
      product:
        DatabaseProduct
    ) => {
      const confirmed =
        window.confirm(
          `${product.name} Delete করতে চান?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");

        const response =
          await fetch(
            `/api/products/${product.databaseId}`,
            {
              method:
                "DELETE",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message
          );
        }

        setSuccess(
          "Product Delete হয়েছে।"
        );

        await loadData();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Product Delete করা যায়নি।"
        );
      }
    };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#15803D]">
            MongoDB Catalog
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Product Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Product, Image, Price, Stock এবং Timed Discount পরিচালনা করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(
                true
              );

              setSuccess("");
              setError("");
            }
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white"
        >
          {showForm ? (
            <X size={18} />
          ) : (
            <Plus
              size={18}
            />
          )}

          {showForm
            ? "Form বন্ধ করুন"
            : "নতুন Product"}
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <form
          onSubmit={
            handleSubmit
          }
          className="mt-7 rounded-[26px] border border-green-100 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900">
            {editingId
              ? "Product Edit করুন"
              : "নতুন Product Add করুন"}
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {/* Bangla Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Product Name
              </label>

              <input
                required
                value={
                  form.name
                }
                onChange={(e) =>
                  updateField(
                    "name",
                    e.target.value
                  )
                }
                placeholder="বাংলা Product Name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* English Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                English Name
              </label>

              <input
                required
                value={
                  form.englishName
                }
                onChange={(e) =>
                  updateField(
                    "englishName",
                    e.target.value
                  )
                }
                placeholder="English Product Name"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category
              </label>

              <select
                required
                value={
                  form.categoryId
                }
                onChange={(e) =>
                  updateField(
                    "categoryId",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
              >
                <option value="">
                  Category নির্বাচন করুন
                </option>

                {categories
                  .filter(
                    (item) =>
                      item.active
                  )
                  .map(
                    (item) => (
                      <option
                        key={
                          item.id
                        }
                        value={
                          item.id
                        }
                      >
                        {
                          item.name
                        }
                      </option>
                    )
                  )}
              </select>
            </div>

            {/* Size */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Size
              </label>

              <input
                required
                value={
                  form.size
                }
                onChange={(e) =>
                  updateField(
                    "size",
                    e.target.value
                  )
                }
                placeholder="30 ml"
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
            </div>

            {/* Regular Price */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Regular Price
              </label>

              <input
                type="number"
                min="1"
                required
                value={
                  form.regularPrice
                }
                onChange={(e) =>
                  updateField(
                    "regularPrice",
                    e.target.value
                  )
                }
                placeholder="Regular Price"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3"
              />
            </div>

            {/* Sale Price */}
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
                onChange={(e) =>
                  updateField(
                    "salePrice",
                    e.target.value
                  )
                }
                placeholder="Optional"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Stock
              </label>

              <input
                type="number"
                min="0"
                required
                value={
                  form.stock
                }
                onChange={(e) =>
                  updateField(
                    "stock",
                    e.target.value
                  )
                }
                placeholder="Stock"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3"
              />
            </div>

            {/* Badge */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Badge
              </label>

              <input
                value={
                  form.badge
                }
                onChange={(e) =>
                  updateField(
                    "badge",
                    e.target.value
                  )
                }
                placeholder="New / Popular / Offer"
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
            </div>

            {/* Timed Discount */}
            <div className="rounded-2xl border border-green-100 bg-green-50/40 p-5 sm:col-span-2">
              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900">
                    Timed Discount
                  </p>

                  <p className="mt-1 text-xs leading-6 text-gray-500">
                    নির্দিষ্ট সময়ের জন্য Discount Price এবং Countdown চালু করুন।
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    form.discountEnabled
                  }
                  onChange={(e) =>
                    updateField(
                      "discountEnabled",
                      e.target.checked
                    )
                  }
                  className="h-5 w-5"
                />
              </label>

              {form.discountEnabled && (
                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-gray-600">
                      Discount Price
                    </label>

                    <input
                      type="number"
                      min="1"
                      required
                      value={
                        form.discountPrice
                      }
                      onChange={(e) =>
                        updateField(
                          "discountPrice",
                          e.target.value
                        )
                      }
                      placeholder="800"
                      className="font-english w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-gray-600">
                      Offer Start
                    </label>

                    <input
                      type="datetime-local"
                      required
                      value={
                        form.discountStartAt
                      }
                      onChange={(e) =>
                        updateField(
                          "discountStartAt",
                          e.target.value
                        )
                      }
                      className="font-english w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-gray-600">
                      Offer End
                    </label>

                    <input
                      type="datetime-local"
                      required
                      value={
                        form.discountEndAt
                      }
                      onChange={(e) =>
                        updateField(
                          "discountEndAt",
                          e.target.value
                        )
                      }
                      className="font-english w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Short Description */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Short Description
              </label>

              <textarea
                required
                rows={3}
                value={
                  form.shortDescription
                }
                onChange={(e) =>
                  updateField(
                    "shortDescription",
                    e.target.value
                  )
                }
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Description
              </label>

              <textarea
                required
                rows={5}
                value={
                  form.description
                }
                onChange={(e) =>
                  updateField(
                    "description",
                    e.target.value
                  )
                }
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3"
              />
            </div>

            {/* Usage */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Usage Information
              </label>

              <textarea
                rows={3}
                value={
                  form.usageInfo
                }
                onChange={(e) =>
                  updateField(
                    "usageInfo",
                    e.target.value
                  )
                }
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3"
              />
            </div>

            {/* Images */}
            <ProductImageField
              existingImages={
                existingImages
              }
              newFiles={
                newImageFiles
              }
              onAddFiles={
                addImageFiles
              }
              onRemoveExisting={
                removeExistingImage
              }
              onRemoveNew={
                removeNewImage
              }
            />
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-6 flex items-center gap-2 rounded-xl bg-[#14532D] px-6 py-3 font-semibold text-white disabled:opacity-60"
          >
            {saving && (
              <Loader2
                size={17}
                className="animate-spin"
              />
            )}

            {editingId
              ? "Update Product"
              : "Save Product"}
          </button>
        </form>
      )}

      {success && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2
            size={18}
          />

          {success}
        </div>
      )}

      {/* Search */}
      <div className="mt-7 rounded-[22px] border border-gray-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Product Search..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20">
          <Loader2
            size={30}
            className="mx-auto animate-spin text-[#14532D]"
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="bg-[#F7FBF8]">
                <tr className="text-left text-xs text-gray-500">
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
                    Discount
                  </th>

                  <th className="px-5 py-4">
                    Stock
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(
                  (product) => (
                    <tr
                      key={
                        product.databaseId
                      }
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">
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

                      <td className="px-5 py-4 text-sm">
                        {
                          product.category
                        }
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          ৳
                          {
                            product.regularPrice
                          }
                        </p>

                        {product.salePrice !==
                          undefined && (
                          <p className="text-xs text-green-600">
                            Sale: ৳
                            {
                              product.salePrice
                            }
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {product.discountEnabled ? (
                          <div>
                            <p className="font-semibold text-red-600">
                              ৳
                              {
                                product.discountPrice
                              }
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              Timed Offer
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
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
                          <button
                            type="button"
                            title="Status"
                            onClick={() =>
                              toggleStatus(
                                product
                              )
                            }
                            className="rounded-lg p-2 hover:bg-gray-50"
                          >
                            <Power
                              size={17}
                            />
                          </button>

                          <button
                            type="button"
                            title="Edit"
                            onClick={() =>
                              startEdit(
                                product
                              )
                            }
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil
                              size={17}
                            />
                          </button>

                          <button
                            type="button"
                            title="Delete"
                            onClick={() =>
                              handleDelete(
                                product
                              )
                            }
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          >
                            <Trash2
                              size={17}
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
        </div>
      )}

      {!loading &&
        filteredProducts.length ===
          0 && (
          <div className="mt-6 rounded-[24px] border border-dashed border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
            কোনো Product পাওয়া যায়নি।
          </div>
        )}
    </div>
  );
}