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
    const customerId = searchParams.get("customerId");

    // ✅ CASE 1: Get Quotations
    if (type === "list") {
      if (!userId) {
        return NextResponse.json(
          {
            success: false,
            message: "User ID is required",
          },
          { status: 400 }
        );
      }

      // Dynamic Filter
      const filter = {
        userId,
      };

      // Agar customerId aayi hai to us customer ki hi quotations lao
      if (customerId) {
        filter.customerId = customerId;
      }

      const data = await Quotation.find(filter).sort({
        createdAt: -1,
      });

      return NextResponse.json({
        success: true,
        data,
      });
    }

    // ✅ CASE 2: Generate Quotation Number
    const quotation_no = await generateQuotationNumber(
      Quotation,
      userId
    );

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

    const quotation_no = await generateQuotationNumber(body.userId);

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

