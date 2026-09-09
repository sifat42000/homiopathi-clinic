import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  isAdminRequest,
} from "@/lib/api-auth";

import {
  deleteCloudinaryImages,
  uploadProductImage,
} from "@/lib/cloudinary";

import type {
  ProductImage,
} from "@/types/product-image";

const MAX_IMAGES = 5;

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const PRODUCT_FOLDER_PREFIX =
  "homeopathy-clinic/products/";

/* =========================
   UPLOAD PRODUCT IMAGES
========================= */

export async function POST(
  request: NextRequest
) {
  const uploadedImages:
    ProductImage[] = [];

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
        {
          status: 403,
        }
      );
    }

    const formData =
      await request.formData();

    const values =
      formData.getAll(
        "images"
      );

    const files: File[] =
      values.filter(
        (
          value
        ): value is File =>
          value instanceof
            File &&
          value.size > 0
      );

    if (
      files.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "কমপক্ষে একটি Image নির্বাচন করুন।",
        },
        {
          status: 400,
        }
      );
    }

    if (
      files.length >
      MAX_IMAGES
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            `একসাথে সর্বোচ্চ ${MAX_IMAGES}টি Image Upload করা যাবে।`,
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       VALIDATE FILES
    ========================= */

    for (
      const file of
      files
    ) {
      if (
        !ALLOWED_TYPES.includes(
          file.type
        )
      ) {
        return NextResponse.json(
          {
            success: false,

            message:
              "শুধু JPG, PNG এবং WEBP Image ব্যবহার করুন।",
          },
          {
            status: 400,
          }
        );
      }

      if (
        file.size >
        MAX_FILE_SIZE
      ) {
        return NextResponse.json(
          {
            success: false,

            message:
              "প্রতিটি Image সর্বোচ্চ 5MB হতে পারবে।",
          },
          {
            status: 400,
          }
        );
      }
    }

    /* =========================
       UPLOAD
    ========================= */

    for (
      const file of
      files
    ) {
      const image =
        await uploadProductImage(
          file
        );

      /*
        শুধু আমাদের Product
        Folder-এর Image accept হবে।
      */
      if (
        !image.publicId.startsWith(
          PRODUCT_FOLDER_PREFIX
        )
      ) {
        throw new Error(
          "Invalid Cloudinary Product Image Path."
        );
      }

      uploadedImages.push(
        image
      );
    }

    return NextResponse.json(
      {
        success: true,

        images:
          uploadedImages,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Product Image Upload Error:",
      error
    );

    /*
      কয়েকটা Image upload হওয়ার
      পরে error হলে rollback।
    */
    if (
      uploadedImages.length >
      0
    ) {
      try {
        const uploadedPublicIds:
          string[] =
          uploadedImages.map(
            (image) =>
              image.publicId
          );

        await deleteCloudinaryImages(
          uploadedPublicIds
        );
      } catch (
        cleanupError
      ) {
        console.error(
          "Upload Rollback Error:",
          cleanupError
        );
      }
    }

    return NextResponse.json(
      {
        success: false,

        message:
          "Product Image Upload করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   DELETE PRODUCT IMAGES
========================= */

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
        {
          status: 403,
        }
      );
    }

    const body:
      unknown =
      await request.json();

    /*
      প্রথমে body object কিনা check।
    */

    if (
      !body ||
      typeof body !==
        "object"
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid Request Body.",
        },
        {
          status: 400,
        }
      );
    }

    const requestBody =
      body as {
        publicIds?: unknown;
      };

    /*
      publicIds Array কিনা check।
    */

    if (
      !Array.isArray(
        requestBody.publicIds
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "publicIds required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
      এখানে explicit unknown[]
      বানানো হচ্ছে।
    */

    const rawPublicIds:
      unknown[] =
      requestBody.publicIds;

    /*
      unknown[] → string[]
    */

    const validPublicIds:
      string[] =
      rawPublicIds
        .filter(
          (
            value
          ): value is string =>
            typeof value ===
              "string"
        )
        .map(
          (value) =>
            value.trim()
        )
        .filter(
          (
            value
          ): value is string =>
            value.length > 0
        );

    /*
      Duplicate remove।
      এখানে Set<string>
      explicitly বলা হয়েছে।
    */

    const publicIds:
      string[] =
      Array.from(
        new Set<string>(
          validPublicIds
        )
      );

    if (
      publicIds.length ===
        0 ||
      publicIds.length >
        MAX_IMAGES
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            `১ থেকে ${MAX_IMAGES}টি valid Product Image ID দিন।`,
        },
        {
          status: 400,
        }
      );
    }

    /*
      এখন publicId নিশ্চিতভাবে
      string type।
    */

    const invalidId:
      string | undefined =
      publicIds.find(
        (
          publicId: string
        ) =>
          !publicId.startsWith(
            PRODUCT_FOLDER_PREFIX
          )
      );

    if (invalidId) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Invalid Product Image Path. অন্য Cloudinary Folder-এর Image Delete করা যাবে না।",
        },
        {
          status: 400,
        }
      );
    }

    /*
      publicIds এখন string[]
      তাই TypeScript error হবে না।
    */

    await deleteCloudinaryImages(
      publicIds
    );

    return NextResponse.json({
      success: true,

      message:
        "Product Images Delete হয়েছে।",
    });
  } catch (error) {
    console.error(
      "Product Image Delete Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Product Image Delete করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}