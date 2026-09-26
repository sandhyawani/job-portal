import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

export const ALLOWED_TRANSITIONS = {
  applied: ["under_review", "rejected", "withdrawn"],
  pending: ["under_review", "rejected", "withdrawn"], // Legacy alias
  under_review: ["shortlisted", "rejected"],
  shortlisted: ["interview", "rejected"],
  interview: ["offer", "rejected"],
  offer: ["hired", "rejected"],
  hired: [],
  rejected: [],
  withdrawn: [],
};

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id || req.body.job;

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required.",
        success: false,
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid Job ID format.",
        success: false,
      });
    }

    // Role check: Only candidates can apply for jobs
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }
    if (user.role === "recruiter") {
      return res.status(403).json({
        message: "Recruiters cannot apply for jobs. Please use a candidate account.",
        success: false,
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Prevent recruiter from applying to their own job
    if (job.created_by.toString() === userId.toString()) {
      return res.status(400).json({
        message: "You cannot apply to your own job posting.",
        success: false,
      });
    }

    // Check if user already applied (prevent duplicate applications)
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // Create new application with default status 'applied' and initial statusHistory audit trail
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      status: "applied",
      statusHistory: [
        {
          status: "applied",
          changedAt: new Date(),
          changedBy: userId,
          comment: "Application submitted by candidate",
        },
      ],
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
      application: newApplication,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }
    console.error("Error in applyJob:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      })
      .populate({
        path: "statusHistory.changedBy",
        select: "fullname role",
      });

    return res.status(200).json({
      applications: applications || [],
      success: true,
    });
  } catch (error) {
    console.error("Error in getAppliedJobs:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Only the recruiter who posted the job can view applicants
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiterId = req.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid Job ID format.",
        success: false,
      });
    }

    const caller = await User.findById(recruiterId);
    if (!caller || caller.role !== "recruiter") {
      return res.status(403).json({
        message: "Forbidden. Only recruiters can view applicants.",
        success: false,
      });
    }

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: [
        { path: "applicant" },
        { path: "statusHistory.changedBy", select: "fullname email role" },
      ],
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Ownership check: Recruiter must own this job
    if (job.created_by.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        message: "Unauthorized. You can only view applicants for your own job postings.",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.error("Error in getApplicants:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Only the recruiter who posted the job can update candidate application status through valid transitions
export const updateStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const applicationId = req.params.id;
    const recruiterId = req.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    // Role check: Only recruiters can update application status
    const caller = await User.findById(recruiterId);
    if (!caller || caller.role !== "recruiter") {
      return res.status(403).json({
        message: "Forbidden. Only recruiters can update application statuses.",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        message: "Invalid Application ID format.",
        success: false,
      });
    }

    const normalizedStatus = status.toLowerCase().trim();
    const allKnownStatuses = Object.keys(ALLOWED_TRANSITIONS);
    if (!allKnownStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: `Invalid status '${status}'. Allowed statuses: ${allKnownStatuses.join(", ")}`,
        success: false,
      });
    }

    const application = await Application.findById(applicationId).populate("job");
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // Ownership check: Recruiter must own the job associated with this application
    if (!application.job || application.job.created_by.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        message: "Unauthorized. You can only update application statuses for jobs you posted.",
        success: false,
      });
    }

    // Transition validation
    const currentStatus = application.status || "applied";
    const allowedNextStatuses = ALLOWED_TRANSITIONS[currentStatus] || [];

    if (!allowedNextStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: `Transition from '${currentStatus}' to '${normalizedStatus}' is not allowed. Valid next stages: ${
          allowedNextStatuses.length > 0 ? allowedNextStatuses.join(", ") : "none (terminal stage)"
        }.`,
        success: false,
      });
    }

    // Record transition in status and statusHistory audit trail
    application.status = normalizedStatus;
    application.statusHistory.push({
      status: normalizedStatus,
      changedAt: new Date(),
      changedBy: recruiterId,
      comment: typeof comment === "string" ? comment.trim() : "",
    });

    await application.save();

    return res.status(200).json({
      message: `Status updated to ${normalizedStatus} successfully.`,
      success: true,
      application,
    });
  } catch (error) {
    console.error("Error in updateStatus:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
export const hasApplied = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        applied: false,
        success: false,
        message: "Invalid Job ID",
      });
    }

    const exists = await Application.exists({
      job: jobId,
      applicant: userId,
    });

    return res.status(200).json({
      applied: Boolean(exists),
      success: true,
    });
  } catch (error) {
    console.error("Error in hasApplied:", error);
    return res.status(500).json({
      applied: false,
      success: false,
    });
  }
};
