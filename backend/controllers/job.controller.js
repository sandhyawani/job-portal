import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import mongoose from "mongoose";

// Create job (Recruiter only)
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
      workMode,
      responsibilities,
      benefits,
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
      !companyId
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, description, requirements, salary, location, job type, experience, and company are required.",
      });
    }

    if (Number(salary) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Salary must be greater than zero.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID.",
      });
    }

    // Verify company exists and user has ownership
    const company = await Company.findOne({ _id: companyId, userId });
    if (!company) {
      return res.status(403).json({
        success: false,
        message: "You can only post jobs for companies you own/manage.",
      });
    }

    // Parse requirements
    let reqArray = [];
    if (Array.isArray(requirements)) {
      reqArray = requirements.map((r) => String(r).trim()).filter(Boolean);
    } else if (typeof requirements === "string") {
      reqArray = requirements.split(",").map((r) => r.trim()).filter(Boolean);
    }

    // Parse responsibilities
    let respArray = [];
    if (Array.isArray(responsibilities)) {
      respArray = responsibilities.map((r) => String(r).trim()).filter(Boolean);
    } else if (typeof responsibilities === "string") {
      respArray = responsibilities.split("\n").map((r) => r.trim()).filter(Boolean);
    }

    // Parse benefits
    let benArray = [];
    if (Array.isArray(benefits)) {
      benArray = benefits.map((b) => String(b).trim()).filter(Boolean);
    } else if (typeof benefits === "string") {
      benArray = benefits.split(",").map((b) => b.trim()).filter(Boolean);
    }

    // Detect workMode if not specified
    let determinedWorkMode = workMode || "On-site";
    const locLower = location.toLowerCase();
    if (!workMode) {
      if (locLower.includes("remote")) determinedWorkMode = "Remote";
      else if (locLower.includes("hybrid")) determinedWorkMode = "Hybrid";
    }

    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      requirements: reqArray,
      responsibilities: respArray,
      benefits: benArray,
      salary: Number(salary),
      location: location.trim(),
      jobType: jobType.trim(),
      workMode: determinedWorkMode,
      experienceLevel: experience.trim(),
      position: Number(position) > 0 ? Number(position) : 1,
      company: companyId,
      created_by: userId,
      status: "active",
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Post job error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
};

