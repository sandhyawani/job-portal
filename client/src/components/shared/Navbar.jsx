import React, { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  LogOut,
  Menu,
  User2,
  X,
  Briefcase,
  LayoutDashboard,
  Bookmark,
  FileText,
  Building2,
  Calculator,
  Compass,
  Search,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { calculateMonthlyTakeHome } from "@/utils/salaryCalculator";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Salary Calculator Popover State
  const [calcSalary, setCalcSalary] = useState("12");
  const [calcResult, setCalcResult] = useState(() => calculateMonthlyTakeHome("12"));

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSalaryChange = (val) => {
    setCalcSalary(val);
    setCalcResult(calculateMonthlyTakeHome(val));
  };

  const isHeroPage = location.pathname === "/";
  const isTransparent = isHeroPage && !scrolled;

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message || "Logged out successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  // Nav link style helper
  const getLinkClasses = (isActive) => {
    if (isTransparent) {
      return isActive
        ? "bg-white/20 text-white font-semibold backdrop-blur-md shadow-xs px-3.5 py-1.5 rounded-xl text-sm transition-all"
        : "text-gray-300 hover:text-white hover:bg-white/10 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all";
    }
    return isActive
      ? "bg-pink-50 text-pink-600 font-semibold shadow-xs px-3.5 py-1.5 rounded-xl text-sm transition-all"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all";
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-slate-950/40 backdrop-blur-md border-b border-white/10 text-white"
          : "bg-white/95 backdrop-blur-md border-b border-gray-200/80 text-gray-800 shadow-xs"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20 font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
            <Briefcase size={18} className="stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-1.5">
            <h1
              className={`text-xl sm:text-2xl font-black tracking-tight transition-colors duration-300 ${
                isTransparent ? "text-white" : "text-gray-900"
              }`}
            >
              Job<span className="text-pink-600">Portal</span>
            </h1>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1.5 lg:gap-2 font-medium">
          {user && user.role === "recruiter" ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className={getLinkClasses(location.pathname === "/profile")}
                >
                  <span className="flex items-center gap-1.5">
                    <LayoutDashboard size={15} /> Dashboard
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/companies"
                  className={getLinkClasses(location.pathname.startsWith("/admin/companies"))}
                >
                  <span className="flex items-center gap-1.5">
                    <Building2 size={15} /> Companies
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/jobs"
                  className={getLinkClasses(
                    location.pathname.startsWith("/admin/jobs") &&
                      location.pathname !== "/admin/jobs/create"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={15} /> Job Postings
                  </span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/jobs"
                  className={getLinkClasses(location.pathname === "/jobs")}
                >
                  <span className="flex items-center gap-1.5">
                    <Search size={14} className="stroke-[2.2]" /> Find Jobs
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/browse"
                  className={getLinkClasses(location.pathname === "/browse")}
                >
                  <span className="flex items-center gap-1.5">
                    <Compass size={14} className="stroke-[2.2]" /> Top Companies
                  </span>
                </Link>
              </li>

              {/* Interactive In-Nav Salary Tool */}
              <li>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 cursor-pointer ${getLinkClasses(false)}`}
                    >
                      <Calculator size={14} className="stroke-[2.2]" />
                      <span>Salary Calculator</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="center"
                    sideOffset={10}
                    className="w-80 sm:w-96 p-5 rounded-2xl bg-white text-gray-900 border border-gray-100 shadow-2xl z-50"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                            <Calculator size={16} />
                          </div>
                          <h4 className="font-bold text-sm text-gray-900">
                            Take-Home Pay Estimator
                          </h4>
                        </div>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                          New Regime
                        </span>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                          Annual CTC (in Lakhs or full amount)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                            ₹
                          </span>
                          <input
                            type="text"
                            value={calcSalary}
                            onChange={(e) => handleSalaryChange(e.target.value)}
                            placeholder="e.g. 12 or 12,00,000"
                            className="w-full pl-7 pr-14 py-2 text-sm font-semibold rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                            LPA
                          </span>
                        </div>
                      </div>

                      {/* Quick chips */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-gray-400 font-medium">Quick:</span>
                        {["6", "12", "18", "25", "40"].map((lpa) => (
                          <button
                            key={lpa}
                            type="button"
                            onClick={() => handleSalaryChange(lpa)}
                            className={`px-2 py-0.5 rounded-md text-xs font-medium border transition-colors ${
                              calcSalary === lpa
                                ? "bg-pink-600 text-white border-pink-600 font-bold"
                                : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                          >
                            {lpa}L
                          </button>
                        ))}
                      </div>

                      {/* Result breakdown */}
                      {calcResult.valid ? (
                        <div className="p-3.5 rounded-xl bg-gradient-to-br from-pink-50/70 to-purple-50/50 border border-pink-100/70 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Est. Monthly In-Hand:</span>
                            <span className="font-extrabold text-sm text-pink-600">
                              {calcResult.formattedInHand}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-gray-500">
                            <span>Gross Monthly CTC:</span>
                            <span className="font-medium text-gray-700">
                              {calcResult.formattedGross}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-gray-500">
                            <span>Est. Monthly Tax & PF:</span>
                            <span className="font-medium text-rose-500">
                              {calcResult.formattedDeductions}
                            </span>
                          </div>
                          <div className="pt-2 border-t border-pink-100/60 flex items-center justify-between text-[11px] text-gray-400">
                            <span>Retained compensation</span>
                            <span className="font-bold text-gray-700">
                              {calcResult.inHandPercentage}% of CTC
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                          Please enter a valid CTC amount (e.g. 8 for 8 LPA).
                        </p>
                      )}

                      <Link
                        to="/jobs"
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold transition-colors"
                      >
                        <span>Explore Open Positions</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </PopoverContent>
                </Popover>
              </li>

              {/* Logged in Candidate shortcuts */}
              {user && user.role === "student" && (
                <>
                  <li>
                    <Link
                      to="/profile?tab=applied"
                      className={getLinkClasses(
                        location.pathname === "/profile" && location.search !== "?tab=saved"
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText size={14} /> Applications
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile?tab=saved"
                      className={getLinkClasses(
                        location.pathname === "/profile" && location.search === "?tab=saved"
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        <Bookmark size={14} /> Saved
                      </span>
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>

        {/* Right Side Actions / CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Guest / Logged-Out Actions */}
          {!user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* For Employers Gateway */}
              <Link
                to="/login"
                className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isTransparent
                    ? "border-white/20 text-gray-200 hover:text-white hover:bg-white/10 hover:border-white/40"
                    : "border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                <Building2 size={13} className="text-pink-500" />
                <span>For Employers</span>
              </Link>

              <div
                className={`hidden lg:block h-4 w-px ${
                  isTransparent ? "bg-white/20" : "bg-gray-200"
                }`}
              />

              {/* Log In */}
              <Link to="/login">
                <Button
                  variant="ghost"
                  className={`text-sm font-semibold px-3.5 py-1.5 rounded-xl transition-colors ${
                    isTransparent
                      ? "text-gray-200 hover:text-white hover:bg-white/10"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Log in
                </Button>
              </Link>

              {/* Sign Up */}
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md shadow-pink-500/25 transition-all transform hover:scale-[1.02] active:scale-95">
                  Sign up
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Recruiter quick CTA: + Post Job */}
              {user.role === "recruiter" && (
                <Link to="/admin/jobs/create" className="hidden sm:inline-block">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95">
                    <PlusCircle size={15} />
                    <span>Post a Job</span>
                  </Button>
                </Link>
              )}

              {/* User Avatar Menu Popover (Always solid white card) */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`rounded-full p-0.5 cursor-pointer ring-2 transition-all hover:scale-105 ${
                      isTransparent
                        ? "ring-white/70 hover:ring-white"
                        : "ring-pink-200 hover:ring-pink-400"
                    }`}
                  >
                    <Avatar className="h-9 w-9">
                      {user?.profile?.profilePhoto && (
                        <AvatarImage
                          src={user.profile.profilePhoto}
                          alt={user?.fullname || "Profile"}
                        />
                      )}
                      <AvatarFallback className="bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center size-full">
                        {user?.fullname ? user.fullname[0].toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  sideOffset={8}
                  className="w-72 p-4 rounded-2xl bg-white text-gray-900 border border-gray-100 shadow-2xl z-50 space-y-4"
                >
                  {/* User Profile Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <Avatar className="h-11 w-11 ring-2 ring-pink-100">
                      {user?.profile?.profilePhoto && (
                        <AvatarImage
                          src={user.profile.profilePhoto}
                          alt={user?.fullname || "Profile"}
                        />
                      )}
                      <AvatarFallback className="bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-bold text-base flex items-center justify-center size-full">
                        {user?.fullname ? user.fullname[0].toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 truncate">
                        {user?.fullname || "User"}
                      </h4>
                      <p className="text-xs text-gray-500 truncate mb-1">
                        {user?.email}
                      </p>
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          user?.role === "recruiter"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {user?.role === "recruiter" ? "Recruiter" : "Candidate"}
                      </span>
                    </div>
                  </div>

                  {/* Contextual Links */}
                  <div className="flex flex-col space-y-1 text-sm font-medium">
                    {user?.role === "recruiter" ? (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                        >
                          <LayoutDashboard size={16} className="text-pink-500" />
                          <span>Recruiter Dashboard</span>
                        </Link>
                        <Link
                          to="/admin/companies"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                        >
                          <Building2 size={16} className="text-pink-500" />
                          <span>Manage Companies</span>
                        </Link>
                        <Link
                          to="/admin/jobs"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                        >
                          <Briefcase size={16} className="text-pink-500" />
                          <span>Manage Postings</span>
                        </Link>
                        <Link
                          to="/admin/jobs/create"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-pink-600 hover:bg-pink-50 font-semibold transition-colors"
                        >
                          <PlusCircle size={16} />
                          <span>Post a New Job</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                        >
                          <User2 size={16} className="text-pink-500" />
                          <span>Profile & Skills</span>
                        </Link>
                        <Link
                          to="/profile?tab=applied"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                        >
                          <FileText size={16} className="text-pink-500" />
                          <span>My Applications</span>
                        </Link>
                        <Link
                          to="/profile?tab=saved"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                        >
                          <Bookmark size={16} className="text-pink-500" />
                          <span>Saved Roles</span>
                        </Link>
                      </>
                    )}

                    <div className="pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={logoutHandler}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut size={16} className="text-rose-500" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition ${
              isTransparent
                ? "text-white hover:bg-white/10"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-5 pt-3 pb-6 border-b shadow-2xl transition-all ${
            isTransparent
              ? "bg-slate-900/98 backdrop-blur-xl text-white border-white/10"
              : "bg-white text-gray-800 border-gray-200"
          }`}
        >
          <ul className="flex flex-col gap-1 py-2 font-medium">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-pink-500/10 hover:text-pink-500 transition-colors"
                  >
                    <LayoutDashboard size={18} className="text-pink-500" />
                    <span>Recruiter Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/companies"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-pink-500/10 hover:text-pink-500 transition-colors"
                  >
                    <Building2 size={18} className="text-pink-500" />
                    <span>Companies</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-pink-500/10 hover:text-pink-500 transition-colors"
                  >
                    <Briefcase size={18} className="text-pink-500" />
                    <span>Job Postings</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl bg-pink-500/15 text-pink-500 font-semibold"
                  >
                    <PlusCircle size={18} />
                    <span>Post a New Job</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-pink-500/10 hover:text-pink-500 transition-colors"
                  >
                    <Briefcase size={18} className="text-pink-500" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-pink-500/10 hover:text-pink-500 transition-colors"
                  >
                    <Search size={18} className="text-pink-500" />
                    <span>Find Jobs</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-pink-500/10 hover:text-pink-500 transition-colors"
                  >
                    <Compass size={18} className="text-pink-500" />
                    <span>Top Companies</span>
                  </Link>
                </li>

                {user && (
                  <>
                    <li>
                      <Link
                        to="/profile?tab=applied"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-pink-500/10 hover:text-pink-500 transition-colors"
                      >
                        <FileText size={18} className="text-pink-500" />
                        <span>My Applications</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile?tab=saved"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-pink-500/10 hover:text-pink-500 transition-colors"
                      >
                        <Bookmark size={18} className="text-pink-500" />
                        <span>Saved Jobs</span>
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}

            {user && (
              <li className="pt-2 mt-2 border-t border-gray-200/20">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-pink-500 font-semibold hover:bg-pink-500/10 transition-colors"
                >
                  <User2 size={18} />
                  <span>My Profile ({user.fullname})</span>
                </Link>
              </li>
            )}
          </ul>

          {!user && (
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-gray-200/20">
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full rounded-xl">
                    Log in
                  </Button>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1"
                >
                  <Button className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-sm">
                    Sign up
                  </Button>
                </Link>
              </div>

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-xs font-semibold text-pink-500 hover:underline"
              >
                Are you an employer? Post a job →
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
