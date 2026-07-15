import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },
    company_logo: {
      type: String,
      required: true,
    },
    theme_color: {
    type: String,
    default: "#000671",
},
    signature: String,
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    company_name: {
      type: String,
      required: true,
      trim: true,
    },
    tag_line: String,
    whatsapp_number: String,
    contact_number_one: {
      type: String,
      required: true,
      trim: true,
    },
    contact_number_two: String,
    landline: String,
    toll_free: String,
    email: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    website: String,
    gst_number: String,
    pan_number: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    pan_card: {
      type: String,
      required: true,
    },
    state: String,
    city: String,
    jurisdiction: String,
    beneficiary_name: String,
    bank_name: String,
    account_number: String,
    ifsc: String,
    branch: String,
    upi_id_one: String,
    upi_id_two: String,
    phonepay: String,
    affiliated_by: String,
    iso_certificate: String,
    registration_number: String,
  },
  { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema, "user_profile");
