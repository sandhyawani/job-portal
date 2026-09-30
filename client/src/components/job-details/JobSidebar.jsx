import React from "react";
import { Link } from "react-router-dom";
import { Building2, ExternalLink } from "lucide-react";
import TrustBadge from "../TrustBadge";
import { normalizeUrl, getValidImageUrl, formatDate } from "@/utils/formatters";

const JobSidebar = ({ company, singleJob, workMode }) => {
  return (
    <div className="space-y-6">
      {company && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            About the Company
          </h3>

          <div className="flex items-center gap-3 mb-4">
            <img
              src={getValidImageUrl(company?.logo, "/logo.png")}
              alt={company?.name || "Company"}
              className="w-12 h-12 rounded-xl border border-slate-200 object-cover"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                {company?.name || "Company"}
              </h4>
              <span className="text-xs text-slate-500">
                {company?.location || "India"}
              </span>
            </div>
          </div>

          {company?.description && (
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {company.description}
            </p>
          )}

          <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
            {normalizeUrl(company?.website) !== "#" && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Website</span>
                <a
                  href={normalizeUrl(company.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 font-medium hover:underline flex items-center gap-1"
                >
                  Visit site <ExternalLink size={12} />
                </a>
              </div>
            )}

            {company.trustLevel && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Verification</span>
                <TrustBadge trustLevel={company.trustLevel} showDetails={true} />
              </div>
            )}

            {company.trustScore > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Trust Score</span>
                <span className="font-bold text-amber-600">
                  {company.trustScore} / 100
                </span>
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <Link
              to={`/company/${company._id}`}
              className="text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center justify-center gap-1 w-full py-2 rounded-xl bg-primary-50/70 hover:bg-primary-50 transition"
            >
              <Building2 size={13} /> View full company profile
            </Link>
          </div>
        </div>
      )}

      {/* Quick Job Summary */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          Job Overview
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Role</span>
            <span className="font-semibold text-slate-800">{singleJob.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Experience</span>
            <span className="font-semibold text-slate-800">
              {singleJob.experienceLevel}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Work Mode</span>
            <span className="font-semibold text-slate-800">{workMode}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Open Positions</span>
            <span className="font-semibold text-slate-800">{singleJob.position}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Posted</span>
            <span className="font-semibold text-slate-800">
              {formatDate(singleJob?.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* What happens when you apply guide */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-6 text-xs">
        <h4 className="font-bold text-slate-900 mb-3 text-sm">
          What happens when you apply?
        </h4>
        <ul className="space-y-3 text-slate-600 text-xs">
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold shrink-0 text-[11px]">
              1
            </span>
            <span>
              Your profile, contact details, and resume are delivered directly to the recruiter.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold shrink-0 text-[11px]">
              2
            </span>
            <span>
              The hiring team reviews your credentials and updates your application status.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold shrink-0 text-[11px]">
              3
            </span>
            <span>
              Track stage progress, interview times, and recruiter feedback in your Application Tracker.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default JobSidebar;
