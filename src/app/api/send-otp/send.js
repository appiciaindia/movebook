import connectDB from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email, mode } = await req.json();

    if (!email) {
      return Response.json({
        success: false,
        message: "Email is required",
      });
    }

    await connectDB();

    const user = await User.findOne({ email });

    // Login
    if (mode === "login" && !user) {
      return Response.json({
        success: false,
        redirectTo: "/signup",
        message: "Account not found.",
      });
    }

    // Signup
    if (mode === "signup" && user) {
      return Response.json({
        success: false,
        redirectTo: "/login",
        message: "Account already exists.",
      });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP in DB
    await Otp.findOneAndUpdate(
      { email },
      {
        email,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
      {
        upsert: true,
        new: true,
      },
    );

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"MoveBook" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Your Login OTP",
      html: `
        <h2>Your OTP is</h2>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    return Response.json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
