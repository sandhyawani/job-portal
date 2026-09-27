import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Notification } from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Helper to sanitize user object
const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete user.password;
  return user;
};

// Calculate profile completion score and breakdown
export const calculateProfileScore = (user) => {
  if (!user) return { score: 0, items: [] };

  const checks = [
    { label: "Basic details (Name, Email, Phone)", completed: Boolean(user.fullname && user.email && user.phoneNumber), weight: 15 },
    { label: "Professional Bio", completed: Boolean(user.profile?.bio && user.profile.bio.trim().length > 10), weight: 15 },
    { label: "Skills (at least 3)", completed: Boolean(user.profile?.skills && user.profile.skills.length >= 3), weight: 20 },
    { label: "Resume uploaded", completed: Boolean(user.profile?.resume), weight: 20 },
    { label: "Experience & Education", completed: Boolean(user.profile?.experience || user.profile?.education), weight: 15 },
    { label: "Links (GitHub / Portfolio)", completed: Boolean(user.profile?.github || user.profile?.portfolio), weight: 15 },
  ];

  const totalScore = checks.reduce((acc, curr) => acc + (curr.completed ? curr.weight : 0), 0);
  return { score: totalScore, checks };
};

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
        success: false,
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    // Profile photo upload
    let profilePhoto = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhoto = cloudResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname: fullname.trim(),
      email: email.toLowerCase().trim(),
      phoneNumber: Number(phoneNumber),
      password: hashedPassword,
      role,
      profile: {
        profilePhoto,
        skills: [],
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      user: sanitizeUser(newUser),
      success: true,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
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

    const sanitized = sanitizeUser(user);

    const isProduction =
      process.env.NODE_ENV === "production" ||
      process.env.RENDER === "true" ||
      Boolean(process.env.RENDER);

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: sanitized,
        token,
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

export const logout = async (req, res) => {
  try {
    const isProduction =
      process.env.NODE_ENV === "production" ||
      process.env.RENDER === "true" ||
      Boolean(process.env.RENDER);
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Server error during logout" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "savedJobs",
        populate: { path: "company" },
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    const completion = calculateProfileScore(user);

    return res.status(200).json({
      success: true,
      user,
      profileCompletion: completion,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phoneNumber,
      bio,
      skills,
      experience,
      education,
      location,
      github,
      portfolio,
      expectedSalary,
      preferredJobType,
      preferredWorkMode,
      projects,
    } = req.body || {};

    const userId = req.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Process skills
    if (skills !== undefined) {
      let skillsArray = [];
      if (Array.isArray(skills)) {
        skillsArray = skills.map((s) => String(s).trim()).filter(Boolean);
      } else if (typeof skills === "string") {
        skillsArray = skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      user.profile.skills = skillsArray;
    }

    // Handle file upload (photo or resume based on mimetype)
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const isPdfOrDoc =
        req.file.mimetype === "application/pdf" ||
        req.file.mimetype.includes("word") ||
        req.file.mimetype.includes("document");

      const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: isPdfOrDoc ? "raw" : "auto",
      });

      if (isPdfOrDoc) {
        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOriginalName = req.file.originalname;
      } else {
        user.profile.profilePhoto = cloudResponse.secure_url;
      }
    }

    if (fullname) user.fullname = fullname.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (phoneNumber) user.phoneNumber = Number(phoneNumber);
    if (bio !== undefined) user.profile.bio = bio;
    if (experience !== undefined) user.profile.experience = experience;
    if (education !== undefined) user.profile.education = education;
    if (location !== undefined) user.profile.location = location;
    if (github !== undefined) user.profile.github = github;
    if (portfolio !== undefined) user.profile.portfolio = portfolio;
    if (expectedSalary !== undefined) user.profile.expectedSalary = Number(expectedSalary) || 0;
    if (preferredJobType !== undefined) user.profile.preferredJobType = preferredJobType;
    if (preferredWorkMode !== undefined) user.profile.preferredWorkMode = preferredWorkMode;

    if (projects) {
      try {
        const parsed = typeof projects === "string" ? JSON.parse(projects) : projects;
        if (Array.isArray(parsed)) {
          user.profile.projects = parsed;
        }
      } catch {
        // If not JSON, ignore project parse error
      }
    }

    await user.save();

    const sanitized = sanitizeUser(user);
    const completion = calculateProfileScore(sanitized);

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: sanitized,
      profileCompletion: completion,
      success: true,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile",
    });
  }
};

// ====================
// Saved jobs
// ====================
export const toggleSaveJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const index = user.savedJobs.findIndex((id) => id.toString() === jobId);
    let isSaved = false;

    if (index > -1) {
      // Unsave
      user.savedJobs.splice(index, 1);
      isSaved = false;
    } else {
      // Save
      user.savedJobs.push(jobId);
      isSaved = true;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      isSaved,
      savedJobs: user.savedJobs,
      message: isSaved ? "Job saved to your pipeline." : "Job removed from saved jobs.",
    });
  } catch (error) {
    console.error("Toggle save job error:", error);
    return res.status(500).json({ success: false, message: "Failed to update saved job" });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).populate({
      path: "savedJobs",
      populate: { path: "company" },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      savedJobs: user.savedJobs || [],
    });
  } catch (error) {
    console.error("Get saved jobs error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch saved jobs" });
  }
};

// ==========================
// Notifications
// ==========================
export const getNotifications = async (req, res) => {
  try {
    const userId = req.id;
    let notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.id;
    const { id } = req.params;

    if (id === "all") {
      await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
    } else {
      await Notification.findOneAndUpdate({ _id: id, user: userId }, { isRead: true });
    }

    return res.status(200).json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    console.error("Mark notification read error:", error);
    return res.status(500).json({ success: false, message: "Failed to update notification" });
  }
};
