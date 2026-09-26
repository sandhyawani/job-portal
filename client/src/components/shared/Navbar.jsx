import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut, Menu, User2, X, Briefcase, LayoutDashboard, Bookmark, FileText, Building2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-transparent text-white"
          : "bg-white/95 border-gray-200 text-gray-800 shadow-md"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-sm font-bold text-sm shrink-0 group-hover:scale-105 transition-transform">
            <Briefcase size={16} />
          </div>
          <h1
            className={`text-xl sm:text-2xl font-extrabold tracking-tight transition-colors duration-300 ${
              isTransparent
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            Job<span className="text-pink-600">Portal</span>
          </h1>
        </Link>

        {/* Navigation Links */}
        <ul
          className={`hidden md:flex items-center gap-7 font-medium transition-colors duration-300 ${
            isTransparent ? "text-white/90" : "text-gray-700"
          }`}
        >
          {user && user.role === "recruiter" ? (
            <>
              <li>
                <Link
                  to="/profile"
                  className={`transition-all duration-200 pb-1 ${
                    location.pathname === "/profile"
                      ? isTransparent
                        ? "text-pink-400 font-bold border-b-2 border-pink-400"
                        : "text-pink-600 font-bold border-b-2 border-pink-600"
                      : "hover:text-pink-500"
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/companies"
                  className={`transition-all duration-200 pb-1 ${
                    location.pathname === "/admin/companies"
                      ? isTransparent
                        ? "text-pink-400 font-bold border-b-2 border-pink-400"
                        : "text-pink-600 font-bold border-b-2 border-pink-600"
                      : "hover:text-pink-500"
                  }`}
                >
                  Companies
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/jobs"
                  className={`transition-all duration-200 pb-1 ${
                    location.pathname === "/admin/jobs"
                      ? isTransparent
                        ? "text-pink-400 font-bold border-b-2 border-pink-400"
                        : "text-pink-600 font-bold border-b-2 border-pink-600"
                      : "hover:text-pink-500"
                  }`}
                >
                  Jobs
                </Link>
              </li>
            </>
          ) : user ? (
            <>
              <li>
                <Link
                  to="/"
                  className={`transition-all duration-200 pb-1 ${
                    location.pathname === "/"
                      ? isTransparent
                        ? "text-pink-400 font-bold border-b-2 border-pink-400"
                        : "text-pink-600 font-bold border-b-2 border-pink-600"
                      : "hover:text-pink-500"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className={`transition-all duration-200 pb-1 ${
                    location.pathname === "/jobs"
                      ? isTransparent
                        ? "text-pink-400 font-bold border-b-2 border-pink-400"
                        : "text-pink-600 font-bold border-b-2 border-pink-600"
                      : "hover:text-pink-500"
                  }`}
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/browse"
                  className={`transition-all duration-200 pb-1 ${
                    location.pathname === "/browse"
                      ? isTransparent
                        ? "text-pink-400 font-bold border-b-2 border-pink-400"
                        : "text-pink-600 font-bold border-b-2 border-pink-600"
                      : "hover:text-pink-500"
                  }`}
                >
                  Browse
                </Link>
              </li>
              <li>
                <Link
                  to="/profile?tab=applied"
                  className={`transition-all duration-200 pb-1 ${
                    location.pathname === "/profile" && location.search !== "?tab=saved"
                      ? isTransparent
                        ? "text-pink-400 font-bold border-b-2 border-pink-400"
                        : "text-pink-600 font-bold border-b-2 border-pink-600"
                      : "hover:text-pink-500"
                  }`}
                >
                  Applications
                </Link>
              </li>
              <li>
                <Link
                  to="/profile?tab=saved"
                  className={`transition-all duration-200 pb-1 ${
                    location.pathname === "/profile" && location.search === "?tab=saved"
                      ? isTransparent
                        ? "text-pink-400 font-bold border-b-2 border-pink-400"
                        : "text-pink-600 font-bold border-b-2 border-pink-600"
                      : "hover:text-pink-500"
                  }`}
                >
                  Saved Jobs
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/"
                  className={`transition-all duration-200 pb-1 ${
                    location.pathname === "/"
                      ? isTransparent
                        ? "text-pink-400 font-bold border-b-2 border-pink-400"
                        : "text-pink-600 font-bold border-b-2 border-pink-600"
                      : "hover:text-pink-500"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className={`transition-all duration-200 pb-1 ${
                    location.pathname === "/jobs"
                      ? isTransparent
                        ? "text-pink-400 font-bold border-b-2 border-pink-400"
                        : "text-pink-600 font-bold border-b-2 border-pink-600"
                      : "hover:text-pink-500"
                  }`}
                >
                  Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/browse"
                  className={`transition-all duration-200 pb-1 ${
                    location.pathname === "/browse"
                      ? isTransparent
                        ? "text-pink-400 font-bold border-b-2 border-pink-400"
                        : "text-pink-600 font-bold border-b-2 border-pink-600"
                      : "hover:text-pink-500"
                  }`}
                >
                  Browse
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Auth / Profile & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/login">
                <Button
                  className={`rounded-full px-4 sm:px-5 py-2 text-sm shadow-md transition-colors duration-300 ${
                    isTransparent
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                      : "bg-pink-500 text-white hover:bg-pink-600"
                  }`}
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="hidden sm:inline-block">
                <Button
                  className={`rounded-full px-5 py-2 text-sm shadow-md transition-colors duration-300 ${
                    isTransparent
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                      : "bg-pink-500 text-white hover:bg-pink-600"
                  }`}
                >
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar
                  className={`cursor-pointer ring-2 hover:ring-purple-400 transition-all shadow-sm ${
                    isTransparent ? "ring-white/60" : "ring-pink-400"
                  }`}
                >
                  {user?.profile?.profilePhoto && (
                    <AvatarImage
                      src={user.profile.profilePhoto}
                      alt={user?.fullname || "Profile"}
                    />
                  )}
                  <AvatarFallback className="bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center size-full">
                    {user?.fullname ? user.fullname[0].toUpperCase() : "A"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent
                className={`w-72 rounded-2xl p-4 shadow-xl border transition-colors duration-300 ${
                  isHeroPage
                    ? "bg-white/20 backdrop-blur-lg border-white/20 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
              >
                <div className="flex gap-3 items-center">
                  <Avatar className="h-12 w-12 ring-2 ring-purple-300">
                    {user?.profile?.profilePhoto && (
                      <AvatarImage
                        src={user.profile.profilePhoto}
                        alt={user?.fullname || "Profile"}
                      />
                    )}
                    <AvatarFallback className="bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-bold text-lg flex items-center justify-center size-full">
                      {user?.fullname ? user.fullname[0].toUpperCase() : "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-lg uppercase">{user?.fullname}</h4>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>

                <div className="flex flex-col mt-4 space-y-2 text-sm">
                  {user?.role === "recruiter" ? (
                    <>
                      <Link
                        to="/profile"
                        className={`flex w-fit items-center gap-2 cursor-pointer transition-colors duration-300 ${
                          isHeroPage ? "hover:text-pink-500" : "hover:text-pink-600"
                        }`}
                      >
                        <LayoutDashboard size={16} />
                        Recruiter Dashboard
                      </Link>
                      <Link
                        to="/admin/companies"
                        className={`flex w-fit items-center gap-2 cursor-pointer transition-colors duration-300 ${
                          isHeroPage ? "hover:text-pink-500" : "hover:text-pink-600"
                        }`}
                      >
                        <Building2 size={16} />
                        Manage Companies
                      </Link>
                      <Link
                        to="/admin/jobs"
                        className={`flex w-fit items-center gap-2 cursor-pointer transition-colors duration-300 ${
                          isHeroPage ? "hover:text-pink-500" : "hover:text-pink-600"
                        }`}
                      >
                        <Briefcase size={16} />
                        Manage Postings
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/profile"
                        className={`flex w-fit items-center gap-2 cursor-pointer transition-colors duration-300 ${
                          isHeroPage ? "hover:text-pink-500" : "hover:text-pink-600"
                        }`}
                      >
                        <User2 size={16} />
                        Profile & Skills
                      </Link>
                      <Link
                        to="/profile?tab=applied"
                        className={`flex w-fit items-center gap-2 cursor-pointer transition-colors duration-300 ${
                          isHeroPage ? "hover:text-pink-500" : "hover:text-pink-600"
                        }`}
                      >
                        <FileText size={16} />
                        My Applications
                      </Link>
                      <Link
                        to="/profile?tab=saved"
                        className={`flex w-fit items-center gap-2 cursor-pointer transition-colors duration-300 ${
                          isHeroPage ? "hover:text-pink-500" : "hover:text-pink-600"
                        }`}
                      >
                        <Bookmark size={16} />
                        Saved Jobs
                      </Link>
                    </>
                  )}
                  <div className="pt-2 border-t border-gray-100">
                    <div
                      onClick={logoutHandler}
                      className={`flex w-fit items-center gap-2 cursor-pointer transition-colors duration-300 ${
                        isHeroPage ? "hover:text-pink-500" : "hover:text-pink-600"
                      }`}
                    >
                      <LogOut size={16} />
                      Logout
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-current hover:bg-black/5 dark:hover:bg-white/10 transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-6 pt-3 pb-6 border-b shadow-xl transition-all ${
            isTransparent
              ? "bg-slate-900/95 backdrop-blur-xl text-white border-white/10"
              : "bg-white text-gray-800 border-gray-200"
          }`}
        >
          <ul className="flex flex-col gap-2 font-medium py-2">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-xl transition-colors ${
                      location.pathname === "/profile"
                        ? "bg-pink-500/10 text-pink-600 font-bold"
                        : "hover:text-pink-500"
                    }`}
                  >
                    📊 Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/companies"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-xl transition-colors ${
                      location.pathname === "/admin/companies"
                        ? "bg-pink-500/10 text-pink-600 font-bold"
                        : "hover:text-pink-500"
                    }`}
                  >
                    🏢 Companies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-xl transition-colors ${
                      location.pathname === "/admin/jobs"
                        ? "bg-pink-500/10 text-pink-600 font-bold"
                        : "hover:text-pink-500"
                    }`}
                  >
                    💼 Jobs
                  </Link>
                </li>
              </>
            ) : user ? (
              <>
                <li>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-xl transition-colors ${
                      location.pathname === "/"
                        ? "bg-pink-500/10 text-pink-600 font-bold"
                        : "hover:text-pink-500"
                    }`}
                  >
                    🏠 Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-xl transition-colors ${
                      location.pathname === "/jobs"
                        ? "bg-pink-500/10 text-pink-600 font-bold"
                        : "hover:text-pink-500"
                    }`}
                  >
                    🔍 Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-xl transition-colors ${
                      location.pathname === "/browse"
                        ? "bg-pink-500/10 text-pink-600 font-bold"
                        : "hover:text-pink-500"
                    }`}
                  >
                    📁 Browse
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile?tab=applied"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-xl transition-colors ${
                      location.pathname === "/profile" && location.search !== "?tab=saved"
                        ? "bg-pink-500/10 text-pink-600 font-bold"
                        : "hover:text-pink-500"
                    }`}
                  >
                    📄 Applications
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile?tab=saved"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-xl transition-colors ${
                      location.pathname === "/profile" && location.search === "?tab=saved"
                        ? "bg-pink-500/10 text-pink-600 font-bold"
                        : "hover:text-pink-500"
                    }`}
                  >
                    🔖 Saved Jobs
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-xl transition-colors ${
                      location.pathname === "/"
                        ? "bg-pink-500/10 text-pink-600 font-bold"
                        : "hover:text-pink-500"
                    }`}
                  >
                    🏠 Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-xl transition-colors ${
                      location.pathname === "/jobs"
                        ? "bg-pink-500/10 text-pink-600 font-bold"
                        : "hover:text-pink-500"
                    }`}
                  >
                    🔍 Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-3 rounded-xl transition-colors ${
                      location.pathname === "/browse"
                        ? "bg-pink-500/10 text-pink-600 font-bold"
                        : "hover:text-pink-500"
                    }`}
                  >
                    📁 Browse
                  </Link>
                </li>
              </>
            )}

            {user && (
              <li className="border-t border-gray-200/40 pt-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 px-3 text-pink-600 font-semibold"
                >
                  <User2 size={18} /> My Profile
                </Link>
              </li>
            )}
          </ul>

          {!user && (
            <div className="flex gap-3 pt-3 border-t border-gray-200/40">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                <Button variant="outline" className="w-full rounded-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                <Button className="w-full rounded-full bg-pink-500 hover:bg-pink-600 text-white">
                  Signup
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
