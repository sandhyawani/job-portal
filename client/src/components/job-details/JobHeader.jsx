import React from "react";
import { Button } from "../ui/button";
import {
  MapPin,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Star,
} from "lucide-react";
import TrustBadge from "../TrustBadge";

const JobHeader = ({
  singleJob,
  company,
  workMode,
  isSaved,
  saving,
  isApplied,
  applying,
  match,
  onSaveToggle,
  onApplyClick,
  onBack,
}) => {
  return (
    <>
      {/* Back Link */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-4 transition cursor-pointer"
      >
        <ArrowLeft size={14} /> Back to jobs
      </button>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Job Title & Meta */}
          <div className="flex items-start gap-4">
            <img
              src={company?.logo || "/logo.png"}
              alt={company?.name || "Company"}
              className="w-16 h-16 rounded-2xl border border-slate-200 bg-white object-cover shrink-0 p-1"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {singleJob.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-sm font-semibold text-slate-700">
                  {company?.name || "Company"}
                </span>
                {company?.trustLevel && (
                  <TrustBadge trustLevel={company.trustLevel} />
                )}
                {company?.trustScore > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold">
                    <Star size={12} fill="currentColor" />
                    {company.trustScore}/100 Trust Score
                  </span>
                )}
              </div>

              {/* Key badges */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  <MapPin size={13} className="text-slate-400" />
                  {singleJob.location}
                </span>
                <span className="text-slate-300">·</span>
                <span
                  className={`font-semibold ${
                    workMode === "Remote"
                      ? "text-emerald-700"
                      : workMode === "Hybrid"
                      ? "text-indigo-700"
                      : "text-slate-700"
                  }`}
                >
                  {workMode}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500 font-medium">
                  {singleJob.jobType}
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-semibold text-slate-800">
                  ₹{singleJob.salary} LPA
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons & Match Score */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-3 shrink-0">
            {match && match.score > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 self-start lg:self-end">
                <Sparkles size={14} className="text-emerald-600" />
                <span className="text-xs font-bold">{match.score}% Profile Match</span>
              </div>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={onSaveToggle}
                disabled={saving}
                variant="outline"
                className="rounded-xl border-slate-200 text-xs font-semibold px-4 h-11 hover:bg-slate-50"
              >
                <Bookmark
                  size={16}
                  className={`mr-1.5 ${
                    isSaved ? "fill-indigo-600 text-indigo-600" : ""
                  }`}
                />
                {isSaved ? "Saved" : "Save Job"}
              </Button>

              <Button
                onClick={onApplyClick}
                disabled={isApplied || applying}
                className={`rounded-xl text-xs font-bold px-6 h-11 transition shadow-xs ${
                  isApplied
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-default"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {isApplied ? (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> Applied
                  </span>
                ) : applying ? (
                  "Submitting..."
                ) : (
                  "Apply Now"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobHeader;
