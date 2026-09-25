import { Job } from "../models/job.model.js";

//create job
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

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(",").map((r) => r.trim()),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
};

// get all jobs 
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
};

// get job by id 
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
};

// get admin job
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin jobs",
    });
  }
};

//update job
export const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    let formattedRequirements = [];
    if (req.body.requirements) {
      if (Array.isArray(req.body.requirements)) {
        formattedRequirements = req.body.requirements;
      } else if (typeof req.body.requirements === "string") {
        formattedRequirements = req.body.requirements.split(",").map((r) => r.trim());
      }
    }

    const updateData = { ...req.body };
    if (req.body.requirements) updateData.requirements = formattedRequirements;
    if (req.body.experience) updateData.experienceLevel = req.body.experience;
    if (req.body.companyId) updateData.company = req.body.companyId;

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      updateData,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
};
