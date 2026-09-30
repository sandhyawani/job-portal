import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFilters } from "@/redux/jobSlice";

const POPULAR_SEARCHES = [
  "Python Developer",
  "React",
  "Full Stack",
  "Django",
  "Data Analyst",
  "Pune",
  "Bengaluru",
  "Remote",
];

const HeroSection = () => {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(
      setFilters({
        keyword: role.trim(),
        location: location.trim() || "All",
      })
    );
    navigate(`/jobs?keyword=${encodeURIComponent(role.trim())}&location=${encodeURIComponent(location.trim())}`);
  };

  const handleQuickSearch = (term) => {
    if (term === "Remote" || term === "Pune" || term === "Bengaluru") {
      dispatch(setFilters({ location: term }));
      navigate(`/jobs?location=${encodeURIComponent(term)}`);
    } else {
      dispatch(setFilters({ keyword: term }));
      navigate(`/jobs?keyword=${encodeURIComponent(term)}`);
    }
  };

  return (
    <section className="relative bg-white border-b border-slate-200/80 pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Workspace Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold mb-6">
          <Sparkles size={13} className="text-primary-600" />
          <span>The Only Platform with Verified Company Trust Scores</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Find work at <span className="text-primary-600">verified</span> companies.
        </h1>

        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-normal">
          Stop applying to fake listings. We verify every company's official domain, registration, and web presence to calculate a Trust Score before you apply.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mt-8 flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl sm:rounded-full border border-slate-300 shadow-md hover:border-slate-400 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-600 transition"
        >
          {/* Job Title / Skill */}
          <div className="flex items-center gap-2.5 flex-1 w-full px-4 py-2">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Job title, skill, or company"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none"
            />
          </div>

          <div className="hidden sm:block h-6 w-px bg-slate-200"></div>

          {/* Location */}
          <div className="flex items-center gap-2.5 sm:w-56 w-full px-4 py-2">
            <MapPin size={18} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Location or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none"
            />
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            className="w-full sm:w-auto rounded-xl sm:rounded-full px-7 py-5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-xs transition"
          >
            Search Jobs
          </Button>
        </form>

        {/* Popular searches chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Popular:</span>
          {POPULAR_SEARCHES.map((item) => (
            <button
              key={item}
              onClick={() => handleQuickSearch(item)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
