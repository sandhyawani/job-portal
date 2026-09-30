import mongoose from "mongoose";

const interviewQuestionSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    subTopic: {
        type: String,
        trim: true,
        default: ""
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
        default: 'Medium'
    },
    type: {
        type: String,
        enum: ['Conceptual', 'Coding', 'Behavioral', 'Scenario'],
        default: 'Conceptual'
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    keyPoints: [{
        type: String
    }],
    codeExample: {
        type: String,
        default: ""
    },
    interviewTip: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export const InterviewQuestion = mongoose.model("InterviewQuestion", interviewQuestionSchema);