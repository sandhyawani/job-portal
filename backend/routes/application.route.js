import express from "express";
import { isAuthenticated, requireRole } from "../middlewares/isAuthenticated.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  hasApplied,
  getExternalApplications,
  createExternalApplication,
  updateExternalApplication,
  deleteExternalApplication,
} from "../controllers/application.controller.js";

const router = express.Router();

// Candidate portal job applications (Student only)
router.post("/apply/:id", isAuthenticated, requireRole("student"), applyJob);
router.get("/has-applied/:id", isAuthenticated, requireRole("student"), hasApplied);
router.get("/get", isAuthenticated, requireRole("student"), getAppliedJobs);

// Recruiter applicant management (Recruiter only)
router.get("/:id/applicants", isAuthenticated, requireRole("recruiter"), getApplicants);
router.post("/status/:id/update", isAuthenticated, requireRole("recruiter"), updateStatus);

// External application tracker (Authenticated candidate / student)
router.get("/external", isAuthenticated, requireRole("student"), getExternalApplications);
router.get("/external/get", isAuthenticated, requireRole("student"), getExternalApplications);
router.post("/external", isAuthenticated, requireRole("student"), createExternalApplication);
router.post("/external/create", isAuthenticated, requireRole("student"), createExternalApplication);
router.put("/external/:id", isAuthenticated, requireRole("student"), updateExternalApplication);
router.delete("/external/:id", isAuthenticated, requireRole("student"), deleteExternalApplication);

export default router;
