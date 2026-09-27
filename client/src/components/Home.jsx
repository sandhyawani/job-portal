import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import MobileBottomNav from "./shared/MobileBottomNav";
import HeroSection from "./HeroSection";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setFilters } from "@/redux/jobSlice";
import {
  Search,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Layers,
  GraduationCap,
  Building2,
  Users,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Target,
} from "lucide-react";
import { Button } from "./ui/button";

const POPULAR_CATEGORIES = [
  { name: "Frontend Development", roles: "React, Next.js, Vue, Tailwind", count: "Active Roles" },
  { name: "Backend Development", roles: "Python, Django, Node.js, Java", count: "Active Roles" },
  { name: "Full Stack Engineering", roles: "MERN, Python Full Stack, Next.js", count: "Active Roles" },
  { name: "Data & Analytics", roles: "Python, SQL, Machine Learning, Tableau", count: "Active Roles" },
  { name: "Human Resources", roles: "Talent Acquisition, People Ops", count: "Active Roles" },
  { name: "Product & Marketing", roles: "Product Management, SEO, Growth", count: "Active Roles" },
];

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redirect recruiters directly to their operational dashboard
  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleCategoryClick = (catName) => {
    const term = catName.split(" ")[0];
    dispatch(setFilters({ keyword: term }));
    navigate(`/jobs?keyword=${encodeURIComponent(term)}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between">
      <Navbar />

      <div>
        <HeroSection />

        {/* Categories Section */}
        <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-b border-slate-200/80">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Browse opportunities across major engineering and business domains
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {POPULAR_CATEGORIES.map((cat, i) => (
              <div
                key={i}
                onClick={() => handleCategoryClick(cat.name)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {cat.name}
                  </h3>
                  <ArrowRight
                    size={14}
                    className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform"
                  />
                </div>
                <p className="text-xs text-slate-500">{cat.roles}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Verified Jobs Section */}
        <LatestJobs />

        {/* How It Works (Candidate Workflow: Search → Discover → Match → Save → Apply → Track → Prepare) */}
        <section className="py-16 px-4 sm:px-6 bg-white border-y border-slate-200/80">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                Product Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Your Complete Job-Search Workspace
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                More than just a job board — an end-to-end platform designed to help you prepare, track, and land the right role.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-4">
                    <Target size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    1. Match Analysis
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Transparent match breakdown based on your skills, experience, and salary preferences before you apply.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-4">
                    <Bookmark size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    2. Persistent Pipeline
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Save jobs and track external applications from LinkedIn or company sites in one unified workspace board.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-4">
                    <Layers size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    3. Live Tracker
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Visual status timelines from Under Review to Interview and Offer, with recruiter interview notes.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
                    <GraduationCap size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    4. Interview Prep
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Practice technical, architectural, and behavioral questions tailored directly to the jobs you are shortlisted for.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recruiter CTA Banner */}
        <section className="py-14 px-4 sm:px-6 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                For Recruiters & Hiring Managers
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Hire Qualified Talent Faster
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
                Create verified company profiles, post job openings, filter applicants by skills, and manage your hiring pipeline.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link to="/signup">
                <Button className="rounded-xl px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md">
                  Recruiter Sign Up
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="rounded-xl px-4 py-2.5 border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold"
                >
                  Recruiter Login
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Home;
