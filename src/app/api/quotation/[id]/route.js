import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Quotation from "@/models/quotation";

export async function GET(req, context) {
  try {
    await connectDB();

    const params = await context.params;
    const id = params.id;
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const data = await Quotation.findOne({ _id: id, userId });

    if (!data) {
      return NextResponse.json({
        success: false,
        message: "Not found",
      });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.log("ERROR:", error);

    return NextResponse.json({
      success: false,
      message: error.message,
    });
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

    const updated = await Quotation.findOneAndUpdate(
      { _id: id, userId },
      body,
      {
        new: true,
      }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Quotation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
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

    await Quotation.findOneAndDelete({ _id: id, userId });

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
