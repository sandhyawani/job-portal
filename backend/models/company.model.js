import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    website: {
      type: String,
      trim: true
    },

    location: {
      type: String,
      trim: true
    },

    logo: {
      type: String
    },

    email: {
      type: String,
      lowercase: true,
      trim: true
    },

    registrationNumber: {
      type: String,
      trim: true
    },

    trustScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },

    trustLevel: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "LOW"
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", companySchema);
