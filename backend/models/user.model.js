import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: ['student', 'recruiter', 'admin'],
        required: true,
        default: 'student',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    profile: {
        bio: { type: String, default: "" },
        skills: [{ type: String }],
        resume: { type: String, default: "" }, // URL to resume file
        resumeOriginalName: { type: String, default: "" },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, 
        profilePhoto: {
            type: String,
            default: ""
        },
        experience: { type: String, default: "" },
        education: { type: String, default: "" },
        location: { type: String, default: "" },
        github: { type: String, default: "" },
        portfolio: { type: String, default: "" },
        expectedSalary: { type: Number, default: 0 },
        preferredJobType: { type: String, default: "" },
        preferredWorkMode: { type: String, default: "" },
        projects: [
            {
                title: { type: String, default: "" },
                description: { type: String, default: "" },
                link: { type: String, default: "" },
            }
        ]
    },
    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
        }
    ],
}, { timestamps: true }); 
export const User = mongoose.model('User', userSchema);