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
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";

import type {
  CustomerProfile,
} from "@/types/customer-profile";

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

const emptyProfile:
  CustomerProfile = {
  userId: "",

  name: "",

  email: "",

  phone: "",

  division: "",

  district: "",

  area: "",

  address: "",
};

export default function CustomerProfileForm() {
  const [
    profile,
    setProfile,
  ] = useState<CustomerProfile>(
    emptyProfile
  );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const loadProfile =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/profile",
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

        setProfile(
          data.profile
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Profile load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateField = (
    field:
      keyof CustomerProfile,

    value: string
  ) => {
    setProfile(
      (current) => ({
        ...current,

        [field]:
          value,
      })
    );
  };

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      setSaving(true);

      const response =
        await fetch(
          "/api/profile",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                name:
                  profile.name,

                phone:
                  profile.phone,

                division:
                  profile.division,

                district:
                  profile.district,

                area:
                  profile.area,

                address:
                  profile.address,
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
        "আপনার Profile সফলভাবে Save হয়েছে।"
      );

      await loadProfile();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Profile Save করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <Loader2
          size={30}
          className="mx-auto animate-spin text-[#14532D]"
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm sm:p-7"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <UserRound
              size={16}
            />

            পূর্ণ নাম *
          </label>

          <input
            value={
              profile.name
            }
            onChange={(event) =>
              updateField(
                "name",
                event.target.value
              )
            }
            required
            minLength={2}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Phone
              size={16}
            />

            Mobile *
          </label>

          <input
            value={
              profile.phone
            }
            onChange={(event) =>
              updateField(
                "phone",
                event.target.value
              )
            }
            required
            maxLength={11}
            inputMode="numeric"
            placeholder="01XXXXXXXXX"
            className="font-english w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#14532D]"
          />
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Mail
              size={16}
            />

            Email
          </label>

          <input
            value={
              profile.email
            }
            readOnly
            className="font-english w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
          />

          <p className="mt-2 text-xs text-gray-400">
            Login Email এখান থেকে পরিবর্তন করা যাবে না।
          </p>
        </div>

        {/* Division */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            বিভাগ
          </label>

          <select
            value={
              profile.division
            }
            onChange={(event) =>
              updateField(
                "division",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
          >
            <option value="">
              নির্বাচন করুন
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
        </div>

        {/* District */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            জেলা
          </label>

          <input
            value={
              profile.district
            }
            onChange={(event) =>
              updateField(
                "district",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
          />
        </div>

        {/* Area */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            এলাকা / থানা
          </label>

          <input
            value={
              profile.area
            }
            onChange={(event) =>
              updateField(
                "area",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
          />
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MapPin
              size={16}
            />

            বিস্তারিত ঠিকানা
          </label>

          <textarea
            value={
              profile.address
            }
            onChange={(event) =>
              updateField(
                "address",
                event.target.value
              )
            }
            rows={4}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3"
          />
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2
            size={18}
          />

          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="mt-6 flex items-center gap-2 rounded-xl bg-[#14532D] px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {saving ? (
          <Loader2
            size={18}
            className="animate-spin"
          />
        ) : (
          <Save
            size={18}
          />
        )}

        {saving
          ? "Saving..."
          : "Profile Save করুন"}
      </button>
    </form>
  );
}