import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
  {
    email: String,
    phone: String,
    otp: String,
    expiresAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Otp || mongoose.model("Otp", OtpSchema);