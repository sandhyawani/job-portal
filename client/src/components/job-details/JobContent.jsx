import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { GraduationCap } from "lucide-react";
import Job from "../Job";

const JobContent = ({ singleJob, similarJobs = [] }) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Role Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          About this role
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {singleJob.description}
        </p>

        {/* Responsibilities */}
        {singleJob.responsibilities && singleJob.responsibilities.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
              Responsibilities
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
              {singleJob.responsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements & Qualifications */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
            Requirements & Qualifications
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
            {singleJob.requirements?.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Skills Tags */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {singleJob.requirements?.map((req, i) => (
              <Badge
                key={i}
                className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-medium py-1 px-3 rounded-lg"
              >
                {req}
              </Badge>
            ))}
          </div>
        </div>

        {/* Benefits if any */}
        {singleJob.benefits && singleJob.benefits.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
              Benefits & Perks
            </h3>
            <div className="flex flex-wrap gap-2">
              {singleJob.benefits.map((b, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium"
                >
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preparation Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
            Interview Preparation
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Prepare for interview for this role
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Practice interview questions tailored to {singleJob.title} and required skills.
          </p>
        </div>
        <Link
          to={`/interview-prep?role=${encodeURIComponent(
            singleJob.title
          )}&skills=${encodeURIComponent(
            (singleJob.requirements || []).join(",")
          )}`}
        >
          <Button className="rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
            <GraduationCap size={16} className="mr-1.5" /> Practice Questions
          </Button>
        </Link>
      </div>

      {/* Similar Jobs */}
      {similarJobs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Similar Opportunities
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {similarJobs.map((simJob) => (
              <Job key={simJob._id} job={simJob} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobContent;
