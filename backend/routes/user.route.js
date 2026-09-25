import express from "express";
import { getSavedJobs, login, logout, register, toggleSaveJob, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { anyUpload, singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, anyUpload, updateProfile);
router.route("/save-job/:id").post(isAuthenticated, toggleSaveJob);
router.route("/saved-jobs").get(isAuthenticated, getSavedJobs);

export default router;

