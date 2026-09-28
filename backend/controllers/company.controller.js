import mongoose from "mongoose";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { calculateTrust } from "../services/trust.service.js";

// Register company (Recruiter)
export const registerCompany = async (req, res) => {
  try {
    const name = (req.body.name || req.body.companyName || "").trim();

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const existing = await Company.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A company with this name already exists",
      });
    }

    const company = new Company({
      name,
      userId: req.id,
    });

    const { score, trustLevel } = calculateTrust(company);
    company.trustScore = score;
    company.trustLevel = trustLevel;

    await company.save();

    return res.status(201).json({
      success: true,
      message: "Company registered successfully",
      company,
    });
  } catch (error) {
    console.error("Register company error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error registering company",
    });
  }
};

// Get recruiter's companies
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, companies: companies || [] });
  } catch (error) {
    console.error("Get companies error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching companies",
    });
  }
};

// Get public companies list (for homepage / directory)
export const getPublicCompanies = async (req, res) => {
  try {
    const companies = await Company.find({})
      .select("name logo location website trustScore trustLevel description")
      .sort({ trustScore: -1, createdAt: -1 })
      .limit(20);
    return res.status(200).json({ success: true, companies: companies || [] });
  } catch (error) {
    console.error("Get public companies error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get company by ID (with active open positions)
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const company = await Company.findById(id).select(
      "name description website location logo email registrationNumber trustScore trustLevel createdAt"
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Fetch active jobs for this company
    const openJobs = await Job.find({
      company: id,
      status: { $ne: "closed" },
    }).select("title location jobType workMode salary experienceLevel requirements createdAt");

    return res.status(200).json({
      success: true,
      company,
      openJobs: openJobs || [],
    });
  } catch (error) {
    console.error("Get company by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching company",
    });
  }
};

// Update company (Owner recruiter only)
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (company.userId.toString() !== req.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this company",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "website",
      "location",
      "email",
      "registrationNumber",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field].trim();
      }
    });

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const upload = await cloudinary.uploader.upload(fileUri.content);
      company.logo = upload.secure_url;
    }

    const { score, trustLevel } = calculateTrust(company);
    company.trustScore = score;
    company.trustLevel = trustLevel;

    await company.save();

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    console.error("Update company error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating company",
    });
  }
};
