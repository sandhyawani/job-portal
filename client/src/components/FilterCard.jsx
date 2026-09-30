import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, resetFilters } from "@/redux/jobSlice";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  RotateCcw,
  MapPin,
  Briefcase,
  Laptop,
  IndianRupee,
  Clock,
  Sparkles,
} from "lucide-react";

const LOCATIONS = [
  "All",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Delhi",
  "Mumbai",
  "Remote",
  "Chennai",
  "Noida",
  "Gurugram",
];

const WORK_MODES = ["All", "Remote", "Hybrid", "On-site"];

const JOB_TYPES = ["All", "Full-time", "Part-time", "Internship", "Contract"];

const EXPERIENCES = ["All", "Fresher / College", "1-3 years", "3-5 years", "5+ years"];

const DATE_POSTED_OPTIONS = [
  { label: "Anytime", value: "all" },
  { label: "Past 24 hours", value: "24h" },
  { label: "Past week", value: "7d" },
  { label: "Past 14 days", value: "14d" },
  { label: "Past month", value: "30d" },
];

const FilterCard = ({ onApplyMobileFilter }) => {
  const dispatch = useDispatch();
  const { filters } = useSelector((store) => store.job);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <span>Filter Jobs</span>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs text-slate-500 hover:text-teal-600 flex items-center gap-1 h-8 px-2"
        >
          <RotateCcw size={13} /> Reset
        </Button>
      </div>

      {/* Work Mode Chips */}
      <div>
        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2.5">
          Work Mode
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {WORK_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => handleFilterChange("workMode", mode)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                filters.workMode === mode
                  ? "bg-teal-50 border-teal-600 text-teal-700 font-semibold"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2.5">
          Location
        </Label>
        <select
          value={filters.location || "All"}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="w-full text-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Experience Level */}
      <div>
        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2.5">
          Experience Level
        </Label>
        <div className="flex flex-col gap-1.5">
          {EXPERIENCES.map((exp) => (
            <label
              key={exp}
              className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <input
                type="radio"
                name="experience"
                value={exp}
                checked={filters.experience === exp}
                onChange={() => handleFilterChange("experience", exp)}
                className="text-teal-600 focus:ring-teal-500 rounded-full"
              />
              <span>{exp}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Job Type */}
      <div>
        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2.5">
          Job Type
        </Label>
        <div className="flex flex-col gap-1.5">
          {JOB_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <input
                type="radio"
                name="jobType"
                value={type}
                checked={filters.jobType === type}
                onChange={() => handleFilterChange("jobType", type)}
                className="text-teal-600 focus:ring-teal-500 rounded-full"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Filter (LPA) */}
      <div>
        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
          Salary (₹ LPA)
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min LPA"
            value={filters.salaryMin || ""}
            onChange={(e) => handleFilterChange("salaryMin", e.target.value)}
            className="text-xs h-9 rounded-xl border-slate-200"
          />
          <Input
            type="number"
            placeholder="Max LPA"
            value={filters.salaryMax || ""}
            onChange={(e) => handleFilterChange("salaryMax", e.target.value)}
            className="text-xs h-9 rounded-xl border-slate-200"
          />
        </div>
      </div>

      {/* Date Posted */}
      <div>
        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2.5">
          Date Posted
        </Label>
        <div className="flex flex-col gap-1.5">
          {DATE_POSTED_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <input
                type="radio"
                name="datePosted"
                value={opt.value}
                checked={(filters.datePosted || "all") === opt.value}
                onChange={() => handleFilterChange("datePosted", opt.value)}
                className="text-teal-600 focus:ring-teal-500 rounded-full"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {onApplyMobileFilter && (
        <Button
          onClick={onApplyMobileFilter}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold py-2.5 mt-2"
        >
          Apply Filters
        </Button>
      )}
    </div>
  );
};

export default FilterCard;