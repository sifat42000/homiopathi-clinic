import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getWebsiteSettings,
  saveWebsiteSettings,
} from "@/lib/db/settings";

import {
  isAdminRequest,
} from "@/lib/api-auth";

import type {
  WebsiteSettings,
} from "@/types/website-settings";

export async function GET() {
  try {
    const settings =
      await getWebsiteSettings();

    return NextResponse.json({
      success: true,

      settings,
    }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error(
      "GET Settings Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Website Settings load করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
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

    const body =
      await request.json();

    const deliveryCharge =
      Number(
        body.deliveryCharge
      );

    const deliveryChargeInside =
      Number(
        body.deliveryChargeInside ??
          deliveryCharge
      );

    const deliveryChargeOutside =
      Number(
        body.deliveryChargeOutside ??
          160
      );

    if (
      !Number.isFinite(
        deliveryCharge
      ) ||
      !Number.isFinite(
        deliveryChargeInside
      ) ||
      !Number.isFinite(
        deliveryChargeOutside
      ) ||
      deliveryCharge < 0 ||
      deliveryCharge > 10000 ||
      deliveryChargeInside < 0 ||
      deliveryChargeInside > 10000 ||
      deliveryChargeOutside < 0 ||
      deliveryChargeOutside > 10000
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Delivery Charge সঠিক নয়।",
        },
        {
          status: 400,
        }
      );
    }

    const settings: WebsiteSettings =
      {
        clinicName:
          String(
            body.clinicName ??
              ""
          )
            .trim()
            .slice(0, 100),

        englishName:
          String(
            body.englishName ??
              ""
          )
            .trim()
            .slice(0, 100),

        doctorName:
          String(
            body.doctorName ??
              ""
          )
            .trim()
            .slice(0, 100),

        doctorDegree:
          String(
            body.doctorDegree ??
              ""
          )
            .trim()
            .slice(0, 200),

        doctorQualification:
          String(
            body.doctorQualification ??
              ""
          )
            .trim()
            .slice(0, 500),

        doctorRegistration:
          String(
            body.doctorRegistration ??
              ""
          )
            .trim()
            .slice(0, 200),

        doctorPhotoUrl:
          String(
            body.doctorPhotoUrl ??
              ""
          ).trim(),

        doctorPhotoPublicId:
          String(
            body.doctorPhotoPublicId ??
              ""
          ).trim(),

        phone:
          String(
            body.phone ?? ""
          )
            .trim()
            .slice(0, 30),

        whatsapp:
          String(
            body.whatsapp ??
              ""
          )
            .trim()
            .slice(0, 30),

        email:
          String(
            body.email ?? ""
          )
            .trim()
            .slice(0, 150),

        address:
          String(
            body.address ?? ""
          )
            .trim()
            .slice(0, 500),

        chamberTime:
          String(
            body.chamberTime ??
              ""
          )
            .trim()
            .slice(0, 200),

        deliveryCharge:
          deliveryChargeInside,

        deliveryChargeInside,

        deliveryChargeOutside,

        announcement:
          String(
            body.announcement ??
              ""
          )
            .trim()
            .slice(0, 300),

        announcementEnabled:
          Boolean(
            body.announcementEnabled
          ),

        appointmentEnabled:
          Boolean(
            body.appointmentEnabled
          ),

        shopEnabled:
          Boolean(
            body.shopEnabled
          ),
      };

    if (
      !settings.clinicName
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Clinic Name required.",
        },
        {
          status: 400,
        }
      );
    }

    await saveWebsiteSettings(
      settings
    );

    return NextResponse.json({
      success: true,

      message:
        "Website Settings MongoDB-তে Save হয়েছে।",
    });
  } catch (error) {
    console.error(
      "PATCH Settings Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Settings Save করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}