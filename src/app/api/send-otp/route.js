import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import OTP from "@/models/Otp";
import nodemailer from "nodemailer";

export async function POST(req) {
  await connectDB();

  const { email } = await req.json();

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  await OTP.deleteMany({ email });

  await OTP.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

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

  console.log("OTP:", otp);

  return NextResponse.json({
    success: true,
    message: "OTP Sent",
  });
}