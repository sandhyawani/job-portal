import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  console.log("Job received in card:", job); // Debug

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-pink-50 to-white border border-gray-100 cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out group"
    >
      {/* Company */}
      <div className="mb-3">
        <h1 className="font-semibold text-lg text-gray-800 group-hover:text-pink-500 transition-colors">
          {job?.company?.name}
        </h1>
        <p className="text-sm text-gray-500">{job?.location || "India"}</p>
      </div>

      {/* Job Title & Description */}
      <div>
        <h1 className="font-bold text-xl text-gray-900 mb-2">{job?.title}</h1>
        <p className="text-sm text-gray-600 line-clamp-3">{job?.description}</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-5">
        <Badge className="text-pink-700 font-bold px-3 py-1 rounded-full" variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className="text-pink-500 font-bold px-3 py-1 rounded-full" variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="text-pink-600 font-bold px-3 py-1 rounded-full" variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
