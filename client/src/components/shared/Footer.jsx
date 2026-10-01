import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Briefcase,
  Layers,
  Sparkles,
  CheckCircle2,
  Lock,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80 pt-14 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                J
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Job<span className="text-primary-400">Portal</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-xs">
              The transparent, skill-first career workspace. Discover verified opportunities, analyze skill match alignment, and manage your full application lifecycle.
            </p>
            <div className="pt-1 flex flex-col gap-2 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5 text-primary-400 font-semibold">
                <ShieldCheck size={14} className="text-primary-400 shrink-0" />
                Verified Employer Network
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Lock size={13} className="text-slate-400 shrink-0" />
                Privacy-First Candidate Data
              </span>
            </div>
          </div>

          {/* Candidate Workspace */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-4 flex items-center gap-1.5">
              <Layers size={13} className="text-primary-400" />
              Candidate Workspace
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/jobs"
                  className="hover:text-primary-400 transition-colors inline-block"
                >
                  Search Verified Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-primary-400 transition-colors inline-block"
                >
                  Workspace Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/pipeline"
                  className="hover:text-primary-400 transition-colors inline-block"
                >
                  Personal Pipeline Board
                </Link>
              </li>
              <li>
                <Link
                  to="/applications"
                  className="hover:text-primary-400 transition-colors inline-block"
                >
                  Live Application Tracker
                </Link>
              </li>
              <li>
                <Link
                  to="/interview-prep"
                  className="hover:text-primary-400 transition-colors inline-block"
                >
                  Interview Question Prep
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-primary-400 transition-colors inline-block"
                >
                  Profile & Match Skills
                </Link>
              </li>
            </ul>
          </div>

          {/* Recruiter Workspace */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-4 flex items-center gap-1.5">
              <Briefcase size={13} className="text-primary-400" />
              Recruiter Workspace
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/admin/dashboard"
                  className="hover:text-primary-400 transition-colors inline-block"
                >
                  Hiring Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/jobs/create"
                  className="hover:text-primary-400 transition-colors inline-block"
                >
                  Post a New Opening
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/jobs"
                  className="hover:text-primary-400 transition-colors inline-block"
                >
                  Manage Job Listings
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/companies"
                  className="hover:text-primary-400 transition-colors inline-block"
                >
                  Company Profiles
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/companies/create"
                  className="hover:text-primary-400 transition-colors inline-block"
                >
                  Register New Organization
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-4 flex items-center gap-1.5">
              <Sparkles size={13} className="text-primary-400" />
              Platform & Trust
            </h4>
            <p className="text-slate-400 leading-relaxed mb-4 text-xs">
              Every job listing originates from authenticated recruiters with verified company credentials. No simulated postings or fake candidate counts.
            </p>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 font-semibold text-white mb-1">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  Transparent Trust Scores
                </div>
                Companies receive trust verification based on domain verification and hiring history.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© {new Date().getFullYear()} JobPortal Workspace. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span className="text-slate-400">Built for skill-first, transparent hiring</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
