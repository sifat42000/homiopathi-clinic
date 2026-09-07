import {
  NextResponse,
} from "next/server";

import clientPromise, {
  getDb,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export async function GET() {
  try {
    await clientPromise;

    const db = getDb();

    await db.command({
      ping: 1,
    });

    return NextResponse.json({
      success: true,

      message:
        "MongoDB connected successfully",

      database:
        db.databaseName,
    });
  } catch (error) {
    console.error(
      "MongoDB Health Check Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Database connection failed",
      },
      {
        status: 500,
      }
    );
  }
}