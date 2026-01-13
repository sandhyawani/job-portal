import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  registerCompany,
  getCompanies,
  getCompanyById,
  updateCompany
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.post("/register", isAuthenticated, registerCompany);
router.get("/", isAuthenticated, getCompanies);
router.get("/:id", isAuthenticated, getCompanyById);
router.put("/:id", isAuthenticated, singleUpload, updateCompany);

export default router;
