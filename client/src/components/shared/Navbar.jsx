import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  LogOut,
  User2,
  Bell,
  CheckCircle2,
  Briefcase,
  Bookmark,
  Layers,
  GraduationCap,
  Building2,
  Menu,
  X,
  LayoutDashboard,
  Check,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import authApi from "@/api/authApi";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import useGetNotifications from "@/hooks/useGetNotifications";

const Navbar = () => {
  const { user, notifications = [], unreadCount = 0 } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { markAsRead } = useGetNotifications();

  const logoutHandler = async () => {
    try {
      const res = await authApi.logout();
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const isActive = (path) => {
    if (!path || typeof path !== "string") return false;
    const current = location?.pathname || "";
    if (path === "/" && current !== "/") return false;
    return typeof current === "string" && current.startsWith(path);
  };

  const candidateLinks = [
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "Workspace", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Pipeline", path: "/pipeline", icon: Layers },
    { name: "Applications", path: "/applications", icon: CheckCircle2 },
    { name: "Interview Prep", path: "/interview-prep", icon: GraduationCap },
  ];

  const recruiterLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Jobs", path: "/admin/jobs", icon: Briefcase },
    { name: "Companies", path: "/admin/companies", icon: Building2 },
  ];

  const navLinks = user?.role === "recruiter" ? recruiterLinks : candidateLinks;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 h-16">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition">
            J
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition">
              Job<span className="text-indigo-600">Portal</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              location.pathname === "/"
                ? "bg-slate-100 text-indigo-600 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Home
          </Link>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon size={16} className={active ? "text-indigo-600" : "text-slate-400"} />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Action Icons (Notifications + Auth / Profile) */}
        <div className="flex items-center gap-3">
          {user && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  aria-label="Notifications"
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 sm:w-96 p-0 rounded-2xl shadow-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/70 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAsRead("all")}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Check size={12} /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => {
                          if (!notif.isRead) markAsRead(notif._id);
                          if (notif.link) navigate(notif.link);
                        }}
                        className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 ${
                          !notif.isRead ? "bg-indigo-50/40" : ""
                        }`}
                      >
                        <div className="mt-0.5">
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 ${
                              notif.isRead ? "bg-transparent" : "bg-indigo-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(notif.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No notifications yet
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-xl px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-xs transition">
                  Get Started
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 p-1 rounded-full ring-2 ring-transparent hover:ring-indigo-100 transition focus:outline-none">
                  <Avatar className="h-9 w-9 border border-slate-200">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt={user?.fullname || "User"}
                    />
                    <AvatarFallback className="bg-indigo-600 text-white font-bold text-sm uppercase">
                      {user?.fullname?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 p-3 rounded-2xl shadow-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-3 p-2 border-b border-slate-100 pb-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt={user?.fullname}
                    />
                    <AvatarFallback className="bg-indigo-600 text-white font-bold uppercase">
                      {user?.fullname?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 truncate">
                      {user?.fullname}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-700">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  {user?.role === "student" ? (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <span className="flex items-center gap-2">
                          <User2 size={16} /> Profile
                        </span>
                        <ChevronRight size={14} className="text-slate-400" />
                      </Link>
                      <Link
                        to="/pipeline"
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <span className="flex items-center gap-2">
                          <Layers size={16} /> Job Pipeline
                        </span>
                        <ChevronRight size={14} className="text-slate-400" />
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <span className="flex items-center gap-2">
                          <LayoutDashboard size={16} /> Dashboard
                        </span>
                        <ChevronRight size={14} className="text-slate-400" />
                      </Link>
                      <Link
                        to="/admin/jobs"
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <span className="flex items-center gap-2">
                          <Briefcase size={16} /> Posted Jobs
                        </span>
                        <ChevronRight size={14} className="text-slate-400" />
                      </Link>
                    </>
                  )}

                  <button
                    onClick={logoutHandler}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            Home
          </Link>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon size={18} />
                {link.name}
              </Link>
            );
          })}

          {user?.role === "student" && (
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              <User2 size={18} /> Profile
            </Link>
          )}

          {!user && (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 font-semibold text-sm text-slate-700"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-indigo-600 font-semibold text-sm text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
