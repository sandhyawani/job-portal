import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  Briefcase,
  Layers,
  Bookmark,
  CheckCircle2,
  User,
  LayoutDashboard,
  Building2,
  Users,
} from "lucide-react";

const MobileBottomNav = () => {
  const { user } = useSelector((store) => store.auth);
  const location = useLocation();

  const isCandidate = !user || user.role === "student";

  const candidateTabs = [
    { label: "Home", path: "/", icon: Home },
    { label: "Jobs", path: "/jobs", icon: Briefcase },
    { label: "Saved", path: "/pipeline?tab=saved", icon: Bookmark },
    { label: "Applications", path: "/applications", icon: CheckCircle2 },
    { label: "Profile", path: user ? "/profile" : "/login", icon: User },
  ];

  const recruiterTabs = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Jobs", path: "/admin/jobs", icon: Briefcase },
    { label: "Applications", path: "/admin/dashboard#applicants", icon: Users },
    { label: "Companies", path: "/admin/companies", icon: Building2 },
    { label: "Profile", path: "/profile", icon: User },
  ];

  const tabs = isCandidate ? candidateTabs : recruiterTabs;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const current = location?.pathname || "";
          const basePath = typeof tab?.path === "string" ? tab.path.split(/[?#]/)[0] : "";
          const isActive =
            basePath === "/"
              ? current === "/"
              : Boolean(basePath && typeof current === "string" && current.startsWith(basePath));

          return (
            <Link
              key={tab.label}
              to={tab.path}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[11px] font-medium transition ${
                isActive
                  ? "text-primary-600 font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div
                className={`p-1 rounded-full transition ${
                  isActive ? "bg-primary-50" : ""
                }`}
              >
                <Icon size={19} className={isActive ? "text-primary-600" : "text-slate-400"} />
              </div>
              <span className="mt-0.5 tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
