import mongoose from "mongoose";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";

// Create job with recruiter role & company ownership check
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Company ID format",
      });
    }

    // Role check: Only recruiters can post jobs
    const user = await User.findById(userId);
    if (!user || user.role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Forbidden. Only recruiters can post jobs.",
      });
    }

    // Company ownership check: Recruiter must own the company
    const company = await Company.findOne({ _id: companyId, userId });
    if (!company) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You can only post jobs for companies you registered.",
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements.split(",").map((r) => r.trim()).filter(Boolean),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position: Number(position),
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
};

// Get all jobs with multi-field search (title, description, location, requirements)
export const getAllJobs = async (req, res) => {
  try {
    const keyword = (req.query.keyword || "").trim();

    const query = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
            { location: { $regex: keyword, $options: "i" } },
            { requirements: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    const jobs = await Job.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

// Get job by ID with ObjectId validation
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID format",
      });
    }

    const job = await Job.findById(jobId).populate("company");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

// Get admin jobs for the authenticated recruiter only
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching admin jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin jobs",
    });
  }
};

// Update job with strict ownership verification
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID format",
      });
    }

    const existingJob = await Job.findById(jobId);
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Ownership check: Recruiter can only edit jobs they created
    if (existingJob.created_by.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You can only update jobs you created.",
      });
    }

    // If company is being changed, verify recruiter owns the target company
    if (req.body.companyId && req.body.companyId !== existingJob.company.toString()) {
      if (!mongoose.Types.ObjectId.isValid(req.body.companyId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Company ID format",
        });
      }
      const ownsCompany = await Company.findOne({
        _id: req.body.companyId,
        userId,
      });
      if (!ownsCompany) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized. Target company does not belong to you.",
        });
      }
    }

    let formattedRequirements = existingJob.requirements;
    if (req.body.requirements) {
      if (Array.isArray(req.body.requirements)) {
        formattedRequirements = req.body.requirements;
      } else if (typeof req.body.requirements === "string") {
        formattedRequirements = req.body.requirements
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean);
      }
    }

    const updateData = { ...req.body };
    if (req.body.requirements) updateData.requirements = formattedRequirements;
    if (req.body.experience) updateData.experienceLevel = req.body.experience;
    if (req.body.companyId) updateData.company = req.body.companyId;
    if (req.body.salary) updateData.salary = Number(req.body.salary);
    if (req.body.position) updateData.position = Number(req.body.position);

    // Prevent created_by or applications from being tampered with
    delete updateData.created_by;
    delete updateData.applications;

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
      new: true,
    }).populate("company");

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
};
