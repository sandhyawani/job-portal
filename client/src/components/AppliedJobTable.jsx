import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  History,
  Calendar,
} from "lucide-react";

const PIPELINE_META = {
  applied: {
    style: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Application Received",
    stage: "Stage 1 of 5 • Application Received",
    icon: <Clock size={13} className="text-blue-600" />,
  },
  pending: {
    style: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Application Received",
    stage: "Stage 1 of 5 • Application Received",
    icon: <Clock size={13} className="text-blue-600" />,
  },
  under_review: {
    style: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Under Review",
    stage: "Stage 2 of 5 • In Recruiter Screening",
    icon: <Clock size={13} className="text-amber-600" />,
  },
  shortlisted: {
    style: "bg-purple-50 text-purple-700 border-purple-200",
    label: "Shortlisted",
    stage: "Stage 3 of 5 • Selected for Review",
    icon: <CheckCircle2 size={13} className="text-purple-600" />,
  },
  interview: {
    style: "bg-indigo-50 text-indigo-700 border-indigo-200",
    label: "Interview Scheduled",
    stage: "Stage 4 of 5 • Interview Round",
    icon: <Calendar size={13} className="text-indigo-600" />,
  },
  offer: {
    style: "bg-teal-50 text-teal-700 border-teal-200",
    label: "Job Offer Extended",
    stage: "Stage 5 of 5 • Offer Received",
    icon: <CheckCircle2 size={13} className="text-teal-600" />,
  },
  hired: {
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Hired 🎉",
    stage: "Final Stage • Welcome Aboard!",
    icon: <CheckCircle2 size={13} className="text-emerald-600" />,
  },
  rejected: {
    style: "bg-rose-50 text-rose-700 border-rose-200",
    label: "Not Selected",
    stage: "Application Closed",
    icon: <XCircle size={13} className="text-rose-600" />,
  },
  withdrawn: {
    style: "bg-gray-100 text-gray-700 border-gray-200",
    label: "Withdrawn",
    stage: "Withdrawn by Applicant",
    icon: <XCircle size={13} className="text-gray-500" />,
  },
};

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [timelineItem, setTimelineItem] = useState(null);
  const [timelineOpen, setTimelineOpen] = useState(false);

  const filteredJobs = (allAppliedJobs || []).filter((app) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const titleMatch = app.job?.title?.toLowerCase().includes(term);
    const companyMatch = app.job?.company?.name?.toLowerCase().includes(term);
    const statusMatch = app.status?.toLowerCase().includes(term);
    return titleMatch || companyMatch || statusMatch;
  });

  const getStatusBadge = (status) => {
    const s = (status || "applied").toLowerCase();
    return PIPELINE_META[s] || PIPELINE_META.applied;
  };

  const openTimeline = (appliedJob) => {
    setTimelineItem(appliedJob);
    setTimelineOpen(true);
  };

  return (
    <div className="space-y-4">
      {allAppliedJobs && allAppliedJobs.length > 2 && (
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by job title, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 focus:bg-white transition"
            />
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {filteredJobs.length} {filteredJobs.length === 1 ? "application" : "applications"}
          </span>
        </div>
      )}

      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="text-xs font-bold text-gray-600">Applied Date</TableHead>
              <TableHead className="text-xs font-bold text-gray-600">Job Role</TableHead>
              <TableHead className="text-xs font-bold text-gray-600">Company</TableHead>
              <TableHead className="text-xs font-bold text-gray-600">Status & Stage</TableHead>
              <TableHead className="text-right text-xs font-bold text-gray-600">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((appliedJob) => {
                const statusMeta = getStatusBadge(appliedJob.status);
                const company = appliedJob.job?.company;
                const hasHistory = (appliedJob.statusHistory?.length || 0) > 0;

                return (
                  <TableRow key={appliedJob._id} className="hover:bg-gray-50/70 transition">
                    <TableCell className="text-gray-500 text-xs">
                      {appliedJob?.createdAt?.split("T")[0] ?? "Recently"}
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold text-gray-900 text-sm">
                        {appliedJob.job?.title ?? "Position Unavailable"}
                      </div>
                      {appliedJob.job?.location && (
                        <div className="text-[11px] text-gray-400 font-normal">
                          📍 {appliedJob.job.location}
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {company?.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-7 h-7 rounded-lg border border-gray-100 object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 text-xs font-bold">
                            <Building2 size={14} />
                          </div>
                        )}
                        <span className="font-medium text-gray-800 text-xs truncate max-w-[130px]">
                          {company?.name ?? "Company"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusMeta.style}`}
                        >
                          {statusMeta.icon}
                          {statusMeta.label}
                        </span>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {statusMeta.stage}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        {hasHistory && (
                          <button
                            onClick={() => openTimeline(appliedJob)}
                            className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-purple-200 bg-purple-50/50"
                            title="View application timeline"
                          >
                            <History size={12} /> Timeline
                          </button>
                        )}

                        {appliedJob.job?._id ? (
                          <Button
                            onClick={() => navigate(`/description/${appliedJob.job._id}`)}
                            size="sm"
                            variant="outline"
                            className="rounded-xl text-pink-600 border-pink-200 hover:bg-pink-50 text-xs font-semibold px-3 py-1"
                          >
                            View Job
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400">Archived</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mb-3">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-gray-800">
                      {searchTerm ? "No applications match your search query." : "You haven't applied to any jobs yet."}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 mb-4">
                      {searchTerm ? "Try searching for a different keyword." : "Discover open roles and submit your applications."}
                    </p>
                    {searchTerm ? (
                      <Button
                        onClick={() => setSearchTerm("")}
                        size="sm"
                        variant="outline"
                        className="rounded-xl text-xs font-semibold"
                      >
                        Clear Search
                      </Button>
                    ) : (
                      <Button
                        onClick={() => navigate("/jobs")}
                        size="sm"
                        className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-medium shadow-sm"
                      >
                        Explore Jobs
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Application Timeline Modal */}
      <Dialog open={timelineOpen} onOpenChange={setTimelineOpen}>
        <DialogContent className="sm:max-w-md p-6 bg-white rounded-3xl border border-gray-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <History size={18} className="text-purple-600" />
              Application Journey Timeline
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-4">
              Real-time stage transitions for{" "}
              <strong className="text-gray-900">{timelineItem?.job?.title}</strong> at{" "}
              <strong className="text-gray-900">{timelineItem?.job?.company?.name || "Company"}</strong>:
            </p>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {timelineItem?.statusHistory?.map((hist, idx) => {
                const conf = PIPELINE_META[hist.status] || PIPELINE_META.applied;
                const formattedTime = new Date(hist.changedAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-purple-600" />
                    <div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${conf.style}`}
                      >
                        {conf.icon}
                        {conf.label}
                      </span>
                      <p className="text-[11px] text-gray-400 mt-1">{formattedTime}</p>
                      {hist.comment && (
                        <p className="text-xs text-gray-600 mt-0.5 bg-gray-50 p-2 rounded-lg border border-gray-100 italic">
                          &ldquo;{hist.comment}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppliedJobTable;
