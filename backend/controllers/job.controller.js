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
      salary === undefined ||
      salary === null ||
      salary === "" ||
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

    if (isNaN(Number(salary)) || Number(salary) <= 0) {
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
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    if (company.userId.toString() !== userId) {
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
        workMode: { $regex: `^${workMode.trim()}$`, $options: "i" },
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
    const isRelevanceSort = sort === "relevance" && Boolean(keyword && keyword.trim());

    if (sort === "salary_desc") {
      sortOptions = { salary: -1, createdAt: -1 };
    } else if (sort === "salary_asc") {
      sortOptions = { salary: 1, createdAt: -1 };
    } else {
      sortOptions = { createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const totalJobs = await Job.countDocuments(query);
    let jobs = await Job.find(query)
      .populate({
        path: "company",
        select: "name logo location trustScore trustLevel website description",
      })
      .populate({
        path: "created_by",
        select: "fullname email",
      })
      .sort(sortOptions);

    if (isRelevanceSort) {
      const kw = keyword.toLowerCase().trim();
      const terms = kw.split(/\s+/).filter(Boolean);

      const scoreJob = (j) => {
        let score = 0;
        const title = (j.title || "").toLowerCase();
        const desc = (j.description || "").toLowerCase();
        const comp = (j.company?.name || "").toLowerCase();
        const reqs = (j.requirements || []).map((r) => String(r).toLowerCase());

        if (title === kw) score += 50;
        else if (title.includes(kw)) score += 25;

        terms.forEach((t) => {
          if (title.includes(t)) score += 10;
          if (reqs.some((r) => r.includes(t))) score += 8;
          if (comp.includes(t)) score += 5;
          if (desc.includes(t)) score += 2;
        });
        return score;
      };

      jobs.sort((a, b) => {
        const scoreDiff = scoreJob(b) - scoreJob(a);
        return scoreDiff !== 0 ? scoreDiff : new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    const paginatedJobs = jobs.slice(skip, skip + limitNum);

    return res.status(200).json({
      success: true,
      jobs: paginatedJobs,
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

    // Meaningful similar jobs matching across requirements, jobType, workMode, and title
    const STOP_WORDS = new Set([
      "the", "and", "for", "with", "a", "an", "in", "to", "of", "at", "by", "from",
      "senior", "junior", "lead", "staff", "associate", "developer", "engineer", "manager"
    ]);

    const titleTokens = job.title
      .toLowerCase()
      .split(/[\s,./\\-]+/)
      .map((w) => w.trim())
      .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));

    const orClauses = [
      { jobType: job.jobType },
      { workMode: job.workMode },
    ];
    if (job.company) {
      orClauses.push({ company: job.company._id || job.company });
    }
    if (job.requirements && job.requirements.length > 0) {
      orClauses.push({ requirements: { $in: job.requirements } });
    }
    if (titleTokens.length > 0) {
      orClauses.push({ title: { $regex: titleTokens.join("|"), $options: "i" } });
    }

    const candidateJobs = await Job.find({
      _id: { $ne: job._id },
      status: { $ne: "closed" },
      $or: orClauses,
    })
      .populate({
        path: "company",
        select: "name logo location trustScore trustLevel",
      })
      .limit(20);

    const targetReqs = (job.requirements || []).map((r) => r.toLowerCase().trim());
    const scoredCandidates = candidateJobs.map((c) => {
      let score = 0;
      const cReqs = (c.requirements || []).map((r) => r.toLowerCase().trim());
      targetReqs.forEach((req) => {
        if (cReqs.some((cr) => cr.includes(req) || req.includes(cr))) score += 4;
      });
      const cTitle = (c.title || "").toLowerCase();
      titleTokens.forEach((tok) => {
        if (cTitle.includes(tok)) score += 5;
      });
      if (c.workMode === job.workMode) score += 2;
      if (c.jobType === job.jobType) score += 2;
      if (c.location && job.location && c.location.toLowerCase().includes(job.location.toLowerCase())) {
        score += 2;
      }
      return { job: c, score };
    });

    scoredCandidates.sort((a, b) => b.score - a.score || new Date(b.job.createdAt) - new Date(a.job.createdAt));
    const similarJobs = scoredCandidates.slice(0, 4).map((item) => item.job);

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
