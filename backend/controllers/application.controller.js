import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Notification } from "../models/notification.model.js";
import { ExternalApplication } from "../models/externalApplication.model.js";

const VALID_STATUSES = [
  "pending",
  "review",
  "shortlisted",
  "accepted",
  "interview",
  "offer",
  "hired",
  "rejected",
];

// Apply for a job (Candidate only)
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id || req.body.job;

    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Valid Job ID is required.",
        success: false,
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
        success: false,
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId).populate("company", "name");
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    if (job.status === "closed") {
      return res.status(400).json({
        message: "This job position is now closed.",
        success: false,
      });
    }

    // Prevent creator from applying to their own job
    if (job.created_by.toString() === userId) {
      return res.status(400).json({
        message: "Recruiters cannot apply to their own posted jobs.",
        success: false,
      });
    }

    // Create new application with initial history
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      status: "pending",
      statusHistory: [
        {
          status: "pending",
          changedAt: new Date(),
          comment: "Application submitted by candidate",
          changedBy: userId,
        },
      ],
    });

    job.applications.push(newApplication._id);
    await job.save();

    // Create notification for candidate
    await Notification.create({
      user: userId,
      title: "Application Submitted",
      message: `Your application for "${job.title}" at ${job.company?.name || "Company"} was successfully submitted.`,
      type: "application",
      link: "/applications",
    });

    return res.status(201).json({
      message: "Job applied successfully.",
      application: newApplication,
      success: true,
    });
  } catch (error) {
    console.error("Error in applyJob:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Get applied jobs for current candidate (Candidate only)
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        select: "title description salary location jobType workMode experienceLevel requirements createdAt",
        populate: {
          path: "company",
          select: "name logo location trustScore trustLevel website",
        },
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

// Get applicants for a job (Recruiter owner only)
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid Job ID format.",
        success: false,
      });
    }

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
        // SECURITY: Explicitly select candidate fields. NEVER return password or password hash!
        select: "fullname email phoneNumber profile createdAt",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // SECURITY: Recruiter authorization check
    if (job.created_by.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to view applicants for this job.",
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

// Update applicant status (Recruiter only with state machine validation)
export const updateStatus = async (req, res) => {
  try {
    const { status, notes, interviewDate } = req.body;
    const applicationId = req.params.id;
    const recruiterId = req.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    const normalizedStatus = status.toLowerCase().trim();
    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        message: "Invalid Application ID format.",
        success: false,
      });
    }

    const application = await Application.findById(applicationId)
      .populate("job", "title created_by company")
      .populate({
        path: "job",
        populate: { path: "company", select: "name" },
      });

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // Authorization: only the recruiter who posted the job can update candidate status
    if (application.job.created_by.toString() !== recruiterId) {
      return res.status(403).json({
        message: "You are not authorized to update applicants for this job.",
        success: false,
      });
    }

    application.status = normalizedStatus;
    if (notes !== undefined) application.notes = notes;
    if (interviewDate) application.interviewDate = new Date(interviewDate);

    // Record status history
    application.statusHistory.push({
      status: normalizedStatus,
      changedAt: new Date(),
      comment: notes || `Status updated to ${normalizedStatus}`,
      changedBy: recruiterId,
    });

    await application.save();

    // Create candidate notification
    const jobTitle = application.job?.title || "your application";
    const companyName = application.job?.company?.name || "the hiring team";
    let notifTitle = `Application Status: ${normalizedStatus.toUpperCase()}`;
    let notifMsg = `Your application for "${jobTitle}" at ${companyName} has moved to ${normalizedStatus}.`;

    if (normalizedStatus === "shortlisted" || normalizedStatus === "accepted") {
      notifTitle = "Application Shortlisted";
      notifMsg = `You have been shortlisted for "${jobTitle}" at ${companyName}.`;
    } else if (normalizedStatus === "interview") {
      notifTitle = "Interview Scheduled";
      notifMsg = interviewDate
        ? `Interview scheduled for "${jobTitle}" on ${new Date(interviewDate).toLocaleDateString()}. Notes: ${notes || "None"}`
        : `You have been invited for an interview for "${jobTitle}" at ${companyName}.`;
    } else if (normalizedStatus === "offer") {
      notifTitle = "Job Offer Extended";
      notifMsg = `You have received an offer for "${jobTitle}" at ${companyName}.`;
    }

    await Notification.create({
      user: application.applicant,
      title: notifTitle,
      message: notifMsg,
      type: "application",
      link: "/applications",
    });

    return res.status(200).json({
      message: `Status updated to ${normalizedStatus} successfully.`,
      application,
      success: true,
    });
  } catch (error) {
    console.error("Error in updateStatus:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Check if current user has applied to a job
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

    const application = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    return res.status(200).json({
      applied: Boolean(application),
      status: application?.status || null,
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

// ============================================
// External application tracker
// ============================================

export const getExternalApplications = async (req, res) => {
  try {
    const userId = req.id;
    const externalApps = await ExternalApplication.find({ user: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      applications: externalApps || [],
    });
  } catch (error) {
    console.error("Get external apps error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch external applications",
    });
  }
};

export const createExternalApplication = async (req, res) => {
  try {
    const userId = req.id;
    const { company, role, source, appliedDate, status, jobUrl, salary, location, notes } =
      req.body;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: "Company and Role are required.",
      });
    }

    const externalApp = await ExternalApplication.create({
      user: userId,
      company: company.trim(),
      role: role.trim(),
      source: source || "LinkedIn",
      appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
      status: status || "applied",
      jobUrl: jobUrl || "",
      salary: salary || "",
      location: location || "",
      notes: notes || "",
    });

    return res.status(201).json({
      success: true,
      message: "External application added to your pipeline.",
      application: externalApp,
    });
  } catch (error) {
    console.error("Create external app error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create external application",
    });
  }
};

export const updateExternalApplication = async (req, res) => {
  try {
    const userId = req.id;
    const { id } = req.params;

    const externalApp = await ExternalApplication.findOne({ _id: id, user: userId });
    if (!externalApp) {
      return res.status(404).json({
        success: false,
        message: "External application not found.",
      });
    }

    const { company, role, source, appliedDate, status, jobUrl, salary, location, notes } =
      req.body;

    if (company) externalApp.company = company.trim();
    if (role) externalApp.role = role.trim();
    if (source) externalApp.source = source;
    if (appliedDate) externalApp.appliedDate = new Date(appliedDate);
    if (status) externalApp.status = status;
    if (jobUrl !== undefined) externalApp.jobUrl = jobUrl;
    if (salary !== undefined) externalApp.salary = salary;
    if (location !== undefined) externalApp.location = location;
    if (notes !== undefined) externalApp.notes = notes;

    await externalApp.save();

    return res.status(200).json({
      success: true,
      message: "External application updated.",
      application: externalApp,
    });
  } catch (error) {
    console.error("Update external app error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update external application",
    });
  }
};

export const deleteExternalApplication = async (req, res) => {
  try {
    const userId = req.id;
    const { id } = req.params;

    const result = await ExternalApplication.findOneAndDelete({ _id: id, user: userId });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "External application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "External application removed.",
    });
  } catch (error) {
    console.error("Delete external app error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete external application",
    });
  }
};