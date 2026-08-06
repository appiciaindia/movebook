import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/lib/db";
import Session from "@/models/Session";
import { verifyAccessToken } from "@/lib/jwt";

export async function POST() {

  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value;

  if (token) {

    const payload = await verifyAccessToken(token);

    if (payload) {

      await connectDB();

      await Session.deleteOne({
        jti: payload.jti,
      });

    }

  }

  cookieStore.delete("access_token");

  return NextResponse.json({
    success: true,
  });

}