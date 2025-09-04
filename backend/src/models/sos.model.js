import { Schema, Types, model } from "mongoose";

const SOSSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  message: {
    type: String,
    default: "Emergency! Need Help."
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending"
  },
  notifiedAuthorities: [{
    type: String
  }], // police station IDs
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const SOS = model("SOS", SOSSchema);
