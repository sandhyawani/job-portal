import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import MobileBottomNav from "../shared/MobileBottomNav";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Building2,
  MapPin,
  ExternalLink,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/button";

const TIMELINE_STAGES = [
  { key: "pending", label: "Applied" },
  { key: "review", label: "Under Review" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
  { key: "hired", label: "Hired" },
];

const ApplicationTracker = () => {
  useGetAppliedJobs();
  const { allAppliedJobs = [] } = useSelector((store) => store.job);
  const [filterStatus, setFilterStatus] = useState("all");

  const getStageIndex = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "pending") return 0;
    if (s === "review") return 1;
    if (s === "shortlisted" || s === "accepted") return 2;
    if (s === "interview") return 3;
    if (s === "offer") return 4;
    if (s === "hired") return 5;
    if (s === "rejected") return -1;
    return 0;
  };

  const filteredJobs = allAppliedJobs.filter((item) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return item.status !== "rejected" && item.status !== "hired";
    if (filterStatus === "shortlisted") return item.status === "shortlisted" || item.status === "accepted";
    if (filterStatus === "interview") return item.status === "interview";
    if (filterStatus === "rejected") return item.status === "rejected";
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto pt-24 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <CheckCircle2 className="text-teal-600" size={28} />
              Application Tracker
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time timeline and recruiter status updates for your job applications.
            </p>
          </div>

          {/* Quick status filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["all", "active", "shortlisted", "interview", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition whitespace-nowrap cursor-pointer ${
                  filterStatus === s
                    ? "bg-teal-600 text-white shadow-2xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Application Cards List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <CheckCircle2 size={36} className="text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">
              No applications in this view
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't submitted any applications matching this filter yet.
            </p>
            <Link to="/jobs">
              <Button className="mt-4 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white">
                Find Opportunities
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((app) => {
              const currentStageIndex = getStageIndex(app.status);
              const isRejected = app.status === "rejected";

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition"
                >
                  {/* Header: Company, Role, Status badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={app.job?.company?.logo || "/logo.png"}
                        alt={app.job?.company?.name || "Company"}
                        className="w-12 h-12 rounded-xl border border-slate-200 object-cover bg-slate-50 p-0.5"
                      />
                      <div>
                        <Link
                          to={`/description/${app.job?._id}`}
                          className="text-base font-bold text-slate-900 hover:text-teal-600 transition"
                        >
                          {app.job?.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">
                            {app.job?.company?.name}
                          </span>
                          <span>·</span>
                          <span>{app.job?.location}</span>
                          <span>·</span>
                          <span>₹{app.job?.salary} LPA</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          isRejected
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : app.status === "hired"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : app.status === "interview"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : app.status === "shortlisted" || app.status === "accepted"
                            ? "bg-purple-50 text-purple-800 border border-purple-200"
                            : "bg-teal-50 text-teal-800 border border-teal-200"
                        }`}
                      >
                        {isRejected ? "Rejected" : app.status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Applied: {app.createdAt?.split("T")[0]}
                      </span>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="py-5">
                    {isRejected ? (
                      <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center gap-3">
                        <AlertCircle size={18} className="text-rose-600 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-rose-900">
                            Application Not Selected
                          </p>
                          <p className="text-[11px] text-rose-700 mt-0.5">
                            The hiring team reviewed your application and decided not to proceed for this opening.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {TIMELINE_STAGES.map((stage, idx) => {
                            const isCompleted = currentStageIndex > idx;
                            const isCurrent = currentStageIndex === idx;

                            return (
                              <div
                                key={stage.key}
                                className={`flex flex-col items-center text-center p-2 rounded-xl transition ${
                                  isCurrent
                                    ? "bg-teal-50 border border-teal-200"
                                    : isCompleted
                                    ? "bg-slate-50"
                                    : "opacity-40"
                                }`}
                              >
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                                    isCompleted
                                      ? "bg-emerald-500 text-white"
                                      : isCurrent
                                      ? "bg-teal-600 text-white ring-4 ring-teal-100"
                                      : "bg-slate-200 text-slate-500"
                                  }`}
                                >
                                  {isCompleted ? "✓" : idx + 1}
                                </div>
                                <span
                                  className={`text-[11px] font-semibold tracking-tight ${
                                    isCurrent
                                      ? "text-teal-900"
                                      : isCompleted
                                      ? "text-slate-800"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {stage.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recruiter Notes or Interview Date if provided */}
                  {(app.interviewDate || app.notes) && (
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 mb-4 text-xs">
                      {app.interviewDate && (
                        <div className="flex items-center gap-2 text-amber-900 font-bold mb-1">
                          <Calendar size={14} className="text-amber-600" />
                          <span>
                            Interview Scheduled:{" "}
                            {new Date(app.interviewDate).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                      )}
                      {app.notes && (
                        <p className="text-amber-800 mt-1">
                          <span className="font-semibold">Recruiter Note:</span> {app.notes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Bottom Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-400">
                      Last updated: {app.updatedAt?.split("T")[0] || app.createdAt?.split("T")[0]}
                    </span>

                    <div className="flex items-center gap-2">
                      {(app.status === "shortlisted" ||
                        app.status === "accepted" ||
                        app.status === "interview") && (
                        <Link
                          to={`/interview-prep?role=${encodeURIComponent(
                            app.job?.title || ""
                          )}`}
                          className="px-3 py-1.5 rounded-xl font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 flex items-center gap-1.5 transition"
                        >
                          <GraduationCap size={14} /> Practice for Interview
                        </Link>
                      )}

                      {isRejected && (
                        <Link
                          to={`/jobs?keyword=${encodeURIComponent(app.job?.title || "")}`}
                          className="px-3 py-1.5 rounded-xl font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 flex items-center gap-1.5 transition"
                        >
                          Find Similar Roles →
                        </Link>
                      )}

                      <Link
                        to={`/description/${app.job?._id}`}
                        className="px-3 py-1.5 rounded-xl font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                      >
                        View Job Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default ApplicationTracker;
