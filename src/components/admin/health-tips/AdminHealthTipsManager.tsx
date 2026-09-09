"use client";

import type { FormEvent } from "react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Power,
  Trash2,
  X,
} from "lucide-react";

import type {
  DatabaseHealthTip,
} from "@/types/health-tip";

type ArticleForm = {
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  excerpt: string;
  intro: string;
};

type ArticleSection = {
  heading: string;
  content: string;
};

const emptyForm: ArticleForm = {
  title: "",
  category: "",
  readTime: "৪ মিনিট",
  date: "",
  author: "Homeopathy Clinic",
  excerpt: "",
  intro: "",
};

const emptySection: ArticleSection = {
  heading: "",
  content: "",
};

export default function AdminHealthTipsManager() {
  const [
    healthTips,
    setHealthTips,
  ] = useState<
    DatabaseHealthTip[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingId,
    setEditingId,
  ] = useState<
    string | null
  >(null);

  const [
    form,
    setForm,
  ] = useState<ArticleForm>(
    emptyForm
  );

  const [
    sections,
    setSections,
  ] = useState<
    ArticleSection[]
  >([
    {
      ...emptySection,
    },
  ]);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  /*
    ==========================
    Load Health Tips
    ==========================
  */
  const loadHealthTips =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            "/api/health-tips?admin=1",
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Health Tips load করা যায়নি।"
          );
        }

        setHealthTips(
          data.healthTips ?? []
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Health Tips load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadHealthTips();
  }, [loadHealthTips]);

  /*
    ==========================
    Form Field Update
    ==========================
  */
  const updateField = (
    field: keyof ArticleForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /*
    ==========================
    Section Update
    ==========================
  */
  const updateSection = (
    index: number,
    field: keyof ArticleSection,
    value: string
  ) => {
    setSections((current) =>
      current.map(
        (
          section,
          itemIndex
        ) =>
          itemIndex === index
            ? {
                ...section,
                [field]:
                  value,
              }
            : section
      )
    );
  };

  /*
    ==========================
    Add Section
    ==========================
  */
  const addSection = () => {
    setSections(
      (current) => [
        ...current,
        {
          ...emptySection,
        },
      ]
    );
  };

  /*
    ==========================
    Remove Section
    ==========================
  */
  const removeSection = (
    index: number
  ) => {
    if (
      sections.length === 1
    ) {
      return;
    }

    setSections((current) =>
      current.filter(
        (
          _,
          itemIndex
        ) =>
          itemIndex !==
          index
      )
    );
  };

  /*
    ==========================
    Reset Form
    ==========================
  */
  const resetForm = () => {
    setForm(emptyForm);

    setSections([
      {
        ...emptySection,
      },
    ]);

    setEditingId(null);

    setShowForm(false);

    setError("");
  };

  /*
    ==========================
    Start Edit
    ==========================
  */
  const startEdit = (
    article:
      DatabaseHealthTip
  ) => {
    setForm({
      title:
        article.title,

      category:
        article.category,

      readTime:
        article.readTime,

      date:
        article.date,

      author:
        article.author,

      excerpt:
        article.excerpt,

      intro:
        article.intro,
    });

    setSections(
      article.sections.map(
        (section) => ({
          heading:
            section.heading,

          content:
            section.content,
        })
      )
    );

    setEditingId(
      article.databaseId
    );

    setShowForm(true);

    setError("");

    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
    ==========================
    Save / Update Article
    ==========================
  */
  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanSections =
      sections.filter(
        (section) =>
          section.heading.trim() &&
          section.content.trim()
      );

    if (
      cleanSections.length === 0
    ) {
      setError(
        "কমপক্ষে একটি Article Section সম্পূর্ণ করুন।"
      );

      return;
    }

    const isEditing =
      Boolean(editingId);

    try {
      const response =
        await fetch(
          editingId
            ? `/api/health-tips/${editingId}`
            : "/api/health-tips",
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
              JSON.stringify({
                ...form,

                sections:
                  cleanSections,
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Health Tip Save করা যায়নি।"
        );
      }

      /*
        MongoDB থেকে আবার
        fresh data load
      */
      await loadHealthTips();

      resetForm();

      setSuccess(
        isEditing
          ? "Health Tip সফলভাবে Update হয়েছে।"
          : "নতুন Health Tip Add হয়েছে।"
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Health Tip Save করা যায়নি।"
      );
    }
  };

  /*
    ==========================
    Publish / Draft
    ==========================
  */
  const toggleStatus =
    async (
      article:
        DatabaseHealthTip
    ) => {
      try {
        setError("");
        setSuccess("");

        const response =
          await fetch(
            `/api/health-tips/${article.databaseId}`,
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
                    !article.active,
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Publish Status পরিবর্তন করা যায়নি।"
          );
        }

        await loadHealthTips();

        setSuccess(
          article.active
            ? "Article Draft করা হয়েছে।"
            : "Article Publish করা হয়েছে।"
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Publish Status পরিবর্তন করা যায়নি।"
        );
      }
    };

  /*
    ==========================
    Delete Health Tip
    ==========================
  */
  const handleDelete =
    async (
      article:
        DatabaseHealthTip
    ) => {
      const confirmed =
        window.confirm(
          `${article.title} Delete করতে চান?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");
        setSuccess("");

        const response =
          await fetch(
            `/api/health-tips/${article.databaseId}`,
            {
              method:
                "DELETE",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Health Tip Delete করা যায়নি।"
          );
        }

        await loadHealthTips();

        setSuccess(
          "Health Tip Delete হয়েছে।"
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Health Tip Delete করা যায়নি।"
        );
      }
    };

  return (
    <div>
      {/* =====================
          Heading
      ====================== */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#15803D]">
            Content
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Health Tips Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Website-এর Health Article Add,
            Edit এবং Publish Manage করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
              setEditingId(null);
              setForm(emptyForm);

              setSections([
                {
                  ...emptySection,
                },
              ]);

              setError("");
              setSuccess("");
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
            : "নতুন Article"}
        </button>
      </div>

      {/* =====================
          Form
      ====================== */}
      {showForm && (
        <form
          onSubmit={
            handleSubmit
          }
          className="mt-7 rounded-[26px] border border-green-100 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900">
            {editingId
              ? "Article Edit করুন"
              : "নতুন Article তৈরি করুন"}
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Article Title *
              </label>

              <input
                required
                value={
                  form.title
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "title",
                    event.target
                      .value
                  )
                }
                placeholder="Article-এর Title"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category *
              </label>

              <input
                required
                value={
                  form.category
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "category",
                    event.target
                      .value
                  )
                }
                placeholder="স্বাস্থ্য সচেতনতা"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Reading Time */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Reading Time *
              </label>

              <input
                required
                value={
                  form.readTime
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "readTime",
                    event.target
                      .value
                  )
                }
                placeholder="৪ মিনিট"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Publish Date *
              </label>

              <input
                required
                value={
                  form.date
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "date",
                    event.target
                      .value
                  )
                }
                placeholder="০৭ সেপ্টেম্বর ২০২৬"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Author */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Author *
              </label>

              <input
                required
                value={
                  form.author
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "author",
                    event.target
                      .value
                  )
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Excerpt */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Short Excerpt *
              </label>

              <textarea
                required
                rows={3}
                value={
                  form.excerpt
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "excerpt",
                    event.target
                      .value
                  )
                }
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            {/* Intro */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Article Introduction *
              </label>

              <textarea
                required
                rows={4}
                value={
                  form.intro
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    "intro",
                    event.target
                      .value
                  )
                }
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>
          </div>

          {/* =====================
              Sections
          ====================== */}
          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-gray-900">
                Article Sections
              </h3>

              <button
                type="button"
                onClick={
                  addSection
                }
                className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-[#14532D]"
              >
                <Plus
                  size={16}
                />

                Section Add
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {sections.map(
                (
                  section,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    className="rounded-2xl border border-gray-100 bg-[#F7FBF8] p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-english text-xs font-bold uppercase text-gray-400">
                        Section{" "}
                        {index +
                          1}
                      </p>

                      {sections.length >
                        1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeSection(
                              index
                            )
                          }
                          className="text-red-500"
                        >
                          <Trash2
                            size={
                              16
                            }
                          />
                        </button>
                      )}
                    </div>

                    <input
                      value={
                        section.heading
                      }
                      onChange={(
                        event
                      ) =>
                        updateSection(
                          index,
                          "heading",
                          event.target
                            .value
                        )
                      }
                      placeholder="Section Heading"
                      className="mt-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#14532D]"
                    />

                    <textarea
                      rows={4}
                      value={
                        section.content
                      }
                      onChange={(
                        event
                      ) =>
                        updateSection(
                          index,
                          "content",
                          event.target
                            .value
                        )
                      }
                      placeholder="Section-এর মূল Content"
                      className="mt-3 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#14532D]"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-[#14532D] px-6 py-3 text-sm font-semibold text-white"
            >
              {editingId
                ? "Update Article"
                : "Save Article"}
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

      {/* =====================
          Success
      ====================== */}
      {success && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-[#166534]">
          <CheckCircle2
            size={18}
          />

          {success}
        </div>
      )}

      {/* Error outside form */}
      {!showForm &&
        error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

      {/* =====================
          Loading
      ====================== */}
      {loading ? (
        <div className="py-20">
          <Loader2
            size={30}
            className="mx-auto animate-spin text-[#14532D]"
          />

          <p className="mt-3 text-center text-sm text-gray-400">
            Health Tips
            Loading...
          </p>
        </div>
      ) : (
        /* =====================
            Articles
        ====================== */
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {healthTips.length ===
          0 ? (
            <div className="md:col-span-2 xl:col-span-3">
              <div className="rounded-[24px] border border-gray-100 bg-white p-10 text-center shadow-sm">
                <FileText
                  size={34}
                  className="mx-auto text-gray-300"
                />

                <p className="mt-3 text-sm text-gray-400">
                  এখনো কোনো
                  Health Tip
                  পাওয়া যায়নি।
                </p>
              </div>
            </div>
          ) : (
            healthTips.map(
              (tip) => (
                <article
                  key={
                    tip.databaseId
                  }
                  className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
                      <FileText
                        size={21}
                      />
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        tip.active
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {tip.active
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>

                  <p className="mt-5 text-xs font-semibold text-[#15803D]">
                    {
                      tip.category
                    }
                  </p>

                  <h2 className="mt-2 text-lg font-bold leading-7 text-gray-900">
                    {
                      tip.title
                    }
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-500">
                    {
                      tip.excerpt
                    }
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-400">
                    <span>
                      {
                        tip.readTime
                      }
                    </span>

                    <span>
                      •
                    </span>

                    <span>
                      {tip.date}
                    </span>
                  </div>

                  <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                    {/* Publish / Draft */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleStatus(
                          tip
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7FBF8] text-gray-600"
                      title="Publish Status"
                    >
                      <Power
                        size={16}
                      />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() =>
                        startEdit(
                          tip
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
                      title="Edit"
                    >
                      <Pencil
                        size={16}
                      />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          tip
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500"
                      title="Delete"
                    >
                      <Trash2
                        size={16}
                      />
                    </button>
                  </div>
                </article>
              )
            )
          )}
        </div>
      )}

      {/* =====================
          Database Notice
      ====================== */}
      <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5 text-sm leading-7 text-green-900">
        Health Tips এখন MongoDB
        Database থেকে Load, Add,
        Update, Publish/Draft এবং
        Delete হচ্ছে।
      </div>
    </div>
  );
}