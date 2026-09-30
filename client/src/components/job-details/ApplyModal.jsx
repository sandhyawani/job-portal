import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { formatSalary } from "@/utils/formatters";

const ApplyModal = ({
  open,
  onOpenChange,
  singleJob,
  company,
  user,
  coverNote,
  setCoverNote,
  onConfirm,
  applying,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900">
            Review Your Application
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Confirm your details before submitting to {company?.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2 text-xs">
          {/* Target Job Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Applying For
            </span>
            <h4 className="text-sm font-bold text-slate-900">{singleJob?.title}</h4>
            <p className="text-slate-600 mt-0.5">
              {company?.name} · {singleJob?.location} · {formatSalary(singleJob?.salary)}
            </p>
          </div>

          {/* Candidate Profile Details */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Profile Information Being Submitted
            </span>
            <div className="grid grid-cols-2 gap-2.5 text-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 block">Full Name</span>
                <span className="font-semibold text-slate-900">{user?.fullname || "Candidate"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Email Address</span>
                <span className="font-semibold text-slate-900">{user?.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Phone</span>
                <span className="font-semibold text-slate-900">{user?.phoneNumber || "Not provided"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Location</span>
                <span className="font-semibold text-slate-900">{user?.profile?.location || "India"}</span>
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Attached Resume
            </span>
            {user?.profile?.resume ? (
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 truncate max-w-[260px]">
                  📄 {user.profile.resumeOriginalName || "Candidate_Resume.pdf"}
                </span>
                <a
                  href={user.profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
                >
                  Preview <ExternalLink size={12} />
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-between text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <span className="text-[11px]">No resume uploaded yet.</span>
                <Link to="/profile" className="font-bold underline text-[11px] text-primary-600">
                  Upload Resume →
                </Link>
              </div>
            )}
          </div>

          {/* Optional Cover Note */}
          <div>
            <label className="text-slate-700 font-semibold block mb-1">
              Brief Note to Hiring Team (Optional)
            </label>
            <textarea
              rows={2}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Mention availability, relevant achievements, or why you're a great fit..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs font-semibold px-4"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={applying}
            className="rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white px-6 shadow-xs"
          >
            {applying ? "Submitting..." : "Confirm & Submit Application"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyModal;
