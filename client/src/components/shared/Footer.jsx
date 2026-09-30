import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-base">
              J
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Job<span className="text-teal-400">Portal</span>
            </span>
          </Link>
          <p className="text-slate-400 leading-relaxed text-xs">
            Your complete job-search workspace. Discover opportunities, analyze match alignment, and manage your full application lifecycle.
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-teal-400 font-semibold text-[11px]">
            <ShieldCheck size={14} /> Verified Company Profiles
          </div>
        </div>

        {/* Candidate Navigation */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
            Candidate Workspace
          </h4>
          <ul className="space-y-2">
            <li>
              <Link to="/jobs" className="hover:text-white transition">
                Search Jobs
              </Link>
            </li>
            <li>
              <Link to="/pipeline" className="hover:text-white transition">
                Personal Pipeline
              </Link>
            </li>
            <li>
              <Link to="/applications" className="hover:text-white transition">
                Application Tracker
              </Link>
            </li>
            <li>
              <Link to="/interview-prep" className="hover:text-white transition">
                Interview Preparation
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-white transition">
                Profile & Resume
              </Link>
            </li>
          </ul>
        </div>

        {/* Recruiter Workspace */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
            Recruiter Workspace
          </h4>
          <ul className="space-y-2">
            <li>
              <Link to="/admin/dashboard" className="hover:text-white transition">
                Hiring Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/jobs/create" className="hover:text-white transition">
                Post an Opening
              </Link>
            </li>
            <li>
              <Link to="/admin/jobs" className="hover:text-white transition">
                Manage Jobs
              </Link>
            </li>
            <li>
              <Link to="/admin/companies" className="hover:text-white transition">
                Manage Companies
              </Link>
            </li>
            <li>
              <Link to="/admin/companies/create" className="hover:text-white transition">
                Register New Company
              </Link>
            </li>
          </ul>
        </div>

        {/* Trust & Safety */}
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
            Platform & Safety
          </h4>
          <p className="text-slate-400 leading-relaxed mb-3">
            All posted jobs originate from real database listings with verified trust score ratings. No simulated candidates or fake statistics.
          </p>
          <span className="text-[11px] text-slate-500 block">
            Node.js · React · MongoDB · Express
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
        <span>© {new Date().getFullYear()} JobPortal Workspace. All rights reserved.</span>
        <span>Empowering careers and transparent hiring.</span>
      </div>
    </footer>
  );
};

export default Footer;
