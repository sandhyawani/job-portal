import React from "react";
import { Button } from "./ui/button";
import { Bookmark, Star, MapPin } from "lucide-react";
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
import { Zap } from "lucide-react";

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
      className="
        group min-h-[430px] h-full flex flex-col rounded-2xl bg-white
        border border-gray-100 shadow-md
        hover:-translate-y-1 hover:shadow-2xl hover:border-pink-300
        transition-all duration-300
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-xs text-gray-500 mr-1">
            {job?.createdAt
              ? daysAgo(job.createdAt) === 0
                ? "Today"
                : `${daysAgo(job.createdAt)}d ago`
              : "Recently"}
          </p>
          {isApplied && (
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
              ✓ Applied
            </span>
          )}
          {skillMatch.hasSkills && skillMatch.matchPercentage > 0 && (
            <span
              className={`px-2 py-0.5 text-[11px] font-bold rounded-full border flex items-center gap-1 ${
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
          variant="outline"
          size="icon"
          title={isSaved ? "Remove from saved" : "Save job"}
          className={`rounded-full transition-colors ${
            isSaved ? "border-pink-500 bg-pink-50" : "hover:border-pink-300"
          }`}
        >
          <Bookmark
            size={18}
            className={`${
              isSaved ? "text-pink-600 fill-pink-600" : "text-pink-500"
            }`}
          />
        </Button>
      </div>

      {/* COMPANY */}
      <div className="flex gap-3 px-5 pt-4">
        <Avatar className="w-12 h-12 border shrink-0">
          {company?.logo && (
            <AvatarImage
              src={company.logo}
              alt={company?.name}
            />
          )}
          <AvatarFallback className="bg-pink-100 text-pink-700 font-bold text-base">
            {company?.name ? company.name[0].toUpperCase() : "C"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
            {company?.name}
          </h3>

          <div className="flex items-center gap-3 mt-1">
            <TrustBadge trustLevel={company?.trustLevel} />

            {company?.trustScore && (
              <span className="flex items-center gap-1 text-xs text-yellow-600">
                <Star size={12} fill="currentColor" />
                <span className="font-medium">
                  {company.trustScore}/100
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* JOB TITLE */}
      <div className="px-5 pt-4">
        <h2 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-pink-700 transition">
          {job?.title}
        </h2>

        {/* LOCATION */}
        <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <MapPin size={12} />
          {job?.location}
        </p>
      </div>

      {/* DESCRIPTION */}
      <div className="px-5 pt-3 flex-1">
        <p className="text-sm text-gray-600 line-clamp-3 min-h-[3.75rem] leading-relaxed">
          {job?.description || "No description provided."}
        </p>
      </div>

      {/* TAGS */}
      <div className="flex flex-wrap items-center gap-1.5 px-5 pb-3">
        <Badge className="bg-pink-50 text-pink-700 border border-pink-200 text-xs font-medium">
          {job?.position || 1} {job?.position === 1 ? "Position" : "Positions"}
        </Badge>
        <Badge className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-medium">
          {formatJobType(job?.jobType)}
        </Badge>
        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
          {formatSalaryDisplay(job?.salary, takeHome)}
        </Badge>
        {applicantCount <= 5 && (
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium">
            🟢 Low Competition
          </Badge>
        )}
      </div>

      {/* FOOTER */}
      <div className="px-5 pb-4 pt-3 border-t flex gap-3">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="flex-1 border-pink-500 text-pink-500 rounded-full"
        >
          View Details
        </Button>

        <Button
          onClick={saveJobHandler}
          className={`flex-1 rounded-full font-medium transition-all duration-300 ${
            isSaved
              ? "bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-300"
              : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:scale-105"
          }`}
        >
          {isSaved ? "✓ Saved" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default Job;


