import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "applied",
        "under_review",
        "shortlisted",
        "interview",
        "offer",
        "hired",
        "rejected",
        "withdrawn",
      ],
      default: "applied",
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true }
);

// Compound unique index preventing duplicate applications for the same job by a single applicant
applicationSchema.index({ applicant: 1, job: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);