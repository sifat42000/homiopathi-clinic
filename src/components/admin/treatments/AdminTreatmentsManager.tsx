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
  Clock3,
  Loader2,
  Pencil,
  Plus,
  Power,
  Search,
  Trash2,
  X,
} from "lucide-react";

import type {
  DatabaseTreatment,
  TreatmentAvailability,
} from "@/types/treatment";

type TreatmentForm = {
  title: string;

  englishTitle: string;

  description: string;

  fullDescription: string;

  fee: string;

  duration: string;

  availability:
    TreatmentAvailability;
};

const emptyForm:
  TreatmentForm = {
  title: "",

  englishTitle: "",

  description: "",

  fullDescription: "",

  fee: "",

  duration: "30",

  availability:
    "available",
};

export default function AdminTreatmentsManager() {
  const [
    treatments,
    setTreatments,
  ] = useState<
    DatabaseTreatment[]
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
    useState<TreatmentForm>(
      emptyForm
    );

  const loadTreatments =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/treatments?admin=1",
            {
              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message
          );
        }

        setTreatments(
          data.treatments ??
            []
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Treatments load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadTreatments();
  }, [loadTreatments]);

  const filtered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return treatments;
      }

      return treatments.filter(
        (treatment) =>
          treatment.title
            .toLowerCase()
            .includes(query) ||
          treatment.englishTitle
            .toLowerCase()
            .includes(query)
      );
    }, [
      treatments,
      search,
    ]);

  const updateField = (
    field:
      keyof TreatmentForm,

    value: string
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

    setShowForm(
      false
    );

    setError("");
  };

  const startEdit = (
    treatment:
      DatabaseTreatment
  ) => {
    setForm({
      title:
        treatment.title,

      englishTitle:
        treatment.englishTitle,

      description:
        treatment.description,

      fullDescription:
        treatment.fullDescription,

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
    });

    setEditingId(
      treatment.databaseId
    );

    setShowForm(true);

    setError("");

    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);

      setError("");

      setSuccess("");

      const response =
        await fetch(
          editingId
            ? `/api/treatments/${editingId}`
            : "/api/treatments",
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
                title:
                  form.title,

                englishTitle:
                  form.englishTitle,

                description:
                  form.description,

                fullDescription:
                  form.fullDescription,

                fee:
                  Number(
                    form.fee
                  ),

                duration:
                  Number(
                    form.duration
                  ),

                availability:
                  form.availability,
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

      setSuccess(
        editingId
          ? "Treatment Update হয়েছে।"
          : "Treatment Add হয়েছে।"
      );

      resetForm();

      await loadTreatments();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Treatment Save করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleActive =
    async (
      treatment:
        DatabaseTreatment
    ) => {
      try {
        const response =
          await fetch(
            `/api/treatments/${treatment.databaseId}`,
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
                    !treatment.active,
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

        await loadTreatments();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Status change করা যায়নি।"
        );
      }
    };

  const handleDelete =
    async (
      treatment:
        DatabaseTreatment
    ) => {
      if (
        !window.confirm(
          `${treatment.title} Delete করতে চান?`
        )
      ) {
        return;
      }

      try {
        const response =
          await fetch(
            `/api/treatments/${treatment.databaseId}`,
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
          "Treatment Delete হয়েছে।"
        );

        await loadTreatments();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Treatment Delete করা যায়নি।"
        );
      }
    };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#15803D]">
            Real Treatments
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Treatment Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Treatment, Fee, Duration এবং Availability পরিচালনা করুন।
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
            }
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 font-semibold text-white"
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

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-7 rounded-[26px] border border-green-100 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold">
            {editingId
              ? "Treatment Edit"
              : "নতুন Treatment"}
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <input
              required
              value={form.title}
              onChange={(e) =>
                updateField(
                  "title",
                  e.target.value
                )
              }
              placeholder="বাংলা Treatment Name"
              className="rounded-xl border border-gray-200 px-4 py-3"
            />

            <input
              required
              value={
                form.englishTitle
              }
              onChange={(e) =>
                updateField(
                  "englishTitle",
                  e.target.value
                )
              }
              placeholder="English Treatment Name"
              className="font-english rounded-xl border border-gray-200 px-4 py-3"
            />

            <input
              required
              type="number"
              min="0"
              value={form.fee}
              onChange={(e) =>
                updateField(
                  "fee",
                  e.target.value
                )
              }
              placeholder="Consultation Fee"
              className="rounded-xl border border-gray-200 px-4 py-3"
            />

            <input
              required
              type="number"
              min="5"
              max="240"
              value={
                form.duration
              }
              onChange={(e) =>
                updateField(
                  "duration",
                  e.target.value
                )
              }
              placeholder="Duration (minutes)"
              className="rounded-xl border border-gray-200 px-4 py-3"
            />

            <select
              value={
                form.availability
              }
              onChange={(e) =>
                updateField(
                  "availability",
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 sm:col-span-2"
            >
              <option value="available">
                Available for Appointment
              </option>

              <option value="unavailable">
                Appointment Unavailable
              </option>
            </select>

            <textarea
              required
              rows={3}
              value={
                form.description
              }
              onChange={(e) =>
                updateField(
                  "description",
                  e.target.value
                )
              }
              placeholder="Short Description"
              className="resize-none rounded-xl border border-gray-200 px-4 py-3 sm:col-span-2"
            />

            <textarea
              required
              rows={6}
              value={
                form.fullDescription
              }
              onChange={(e) =>
                updateField(
                  "fullDescription",
                  e.target.value
                )
              }
              placeholder="Full Description"
              className="resize-none rounded-xl border border-gray-200 px-4 py-3 sm:col-span-2"
            />
          </div>

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-6 flex items-center gap-2 rounded-xl bg-[#14532D] px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {saving && (
              <Loader2
                size={17}
                className="animate-spin"
              />
            )}

            {editingId
              ? "Update Treatment"
              : "Save Treatment"}
          </button>
        </form>
      )}

      {success && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle2
            size={18}
          />

          {success}
        </div>
      )}

      <div className="mt-7 rounded-[22px] border border-gray-100 bg-white p-4">
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
            placeholder="Treatment Search..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20">
          <Loader2
            size={30}
            className="mx-auto animate-spin text-[#14532D]"
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(
            (treatment) => (
              <article
                key={
                  treatment.databaseId
                }
                className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold">
                      {
                        treatment.title
                      }
                    </h2>

                    <p className="font-english mt-1 text-xs text-gray-400">
                      {
                        treatment.englishTitle
                      }
                    </p>
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

                <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-500">
                  {
                    treatment.description
                  }
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#F7FBF8] p-3">
                    <p className="text-xs text-gray-400">
                      Fee
                    </p>

                    <p className="mt-1 font-bold">
                      ৳
                      {
                        treatment.fee
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F7FBF8] p-3">
                    <p className="text-xs text-gray-400">
                      Duration
                    </p>

                    <p className="mt-1 flex items-center gap-1 font-bold">
                      <Clock3
                        size={14}
                      />

                      {
                        treatment.duration
                      }{" "}
                      min
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-xs font-semibold">
                  Appointment:{" "}
                  <span
                    className={
                      treatment.availability ===
                      "available"
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {
                      treatment.availability
                    }
                  </span>
                </p>

                <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      toggleActive(
                        treatment
                      )
                    }
                    className="rounded-lg p-2"
                  >
                    <Power
                      size={17}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      startEdit(
                        treatment
                      )
                    }
                    className="rounded-lg p-2 text-blue-600"
                  >
                    <Pencil
                      size={17}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        treatment
                      )
                    }
                    className="ml-auto rounded-lg p-2 text-red-500"
                  >
                    <Trash2
                      size={17}
                    />
                  </button>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </div>
  );
}