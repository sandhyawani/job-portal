import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Jobs = () => {
  useGetAllJobs();
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs || []);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const jobsList = allJobs || [];
    if (searchedQuery) {
      const query = searchedQuery.toLowerCase().trim();
      const filteredJobs = jobsList.filter((job) => {
        const titleMatch = job.title?.toLowerCase().includes(query);
        const descMatch = job.description?.toLowerCase().includes(query);
        const locMatch = job.location?.toLowerCase().includes(query);
        const typeMatch = job.jobType?.toLowerCase().includes(query);
        const reqMatch = Array.isArray(job?.requirements)
          ? job.requirements.some((r) => r?.toLowerCase().includes(query))
          : job?.requirements?.toLowerCase().includes(query);
        return titleMatch || descMatch || locMatch || typeMatch || reqMatch;
      });
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(jobsList);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-24 px-4 flex flex-col lg:flex-row gap-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden w-full">
          <button
            type="button"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="w-full flex items-center justify-between px-5 py-3.5 bg-white rounded-2xl shadow-sm border border-gray-200 text-gray-800 font-semibold"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-pink-500" />
              Filter Jobs
            </span>
            {showMobileFilter ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {showMobileFilter && (
            <div className="mt-3">
              <FilterCard />
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <div className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-28">
            <FilterCard />
          </div>
        </div>

        {/* Job List */}
        <div className="flex-1 flex flex-col min-h-[calc(100vh-5rem)]">
          {/* Header bar with count & active filter chip */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 px-1">
            <h1 className="text-xl font-bold text-gray-800">
              {searchedQuery ? (
                <span>
                  Results for &ldquo;<span className="text-pink-600">{searchedQuery}</span>&rdquo;
                </span>
              ) : (
                "All Available Jobs"
              )}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filterJobs.length} {filterJobs.length === 1 ? "opening" : "openings"})
              </span>
            </h1>

            {searchedQuery && (
              <button
                onClick={() => dispatch(setSearchedQuery(""))}
                className="flex items-center gap-1.5 text-xs font-semibold text-pink-700 bg-pink-100 hover:bg-pink-200 px-3 py-1.5 rounded-full transition-colors"
                title="Clear current filter"
              >
                <span>Filtered: &ldquo;{searchedQuery}&rdquo;</span>
                <span className="font-bold text-sm leading-none">&times;</span>
              </button>
            )}
          </div>

          {!allJobs || allJobs.length === 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-4/5" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filterJobs.length <= 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center py-16 px-4 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-3">
                <SlidersHorizontal size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No jobs found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                Try changing your search or removing some filters to discover open roles.
              </p>
              {searchedQuery && (
                <button
                  onClick={() => dispatch(setSearchedQuery(""))}
                  className="mt-4 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold rounded-xl shadow-2xs transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pb-6 pr-2">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                <AnimatePresence>
                  {filterJobs.map((job, index) => (
                    <motion.div
                      key={job?._id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="hover:scale-[1.02] transition-transform"
                    >
                      <Job job={job} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
