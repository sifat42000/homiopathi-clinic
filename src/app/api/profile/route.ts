import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getDb,
} from "@/lib/mongodb";

import {
  getApiSession,
} from "@/lib/api-auth";

import {
  ensureCustomerProfileIndexes,
  type CustomerProfileDocument,
} from "@/lib/db/customer-profiles";

/* =========================
   GET PROFILE
========================= */

export async function GET(
  request: NextRequest
) {
  try {
    const session =
      await getApiSession(
        request.headers
      );

    if (!session) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Login required.",
        },
        {
          status: 401,
        }
      );
    }

    await ensureCustomerProfileIndexes();

    const db =
      await getDb();

    const profiles =
      db.collection<CustomerProfileDocument>(
        "customerProfiles"
      );

    const profile =
      await profiles.findOne({
        userId:
          session.user.id,
      });

    /*
      Registration-এর সময় phone
      Better Auth user field-এ থাকলে
      initial value হিসেবে ব্যবহার করব।
    */
    const authUser =
      session.user as typeof session.user & {
        phone?: string;
      };

    if (!profile) {
      return NextResponse.json({
        success: true,

        profile: {
          userId:
            session.user.id,

          name:
            session.user.name ??
            "",

          email:
            session.user.email,

          phone:
            authUser.phone ??
            "",

          division: "",

          district: "",

          area: "",

          address: "",
        },
      });
    }

    return NextResponse.json({
      success: true,

      profile: {
        userId:
          profile.userId,

        name:
          profile.name,

        email:
          session.user.email,

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

        createdAt:
          profile.createdAt.toISOString(),

        updatedAt:
          profile.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error(
      "GET Profile Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Profile load করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   UPDATE PROFILE
========================= */

export async function PATCH(
  request: NextRequest
) {
  try {
    const session =
      await getApiSession(
        request.headers
      );

    if (!session) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Login required.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const name =
      String(
        body.name ?? ""
      ).trim();

    const phone =
      String(
        body.phone ?? ""
      )
        .replace(
          /\D/g,
          ""
        )
        .trim();

    const division =
      String(
        body.division ?? ""
      ).trim();

    const district =
      String(
        body.district ?? ""
      ).trim();

    const area =
      String(
        body.area ?? ""
      ).trim();

    const address =
      String(
        body.address ?? ""
      ).trim();

    if (
      name.length < 2 ||
      name.length > 100
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "নাম সঠিকভাবে দিন।",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !/^01[3-9]\d{8}$/.test(
        phone
      )
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "সঠিক ১১ সংখ্যার Mobile Number দিন।",
        },
        {
          status: 400,
        }
      );
    }

    if (
      division.length > 100 ||
      district.length > 100 ||
      area.length > 150 ||
      address.length > 500
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Address Information অনেক বড় হয়েছে।",
        },
        {
          status: 400,
        }
      );
    }

    await ensureCustomerProfileIndexes();

    const db =
      await getDb();

    const profiles =
      db.collection<CustomerProfileDocument>(
        "customerProfiles"
      );

    const existing =
      await profiles.findOne({
        userId:
          session.user.id,
      });

    const now =
      new Date();

    await profiles.updateOne(
      {
        userId:
          session.user.id,
      },

      {
        $set: {
          name,

          phone,

          division,

          district,

          area,

          address,

          updatedAt:
            now,
        },

        $setOnInsert: {
          userId:
            session.user.id,

          createdAt:
            now,
        },
      },

      {
        upsert: true,
      }
    );

    return NextResponse.json({
      success: true,

      message:
        existing
          ? "Profile Update হয়েছে।"
          : "Profile তৈরি হয়েছে।",
    });
  } catch (error) {
    console.error(
      "PATCH Profile Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Profile Update করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}