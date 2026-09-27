import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import MobileBottomNav from "./shared/MobileBottomNav";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { Search, Briefcase } from "lucide-react";
import { Button } from "./ui/button";

const Browse = () => {
  useGetAllJobs();
  const { allJobs = [], filters } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const [keywordInput, setKeywordInput] = useState(filters.keyword || "");

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ keyword: keywordInput.trim() }));
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-16">
      <Navbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Browse Open Positions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Explore {allJobs.length} active opportunities from top companies
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-2xs sm:w-80"
          >
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by title, skill, or role..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              className="w-full text-xs text-slate-900 bg-transparent outline-none"
            />
            <Button
              type="submit"
              size="sm"
              className="rounded-xl text-xs font-semibold bg-indigo-600 text-white h-7 px-3"
            >
              Search
            </Button>
          </form>
        </div>

        {allJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allJobs.map((job) => (
              <Job key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
            <Briefcase size={36} className="mx-auto mb-2 text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No jobs found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with different keywords or location.
            </p>
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default Browse;
