"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  Pencil,
  Plus,
  Power,
  Stethoscope,
  Trash2,
  X,
} from "lucide-react";

import { useAdminOperationsStore } from "@/stores/admin-operations-store";

type TreatmentForm = {
  title: string;
  englishTitle: string;

  fee: string;
  duration: string;

  availability: string;

  description: string;

  fullDescription: string;
};

const emptyForm: TreatmentForm = {
  title: "",
  englishTitle: "",
  fee: "",
  duration: "",
  availability:
    "Appointment অনুযায়ী",
  description: "",
  fullDescription: "",
};

function makeSlug(
  value: string
) {
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
    `treatment-${Date.now()}`
  );
}

export default function AdminTreatmentsManager() {
  const treatments =
    useAdminOperationsStore(
      (state) =>
        state.treatments
    );

  const addTreatment =
    useAdminOperationsStore(
      (state) =>
        state.addTreatment
    );

  const updateTreatment =
    useAdminOperationsStore(
      (state) =>
        state.updateTreatment
    );

  const deleteTreatment =
    useAdminOperationsStore(
      (state) =>
        state.deleteTreatment
    );

  const toggleTreatmentStatus =
    useAdminOperationsStore(
      (state) =>
        state.toggleTreatmentStatus
    );

  const [mounted, setMounted] =
    useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(
      null
    );

  const [form, setForm] =
    useState<TreatmentForm>(
      emptyForm
    );

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
        Treatments Loading...
      </div>
    );
  }

  const updateField = (
    field: keyof TreatmentForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);

    setEditingId(null);

    setShowForm(false);

    setError("");
  };

  const startEdit = (
    id: number
  ) => {
    const treatment =
      treatments.find(
        (item) =>
          item.id === id
      );

    if (!treatment) {
      return;
    }

    setForm({
      title:
        treatment.title,

      englishTitle:
        treatment.englishTitle,

      fee:
        String(
          treatment.fee
        ),

      duration:
        String(
          treatment.duration
        ),

      availability:
        treatment.availability,

      description:
        treatment.description,

      fullDescription:
        treatment.fullDescription,
    });

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

    const fee =
      Number(form.fee);

    const duration =
      Number(form.duration);

    if (
      fee < 0 ||
      duration <= 0
    ) {
      setError(
        "Fee এবং Duration সঠিকভাবে দিন।"
      );

      return;
    }

    const existing =
      editingId
        ? treatments.find(
            (item) =>
              item.id ===
              editingId
          )
        : undefined;

    const treatmentData = {
      title:
        form.title.trim(),

      englishTitle:
        form.englishTitle.trim(),

      slug:
        existing?.slug ??
        makeSlug(
          form.englishTitle
        ),

      description:
        form.description.trim(),

      fullDescription:
        form.fullDescription.trim(),

      icon:
        existing?.icon ??
        "stethoscope",

      fee,

      duration,

      availability:
        form.availability.trim(),
    };

    if (editingId) {
      updateTreatment(
        editingId,
        treatmentData
      );

      setSuccess(
        "Treatment সফলভাবে Update হয়েছে।"
      );
    } else {
      addTreatment(
        treatmentData
      );

      setSuccess(
        "নতুন Treatment Add হয়েছে।"
      );
    }

    setForm(emptyForm);

    setEditingId(null);

    setShowForm(false);
  };

  const handleDelete = (
    id: number,
    title: string
  ) => {
    setError("");
    setSuccess("");

    const confirmed =
      window.confirm(
        `${title} Delete করতে চান?`
      );

    if (!confirmed) {
      return;
    }

    const deleted =
      deleteTreatment(id);

    if (!deleted) {
      setError(
        "এই Treatment একটি Appointment-এ ব্যবহার হচ্ছে, তাই Delete করা যাচ্ছে না। চাইলে Inactive করুন।"
      );

      return;
    }

    setSuccess(
      "Treatment Delete হয়েছে।"
    );
  };

  return (
    <div>
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#15803D]">
            Medical Services
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Treatment Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Consultation Service, Fee এবং Duration Manage করুন।
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
            : "নতুন Treatment"}
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
              ? "Treatment Edit"
              : "Treatment Add"}
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                বাংলা নাম *
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                English Name *
              </label>

              <input
                required
                value={
                  form.englishTitle
                }
                onChange={(event) =>
                  updateField(
                    "englishTitle",
                    event.target.value
                  )
                }
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Consultation Fee *
              </label>

              <input
                type="number"
                min="0"
                required
                value={form.fee}
                onChange={(event) =>
                  updateField(
                    "fee",
                    event.target.value
                  )
                }
                placeholder="500"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Duration (Minutes) *
              </label>

              <input
                type="number"
                min="1"
                required
                value={
                  form.duration
                }
                onChange={(event) =>
                  updateField(
                    "duration",
                    event.target.value
                  )
                }
                placeholder="20"
                className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Availability *
              </label>

              <input
                required
                value={
                  form.availability
                }
                onChange={(event) =>
                  updateField(
                    "availability",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Short Description *
              </label>

              <textarea
                required
                rows={3}
                value={
                  form.description
                }
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Description *
              </label>

              <textarea
                required
                rows={5}
                value={
                  form.fullDescription
                }
                onChange={(event) =>
                  updateField(
                    "fullDescription",
                    event.target.value
                  )
                }
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-xl bg-[#14532D] px-6 py-3 text-sm font-semibold text-white"
            >
              {editingId
                ? "Update Treatment"
                : "Save Treatment"}
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

      {error && !showForm && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-[#166534]">
          <CheckCircle2 size={18} />

          {success}
        </div>
      )}

      {/* Cards */}
      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {treatments.map(
          (treatment) => (
            <article
              key={
                treatment.id
              }
              className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-[#14532D]">
                  <Stethoscope
                    size={22}
                  />
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    treatment.active
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {treatment.active
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>

              <p className="font-english mt-5 text-xs font-semibold uppercase text-[#15803D]">
                {
                  treatment.englishTitle
                }
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                {
                  treatment.title
                }
              </h2>

              <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-500">
                {
                  treatment.description
                }
              </p>

              <div className="mt-5 flex gap-2">
                <span className="rounded-full bg-[#F7FBF8] px-3 py-1.5 text-xs font-semibold text-gray-600">
                  ৳
                  {
                    treatment.fee
                  }
                </span>

                <span className="rounded-full bg-[#F7FBF8] px-3 py-1.5 text-xs font-semibold text-gray-600">
                  {
                    treatment.duration
                  }{" "}
                  min
                </span>
              </div>

              <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    toggleTreatmentStatus(
                      treatment.id
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7FBF8] text-gray-500"
                  title="Status"
                >
                  <Power size={16} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    startEdit(
                      treatment.id
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
                      treatment.id,
                      treatment.title
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          )
        )}
      </div>
    </div>
  );
}