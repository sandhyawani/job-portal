import React from "react";
import { Link } from "react-router-dom";
import { Search, Bookmark } from "lucide-react";
import { Button } from "../../ui/button";
import Job from "../../Job";

const SavedJobsTab = ({
  savedJobs = [],
  filteredSavedJobs = [],
  searchSaved,
  setSearchSaved,
  savedFilter,
  setSavedFilter,
  toApplyCount,
  appliedSavedCount,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 flex-1 px-2">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search saved jobs by title, company, location..."
            value={searchSaved}
            onChange={(e) => setSearchSaved(e.target.value)}
            className="w-full text-xs text-slate-900 outline-none bg-transparent"
          />
        </div>

        {/* Triage filter pills */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0">
          <button
            onClick={() => setSavedFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              savedFilter === "all"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({savedJobs.length})
          </button>
          <button
            onClick={() => setSavedFilter("to_apply")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              savedFilter === "to_apply"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            To Apply ({toApplyCount})
          </button>
          <button
            onClick={() => setSavedFilter("applied")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              savedFilter === "applied"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Applied ({appliedSavedCount})
          </button>
        </div>
      </div>

      {filteredSavedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Bookmark size={32} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No saved jobs</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            When browsing jobs, click the bookmark icon to save opportunities here for later.
          </p>
          <Link to="/jobs">
            <Button className="mt-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white">
              Explore Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSavedJobs.map((job) => (
            <Job key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsTab;
