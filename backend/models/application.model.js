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
            status: { type: String, required: true },
            changedAt: { type: Date, default: Date.now },
            comment: { type: String, default: "" },
            changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
    ]
},{timestamps:true});
export const Application  = mongoose.model("Application", applicationSchema);