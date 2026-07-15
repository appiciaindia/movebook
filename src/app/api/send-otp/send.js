import connectDB from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";

export async function POST(req) {
  try {

    const { phone, mode } = await req.json();

    if (!phone) {
      return Response.json({
        success: false,
        message: "Phone number is required",
      });
    }

    await connectDB();

    // LOGIN FLOW
    if (mode === "login") {

      const existingUser = await User.findOne({
        phone
      });

      if (!existingUser) {

        return Response.json({
          success: false,
          redirectTo: "/signup",
          message:
            "Account not found. Please create an account first.",
        });

      }

    }

    // SIGNUP FLOW
    if (mode === "signup") {

      const existingUser = await User.findOne({
        phone
      });

      if (existingUser) {

        return Response.json({
          success: false,
          redirectTo: "/login",
          message:
            "Account already exists. Please login.",
        });

      }

    }

    // Remove previous OTP
    await Otp.deleteMany({
      phone
    });

    const otp = Math.floor(
      1000 + Math.random() * 9000
    ).toString();

    const expiresAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await Otp.create({
      phone,
      otp,
      expiresAt
    });

    // OTP provider code
    // ...

    return Response.json({

      success: true,

      message:
        "OTP sent successfully",

    });

  }

  catch (error) {

    return Response.json({

      success: false,

      message:
        error.message

    });

  }

}