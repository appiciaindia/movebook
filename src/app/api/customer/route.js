import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Customer from "@/models/Customer";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
const pinPattern = /^[0-9]{5,6}$/;
const mobilePattern = /^[0-9]{10}$/;

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const query = { userId };

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { party_name: regex },
        { company_name: regex },
        { mobile: regex },
        { email: regex },
        { gst_no: regex },
        { city: regex },
      ];
    }

    const customers = await Customer.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: customers });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

function createCustomerId() {
  return `CUST${Date.now().toString().slice(-8)}`;
}

export async function POST(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const queryUserId = url.searchParams.get("userId");
    const body = await req.json();
    const userId = body.userId || queryUserId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    body.userId = userId;

    const {
      party_name,
      company_name,
      gst_no,
      email,
      mobile,
      address,
      city,
      state,
      pincode,
    } = body;

    const errors = [];

    if (!party_name || !party_name.trim()) {
      errors.push("Party Name is required");
    }
    if (!mobile || !mobile.trim()) {
      errors.push("Mobile is required");
    } else if (!mobilePattern.test(mobile.trim())) {
      errors.push("Enter a valid 10-digit mobile number");
    }
    if (!city || !city.trim()) {
      errors.push("City is required");
    }
    if (email && !emailPattern.test(email.trim())) {
      errors.push("Enter a valid email address");
    }
    if (gst_no && !gstPattern.test(gst_no.trim())) {
      errors.push("Enter a valid GST number");
    }
    if (pincode && !pinPattern.test(pincode.trim())) {
      errors.push("Enter a valid pincode");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: errors.join(". ") },
        { status: 400 }
      );
    }

    const searchConditions = [
      { mobile: mobile.trim() },
    ];

    if (email?.trim()) {
      searchConditions.push({ email: email.trim().toLowerCase() });
    }
    if (gst_no?.trim()) {
      searchConditions.push({ gst_no: gst_no.trim().toUpperCase() });
    }

    if (!body.userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const existing = await Customer.findOne({ $or: searchConditions, userId: body.userId });

    if (existing) {
      const duplicateFields = [];
      if (existing.mobile === mobile.trim()) duplicateFields.push("mobile");
      if (email?.trim() && existing.email === email.trim().toLowerCase()) duplicateFields.push("email");
      if (gst_no?.trim() && existing.gst_no === gst_no.trim().toUpperCase()) duplicateFields.push("GST number");

      return NextResponse.json(
        {
          success: false,
          message: `Customer already exists with same ${duplicateFields.join(" and ")}. Customer ID: ${existing.customer_id}`,
        },
        { status: 400 }
      );
    }

    const customer = await Customer.create({
      userId: body.userId,
      customer_id: createCustomerId(),
      party_name: party_name.trim(),
      company_name: company_name?.trim() || "",
      gst_no: gst_no?.trim().toUpperCase() || "",
      email: email?.trim().toLowerCase() || "",
      mobile: mobile.trim(),
      address: address?.trim() || "",
      city: city.trim(),
      state: state?.trim() || "",
      pincode: pincode?.trim() || "",
    });

    return NextResponse.json({
      success: true,
      message: "Customer saved successfully",
      data: customer,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
