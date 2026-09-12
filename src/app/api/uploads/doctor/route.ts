import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  deleteCloudinaryImage,
  uploadDoctorImage,
} from "@/lib/cloudinary";

import {
  isAdminRequest,
} from "@/lib/api-auth";

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const DOCTOR_FOLDER_PREFIX =
  "homeopathy-clinic/doctor/";

export async function POST(
  request: NextRequest
) {
  try {
    const admin =
      await isAdminRequest(
        request.headers
      );

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin access required.",
        },
        { status: 403 }
      );
    }

    const formData =
      await request.formData();

    const value = formData.get(
      "image"
    );

    if (
      !(value instanceof File) ||
      value.size === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "একটি Doctor Image নির্বাচন করুন।",
        },
        { status: 400 }
      );
    }

    if (
      !ALLOWED_TYPES.includes(
        value.type
      ) ||
      value.size > MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "শুধু JPG, PNG অথবা WEBP Image ব্যবহার করুন। সর্বোচ্চ 5MB।",
        },
        { status: 400 }
      );
    }

    const image =
      await uploadDoctorImage(value);

    if (
      !image.publicId.startsWith(
        DOCTOR_FOLDER_PREFIX
      )
    ) {
      throw new Error(
        "Invalid Doctor Image Path."
      );
    }

    return NextResponse.json({
      success: true,
      image,
    }, { status: 201 });
  } catch (error) {
    console.error(
      "Doctor Image Upload Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Doctor Image Upload করা যায়নি।",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  try {
    const admin =
      await isAdminRequest(
        request.headers
      );

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin access required.",
        },
        { status: 403 }
      );
    }

    const body =
      await request.json();

    const publicId = String(
      body.publicId ?? ""
    ).trim();

    if (
      !publicId.startsWith(
        DOCTOR_FOLDER_PREFIX
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid Doctor Image Path.",
        },
        { status: 400 }
      );
    }

    await deleteCloudinaryImage(
      publicId
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Doctor Image Delete Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Doctor Image Delete করা যায়নি।",
      },
      { status: 500 }
    );
  }
}