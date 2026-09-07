"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Loader2,
  Plus,
  Power,
  Tags,
  Trash2,
} from "lucide-react";

import type {
  Category,
} from "@/types/category";

export default function AdminCategoriesManager() {
  const [
    categories,
    setCategories,
  ] = useState<Category[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const loadCategories =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/categories?admin=1",
            {
              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
              "Category load failed."
          );
        }

        setCategories(
          data.categories
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Category load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const name =
      String(
        formData.get(
          "categoryName"
        ) ?? ""
      ).trim();

    try {
      setSaving(true);

      const response =
        await fetch(
          "/api/categories",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.message ||
            "Category add failed."
        );
      }

      form.reset();

      setSuccess(
        "নতুন Category MongoDB-তে Save হয়েছে।"
      );

      await loadCategories();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Category Add করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (
    category: Category
  ) => {
    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/categories/${category.id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                active:
                  !category.active,
              }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.message
        );
      }

      await loadCategories();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Status পরিবর্তন করা যায়নি।"
      );
    }
  };

  const handleDelete = async (
    category: Category
  ) => {
    const confirmed =
      window.confirm(
        `${category.name} Category Delete করতে চান?`
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/categories/${category.id}`,
          {
            method:
              "DELETE",
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.message
        );
      }

      setSuccess(
        "Category MongoDB থেকে Delete হয়েছে।"
      );

      await loadCategories();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Category Delete করা যায়নি।"
      );
    }
  };

  return (
    <div>
      <div>
        <p className="text-sm font-semibold text-[#15803D]">
          Database Catalog
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Category Management
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Category এখন সরাসরি MongoDB Database থেকে পরিচালিত হচ্ছে।
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-7 rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm"
      >
        <label
          htmlFor="category-name"
          className="text-sm font-semibold text-gray-700"
        >
          নতুন Category
        </label>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="category-name"
            name="categoryName"
            required
            placeholder="যেমন: Hair Care"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
          />

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-6 py-3 font-semibold text-white disabled:opacity-60"
          >
            {saving ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Plus
                size={18}
              />
            )}

            Add Category
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-[#166534]">
          <CheckCircle2
            size={18}
          />

          {success}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center">
          <Loader2
            size={28}
            className="mx-auto animate-spin text-[#14532D]"
          />
        </div>
      ) : (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map(
            (category) => (
              <div
                key={
                  category.id
                }
                className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
                    <Tags
                      size={21}
                    />
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      category.active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {category.active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <h2 className="mt-5 text-lg font-bold text-gray-900">
                  {
                    category.name
                  }
                </h2>

                <p className="font-english mt-1 text-xs text-gray-400">
                  /{category.slug}
                </p>

                <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      toggleStatus(
                        category
                      )
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F7FBF8] px-3 py-2.5 text-xs font-semibold text-gray-600"
                  >
                    <Power
                      size={15}
                    />

                    Status
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        category
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500"
                  >
                    <Trash2
                      size={16}
                    />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {!loading &&
        categories.length ===
          0 && (
          <div className="mt-7 rounded-[22px] border border-dashed border-gray-200 bg-white py-14 text-center text-sm text-gray-400">
            এখনো কোনো Category নেই। উপরের Form থেকে প্রথম Category Add করুন।
          </div>
        )}
    </div>
  );
}