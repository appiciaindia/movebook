import connectDB from "@/lib/db";
import Otp from "@/models/Otp";
import User from "@/models/User";

export async function POST(req) {
  try {

    const { phone, otp, mode } = await req.json();
console.log("MODE:", mode);
    const normalizedPhone =
      typeof phone === "string"
        ? phone.trim()
        : "";

    await connectDB();

    const activeRecord = await Otp.findOne({
      phone: normalizedPhone,
      otp,
    });

    if (!activeRecord) {
      return Response.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (new Date() > activeRecord.expiresAt) {
      return Response.json({
        success: false,
        message: "OTP expired",
      });
    }

    await Otp.deleteMany({
      phone: normalizedPhone,
    });

    let user = await User.findOne({
      phone: normalizedPhone,
    });

    if (!user) {
      user = await User.create({
        phone: normalizedPhone,
      });
    }
console.log(mode);
    return Response.json({

      success: true,

      message: "OTP verified",

      user,

      redirectTo:
        mode === "signup"
          ? "/register"
          : "/dashboard",

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