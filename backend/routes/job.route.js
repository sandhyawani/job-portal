import express from "express";
import { isAuthenticated, optionalAuth } from "../middlewares/isAuthenticated.js";
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
router.post("/post", isAuthenticated, postJob);
router.get("/getadminjobs", isAuthenticated, getAdminJobs);
router.put("/update/:id", isAuthenticated, updateJob);

export default router;
