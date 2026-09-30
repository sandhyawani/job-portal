import { InterviewQuestion } from "../models/interviewQuestion.model.js";

export const getPublicInterviewQuestions = async (req, res) => {
    try {
        const { topic } = req.query;
        let query = { isActive: true }; // Candidates only see active questions
        
        if (topic) {
            query.topic = new RegExp(topic, 'i');
        }

        const questions = await InterviewQuestion.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            questions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
