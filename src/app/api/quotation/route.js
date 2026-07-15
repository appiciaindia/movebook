import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { generateQuotationNumber } from "@/lib/helper";
import Quotation from "@/models/quotation";

// GET (Fetch Quotation)

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const userId = searchParams.get("userId");

    // ✅ CASE 1: Get All Quotations (Listing Page)
    if (type === "list") {
      if (!userId) {
        return NextResponse.json(
          { success: false, message: "User ID is required" },
          { status: 400 }
        );
      }

      const data = await Quotation.find({ userId }).sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        data,
      });
    }

    // ✅ CASE 2: Generate Quotation Number (Form Page)
    const quotation_no = await generateQuotationNumber(Quotation, userId);

    return NextResponse.json({
      success: true,
      quotation_no,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}

// POST (Create / Update)
export async function POST(req) {
  try {
    await connectDB();

      const body = await req.json();
    if (!body.userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const quotation_no = await generateQuotationNumber(Quotation, body.userId);

    const newQuotation = await Quotation.create({
      ...body,
      userId: body.userId,
      quotation_number: quotation_no,
    });

    return NextResponse.json({
      success: true,
      message: "Quotation created successfully",
      data: newQuotation,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}

