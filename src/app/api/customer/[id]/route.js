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

export async function PUT(req, context) {
  try {
    await connectDB();

    const params = await context.params;
    const id = params.id;

    const body = await req.json();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Mobile Duplicate Check
    const mobileExists = await Customer.findOne({
      _id: { $ne: id },
      userId,
      mobile: body.mobile.trim(),
    });

    if (mobileExists) {
      return NextResponse.json(
        {
          success: false,
          message: `Mobile number is already registered. Customer ID: ${mobileExists.customer_id}`,
        },
        { status: 400 }
      );
    }

    // Email Duplicate Check
    if (body.email?.trim()) {
      const emailExists = await Customer.findOne({
        _id: { $ne: id },
        userId,
        email: body.email.trim().toLowerCase(),
      });

      if (emailExists) {
        return NextResponse.json(
          {
            success: false,
            message: `Email is already registered. Customer ID: ${emailExists.customer_id}`,
          },
          { status: 400 }
        );
      }
    }

    // GST Duplicate Check
    if (body.gst_no?.trim()) {
      const gstExists = await Customer.findOne({
        _id: { $ne: id },
        userId,
        gst_no: body.gst_no.trim().toUpperCase(),
      });

      if (gstExists) {
        return NextResponse.json(
          {
            success: false,
            message: `GST number is already registered. Customer ID: ${gstExists.customer_id}`,
          },
          { status: 400 }
        );
      }
    }

    // Normalize values
    body.email = body.email?.trim()
      ? body.email.trim().toLowerCase()
      : undefined;

    body.gst_no = body.gst_no?.trim()
      ? body.gst_no.trim().toUpperCase()
      : undefined;

    const updated = await Customer.findOneAndUpdate(
      { _id: id, userId },
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
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
      data: updated,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];

      const messages = {
        mobile: "Mobile number is already registered.",
        email: "Email is already registered.",
        gst_no: "GST number is already registered.",
      };

      return NextResponse.json(
        {
          success: false,
          message: messages[field] || "Duplicate record found.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
export async function DELETE(req, context) {
  try {
    await connectDB();

    const params = await context.params; // 👈 DIRECT await

    const id = params.id;

    console.log("DELETE ID:", id);

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!id) {
      return Response.json({
        success: false,
        message: "ID missing",
      });
    }

    if (!userId) {
      return Response.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    await Customer.findOneAndDelete({ _id: id, userId });

    return Response.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}