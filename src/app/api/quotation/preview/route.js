import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getQuotationPreviewNumber } from "@/lib/helper";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({
      success: false,
      message: "User ID is required",
    });
  }

  const quotation_number = await getQuotationPreviewNumber(userId);

  return NextResponse.json({
    success: true,
    quotation_number,
  });
}