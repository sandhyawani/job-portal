import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import TrustBadge from "./TrustBadge";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-5 rounded-2xl shadow-sm hover:shadow-md bg-white border border-gray-200/80 hover:border-pink-300 cursor-pointer hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between"
    >
      <div>
        {/* Company information */}
        <div className="mb-2">
          <div className="flex items-center justify-between gap-2">
            <h1 className="font-bold text-base text-gray-800 group-hover:text-pink-600 transition-colors truncate">
              {job?.company?.name}
            </h1>
            <TrustBadge trustLevel={job?.company?.trustLevel} />
          </div>

          <p className="text-xs text-gray-500 mt-0.5">
            📍 {job?.location || "India"}
          </p>
        </div>

        {/* Job title and summary */}
        <div className="mt-2">
          <h2 className="font-bold text-base sm:text-lg text-gray-900 mb-1">
            {job?.title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {job?.description}
          </p>
        </div>
      </div>

      {/* Job meta details */}
      <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-gray-100">
        <Badge className="bg-pink-50 text-pink-700 text-xs px-2.5 py-0.5 rounded-md font-medium border border-pink-200">
          {job?.position} Positions
        </Badge>
        <Badge className="bg-purple-50 text-purple-700 text-xs px-2.5 py-0.5 rounded-md font-medium border border-purple-200">
          {job?.jobType}
        </Badge>
        <Badge className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-md font-medium border border-emerald-200">
          {job?.salary?.startsWith?.("₹") ? job?.salary : `₹${job?.salary}`}
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
