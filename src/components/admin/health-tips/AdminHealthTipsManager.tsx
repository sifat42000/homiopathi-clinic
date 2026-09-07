"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  FileText,
  Pencil,
  Plus,
  Power,
  Trash2,
  X,
} from "lucide-react";

import { useAdminContentStore } from "@/stores/admin-content-store";

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

  author:
    "Homeopathy Clinic",

  excerpt: "",

  intro: "",
};

const emptySection: ArticleSection = {
  heading: "",

  content: "",
};

function createSlug() {
  return `health-tip-${Date.now()
    .toString()
    .slice(-8)}`;
}

export default function AdminHealthTipsManager() {
  const healthTips =
    useAdminContentStore(
      (state) =>
        state.healthTips
    );

  const addHealthTip =
    useAdminContentStore(
      (state) =>
        state.addHealthTip
    );

  const updateHealthTip =
    useAdminContentStore(
      (state) =>
        state.updateHealthTip
    );

  const deleteHealthTip =
    useAdminContentStore(
      (state) =>
        state.deleteHealthTip
    );

  const toggleHealthTipStatus =
    useAdminContentStore(
      (state) =>
        state.toggleHealthTipStatus
    );

  const [mounted, setMounted] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [
    editingId,
    setEditingId,
  ] = useState<number | null>(
    null
  );

  const [form, setForm] =
    useState<ArticleForm>(
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

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-20 text-center text-sm text-gray-400">
        Health Tips Loading...
      </div>
    );
  }

  const updateField = (
    field: keyof ArticleForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,

      [field]: value,
    }));
  };

  const updateSection = (
    index: number,
    field: keyof ArticleSection,
    value: string
  ) => {
    setSections(
      (current) =>
        current.map(
          (section, itemIndex) =>
            itemIndex === index
              ? {
                  ...section,

                  [field]: value,
                }
              : section
        )
    );
  };

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

  const removeSection = (
    index: number
  ) => {
    if (
      sections.length === 1
    ) {
      return;
    }

    setSections(
      (current) =>
        current.filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
    );
  };

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

  const startEdit = (
    id: number
  ) => {
    const article =
      healthTips.find(
        (item) =>
          item.id === id
      );

    if (!article) {
      return;
    }

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

    setEditingId(id);

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

    const existing =
      editingId
        ? healthTips.find(
            (item) =>
              item.id ===
              editingId
          )
        : undefined;

    const articleData = {
      title:
        form.title.trim(),

      slug:
        existing?.slug ??
        createSlug(),

      excerpt:
        form.excerpt.trim(),

      category:
        form.category.trim(),

      readTime:
        form.readTime.trim(),

      date:
        form.date.trim(),

      author:
        form.author.trim(),

      intro:
        form.intro.trim(),

      sections:
        cleanSections,
    };

    if (editingId) {
      updateHealthTip(
        editingId,
        articleData
      );

      setSuccess(
        "Health Tip সফলভাবে Update হয়েছে।"
      );
    } else {
      addHealthTip(
        articleData
      );

      setSuccess(
        "নতুন Health Tip Add হয়েছে।"
      );
    }

    setForm(emptyForm);

    setSections([
      {
        ...emptySection,
      },
    ]);

    setEditingId(null);

    setShowForm(false);
  };

  const handleDelete = (
    id: number,
    title: string
  ) => {
    const confirmed =
      window.confirm(
        `${title} Delete করতে চান?`
      );

    if (!confirmed) {
      return;
    }

    deleteHealthTip(id);

    setSuccess(
      "Health Tip Delete হয়েছে।"
    );
  };

  return (
    <div>
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#15803D]">
            Content
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Health Tips Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Website-এর Health Article Add, Edit এবং Publish Manage করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
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

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
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
                value={form.title}
                onChange={(event) =>
                  updateField(
                    "title",
                    event.target.value
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
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value
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
                onChange={(event) =>
                  updateField(
                    "readTime",
                    event.target.value
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
                value={form.date}
                onChange={(event) =>
                  updateField(
                    "date",
                    event.target.value
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
                onChange={(event) =>
                  updateField(
                    "author",
                    event.target.value
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
                onChange={(event) =>
                  updateField(
                    "excerpt",
                    event.target.value
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
                onChange={(event) =>
                  updateField(
                    "intro",
                    event.target.value
                  )
                }
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>
          </div>

          {/* Sections */}
          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-gray-900">
                Article Sections
              </h3>

              <button
                type="button"
                onClick={addSection}
                className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-[#14532D]"
              >
                <Plus size={16} />

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
                    key={index}
                    className="rounded-2xl border border-gray-100 bg-[#F7FBF8] p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-english text-xs font-bold uppercase text-gray-400">
                        Section{" "}
                        {index + 1}
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
                            size={16}
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
                          event
                            .target
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
                          event
                            .target
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

      {success && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-[#166534]">
          <CheckCircle2 size={18} />

          {success}
        </div>
      )}

      {/* Articles */}
      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {healthTips.map(
          (tip) => (
            <article
              key={tip.id}
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
                {tip.category}
              </p>

              <h2 className="mt-2 text-lg font-bold leading-7 text-gray-900">
                {tip.title}
              </h2>

              <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-500">
                {tip.excerpt}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-400">
                <span>
                  {tip.readTime}
                </span>

                <span>•</span>

                <span>
                  {tip.date}
                </span>
              </div>

              <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    toggleHealthTipStatus(
                      tip.id
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7FBF8] text-gray-600"
                  title="Publish Status"
                >
                  <Power size={16} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    startEdit(
                      tip.id
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      tip.id,
                      tip.title
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
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
        Admin Article changes এখন LocalStorage-এ থাকবে। Public
        `/health-tips` এখনো `healthTips.ts` ব্যবহার করছে। Backend Phase-এ
        MongoDB-এর একই Article Data Public Page এবং Admin Panel দুটোতেই ব্যবহার
        হবে।
      </div>
    </div>
  );
}