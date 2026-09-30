import React, { useState } from "react";
import { Button } from "./ui/button";
import { Bookmark, MapPin, Briefcase, IndianRupee, Clock, Sparkles } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userApi from "@/api/userApi";
import { toggleSavedJobInState } from "@/redux/jobSlice";
import { toast } from "sonner";
import { calculateJobMatch } from "@/utils/jobMatcher";
import TrustBadge from "./TrustBadge";
import { formatSalary, getValidImageUrl } from "@/utils/formatters";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { savedJobs = [] } = useSelector((store) => store.job);

  const company = job?.company;
  const isCandidate = user?.role === "student";

  // Check if job is in savedJobs array (which may contain objects or IDs)
  const isSaved = savedJobs.some(
    (item) => (item._id || item) === job?._id
  );

  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.info("Please log in to save jobs to your pipeline.");
      navigate("/login");
      return;
    }

    if (!isCandidate) {
      toast.info("Recruiters cannot save candidate jobs.");
      return;
    }

    try {
      setSaving(true);
      // Optimistic update
      dispatch(toggleSavedJobInState(job._id));

      const res = await userApi.toggleSaveJob(job._id);

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      // Revert on failure
      dispatch(toggleSavedJobInState(job._id));
      toast.error(error.response?.data?.message || "Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  const daysAgo = (date) => {
    if (!date) return "Recently";
    const diff = new Date() - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  // Determine work mode
  const workMode =
    job?.workMode ||
    (job?.location?.toLowerCase().includes("remote")
      ? "Remote"
      : job?.location?.toLowerCase().includes("hybrid")
      ? "Hybrid"
      : "On-site");

  // Calculate transparent job match score
  const matchResult = isCandidate ? calculateJobMatch(job, user) : null;

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 p-5 cursor-pointer h-full"
    >
      <div>
        {/* Top bar: Posted Date + Match Badge + Save Button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <Clock size={12} className="text-slate-400" />
              {daysAgo(job?.createdAt)}
            </span>

            {/* Match Score Badge */}
            {matchResult && matchResult.score > 0 && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-tight ${
                  matchResult.score >= 75
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : matchResult.score >= 50
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
                title={matchResult.reasons.join("\n")}
              >
                <Sparkles size={11} />
                {matchResult.score}% Match
              </span>
            )}
          </div>

          <button
            onClick={handleSaveToggle}
            disabled={saving}
            aria-label={isSaved ? "Unsave job" : "Save job"}
            className={`p-2 rounded-xl transition ${
              isSaved
                ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
            }`}
          >
            <Bookmark
              size={17}
              className={isSaved ? "fill-indigo-600 text-indigo-600" : ""}
            />
          </button>
        </div>

        {/* Company & Role Details */}
        <div className="flex items-start gap-3.5 mb-3">
          <Avatar className="h-11 w-11 rounded-xl border border-slate-200 bg-slate-50 shrink-0">
            <AvatarImage
              src={company?.logo}
              alt={company?.name || "Company"}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary-600 text-white font-bold uppercase text-lg">
              {company?.name?.charAt(0) || "C"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-1 leading-snug">
              {job?.title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-medium text-slate-600 truncate">
                {company?.name || "Company"}
              </span>
              {company?.trustLevel && (
                <TrustBadge trustLevel={company.trustLevel} />
              )}
            </div>
          </div>
        </div>

        {/* Location & Work Mode */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <MapPin size={13} className="text-slate-400 shrink-0" />
          <span className="truncate">{job?.location || "India"}</span>
          <span className="text-slate-300">·</span>
          <span
            className={`font-medium ${
              workMode === "Remote"
                ? "text-emerald-700"
                : workMode === "Hybrid"
                ? "text-indigo-700"
                : "text-slate-600"
            }`}
          >
            {workMode}
          </span>
        </div>

        {/* Meta badges: Salary & Experience & Type */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold">
            {formatSalary(job?.salary)}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
            {job?.experienceLevel || "Any Experience"}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
            {job?.jobType || "Full-time"}
          </span>
        </div>

        {/* Requirements / Key Skills tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {(job?.requirements || []).slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-medium truncate max-w-[140px]"
            >
              {skill}
            </span>
          ))}
          {(job?.requirements || []).length > 4 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-400">
              +{job.requirements.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer action buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${job?._id}`);
          }}
          variant="outline"
          className="flex-1 rounded-xl text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 h-9"
        >
          View Job
        </Button>
        <Button
          onClick={handleSaveToggle}
          className={`flex-1 rounded-xl text-xs font-semibold h-9 transition ${
            isSaved
              ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          }`}
        >
          {isSaved ? "Saved" : "Save Job"}
        </Button>
      </div>
    </div>
  );
};

export default Job;
