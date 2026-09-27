import express from "express";
import { isAuthenticated, optionalAuth } from "../middlewares/isAuthenticated.js";
import {
  registerCompany,
  getCompanies,
  getPublicCompanies,
  getCompanyById,
  updateCompany,
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.get("/public", getPublicCompanies);
router.get("/public/all", getPublicCompanies);
router.post("/register", isAuthenticated, registerCompany);
router.get("/get", isAuthenticated, getCompanies);
router.get("/", isAuthenticated, getCompanies);
router.get("/get/:id", optionalAuth, getCompanyById);
router.get("/:id", optionalAuth, getCompanyById);
router.put("/update/:id", isAuthenticated, singleUpload, updateCompany);
router.put("/:id", isAuthenticated, singleUpload, updateCompany);

export default router;
