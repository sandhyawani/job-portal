import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, ExternalLink, HelpCircle, Send, Users, Activity, Check } from "lucide-react";
import TrustBadge from "../TrustBadge";
import { normalizeUrl, getValidImageUrl, formatDate } from "@/utils/formatters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";

const JobSidebar = ({ company, singleJob, workMode }) => {
  const [showProcessModal, setShowProcessModal] = useState(false);

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

      {/* Quick Job Summary with clean Modal trigger */}
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

        {/* Clean Process Modal Trigger */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowProcessModal(true)}
            className="w-full text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center justify-center gap-1.5 py-1.5 rounded-xl hover:bg-primary-50/70 transition cursor-pointer"
          >
            <HelpCircle size={14} /> What happens when you apply?
          </button>
        </div>
      </div>

      {/* Proper Centered Modal Popup for Application Steps */}
      <Dialog open={showProcessModal} onOpenChange={setShowProcessModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-xl">
          <DialogHeader>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold w-fit mb-2">
              <HelpCircle size={13} /> Application Guide
            </div>
            <DialogTitle className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              What happens when you apply?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Transparent 3-step hiring process from application to interview.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 my-3 text-xs">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-0.5">
                  Direct Profile Delivery
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Your contact information, skills, and resume are delivered directly to the recruiter's portal.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-0.5">
                  Recruiter Screening & Review
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  The hiring team reviews your credentials and updates your application status (Under Review, Shortlisted, or Interview).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-0.5">
                  Live Stage Tracking & Prep
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Track stage progress, scheduled interview calls, and recruiter feedback in your Application Tracker.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2 flex justify-end">
            <Button
              onClick={() => setShowProcessModal(false)}
              className="rounded-xl px-5 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobSidebar;
