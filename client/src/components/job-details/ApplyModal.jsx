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
      <DialogContent className="sm:max-w-lg bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900">
            Review Your Application
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Confirm your details before submitting to {company?.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-1 text-xs">
          {/* Target Job Box */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Applying For
            </span>
            <h4 className="text-sm font-bold text-slate-900">{singleJob?.title}</h4>
            <p className="text-slate-600 text-xs mt-0.5">
              {company?.name} · {singleJob?.location} · {formatSalary(singleJob?.salary)}
            </p>
          </div>

          {/* Candidate Profile Details */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Profile Information Being Submitted
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-700 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Full Name</span>
                <span className="font-semibold text-slate-900 truncate block">{user?.fullname || "Candidate"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Email Address</span>
                <span className="font-semibold text-slate-900 truncate block">{user?.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Phone</span>
                <span className="font-semibold text-slate-900 truncate block">{user?.phoneNumber || "Not provided"}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Location</span>
                <span className="font-semibold text-slate-900 truncate block">{user?.profile?.location || "India"}</span>
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Attached Resume
            </span>
            {user?.profile?.resume ? (
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 truncate max-w-[240px] text-xs">
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
              <div className="flex items-center justify-between text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                <span className="text-[11px]">No resume uploaded yet.</span>
                <Link to="/profile" className="font-bold underline text-[11px] text-primary-600">
                  Upload Resume →
                </Link>
              </div>
            )}
          </div>

          {/* Optional Cover Note */}
          <div>
            <label className="text-slate-700 font-semibold block mb-1 text-xs">
              Brief Note to Hiring Team (Optional)
            </label>
            <textarea
              rows={2}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Mention availability, relevant achievements, or why you're a great fit..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20"
            />
          </div>

          {/* Informative Process Steps */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs text-slate-600">
            <span className="font-bold text-slate-800 text-[10px] uppercase tracking-wider block mb-0.5">
              What happens after submission?
            </span>
            <ul className="space-y-0.5 text-[11px] text-slate-600 list-disc list-inside">
              <li>Profile & resume are delivered directly to the recruiter.</li>
              <li>Hiring team reviews credentials and updates stage status.</li>
              <li>Track progress and interview calls in your Application Tracker.</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-3 pt-2.5 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs font-semibold px-4 h-9"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={applying}
            className="rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white px-5 h-9 shadow-xs"
          >
            {applying ? "Submitting..." : "Confirm & Submit Application"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyModal;
