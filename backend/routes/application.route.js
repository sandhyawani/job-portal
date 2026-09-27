import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
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

// Candidate portal job applications
router.get("/apply/:id", isAuthenticated, applyJob);
router.post("/apply/:id", isAuthenticated, applyJob);
router.get("/has-applied/:id", isAuthenticated, hasApplied);
router.get("/get", isAuthenticated, getAppliedJobs);

// Recruiter applicant management
router.get("/:id/applicants", isAuthenticated, getApplicants);
router.post("/status/:id/update", isAuthenticated, updateStatus);

// External application tracker
router.get("/external", isAuthenticated, getExternalApplications);
router.get("/external/get", isAuthenticated, getExternalApplications);
router.post("/external", isAuthenticated, createExternalApplication);
router.post("/external/create", isAuthenticated, createExternalApplication);
router.put("/external/:id", isAuthenticated, updateExternalApplication);
router.delete("/external/:id", isAuthenticated, deleteExternalApplication);

export default router;
