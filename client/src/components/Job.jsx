import React from "react";
import { Button } from "./ui/button";
import { Bookmark, Star, MapPin, Briefcase, Zap, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import TrustBadge from "./TrustBadge";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setSavedJobs } from "@/redux/authSlice";
import { toast } from "sonner";
import { calculateSkillMatch } from "@/utils/skillMatcher";
import { calculateMonthlyTakeHome } from "@/utils/salaryCalculator";

const formatJobType = (type) => {
  if (!type) return "Full-Time";
  const str = String(type).trim().toLowerCase();
  if (str === "full time" || str === "full-time" || str === "fulltime") return "Full-Time";
  if (str === "part time" || str === "part-time" || str === "parttime") return "Part-Time";
  if (str === "internship" || str === "intern") return "Internship";
  if (str === "contract") return "Contract";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatSalaryDisplay = (rawSalary, takeHome) => {
  if (takeHome?.valid) return takeHome.formattedInHand;
  if (!rawSalary) return "Competitive";
  const clean = String(rawSalary).replace(/[₹,]/g, "").trim();
  const num = parseFloat(clean);
  if (isNaN(num) || num <= 0) return "Competitive";
  if (num <= 100) return `₹${num} LPA`;
  return `₹${num.toLocaleString("en-IN")}/mo`;
};

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { allAppliedJobs } = useSelector((store) => store.job);
  const company = job?.company;

  const skillMatch = calculateSkillMatch(user?.profile?.skills, job);
  const takeHome = calculateMonthlyTakeHome(job?.salary);
  const applicantCount = job?.applications?.length || 0;

  const daysAgo = (date) => {
    const diff = new Date() - new Date(date);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const isApplied = Boolean(
    allAppliedJobs?.some((app) => {
      const appId = typeof app?.job === "object" ? app?.job?._id : app?.job;
      return appId?.toString() === job?._id?.toString();
    })
  );

  const isSaved = Boolean(
    user?.savedJobs?.some((saved) => {
      const id = typeof saved === "object" ? saved?._id : saved;
      return id?.toString() === job?._id?.toString();
    })
  );

  const saveJobHandler = async (e) => {
    e?.stopPropagation?.();
    if (!user) {
      toast.error("Please login to save jobs");
      return;
    }

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/save-job/${job?._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setSavedJobs(res.data.savedJobs));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update saved jobs");
    }
  };

  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="
        group flex flex-col justify-between rounded-2xl bg-white
        border border-gray-200/80 shadow-xs
        hover:-translate-y-1 hover:shadow-lg hover:border-pink-300
        transition-all duration-200 cursor-pointer p-5 h-full min-h-[320px]
      "
    >
      <div>
        {/* HEADER ROW */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <span className="text-[11px] text-gray-500">
              {job?.createdAt
                ? daysAgo(job.createdAt) === 0
                  ? "Today"
                  : `${daysAgo(job.createdAt)}d ago`
                : "Recently"}
            </span>

            {isApplied && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                <Check size={10} className="stroke-[2.5]" />
                <span>Applied</span>
              </span>
            )}

            {skillMatch.hasSkills && skillMatch.matchPercentage > 0 && (
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full border flex items-center gap-1 ${
                  skillMatch.matchPercentage >= 70
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                }`}
                title={
                  skillMatch.matchedSkills.length > 0
                    ? `Matched: ${skillMatch.matchedSkills.slice(0, 3).join(", ")}`
                    : "Skills match"
                }
              >
                <Zap size={10} className="fill-current text-purple-600" />
                {skillMatch.matchPercentage}% Match
              </span>
            )}
          </div>

          <Button
            onClick={saveJobHandler}
            variant="ghost"
            size="icon"
            aria-label={isSaved ? "Remove from saved jobs" : "Save this job"}
            title={isSaved ? "Remove from saved" : "Save job"}
            className={`w-8 h-8 rounded-full transition-colors shrink-0 ${
              isSaved
                ? "bg-pink-50 text-pink-600 hover:bg-pink-100"
                : "text-gray-400 hover:text-pink-600 hover:bg-pink-50"
            }`}
          >
            <Bookmark
              size={15}
              className={`${
                isSaved ? "text-pink-600 fill-pink-600" : ""
              }`}
            />
          </Button>
        </div>

        {/* JOB TITLE & COMPANY */}
        <div className="pt-3">
          <h2 className="font-bold text-base text-gray-900 line-clamp-1 group-hover:text-pink-600 transition-colors">
            {job?.title}
          </h2>

          <div className="flex items-center gap-2 mt-1">
            <span className="font-semibold text-xs text-gray-700 truncate max-w-[150px]">
              {company?.name || "Company"}
            </span>
            <TrustBadge trustLevel={company?.trustLevel} />
          </div>

          {/* KEY DETAILS STRIP: Location, Type, Salary */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-2.5">
            <span className="flex items-center gap-1 truncate">
              <MapPin size={12} className="text-gray-400 shrink-0" />
              {job?.location || "India"}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={12} className="text-gray-400 shrink-0" />
              {formatJobType(job?.jobType)}
            </span>
            <span className="font-semibold text-emerald-700">
              {formatSalaryDisplay(job?.salary, takeHome)}
            </span>
          </div>

          {/* DESCRIPTION */}
          <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
            {job?.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* FOOTER & ACTIONS */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge className="bg-pink-50 text-pink-700 border border-pink-200 text-[11px] font-medium px-2 py-0.5">
            {job?.position || 1} {job?.position === 1 ? "Position" : "Positions"}
          </Badge>
          {applicantCount <= 5 && (
            <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium px-2 py-0.5">
              🟢 Low Competition
            </Badge>
          )}
        </div>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/description/${job?._id}`);
          }}
          size="sm"
          className="rounded-xl font-bold text-xs bg-pink-600 hover:bg-pink-700 text-white px-3.5 py-1.5 shadow-2xs transition-all"
        >
          View Job
        </Button>
      </div>
    </div>
  );
};

export default Job;


