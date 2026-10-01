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
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-8">
      <Navbar />

      <main className="max-w-4xl mx-auto pt-20 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CheckCircle2 className="text-primary-600" size={22} />
              Application Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time timeline and recruiter status updates for your job applications.
            </p>
          </div>

          {/* Quick status filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["all", "active", "shortlisted", "interview", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition whitespace-nowrap cursor-pointer ${
                  filterStatus === s
                    ? "bg-primary-600 text-white shadow-2xs"
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
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <CheckCircle2 size={32} className="text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-900">
              No applications in this view
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You haven't submitted any applications matching this filter yet.
            </p>
            <Link to="/jobs">
              <Button className="mt-3 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white h-8 px-4">
                Find Opportunities
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map((app) => {
              const currentStageIndex = getStageIndex(app.status);
              const isRejected = app.status === "rejected";

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition"
                >
                  {/* Header: Company, Role, Status badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                      <img
                        src={app.job?.company?.logo || "/logo.png"}
                        alt={app.job?.company?.name || "Company"}
                        className="w-10 h-10 rounded-xl border border-slate-200 object-cover bg-slate-50 p-0.5 shrink-0"
                      />
                      <div>
                        <Link
                          to={`/description/${app.job?._id}`}
                          className="text-sm sm:text-base font-bold text-slate-900 hover:text-primary-600 transition"
                        >
                          {app.job?.title}
                        </Link>
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
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

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          isRejected
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : app.status === "hired"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : app.status === "interview"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : app.status === "shortlisted" || app.status === "accepted"
                            ? "bg-purple-50 text-purple-800 border border-purple-200"
                            : "bg-primary-50 text-primary-800 border border-primary-200"
                        }`}
                      >
                        {isRejected ? "Rejected" : app.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Applied: {app.createdAt?.split("T")[0]}
                      </span>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="py-3">
                    {isRejected ? (
                      <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/80 flex items-center gap-2.5">
                        <AlertCircle size={16} className="text-rose-600 shrink-0" />
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
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5">
                          {TIMELINE_STAGES.map((stage, idx) => {
                            const isCompleted = currentStageIndex > idx;
                            const isCurrent = currentStageIndex === idx;

                            return (
                              <div
                                key={stage.key}
                                className={`flex items-center gap-1.5 p-1.5 sm:p-2 rounded-lg transition ${
                                  isCurrent
                                    ? "bg-primary-50 border border-primary-200"
                                    : isCompleted
                                    ? "bg-slate-50"
                                    : "opacity-40"
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                    isCompleted
                                      ? "bg-emerald-500 text-white"
                                      : isCurrent
                                      ? "bg-primary-600 text-white ring-2 ring-primary-100"
                                      : "bg-slate-200 text-slate-500"
                                  }`}
                                >
                                  {isCompleted ? "✓" : idx + 1}
                                </div>
                                <span
                                  className={`text-[10px] sm:text-[11px] font-semibold truncate ${
                                    isCurrent
                                      ? "text-primary-900"
                                      : isCompleted
                                      ? "text-slate-700"
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
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 mb-2.5 text-xs">
                      {app.interviewDate && (
                        <div className="flex items-center gap-2 text-amber-900 font-bold mb-0.5">
                          <Calendar size={13} className="text-amber-600" />
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
                        <p className="text-amber-800 text-[11px]">
                          <span className="font-semibold">Recruiter Note:</span> {app.notes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Bottom Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-400">
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
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-50 text-primary-700 hover:bg-primary-100 flex items-center gap-1 transition"
                        >
                          <GraduationCap size={13} /> Practice Prep
                        </Link>
                      )}

                      {isRejected && (
                        <Link
                          to={`/jobs?keyword=${encodeURIComponent(app.job?.title || "")}`}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-50 text-primary-700 hover:bg-primary-100 flex items-center gap-1 transition"
                        >
                          Find Similar Roles →
                        </Link>
                      )}

                      <Link
                        to={`/description/${app.job?._id}`}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
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
