import express from "express";
import {
  login,
  logout,
  register,
  getProfile,
  updateProfile,
  toggleSaveJob,
  getSavedJobs,
  getNotifications,
  markNotificationRead,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", isAuthenticated, getProfile);
router.post("/profile/update", isAuthenticated, singleUpload, updateProfile);

// Saved jobs
router.post("/save/:id", isAuthenticated, toggleSaveJob);
router.post("/save-job/:id", isAuthenticated, toggleSaveJob);
router.get("/saved-jobs", isAuthenticated, getSavedJobs);

// Notifications
router.get("/notifications", isAuthenticated, getNotifications);
router.put("/notifications/:id/read", isAuthenticated, markNotificationRead);

export default router;