// Get all jobs with multi-criteria filtering, search, sorting, and pagination
export const getAllJobs = async (req, res) => {
  try {
    const {
      keyword = "",
      location = "",
      workMode = "",
      jobType = "",
      experience = "",
      salaryMin,
      salaryMax,
      datePosted,
      companyId,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    const andConditions = [{ status: { $ne: "closed" } }];

    // Keyword search across title, description, requirements, or company name
    if (keyword && keyword.trim()) {
      const kw = keyword.trim();
      // First find matching companies if any
      const matchingCompanies = await Company.find({
        name: { $regex: kw, $options: "i" },
      }).select("_id");
      const companyIds = matchingCompanies.map((c) => c._id);

      andConditions.push({
        $or: [
          { title: { $regex: kw, $options: "i" } },
          { description: { $regex: kw, $options: "i" } },
          { requirements: { $elemMatch: { $regex: kw, $options: "i" } } },
          { location: { $regex: kw, $options: "i" } },
          ...(companyIds.length > 0 ? [{ company: { $in: companyIds } }] : []),
        ],
      });
    }

    // Location filter
    if (location && location.trim() && location !== "All") {
      andConditions.push({
        location: { $regex: location.trim(), $options: "i" },
      });
    }

    // Work mode filter (Remote, Hybrid, On-site)
    if (workMode && workMode.trim() && workMode !== "All") {
      andConditions.push({
        $or: [
          { workMode: { $regex: `^${workMode.trim()}$`, $options: "i" } },
          { location: { $regex: workMode.trim(), $options: "i" } },
        ],
      });
    }

    // Job type filter (Full-time, Part-time, Internship, Contract)
    if (jobType && jobType.trim() && jobType !== "All") {
      andConditions.push({
        jobType: { $regex: jobType.trim(), $options: "i" },
      });
    }

    // Experience level filter
    if (experience && experience.trim() && experience !== "All") {
      andConditions.push({
        experienceLevel: { $regex: experience.trim(), $options: "i" },
      });
    }

    // Company filter
    if (companyId && mongoose.Types.ObjectId.isValid(companyId)) {
      andConditions.push({ company: companyId });
    }

    // Salary filter
    if (salaryMin !== undefined && salaryMin !== "" && !isNaN(Number(salaryMin))) {
      andConditions.push({ salary: { $gte: Number(salaryMin) } });
    }
    if (salaryMax !== undefined && salaryMax !== "" && !isNaN(Number(salaryMax))) {
      andConditions.push({ salary: { $lte: Number(salaryMax) } });
    }

    // Date posted filter
    if (datePosted && datePosted !== "all") {
      const now = new Date();
      let threshold = null;
      if (datePosted === "24h" || datePosted === "today") {
        threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (datePosted === "week" || datePosted === "7d") {
        threshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (datePosted === "14d") {
        threshold = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      } else if (datePosted === "month" || datePosted === "30d") {
        threshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      if (threshold) {
        andConditions.push({ createdAt: { $gte: threshold } });
      }
    }

    const query = andConditions.length > 1 ? { $and: andConditions } : andConditions[0];

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === "salary_desc") {
      sortOptions = { salary: -1, createdAt: -1 };
    } else if (sort === "salary_asc") {
      sortOptions = { salary: 1, createdAt: -1 };
    } else if (sort === "relevance" && keyword) {
      sortOptions = { createdAt: -1 };
    } else {
      sortOptions = { createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate({
        path: "company",
        select: "name logo location trustScore trustLevel website description",
      })
      .populate({
        path: "created_by",
        select: "fullname email",
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      jobs,
      totalJobs,
      currentPage: pageNum,
      totalPages: Math.ceil(totalJobs / limitNum) || 1,
    });
  } catch (error) {
    console.error("Get all jobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

// Get job by ID with similar jobs
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(jobId)
      .populate({
        path: "company",
        select: "name logo description website location email registrationNumber trustScore trustLevel",
      })
      .populate({
        path: "created_by",
        select: "fullname email",
      });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Find 3-4 similar jobs based on title keywords or requirements
    const firstWord = job.title.split(" ")[0];
    const similarJobs = await Job.find({
      _id: { $ne: job._id },
      status: { $ne: "closed" },
      $or: [
        { title: { $regex: firstWord, $options: "i" } },
        { jobType: job.jobType },
        { requirements: { $in: job.requirements } },
      ],
    })
      .populate({
        path: "company",
        select: "name logo location trustScore trustLevel",
      })
      .limit(4);

    return res.status(200).json({
      success: true,
      job,
      similarJobs,
    });
  } catch (error) {
    console.error("Get job by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

// Get admin jobs (Recruiter only)
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate("company", "name logo location trustScore trustLevel")
      .populate({
        path: "applications",
        select: "status createdAt applicant notes interviewDate",
        populate: {
          path: "applicant",
          select: "fullname email phoneNumber profile.skills profile.resume",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get admin jobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin jobs",
    });
  }
};

// Update job (Recruiter owner only)
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check ownership
    if (job.created_by.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this job",
      });
    }

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      workMode,
      responsibilities,
      benefits,
      status,
    } = req.body;

    if (title) job.title = title.trim();
    if (description) job.description = description.trim();
    if (requirements !== undefined) {
      job.requirements = Array.isArray(requirements)
        ? requirements
        : requirements.split(",").map((r) => r.trim()).filter(Boolean);
    }
    if (responsibilities !== undefined) {
      job.responsibilities = Array.isArray(responsibilities)
        ? responsibilities
        : responsibilities.split("\n").map((r) => r.trim()).filter(Boolean);
    }
    if (benefits !== undefined) {
      job.benefits = Array.isArray(benefits)
        ? benefits
        : benefits.split(",").map((b) => b.trim()).filter(Boolean);
    }
    if (salary) {
      if (Number(salary) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Salary must be greater than zero",
        });
      }
      job.salary = Number(salary);
    }
    if (location) job.location = location.trim();
    if (jobType) job.jobType = jobType.trim();
    if (workMode) job.workMode = workMode;
    if (experience) job.experienceLevel = experience.trim();
    if (position) job.position = Number(position) > 0 ? Number(position) : job.position;
    if (status) job.status = status;

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update job error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
};
