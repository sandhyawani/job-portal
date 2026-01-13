import mongoose from "mongoose";
import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { calculateTrust } from "../services/trust.service.js";

// reg comp
export const registerCompany = async (req, res) => {
  try {
    const name = req.body.name || req.body.companyName;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const existing = await Company.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Company already exists",
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//get all companies
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.id });
    return res.status(200).json({ success: true, companies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//get company by id
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const company = await Company.findOne({
      _id: id,
      userId: req.id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({ success: true, company });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//update company
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const company = await Company.findOne({
      _id: id,
      userId: req.id,
    });

    if (!company) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized or company not found",
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
        company[field] = req.body[field];
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
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
