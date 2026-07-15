import connectDB from "@/lib/db";
import Customer from "@/models/Customer";
import { NextResponse } from "next/server";

export async function GET(req, context) {

  try {

    await connectDB();

    const { id } = await context.params;

    const customer = await Customer.findById(id);

    if (!customer) {

      return NextResponse.json(
        {
          success: false,
          message: "Customer not found",
        },
        { status: 404 }
      );

    }

    return NextResponse.json({
      success: true,
      data: customer,
    });

  }

  catch (error) {

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );

  }

}