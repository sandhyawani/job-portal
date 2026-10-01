import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./shared/Navbar";
import MobileBottomNav from "./shared/MobileBottomNav";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector, useDispatch } from "react-redux";
import { setFilters, setPagination, resetFilters } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import useGetSavedJobs from "@/hooks/useGetSavedJobs";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  RotateCcw,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const Jobs = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { allJobs = [], filters, pagination, loading } = useSelector(
    (store) => store.job
  );

  // Load saved jobs for candidate bookmark indicators
  useGetSavedJobs();

  // Load jobs based on Redux filters
  useGetAllJobs();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("keyword") || filters.keyword || "");
  const [locationInput, setLocationInput] = useState(
    searchParams.get("location") || (filters.location !== "All" ? filters.location : "") || ""
  );

  // Sync from URL params on initial mount
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");
    const urlLocation = searchParams.get("location");
    const urlWorkMode = searchParams.get("workMode");
    const urlJobType = searchParams.get("jobType");
    const urlExperience = searchParams.get("experience");
    const urlSort = searchParams.get("sort");
    const urlPage = parseInt(searchParams.get("page") || "1", 10);

    const initialFilters = {};
    if (urlKeyword !== null) {
      initialFilters.keyword = urlKeyword;
      setSearchInput(urlKeyword);
    }
    if (urlLocation !== null) {
      initialFilters.location = urlLocation || "All";
      setLocationInput(urlLocation || "");
    }
    if (urlWorkMode !== null) initialFilters.workMode = urlWorkMode;
    if (urlJobType !== null) initialFilters.jobType = urlJobType;
    if (urlExperience !== null) initialFilters.experience = urlExperience;
    if (urlSort !== null) initialFilters.sort = urlSort;

    if (Object.keys(initialFilters).length > 0) {
      dispatch(setFilters(initialFilters));
    }
    if (urlPage && urlPage !== pagination?.currentPage) {
      dispatch(setPagination({ currentPage: urlPage }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync to URL params whenever filters or page change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.location && filters.location !== "All") params.set("location", filters.location);
    if (filters.workMode && filters.workMode !== "All") params.set("workMode", filters.workMode);
    if (filters.jobType && filters.jobType !== "All") params.set("jobType", filters.jobType);
    if (filters.experience && filters.experience !== "All") params.set("experience", filters.experience);
    if (filters.sort && filters.sort !== "newest") params.set("sort", filters.sort);
    if (pagination?.currentPage > 1) params.set("page", String(pagination.currentPage));

    setSearchParams(params, { replace: true });
  }, [filters, pagination?.currentPage, setSearchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setFilters({
        keyword: searchInput.trim(),
        location: locationInput.trim() || "All",
      })
    );
    dispatch(setPagination({ currentPage: 1 }));
  };

  const handleSortChange = (e) => {
    dispatch(setFilters({ sort: e.target.value }));
    dispatch(setPagination({ currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPagination({ currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilter = (key, defaultValue = "All") => {
    dispatch(setFilters({ [key]: defaultValue }));
    if (key === "keyword") setSearchInput("");
    if (key === "location") setLocationInput("");
  };

  const handleResetAll = () => {
    dispatch(resetFilters());
    setSearchInput("");
    setLocationInput("");
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const hasActiveFilters =
    Boolean(filters.keyword) ||
    (filters.location && filters.location !== "All") ||
    (filters.workMode && filters.workMode !== "All") ||
    (filters.jobType && filters.jobType !== "All") ||
    (filters.experience && filters.experience !== "All") ||
    Boolean(filters.salaryMin) ||
    Boolean(filters.salaryMax) ||
    (filters.datePosted && filters.datePosted !== "all");

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-8">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6">
        {/* Top Header & Search Bar */}
        <div className="mb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Discover Jobs
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Explore real, verified opportunities matching your career goals.
              </p>
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                <SlidersHorizontal size={14} />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-primary-600"></span>
                )}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  Sort by:
                </span>
                <select
                  value={filters.sort || "newest"}
                  onChange={handleSortChange}
                  className="text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="newest">Newest First</option>
                  <option value="relevance">Relevance</option>
                  <option value="salary_desc">Salary: High to Low</option>
                  <option value="salary_asc">Salary: Low to High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dual Search Bar: Keyword & Location */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs"
          >
            {/* Title / Skill / Company */}
            <div className="flex items-center flex-1 w-full px-3 gap-2 py-1">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills (Python, React...), company"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    clearFilter("keyword", "");
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="hidden sm:block h-6 w-px bg-slate-200"></div>

            {/* Location */}
            <div className="flex items-center sm:w-60 w-full px-3 gap-2 py-1">
              <MapPin size={17} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="City or 'Remote'"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none"
              />
              {locationInput && (
                <button
                  type="button"
                  onClick={() => {
                    setLocationInput("");
                    clearFilter("location", "All");
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <Button
              type="submit"
              className="w-full sm:w-auto rounded-xl px-6 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold h-10 shadow-xs transition"
            >
              Search Jobs
            </Button>
          </form>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2">
              <span className="text-xs font-medium text-slate-500">Active:</span>

              {filters.keyword && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                  Keyword: {filters.keyword}
                  <button
                    onClick={() => clearFilter("keyword", "")}
                    className="hover:text-primary-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {filters.location && filters.location !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Location: {filters.location}
                  <button
                    onClick={() => clearFilter("location", "All")}
                    className="hover:text-slate-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {filters.workMode && filters.workMode !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Mode: {filters.workMode}
                  <button
                    onClick={() => clearFilter("workMode", "All")}
                    className="hover:text-slate-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {filters.experience && filters.experience !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Exp: {filters.experience}
                  <button
                    onClick={() => clearFilter("experience", "All")}
                    className="hover:text-slate-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {filters.jobType && filters.jobType !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Type: {filters.jobType}
                  <button
                    onClick={() => clearFilter("jobType", "All")}
                    className="hover:text-slate-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {(filters.salaryMin || filters.salaryMax) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  ₹{filters.salaryMin || "0"} - ₹{filters.salaryMax || "Any"} LPA
                  <button
                    onClick={() => {
                      clearFilter("salaryMin", "");
                      clearFilter("salaryMax", "");
                    }}
                    className="hover:text-slate-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetAll}
                className="text-xs text-primary-600 hover:text-primary-800 font-semibold ml-1 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw size={12} /> Clear all
              </button>
            </div>
          )}
        </div>

        {/* Content Layout: Sidebar + Grid */}
        <div className="flex gap-6 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="w-72 hidden lg:block shrink-0 sticky top-24">
            <FilterCard />
          </aside>

          {/* Job Results */}
          <section className="flex-1 min-w-0">
            {/* Results count header */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-4">
              <span>
                Showing {allJobs.length} of {pagination.totalJobs || allJobs.length} jobs
              </span>
              {pagination.totalPages > 1 && (
                <span>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
              )}
            </div>

            {/* Loading skeletons */}
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 rounded-2xl bg-white border border-slate-200 p-5 animate-pulse flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                    </div>
                    <div className="h-8 bg-slate-100 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : allJobs.length === 0 ? (
              /* Meaningful Empty State */
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
                  <Briefcase size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  No matching jobs found
                </h3>
                <p className="text-sm text-slate-500 max-w-md mt-1 mb-6">
                  We couldn't find any opportunities matching your active criteria. Try
                  expanding your search or resetting filters.
                </p>
                <Button
                  onClick={() => {
                    dispatch(resetFilters());
                    setSearchInput("");
                  }}
                  variant="outline"
                  className="rounded-xl border-slate-200 text-xs font-semibold gap-2"
                >
                  <RotateCcw size={14} /> Reset all filters
                </Button>
              </div>
            ) : (
              /* Job Cards Grid */
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {allJobs.map((job) => (
                  <Job key={job._id} job={job} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage <= 1}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  className="rounded-xl border-slate-200 text-xs font-medium gap-1"
                >
                  <ChevronLeft size={14} /> Previous
                </Button>

                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-semibold transition ${
                        pagination.currentPage === pageNum
                          ? "bg-primary-600 text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  className="rounded-xl border-slate-200 text-xs font-medium gap-1"
                >
                  Next <ChevronRight size={14} />
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile Filters Dialog / Drawer */}
      <Dialog open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto p-0 rounded-2xl bg-white border border-slate-200">
          <DialogHeader className="p-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
            <DialogTitle className="text-base font-bold text-slate-900">
              Filter Opportunities
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <FilterCard
              onApplyMobileFilter={() => setMobileFilterOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <MobileBottomNav />
    </div>
  );
};

export default Jobs;
