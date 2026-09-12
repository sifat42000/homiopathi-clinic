import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getDb,
} from "@/lib/mongodb";

import {
  isAdminRequest,
} from "@/lib/api-auth";

import {
  createSlug,
} from "@/lib/slug";

import {
  serializeHealthTip,
  type HealthTipDocument,
} from "@/lib/db/health-tips";

export async function GET(
  request: NextRequest
) {
  try {
    const adminMode =
      request.nextUrl.searchParams.get(
        "admin"
      ) === "1";

    if (adminMode) {
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
    }

    const db =
      await getDb();

    const tips =
      await db
        .collection<HealthTipDocument>(
          "healthTips"
        )
        .find(
          adminMode
            ? {}
            : {
                active: true,
              }
        )
        .sort({
          createdAt: -1,
        })
        .toArray();

    return NextResponse.json({
      success: true,

      healthTips:
        tips.map(
          (tip) =>
            serializeHealthTip(
              tip
            )
        ),
    });
  } catch (error) {
    console.error(
      "GET Health Tips Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Health Tips load করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}

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
        {
          status: 403,
        }
      );
    }

    const body =
      await request.json();

    const title =
      String(
        body.title ?? ""
      ).trim();

    const excerpt =
      String(
        body.excerpt ?? ""
      ).trim();

    const category =
      String(
        body.category ?? ""
      ).trim();

    const readTime =
      String(
        body.readTime ?? ""
      ).trim();

    const date =
      String(
        body.date ?? ""
      ).trim();

    const author =
      String(
        body.author ?? ""
      ).trim();

    const intro =
      String(
        body.intro ?? ""
      ).trim();

    if (
      !title ||
      !excerpt ||
      !category ||
      !readTime ||
      !date ||
      !author ||
      !intro
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "সব প্রয়োজনীয় Article Information দিন।",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Array.isArray(
        body.sections
      ) ||
      body.sections.length ===
        0
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "কমপক্ষে একটি Article Section দিন।",
        },
        {
          status: 400,
        }
      );
    }

    const sections =
      body.sections
        .map(
          (
            section: unknown
          ) => {
            if (
              !section ||
              typeof section !==
                "object"
            ) {
              return null;
            }

            const item =
              section as {
                heading?: unknown;
                content?: unknown;
              };

            const heading =
              String(
                item.heading ??
                  ""
              ).trim();

            const content =
              String(
                item.content ??
                  ""
              ).trim();

            if (
              !heading ||
              !content
            ) {
              return null;
            }

            return {
              heading,
              content,
            };
          }
        )
        .filter(
          (
            section: {
              heading: string;
              content: string;
            } | null
          ): section is {
            heading: string;
            content: string;
          } =>
            section !== null
        );

    if (
      sections.length ===
      0
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Article Section সঠিকভাবে দিন।",
        },
        {
          status: 400,
        }
      );
    }

    let slug =
      createSlug(title);

    if (!slug) {
      slug =
        `health-tip-${Date.now()}`;
    }

    const db =
      await getDb();

    const collection =
      db.collection<HealthTipDocument>(
        "healthTips"
      );

    const duplicate =
      await collection.findOne({
        slug,
      });

    if (duplicate) {
      slug =
        `${slug}-${Date.now()
          .toString()
          .slice(-5)}`;
    }

    const now =
      new Date();

    const document:
      HealthTipDocument = {
      id:
        Date.now(),

      title,

      slug,

      excerpt,

      category,

      readTime,

      date,

      author,

      intro,

      sections,

      active: true,

      createdAt: now,

      updatedAt: now,
    };

    const result =
      await collection.insertOne(
        document
      );

    const created =
      await collection.findOne({
        _id:
          result.insertedId,
      });

    if (!created) {
      throw new Error(
        "Health Tip creation failed"
      );
    }

    return NextResponse.json(
      {
        success: true,

        healthTip:
          serializeHealthTip(
            created
          ),
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST Health Tip Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Health Tip তৈরি করা যায়নি।",
      },
      {
        status: 500,
      }
    );
  }
}