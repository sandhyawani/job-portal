import express from "express";
import isAuthenticated, { requireRole } from "../middlewares/isAuthenticated.js";
import { 
    addInterviewQuestion, 
    getInterviewQuestions, 
    updateInterviewQuestion,
    deleteInterviewQuestion,
    getAdminStats,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getRecruiters,
    getRecruiterById,
    updateRecruiter,
    deleteRecruiter,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getApplications,
    getApplicationById,
    updateApplicationStatus,
    deleteApplication
} from "../controllers/admin.controller.js";

const router = express.Router();

// Admin stats
router.route("/stats").get(isAuthenticated, requireRole('admin'), getAdminStats);

// Admin interview question routes
router.route("/interview-questions")
    .get(isAuthenticated, requireRole('admin'), getInterviewQuestions)
    .post(isAuthenticated, requireRole('admin'), addInterviewQuestion);

router.route("/interview-questions/:id")
    .put(isAuthenticated, requireRole('admin'), updateInterviewQuestion)
    .delete(isAuthenticated, requireRole('admin'), deleteInterviewQuestion);

// Admin user routes
router.route("/users")
    .get(isAuthenticated, requireRole('admin'), getUsers);

router.route("/users/:id")
    .get(isAuthenticated, requireRole('admin'), getUserById)
    .put(isAuthenticated, requireRole('admin'), updateUser)
    .delete(isAuthenticated, requireRole('admin'), deleteUser);

// Admin recruiter routes
router.route("/recruiters")
    .get(isAuthenticated, requireRole('admin'), getRecruiters);

router.route("/recruiters/:id")
    .get(isAuthenticated, requireRole('admin'), getRecruiterById)
    .put(isAuthenticated, requireRole('admin'), updateRecruiter)
    .delete(isAuthenticated, requireRole('admin'), deleteRecruiter);

// Admin company routes
router.route("/companies")
    .get(isAuthenticated, requireRole('admin'), getCompanies);

router.route("/companies/:id")
    .get(isAuthenticated, requireRole('admin'), getCompanyById)
    .put(isAuthenticated, requireRole('admin'), updateCompany)
    .delete(isAuthenticated, requireRole('admin'), deleteCompany);

// Admin jobs routes
router.route("/jobs")
    .get(isAuthenticated, requireRole('admin'), getJobs);

router.route("/jobs/:id")
    .get(isAuthenticated, requireRole('admin'), getJobById)
    .put(isAuthenticated, requireRole('admin'), updateJob)
    .delete(isAuthenticated, requireRole('admin'), deleteJob);

// Admin applications routes
router.route("/applications")
    .get(isAuthenticated, requireRole('admin'), getApplications);

router.route("/applications/:id")
    .get(isAuthenticated, requireRole('admin'), getApplicationById)
    .put(isAuthenticated, requireRole('admin'), updateApplicationStatus)
    .delete(isAuthenticated, requireRole('admin'), deleteApplication);

export default router;