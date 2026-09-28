import React from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Send,
  Calendar,
  Award,
  Edit3,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";

const PipelineBoard = ({
  savedJobs = [],
  allAppliedJobs = [],
  externalApplications = [],
  onUnsaveJob,
  onOpenAddModal,
  onDeleteExternal,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
      {/* Column 1: Saved / To Apply */}
      <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Saved ({savedJobs.length})
          </span>
          <Bookmark size={14} className="text-indigo-600" />
        </div>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {savedJobs.length === 0 ? (
            <div className="bg-white rounded-xl p-4 text-center border border-dashed border-slate-200">
              <p className="text-xs text-slate-400">No saved jobs yet</p>
              <Link
                to="/jobs"
                className="text-xs text-indigo-600 font-semibold mt-1 inline-block"
              >
                Browse opportunities →
              </Link>
            </div>
          ) : (
            savedJobs.map((item) => {
              const job = typeof item === "object" ? item : null;
              if (!job) return null;
              return (
                <div
                  key={job._id}
                  className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:border-indigo-300 transition"
                >
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {job.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {job.company?.name || "Company"}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="font-semibold text-slate-700">
                      ₹{job.salary} LPA
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUnsaveJob(job._id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Unsave"
                      >
                        <X size={13} />
                      </button>
                      <Link
                        to={`/description/${job._id}`}
                        className="font-semibold text-indigo-600 hover:underline"
                      >
                        Apply →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Column 2: Applied */}
      <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Applied (
            {allAppliedJobs.filter(
              (a) => a.status === "pending" || a.status === "review"
            ).length +
              externalApplications.filter((a) => a.status === "applied").length}
            )
          </span>
          <Send size={14} className="text-blue-600" />
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {/* Portal applications */}
          {allAppliedJobs
            .filter((a) => a.status === "pending" || a.status === "review")
            .map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    Portal Application
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {app.createdAt?.split("T")[0]}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {app.job?.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {app.job?.company?.name}
                </p>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span className="capitalize font-medium">
                    ● {app.status === "pending" ? "Applied" : "Under Review"}
                  </span>
                  <Link
                    to={`/description/${app.job?._id}`}
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}

          {/* External applications */}
          {externalApplications
            .filter((a) => a.status === "applied")
            .map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {app.source}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenAddModal(app)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <Edit3 size={11} />
                    </button>
                    <button
                      onClick={() => onDeleteExternal(app._id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                  {app.role}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{app.company}</p>
                {app.jobUrl && (
                  <a
                    href={app.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-indigo-600 hover:underline flex items-center gap-1 mt-2"
                  >
                    Job Link <ExternalLink size={10} />
                  </a>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Column 3: Shortlisted / Interview */}
      <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Interviewing (
            {allAppliedJobs.filter(
              (a) =>
                a.status === "shortlisted" ||
                a.status === "accepted" ||
                a.status === "interview"
            ).length +
              externalApplications.filter((a) => a.status === "interview").length}
            )
          </span>
          <Calendar size={14} className="text-amber-600" />
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {allAppliedJobs
            .filter(
              (a) =>
                a.status === "shortlisted" ||
                a.status === "accepted" ||
                a.status === "interview"
            )
            .map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-xl p-3.5 border-l-4 border-l-amber-500 border-slate-200 border shadow-2xs"
              >
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-800">
                  {app.status === "interview" ? "Interview" : "Shortlisted"}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                  {app.job?.title}
                </h4>
                <p className="text-[11px] text-slate-500">{app.job?.company?.name}</p>
                {app.interviewDate && (
                  <p className="text-[10px] text-amber-700 font-semibold mt-1.5 flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(app.interviewDate).toLocaleDateString()}
                  </p>
                )}
                <Link
                  to={`/interview-prep?role=${encodeURIComponent(
                    app.job?.title || ""
                  )}`}
                  className="inline-block mt-2 text-[11px] font-semibold text-indigo-600 hover:underline"
                >
                  Prepare for Interview →
                </Link>
              </div>
            ))}

          {externalApplications
            .filter((a) => a.status === "interview")
            .map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-xl p-3.5 border-l-4 border-l-amber-500 border-slate-200 border shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-800">
                    Interview ({app.source})
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenAddModal(app)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <Edit3 size={11} />
                    </button>
                    <button
                      onClick={() => onDeleteExternal(app._id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{app.role}</h4>
                <p className="text-[11px] text-slate-500">{app.company}</p>
                {app.notes && (
                  <p className="text-[11px] text-slate-600 mt-1 bg-slate-50 p-1.5 rounded">
                    {app.notes}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Column 4: Offer / Hired */}
      <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Offers & Hired (
            {allAppliedJobs.filter(
              (a) => a.status === "offer" || a.status === "hired"
            ).length +
              externalApplications.filter((a) => a.status === "offer").length}
            )
          </span>
          <Award size={14} className="text-emerald-600" />
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {allAppliedJobs
            .filter((a) => a.status === "offer" || a.status === "hired")
            .map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-xl p-3.5 border-l-4 border-l-emerald-500 border-slate-200 border shadow-2xs"
              >
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800">
                  {app.status === "hired" ? "Hired" : "Offer Received"}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">
                  {app.job?.title}
                </h4>
                <p className="text-[11px] text-slate-500">{app.job?.company?.name}</p>
              </div>
            ))}

          {externalApplications
            .filter((a) => a.status === "offer")
            .map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-xl p-3.5 border-l-4 border-l-emerald-500 border-slate-200 border shadow-2xs"
              >
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800">
                  Offer ({app.source})
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">{app.role}</h4>
                <p className="text-[11px] text-slate-500">{app.company}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PipelineBoard;
