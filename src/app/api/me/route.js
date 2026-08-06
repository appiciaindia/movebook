import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

import { getCurrentUser } from "@/lib/auth";

export async function GET() {

  await connectDB();

  const authUser = await getCurrentUser();

  if (!authUser) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 401,
      }
    );
  }

  const user = await User.findById(authUser.userId).select("-password");

  if (!user) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    success: true,
    user,
  });
}