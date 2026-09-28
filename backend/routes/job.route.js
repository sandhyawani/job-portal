import express from "express";
import { isAuthenticated, requireRole, optionalAuth } from "../middlewares/isAuthenticated.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  updateJob,
} from "../controllers/job.controller.js";

const router = express.Router();

// Public routes with optional authentication context
router.get("/get", optionalAuth, getAllJobs);
router.get("/get/:id", optionalAuth, getJobById);

// Protected recruiter routes
router.post("/post", isAuthenticated, requireRole("recruiter"), postJob);
router.get("/getadminjobs", isAuthenticated, requireRole("recruiter"), getAdminJobs);
router.put("/update/:id", isAuthenticated, requireRole("recruiter"), updateJob);

export default router;
