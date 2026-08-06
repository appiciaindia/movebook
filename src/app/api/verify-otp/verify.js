import connectDB from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";

export async function POST(req) {
  try {
    const { email, otp, mode } = await req.json();

    if (!email || !otp) {
      return Response.json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    await connectDB();

    // OTP Record
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return Response.json({
        success: false,
        message: "OTP not found.",
      });
    }

    // OTP Match
    if (otpRecord.otp !== otp) {
      return Response.json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // OTP Expiry
    if (new Date() > otpRecord.expiresAt) {
      return Response.json({
        success: false,
        message: "OTP has expired.",
      });
    }

    let user = await User.findOne({ email });

    // Signup
    if (mode === "signup") {
      if (!user) {
        user = await User.create({
          email,
          isVerified: true,
        });
      } else {
        user.isVerified = true;
        await user.save();
      }

      // OTP delete
      await Otp.deleteOne({ _id: otpRecord._id });

      return Response.json({
        success: true,
        message: "OTP Verified",
        user,
        redirectTo: "/register",
      });
    }

    // Login
    if (!user) {
      return Response.json({
        success: false,
        message: "Account not found.",
      });
    }

    user.isVerified = true;
    await user.save();

    // OTP delete
    await Otp.deleteOne({ _id: otpRecord._id });

    return Response.json({
      success: true,
      message: "OTP Verified",
      user,
      redirectTo: "/dashboard",
    });

  } catch (error) {
    console.error("VERIFY ERROR:", error);

    return Response.json({
      success: false,
      message: error.message,
    });
  }
}