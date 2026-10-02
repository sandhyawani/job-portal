import express from "express";
import { isAuthenticated, requireRole, optionalAuth } from "../middlewares/isAuthenticated.js";
import {
  registerCompany,
  getCompanies,
  getPublicCompanies,
  getCompanyById,
  updateCompany,
} from "../controllers/company.controller.js";
import { imageUpload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/public", getPublicCompanies);
router.get("/public/all", getPublicCompanies);
router.post("/register", isAuthenticated, requireRole("recruiter"), registerCompany);
router.get("/get", isAuthenticated, requireRole("recruiter"), getCompanies);
router.get("/", isAuthenticated, requireRole("recruiter"), getCompanies);
router.get("/get/:id", optionalAuth, getCompanyById);
router.get("/:id", optionalAuth, getCompanyById);
router.put("/update/:id", isAuthenticated, requireRole("recruiter"), imageUpload, updateCompany);
router.put("/:id", isAuthenticated, requireRole("recruiter"), imageUpload, updateCompany);

export default router;
