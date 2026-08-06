import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

import connectDB from "@/lib/db";
import OTP from "@/models/Otp";
import User from "@/models/User";
import Session from "@/models/Session";

import { createAccessToken } from "@/lib/jwt";
import { ACCESS_TOKEN, COOKIE_OPTIONS } from "@/lib/constants";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { email, otp, mode } = body;

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and OTP are required.",
        },
        {
          status: 400,
        },
      );
    }

    // Device Id
    const deviceId = body.deviceId || req.headers.get("user-agent") || uuid();

    // OTP
    const otpDoc = await OTP.findOne({
      email: email.toLowerCase(),
    });

    if (!otpDoc) {
      return NextResponse.json({
        success: false,
        message: "OTP not found.",
      });
    }

    if (otpDoc.otp !== otp) {
      return NextResponse.json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (new Date() > otpDoc.expiresAt) {
      return NextResponse.json({
        success: false,
        message: "OTP has expired.",
      });
    }

    let user = await User.findOne({
      email: email.toLowerCase(),
    });

    // Signup
    if (mode === "signup") {
      if (!user) {
        user = await User.create({
          email: email.toLowerCase(),
          isVerified: true,
          isProfileCompleted: false,
        });
      } else {
        user.isVerified = true;
        await user.save();
      }

      await OTP.deleteOne({
        _id: otpDoc._id,
      });

      return NextResponse.json({
        success: true,
        redirectTo: "/register",
      });
    }

    // Login
    if (mode === "login") {
      if (!user) {
        return NextResponse.json({
          success: false,
          message: "Account not found.",
        });
      }

      // User must complete registration first
      if (!user.isProfileCompleted) {
        return NextResponse.json({
          success: false,
          message: "Please Create Your Account.",
          redirectTo: "/signup",
        });
      }

      user.isVerified = true;
      await user.save();
    }

    // Remove old session of same device
    await Session.deleteOne({
      userId: user._id,
      deviceId,
    });

    // Active Sessions
    const sessions = await Session.find({
      userId: user._id,
    }).sort({
      createdAt: 1,
    });

    const maxDevice = Number(process.env.MAX_DEVICE_LOGIN || 3);

    if (sessions.length >= maxDevice) {
      await Session.deleteOne({
        _id: sessions[0]._id,
      });
    }

    // JWT
    const jti = uuid();

    const token = await createAccessToken(user, jti);

    // Save Session
    await Session.create({
      userId: user._id,
      jti,
      deviceId,
      ip: req.headers.get("x-forwarded-for") || "",
      browser: req.headers.get("user-agent") || "",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Delete OTP
    await OTP.deleteOne({
      _id: otpDoc._id,
    });

    // Cookie
    const cookieStore = await cookies();

    cookieStore.set(ACCESS_TOKEN, token, COOKIE_OPTIONS);

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
      redirectTo: mode === "signup" ? "/register" : "/dashboard",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
