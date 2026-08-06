import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    jti: {
      type: String,
      required: true,
      unique: true,
    },

    deviceId: {
      type: String,
      required: true,
    },

    ip: String,

    browser: String,

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Session =
  mongoose.models?.Session ||
  mongoose.model("Session", SessionSchema);

export default Session;