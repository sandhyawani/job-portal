import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending', 'review', 'shortlisted', 'accepted', 'interview', 'offer', 'hired', 'rejected'],
        default:'pending'
    },
    notes: {
        type: String,
        default: ""
    },
    interviewDate: {
        type: Date
    },
    statusHistory: [
        {
            previousStatus: { type: String, default: "" },
            status: { type: String, required: true },
            changedAt: { type: Date, default: Date.now },
            comment: { type: String, default: "" },
            changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
    ]
},{timestamps:true});

// Enforce unique application per candidate per job at database level
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ applicant: 1 });
applicationSchema.index({ status: 1 });

export const Application  = mongoose.model("Application", applicationSchema);