import {
  v2 as cloudinary,
  type UploadApiResponse,
} from "cloudinary";

import type {
  ProductImage,
} from "@/types/product-image";

import type {
  ReviewImage,
} from "@/types/review";

let configured = false;

function configureCloudinary() {
  if (configured) {
    return;
  }

  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME;

  const apiKey =
    process.env.CLOUDINARY_API_KEY;

  const apiSecret =
    process.env.CLOUDINARY_API_SECRET;

  if (
    !cloudName ||
    !apiKey ||
    !apiSecret
  ) {
    throw new Error(
      "Cloudinary Environment Variables পাওয়া যায়নি."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  configured = true;
}

/*
  ==========================
  Product Image Upload
  ==========================
*/
export async function uploadProductImage(
  file: File
): Promise<ProductImage> {
  configureCloudinary();

  const bytes =
    await file.arrayBuffer();

  const buffer =
    Buffer.from(bytes);

  const result =
    await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder:
                "homeopathy-clinic/products",

              resource_type:
                "image",

              unique_filename:
                true,

              overwrite:
                false,
            },

            (error, result) => {
              if (
                error ||
                !result
              ) {
                reject(
                  error ??
                    new Error(
                      "Cloudinary upload failed"
                    )
                );

                return;
              }

              resolve(result);
            }
          );

        uploadStream.end(
          buffer
        );
      }
    );

  return {
    publicId:
      result.public_id,

    url:
      result.secure_url,

    width:
      result.width,

    height:
      result.height,

    format:
      result.format,
  };
}

/*
  ==========================
  Review Image Upload
  ==========================
*/
export async function uploadReviewImage(
  file: File
): Promise<ReviewImage> {
  configureCloudinary();

  const bytes =
    await file.arrayBuffer();

  const buffer =
    Buffer.from(bytes);

  const result =
    await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder:
                "homeopathy-clinic/reviews",

              resource_type:
                "image",

              unique_filename:
                true,

              overwrite:
                false,
            },

            (error, result) => {
              if (
                error ||
                !result
              ) {
                reject(
                  error ??
                    new Error(
                      "Review image upload failed"
                    )
                );

                return;
              }

              resolve(result);
            }
          );

        uploadStream.end(
          buffer
        );
      }
    );

  return {
    publicId:
      result.public_id,

    url:
      result.secure_url,

    width:
      result.width,

    height:
      result.height,

    format:
      result.format,
  };
}

/*
  ==========================
  Single Image Delete
  ==========================
*/
export async function deleteCloudinaryImage(
  publicId: string
) {
  configureCloudinary();

  return cloudinary.uploader.destroy(
    publicId,
    {
      invalidate: true,
      resource_type: "image",
    }
  );
}

/*
  ==========================
  Multiple Images Delete
  ==========================
*/
export async function deleteCloudinaryImages(
  publicIds: string[]
) {
  if (
    publicIds.length === 0
  ) {
    return;
  }

  await Promise.all(
    publicIds.map(
      (publicId) =>
        deleteCloudinaryImage(
          publicId
        )
    )
  );
}