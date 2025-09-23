import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "../redux/jobSlice";
import { useNavigate, Link } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    if (!query.trim()) return;
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background animated blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-pink-500 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse delay-200"></div>
      <div className="absolute inset-0">
        <div className="w-full h-full pointer-events-none">
          {/* optional floating particle effect */}
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
      </div>

      <div className="relative z-10 text-center px-4 py-28 sm:py-36 max-w-6xl mx-auto">
        {/* Badge */}
        <span className="inline-block px-6 py-2 mb-6 rounded-full bg-white/10 border border-white/20 text-pink-400 font-medium backdrop-blur-md shadow-lg hover:scale-105 transition-transform">
          🚀 Turning Ambitions Into Careers
        </span>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-gradient drop-shadow-[0_2px_25px_rgba(255,192,203,0.5)]">
          Your Career, <span className="text-pink-400">Your Way</span>
          <br /> Start Today
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Connect with top recruiters, explore premium opportunities, and shape
          the future you deserve.
        </p>

        {/* Search Bar */}
        <div className="mt-10 flex w-full sm:w-[80%] md:w-[60%] lg:w-[50%] mx-auto shadow-xl rounded-full overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5 hover:scale-105 transition-transform">
          <input
            type="text"
            placeholder="Search your dream job..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchJobHandler()}
            className="flex-1 px-5 py-4 text-gray-200 placeholder-gray-400 bg-transparent outline-none border-none"
          />
          <Button
            onClick={searchJobHandler}
            className="h-14 px-8 flex items-center justify-center gap-2 
                       bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600
                       hover:from-pink-600 hover:via-pink-700 hover:to-purple-700
                       text-white font-semibold rounded-full shadow-lg shadow-pink-500/40
                       transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
          >
            <Search className="h-5 w-5" />
            Search
          </Button>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup">
            <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:to-pink-600 rounded-full font-medium text-white shadow-lg hover:shadow-pink-500/50 transition-all transform hover:scale-105">
              Get Started
            </button>
          </Link>

          <Link to="/browse">
            <button className="px-8 py-3 border border-white/30 hover:border-pink-400 rounded-full font-medium text-white hover:text-pink-400 backdrop-blur-md transition-all hover:scale-105">
              Learn More
            </button>
          </Link>
        </div>
      </div>

      {/* Decorative wave */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#fff"
          fillOpacity="1"
          d="M0,192L60,165.3C120,139,240,85,360,74.7C480,64,600,96,720,133.3C840,171,960,213,1080,197.3C1200,181,1320,107,1380,69.3L1440,32V320H0Z"
        ></path>
      </svg>

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
