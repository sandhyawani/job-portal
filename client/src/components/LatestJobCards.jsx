import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TrustBadge from "./TrustBadge";
import { Zap, MapPin } from "lucide-react";
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

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const skillMatch = calculateSkillMatch(user?.profile?.skills, job);
  const takeHome = calculateMonthlyTakeHome(job?.salary);

  const positions = job?.position || 1;
  const positionLabel = `${positions} ${positions === 1 ? "Position" : "Positions"}`;
  const jobTypeLabel = formatJobType(job?.jobType);
  const salaryLabel = formatSalaryDisplay(job?.salary, takeHome);

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-5 rounded-2xl shadow-xs hover:shadow-md bg-white border border-gray-200/80 hover:border-pink-300 cursor-pointer hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between h-full min-h-[230px]"
    >
      <div>
        {/* Company header row */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-pink-600 transition-colors truncate">
              {job?.company?.name || "Company"}
            </h3>
            <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 truncate">
              <MapPin size={12} className="text-gray-400 shrink-0" />
              <span>{job?.location || "India"}</span>
            </p>
          </div>
          <TrustBadge trustLevel={job?.company?.trustLevel} />
        </div>

        {/* Job title & description */}
        <div className="mt-1">
          <h4 className="font-bold text-base text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1 mb-1">
            {job?.title}
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {job?.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Footer metadata badges */}
      <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-gray-100">
        {skillMatch.hasSkills && skillMatch.matchPercentage > 0 && (
          <span
            className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1"
            title={`Matched skills: ${skillMatch.matchedSkills.join(", ")}`}
          >
            <Zap size={10} className="fill-current text-indigo-600" />
            {skillMatch.matchPercentage}% Match
          </span>
        )}
        <Badge className="bg-pink-50 text-pink-700 text-xs px-2.5 py-0.5 rounded-md font-medium border border-pink-200">
          {positionLabel}
        </Badge>
        <Badge className="bg-purple-50 text-purple-700 text-xs px-2.5 py-0.5 rounded-md font-medium border border-purple-200">
          {jobTypeLabel}
        </Badge>
        <Badge className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-md font-medium border border-emerald-200">
          {salaryLabel}
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
