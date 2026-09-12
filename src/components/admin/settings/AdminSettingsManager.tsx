"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Bell,
  CheckCircle2,
  Loader2,
  Save,
  Settings2,
  Stethoscope,
  Store,
  ImagePlus,
  X,
} from "lucide-react";

import Image from "next/image";

import type {
  WebsiteSettings,
} from "@/types/website-settings";

const emptySettings: WebsiteSettings =
  {
    clinicName: "",

    englishName: "",

    doctorName: "",

    doctorDegree: "",

    doctorQualification: "",

    doctorRegistration: "",

    phone: "",

    whatsapp: "",

    email: "",

    address: "",

    chamberTime: "",

    deliveryCharge: 80,

    deliveryChargeInside: 80,

    deliveryChargeOutside: 160,

    announcement: "",

    announcementEnabled:
      false,

    appointmentEnabled:
      true,

    shopEnabled: true,
  };

export default function AdminSettingsManager() {
  const [
    settings,
    setSettings,
  ] = useState<WebsiteSettings>(
    emptySettings
  );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [doctorPhotoFile, setDoctorPhotoFile] =
    useState<File | null>(null);

  const [doctorPhotoPreview, setDoctorPhotoPreview] =
    useState("");

  const [removeDoctorPhoto, setRemoveDoctorPhoto] =
    useState(false);

  const loadSettings =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/settings",
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

        setSettings(
          data.settings
        );

        if (!doctorPhotoFile) {
          setDoctorPhotoPreview(
            data.settings.doctorPhotoUrl ??
              ""
          );
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Settings load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateField = (
    field:
      keyof WebsiteSettings,

    value:
      string | number | boolean
  ) => {
    setSettings(
      (current) => ({
        ...current,

        [field]: value,
      })
    );
  };

  const handleDoctorPhotoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setError(
        "শুধু JPG, PNG অথবা WEBP Image ব্যবহার করুন।"
      );

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Doctor Image সর্বোচ্চ 5MB হতে পারবে।"
      );

      return;
    }

    setError("");
    setDoctorPhotoFile(file);
    setDoctorPhotoPreview(
      URL.createObjectURL(file)
    );
    setRemoveDoctorPhoto(false);
  };

  const handleSubmit = async (
    event:
      FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const previousPhotoPublicId =
      settings.doctorPhotoPublicId;

    let uploadedDoctorPhoto:
      | {
          url: string;
          publicId: string;
        }
      | null = null;

    try {
      setSaving(true);

      setError("");

      setSuccess("");

      if (doctorPhotoFile) {
        const imageFormData =
          new FormData();

        imageFormData.append(
          "image",
          doctorPhotoFile
        );

        const uploadResponse =
          await fetch(
            "/api/uploads/doctor",
            {
              method: "POST",
              body: imageFormData,
            }
          );

        const uploadData =
          await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.message ||
              "Doctor Image Upload করা যায়নি।"
          );
        }

        uploadedDoctorPhoto =
          uploadData.image;
      }

      const settingsPayload = {
        ...settings,
        doctorPhotoUrl:
          removeDoctorPhoto
            ? ""
            : uploadedDoctorPhoto?.url ??
              settings.doctorPhotoUrl ??
              "",
        doctorPhotoPublicId:
          removeDoctorPhoto
            ? ""
            : uploadedDoctorPhoto?.publicId ??
              settings.doctorPhotoPublicId ??
              "",
      };

      const response =
        await fetch(
          "/api/settings",
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                settingsPayload
              ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        if (uploadedDoctorPhoto) {
          await fetch(
            "/api/uploads/doctor",
            {
              method: "DELETE",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                publicId:
                  uploadedDoctorPhoto.publicId,
              }),
            }
          );
        }

        throw new Error(
          data.message
        );
      }

      if (
        previousPhotoPublicId &&
        (uploadedDoctorPhoto ||
          removeDoctorPhoto)
      ) {
        await fetch(
          "/api/uploads/doctor",
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              publicId:
                previousPhotoPublicId,
            }),
          }
        );
      }

      setSuccess(
        "Website Settings সফলভাবে Save হয়েছে।"
      );

      setDoctorPhotoFile(null);
      setRemoveDoctorPhoto(false);

      await loadSettings();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Settings Save করা যায়নি।"
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
    <div>
      <div>
        <p className="text-sm font-semibold text-[#15803D]">
          Website Control
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Website Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Clinic Information, Delivery Charge এবং Website Features এখান থেকে
          নিয়ন্ত্রণ করুন।
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-7 space-y-6"
      >
        {/* General */}
        <section className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Settings2
              size={21}
              className="text-[#14532D]"
            />

            <h2 className="text-xl font-bold">
              General Information
            </h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <input
              required
              value={
                settings.clinicName
              }
              onChange={(e) =>
                updateField(
                  "clinicName",
                  e.target.value
                )
              }
              placeholder="Clinic Name"
              className="rounded-xl border border-gray-200 px-4 py-3"
            />

            <input
              value={
                settings.englishName
              }
              onChange={(e) =>
                updateField(
                  "englishName",
                  e.target.value
                )
              }
              placeholder="English Name"
              className="font-english rounded-xl border border-gray-200 px-4 py-3"
            />

            <input
              value={
                settings.phone
              }
              onChange={(e) =>
                updateField(
                  "phone",
                  e.target.value
                )
              }
              placeholder="Phone"
              className="font-english rounded-xl border border-gray-200 px-4 py-3"
            />

            <input
              value={
                settings.whatsapp
              }
              onChange={(e) =>
                updateField(
                  "whatsapp",
                  e.target.value
                )
              }
              placeholder="WhatsApp"
              className="font-english rounded-xl border border-gray-200 px-4 py-3"
            />

            <input
              type="email"
              value={
                settings.email
              }
              onChange={(e) =>
                updateField(
                  "email",
                  e.target.value
                )
              }
              placeholder="Email"
              className="font-english rounded-xl border border-gray-200 px-4 py-3"
            />

            <input
              value={
                settings.chamberTime
              }
              onChange={(e) =>
                updateField(
                  "chamberTime",
                  e.target.value
                )
              }
              placeholder="Chamber Time"
              className="rounded-xl border border-gray-200 px-4 py-3 sm:col-span-2"
            />

            <textarea
              rows={4}
              value={
                settings.address
              }
              onChange={(e) =>
                updateField(
                  "address",
                  e.target.value
                )
              }
              placeholder="Clinic Address"
              className="resize-none rounded-xl border border-gray-200 px-4 py-3 sm:col-span-2"
            />
          </div>
        </section>

        {/* Doctor Profile */}
        <section className="rounded-[26px] border border-green-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Stethoscope
              size={21}
              className="text-[#14532D]"
            />

            <h2 className="text-xl font-bold">
              Doctor Profile
            </h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                ডাক্তারের নাম
              </label>

              <input
                value={settings.doctorName}
                onChange={(e) =>
                  updateField(
                    "doctorName",
                    e.target.value
                  )
                }
                placeholder="ডা. আপনার নাম"
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Degree
              </label>

              <input
                value={settings.doctorDegree}
                onChange={(e) =>
                  updateField(
                    "doctorDegree",
                    e.target.value
                  )
                }
                placeholder="DHMS / BHMS"
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Professional Qualification
              </label>

              <textarea
                rows={3}
                value={settings.doctorQualification}
                onChange={(e) =>
                  updateField(
                    "doctorQualification",
                    e.target.value
                  )
                }
                placeholder="ডাক্তারের যোগ্যতা ও অভিজ্ঞতা"
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Registration Information
              </label>

              <input
                value={settings.doctorRegistration}
                onChange={(e) =>
                  updateField(
                    "doctorRegistration",
                    e.target.value
                  )
                }
                placeholder="Registration No."
                className="w-full rounded-xl border border-gray-200 px-4 py-3"
              />
            </div>

            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold text-gray-700">
                Professional Portrait Photo
              </p>

              {doctorPhotoPreview && !removeDoctorPhoto ? (
                <div className="relative h-64 w-full max-w-xs overflow-hidden rounded-2xl border border-green-100 bg-green-50">
                  <Image
                    src={doctorPhotoPreview}
                    alt="Doctor portrait preview"
                    fill
                    unoptimized={doctorPhotoPreview.startsWith("blob:")}
                    className="object-cover"
                    sizes="320px"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setDoctorPhotoFile(null);
                      setDoctorPhotoPreview("");
                      setRemoveDoctorPhoto(true);
                    }}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-500 shadow"
                    title="Photo remove করুন"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex max-w-xs cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-[#FAFAF7] px-5 py-10 text-center hover:border-green-300">
                  <ImagePlus
                    size={30}
                    className="text-[#14532D]"
                  />

                  <span className="mt-2 text-sm font-semibold text-gray-700">
                    Professional Photo Upload
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    JPG, PNG, WEBP • Max 5MB
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleDoctorPhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </section>

        {/* Shop */}
        <section className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Store
              size={21}
              className="text-[#14532D]"
            />

            <h2 className="text-xl font-bold">
              Shop Settings
            </h2>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold">
              Delivery Charge
            </p>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm text-gray-600">
                  চুয়াডাঙ্গার ভিতরে
                </span>

                <input
                  type="number"
                  min="0"
                  value={
                    settings.deliveryChargeInside
                  }
                  onChange={(e) =>
                    updateField(
                      "deliveryChargeInside",
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="font-english mt-2 w-full rounded-xl border border-gray-200 px-4 py-3"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">
                  চুয়াডাঙ্গার বাইরে
                </span>

                <input
                  type="number"
                  min="0"
                  value={
                    settings.deliveryChargeOutside
                  }
                  onChange={(e) =>
                    updateField(
                      "deliveryChargeOutside",
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="font-english mt-2 w-full rounded-xl border border-gray-200 px-4 py-3"
                />
              </label>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Checkout পেইজে customer এই দুইটি charge option দেখতে পাবেন।
            </p>
          </div>

          <label className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-[#F7FBF8] p-4">
            <div>
              <p className="font-semibold">
                Product Ordering
              </p>

              <p className="mt-1 text-xs text-gray-500">
                বন্ধ করলে নতুন Order নেওয়া হবে না।
              </p>
            </div>

            <input
              type="checkbox"
              checked={
                settings.shopEnabled
              }
              onChange={(e) =>
                updateField(
                  "shopEnabled",
                  e.target.checked
                )
              }
              className="h-5 w-5"
            />
          </label>
        </section>

        {/* Appointment */}
        <section className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Stethoscope
              size={21}
              className="text-[#14532D]"
            />

            <h2 className="text-xl font-bold">
              Appointment
            </h2>
          </div>

          <label className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-[#F7FBF8] p-4">
            <div>
              <p className="font-semibold">
                Appointment Booking
              </p>

              <p className="mt-1 text-xs text-gray-500">
                বন্ধ করলে নতুন Appointment নেওয়া হবে না।
              </p>
            </div>

            <input
              type="checkbox"
              checked={
                settings.appointmentEnabled
              }
              onChange={(e) =>
                updateField(
                  "appointmentEnabled",
                  e.target.checked
                )
              }
              className="h-5 w-5"
            />
          </label>
        </section>

        {/* Announcement */}
        <section className="rounded-[26px] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Bell
              size={21}
              className="text-[#14532D]"
            />

            <h2 className="text-xl font-bold">
              Announcement
            </h2>
          </div>

          <textarea
            rows={3}
            maxLength={300}
            value={
              settings.announcement
            }
            onChange={(e) =>
              updateField(
                "announcement",
                e.target.value
              )
            }
            placeholder="যেমন: আগামী শুক্রবার Chamber বন্ধ থাকবে।"
            className="mt-5 w-full resize-none rounded-xl border border-gray-200 px-4 py-3"
          />

          <label className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                settings.announcementEnabled
              }
              onChange={(e) =>
                updateField(
                  "announcementEnabled",
                  e.target.checked
                )
              }
              className="h-5 w-5"
            />

            <span className="text-sm font-semibold">
              Announcement Public Website-এ দেখান
            </span>
          </label>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2
              size={18}
            />

            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#14532D] px-6 py-3.5 font-semibold text-white disabled:opacity-60"
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

          Save Settings
        </button>
      </form>
    </div>
  );
}