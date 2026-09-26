
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    //profile photo upload
    let profilePhoto = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhoto = cloudResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto, 
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role.",
        success: false,
      });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      savedJobs: user.savedJobs || [],
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true, 
       secure: true,
sameSite: "none",

      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body || {};
    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    let skillsArray = [];
    if (skills) {
      if (Array.isArray(skills)) {
        skillsArray = skills.map((s) => s.trim());
      } else {
        skillsArray = skills.split(",").map((s) => s.trim());
      }
    }

    // Support files from req.files (array) or req.file (single)
    const uploadedFiles = req.files && req.files.length > 0 ? req.files : (req.file ? [req.file] : []);
    for (const file of uploadedFiles) {
      const fileUri = getDataUri(file);
      const isPhoto = file.fieldname === "profilePhoto" || file.mimetype.startsWith("image/");
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: isPhoto ? "image" : "auto",
      });

      if (isPhoto) {
        user.profile.profilePhoto = cloudResponse.secure_url;
      } else {
        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOriginalName = file.originalname;
      }
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skillsArray.length > 0) user.profile.skills = skillsArray;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
        savedJobs: user.savedJobs || [],
      },
      success: true,
    });
  } catch (error) {
    console.log("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile",
    });
  }
};

export const toggleSaveJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid Job ID format.",
        success: false,
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (!user.savedJobs) {
      user.savedJobs = [];
    }

    const isAlreadySaved = user.savedJobs.some(
      (id) => id.toString() === jobId.toString()
    );

    let message = "";
    if (isAlreadySaved) {
      user.savedJobs = user.savedJobs.filter(
        (id) => id.toString() !== jobId.toString()
      );
      message = "Job removed from saved list.";
    } else {
      user.savedJobs.push(jobId);
      message = "Job saved successfully.";
    }

    await user.save();

    return res.status(200).json({
      message,
      savedJobs: user.savedJobs,
      isSaved: !isAlreadySaved,
      success: true,
    });
  } catch (error) {
    console.error("Save job error:", error);
    return res.status(500).json({
      message: "Server error while saving job.",
      success: false,
    });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).populate({
      path: "savedJobs",
      populate: {
        path: "company",
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    return res.status(200).json({
      savedJobs: user.savedJobs || [],
      success: true,
    });
  } catch (error) {
    console.error("Get saved jobs error:", error);
    return res.status(500).json({
      message: "Server error while fetching saved jobs.",
      success: false,
    });
  }
};
