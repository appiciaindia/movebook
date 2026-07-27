import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customer_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    party_name: {
      type: String,
      required: true,
      trim: true,
    },
    company_name: {
      type: String,
      trim: true,
    },
    gst_no: {
      type: String,
      trim: true,
      sparse: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      sparse: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

CustomerSchema.index({ userId: 1, mobile: 1 }, { unique: true });
CustomerSchema.index(
  { userId: 1, email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: {
        $exists: true,
        $ne: "",
      },
    },
  }
);
CustomerSchema.index(
  { userId: 1, gst_no: 1 },
  {
    unique: true,
    partialFilterExpression: {
      gst_no: {
        $exists: true,
        $ne: "",
      },
    },
  }
);

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
