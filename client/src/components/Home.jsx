import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./CategoryCarousel";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, []);
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 sm:my-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8">
          <span className="text-pink-600">Latest & Top </span>Job Openings
        </h2>
        <LatestJobs />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
