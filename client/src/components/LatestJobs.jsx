import React from "react";
import { useSelector } from "react-redux";
import Job from "./Job";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const LatestJobs = () => {
  const { allJobs = [], loading } = useSelector((store) => store.job);

  // Take the first 6 latest jobs
  const displayJobs = allJobs.slice(0, 6);

  return (
    <section className="py-8 sm:py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary-600 uppercase tracking-wider mb-1">
            <Sparkles size={13} />
            <span>Latest Openings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recently Posted Opportunities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified opportunities from companies actively hiring now
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-800 transition self-start sm:self-auto"
        >
          View all {allJobs.length} jobs <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-60 rounded-2xl bg-white border border-slate-200 p-5 animate-pulse"
            />
          ))}
        </div>
      ) : displayJobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayJobs.map((job) => (
            <Job key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          No jobs currently available.
        </div>
      )}
    </section>
  );
};

export default LatestJobs;
