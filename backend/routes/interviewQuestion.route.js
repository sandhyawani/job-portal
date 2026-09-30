import express from "express";
import { getPublicInterviewQuestions } from "../controllers/interviewQuestion.controller.js";

const router = express.Router();

router.route("/").get(getPublicInterviewQuestions);

export default router;
