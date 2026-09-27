import mongoose from "mongoose";

const externalApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      enum: ["LinkedIn", "Naukri", "Company Website", "Indeed", "Wellfound", "Referral", "Other"],
      default: "LinkedIn",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["applied", "review", "interview", "offer", "rejected"],
      default: "applied",
    },
    jobUrl: {
      type: String,
      trim: true,
      default: "",
    },
    salary: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const ExternalApplication = mongoose.model(
  "ExternalApplication",
  externalApplicationSchema
);
