import React from "react";
import { Button } from "./ui/button";
import { Bookmark, Star, MapPin } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import TrustBadge from "./TrustBadge";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const company = job?.company;

  const daysAgo = (date) => {
    const diff = new Date() - new Date(date);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div
      className="
        group h-[440px] flex flex-col rounded-2xl bg-white
        border border-gray-100 shadow-md
        hover:-translate-y-1 hover:shadow-2xl hover:border-pink-300
        transition-all duration-300
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 pt-4">
        <p className="text-xs text-gray-500">
          {job?.createdAt
            ? daysAgo(job.createdAt) === 0
              ? "Today"
              : `${daysAgo(job.createdAt)} days ago`
            : "Recently"}
        </p>

        <Button variant="outline" size="icon" className="rounded-full">
          <Bookmark size={18} className="text-pink-500" />
        </Button>
      </div>

      {/* COMPANY */}
      <div className="flex gap-3 px-5 pt-4">
        <Avatar className="w-12 h-12 border shrink-0">
          <AvatarImage
            src={company?.logo || "/logo.png"}
            alt={company?.name}
          />
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
                  {company.trustScore}/5
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
        <p className="text-sm text-gray-600 line-clamp-3">
          {job?.description}
        </p>
      </div>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 px-5 pb-3">
        <Badge className="bg-pink-100 text-pink-700 text-xs">
          {job?.position} Positions
        </Badge>
        <Badge className="bg-pink-200 text-pink-700 text-xs">
          {job?.jobType}
        </Badge>
        <Badge className="bg-pink-300 text-pink-700 text-xs">
          {job?.salary}
        </Badge>
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

        <Button className="flex-1 rounded-full bg-gradient-to-r from-pink-500 to-pink-700 text-white">
          Save
        </Button>
      </div>
    </div>
  );
};

export default Job;


