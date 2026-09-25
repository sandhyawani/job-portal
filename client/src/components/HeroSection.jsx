import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";
import { useNavigate, Link } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const searchJobHandler = () => {
    if (!query.trim()) return;
    dispatch(setSearchedQuery(query));
    navigate("/jobs");
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Decorative background effects */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-pink-500 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse delay-200"></div>

      {/* Subtle particle accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-1 h-1 bg-white opacity-20 rounded-full animate-bounce"
          style={{ top: "10%", left: "25%" }}
        ></div>
        <div
          className="absolute w-1.5 h-1.5 bg-pink-400 opacity-30 rounded-full animate-bounce"
          style={{ top: "60%", left: "80%" }}
        ></div>
        <div
          className="absolute w-1 h-1 bg-purple-400 opacity-25 rounded-full animate-bounce"
          style={{ top: "40%", left: "50%" }}
        ></div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-4 pt-24 sm:pt-28 pb-14 sm:pb-18 max-w-5xl mx-auto">
        {/* Highlight badge */}
        <span className="inline-block px-4 sm:px-5 py-1.5 mb-4 rounded-full bg-white/10 border border-white/20 text-pink-400 text-sm font-medium backdrop-blur-md shadow-sm hover:scale-105 transition-transform">
          {user ? `👋 Welcome back, ${user.fullname}` : "🚀 Turning Ambitions Into Careers"}
        </span>

        {/* Main heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-gradient drop-shadow-[0_2px_25px_rgba(255,192,203,0.5)]">
          Your Career, <span className="text-pink-400">Your Way</span>
          <br /> Start Today
        </h1>

        {/* Supporting text */}
        <p className="mt-4 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Smart matching, real in-hand salary estimates, and transparent hiring with verified recruiters.
        </p>

        {/* Job search input */}
        <div className="mt-6 sm:mt-7 flex w-full sm:w-[80%] md:w-[60%] lg:w-[50%] mx-auto shadow-lg rounded-full overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5 hover:scale-105 transition-transform">
          <input
            type="text"
            placeholder="Search by title, skill, or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchJobHandler()}
            className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base text-gray-200 placeholder-gray-400 bg-transparent outline-none border-none min-w-0"
          />
          <Button
            onClick={searchJobHandler}
            className="h-11 sm:h-12 px-4 sm:px-6 flex items-center justify-center gap-2 
                       bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600
                       hover:from-pink-600 hover:via-pink-700 hover:to-purple-700
                       text-white font-semibold rounded-full shadow-md shadow-pink-500/40
                       transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 text-sm"
          >
            <Search className="h-4 w-4" />
            <span className="hidden xs:inline">Search</span>
          </Button>
        </div>

        {/* Quick Vibe Chips */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto text-xs">
          <span className="text-gray-400 font-medium">Trending:</span>
          {[
            { label: "🔥 Remote", query: "Remote" },
            { label: "🌱 Frontend", query: "Frontend" },
            { label: "⚡ Full Stack", query: "Full Stack" },
            { label: "📊 Data", query: "Data" },
            { label: "💼 Developer", query: "Developer" },
          ].map((vibe, idx) => (
            <button
              key={idx}
              onClick={() => {
                dispatch(setSearchedQuery(vibe.query));
                navigate("/jobs");
              }}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-pink-600/30 text-gray-200 hover:text-white border border-white/10 hover:border-pink-400/50 backdrop-blur-md transition-all hover:scale-105"
            >
              {vibe.label}
            </button>
          ))}
        </div>

        {/* Primary actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/jobs">
            <button className="px-6 py-2.5 text-sm bg-gradient-to-r from-pink-500 to-purple-500 hover:to-pink-600 rounded-full font-medium text-white shadow-md hover:shadow-pink-500/50 transition-all transform hover:scale-105">
              Explore All Jobs
            </button>
          </Link>

          {!user ? (
            <Link to="/signup">
              <button className="px-6 py-2.5 text-sm border border-white/30 hover:border-pink-400 rounded-full font-medium text-white hover:text-pink-400 backdrop-blur-md transition-all hover:scale-105">
                Join As Candidate
              </button>
            </Link>
          ) : (
            <Link to="/profile">
              <button className="px-6 py-2.5 text-sm border border-white/30 hover:border-pink-400 rounded-full font-medium text-white hover:text-pink-400 backdrop-blur-md transition-all hover:scale-105">
                View My Profile
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Decorative footer wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
        <svg
          className="relative block w-full h-6 sm:h-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,120 L0,120 Z"
          ></path>
        </svg>
      </div>

      {/* Gradient animation */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradientMove 8s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
