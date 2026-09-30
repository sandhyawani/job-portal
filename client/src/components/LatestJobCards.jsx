import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import TrustBadge from "./TrustBadge";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-5 rounded-2xl bg-white border border-slate-200 cursor-pointer hover:border-teal-300 hover:shadow-xs transition group flex flex-col justify-between"
    >
      <div>
        {/* Company information */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h2 className="font-semibold text-xs text-slate-500 group-hover:text-teal-600 transition">
              {job?.company?.name || "Company"}
            </h2>
            <h3 className="font-bold text-base text-slate-900 mt-0.5 line-clamp-1">
              {job?.title}
            </h3>
          </div>
          <TrustBadge trustLevel={job?.company?.trustLevel} />
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
          {job?.description}
        </p>
      </div>

      {/* Job meta details */}
      <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 text-xs">
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
          {job?.location || "Remote"}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 font-medium">
          {job?.jobType || "Full-time"}
        </span>
        {job?.salary && (
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold">
            ₹{job?.salary} LPA
          </span>
        )}
      </div>
    </div>
  );
};

export default LatestJobCards;
