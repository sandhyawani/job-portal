import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
  hasApplied,
} from "../controllers/application.controller.js";

const router = express.Router();

router.get("/apply/:id", isAuthenticated, applyJob);
router.get("/has-applied/:id", isAuthenticated, hasApplied);
router.get("/get", isAuthenticated, getAppliedJobs);
router.get("/:id/applicants", isAuthenticated, getApplicants);
router.post("/status/:id/update", isAuthenticated, updateStatus);

export default router; 
