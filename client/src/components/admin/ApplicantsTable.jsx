import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  MoreHorizontal,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  History,
  User,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { setAllApplicants } from "@/redux/applicationSlice";
import axios from "axios";

// Status configuration with human-readable labels, styles and icons
const STATUS_CONFIG = {
  applied: {
    label: "Application Received",
    style: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Clock size={12} className="text-blue-600" />,
  },
  pending: {
    label: "Application Received",
    style: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <Clock size={12} className="text-blue-600" />,
  },
  accepted: {
    label: "Historical Stage • Accepted / Shortlisted",
    style: "bg-purple-50 text-purple-700 border-purple-200",
    icon: <CheckCircle2 size={12} className="text-purple-600" />,
  },
  under_review: {
    label: "Under Review",
    style: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock size={12} className="text-amber-600" />,
  },
  shortlisted: {
    label: "Shortlisted",
    style: "bg-purple-50 text-purple-700 border-purple-200",
    icon: <CheckCircle2 size={12} className="text-purple-600" />,
  },
  interview: {
    label: "Interview",
    style: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: <Calendar size={12} className="text-indigo-600" />,
  },
  offer: {
    label: "Offer Extended",
    style: "bg-teal-50 text-teal-700 border-teal-200",
    icon: <CheckCircle2 size={12} className="text-teal-600" />,
  },
  hired: {
    label: "Hired",
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle2 size={12} className="text-emerald-600" />,
  },
  rejected: {
    label: "Rejected",
    style: "bg-rose-50 text-rose-700 border-rose-200",
    icon: <XCircle size={12} className="text-rose-600" />,
  },
  withdrawn: {
    label: "Withdrawn",
    style: "bg-gray-100 text-gray-700 border-gray-200",
    icon: <XCircle size={12} className="text-gray-500" />,
  },
};

// Transition matrix strictly adhering to backend rules
const NEXT_TRANSITIONS = {
  applied: [
    { key: "under_review", label: "Move to Under Review" },
    { key: "rejected", label: "Reject Application" },
  ],
  pending: [
    { key: "under_review", label: "Move to Under Review" },
    { key: "rejected", label: "Reject Application" },
  ],
  accepted: [
    { key: "hired", label: "Mark as Hired" },
    { key: "rejected", label: "Reject Application" },
  ],
  under_review: [
    { key: "shortlisted", label: "Shortlist Candidate" },
    { key: "rejected", label: "Reject Application" },
  ],
  shortlisted: [
    { key: "interview", label: "Schedule / Move to Interview" },
    { key: "rejected", label: "Reject Application" },
  ],
  interview: [
    { key: "offer", label: "Extend Job Offer" },
    { key: "rejected", label: "Reject Application" },
  ],
  offer: [
    { key: "hired", label: "Mark as Hired" },
    { key: "rejected", label: "Reject Application" },
  ],
  hired: [],
  rejected: [],
  withdrawn: [],
};

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const dispatch = useDispatch();

  const [historyItem, setHistoryItem] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;

      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );

      if (res.data.success) {
        toast.success(res.data.message || `Status updated to ${status}`);

        // Update local Redux store to reflect real backend state immediately
        if (applicants?.applications) {
          const updatedApplications = applicants.applications.map((app) => {
            if (app._id === id) {
              const updatedApp = res.data.application || {
                ...app,
                status,
                updatedAt: new Date().toISOString(),
              };
              return {
                ...app,
                ...updatedApp,
              };
            }
            return app;
          });

          dispatch(
            setAllApplicants({
              ...applicants,
              applications: updatedApplications,
            })
          );
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  const openHistoryModal = (item) => {
    setHistoryItem(item);
    setHistoryOpen(true);
  };

  const applications = applicants?.applications || [];

  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/70">
            <TableHead className="font-bold text-xs text-gray-700">Candidate</TableHead>
            <TableHead className="font-bold text-xs text-gray-700">Job Role</TableHead>
            <TableHead className="font-bold text-xs text-gray-700">Resume</TableHead>
            <TableHead className="font-bold text-xs text-gray-700">Applied Date</TableHead>
            <TableHead className="font-bold text-xs text-gray-700">Current Status</TableHead>
            <TableHead className="font-bold text-xs text-gray-700">Timeline</TableHead>
            <TableHead className="text-right font-bold text-xs text-gray-700">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {applications.length > 0 ? (
            applications.map((item) => {
              const rawStatus = (item.status || "applied").toLowerCase();
              const statusInfo = STATUS_CONFIG[rawStatus] || STATUS_CONFIG.applied;
              const nextOptions = NEXT_TRANSITIONS[rawStatus] || [];
              const applicant = item?.applicant;

              return (
                <TableRow key={item._id} className="hover:bg-gray-50/70 transition">
                  <TableCell>
                    <div className="font-semibold text-gray-900 text-sm">
                      {applicant?.fullname || "Candidate"}
                    </div>
                    <div className="text-xs text-gray-500">{applicant?.email}</div>
                    {applicant?.phoneNumber && (
                      <div className="text-[11px] text-gray-400 mt-0.5">{applicant.phoneNumber}</div>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="font-medium text-gray-800 text-xs truncate max-w-[140px] block">
                      {applicants?.title || "Job Opening"}
                    </span>
                  </TableCell>

                  <TableCell>
                    {applicant?.profile?.resume ? (
                      <a
                        href={applicant.profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700 hover:underline"
                      >
                        <FileText size={14} />
                        <span className="max-w-[110px] truncate">
                          {applicant.profile.resumeOriginalName || "Resume"}
                        </span>
                        <ExternalLink size={10} />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">No Resume</span>
                    )}
                  </TableCell>

                  <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                    {item?.createdAt?.split("T")[0] || "Recently"}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${statusInfo.style}`}
                    >
                      {statusInfo.icon}
                      {statusInfo.label}
                    </span>
                  </TableCell>

                  <TableCell>
                    <button
                      onClick={() => openHistoryModal(item)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-xl transition shadow-2xs whitespace-nowrap"
                      title="View transition audit history"
                    >
                      <History size={12} />
                      <span>Timeline</span>
                    </button>
                  </TableCell>

                  <TableCell className="text-right">
                    {nextOptions.length > 0 ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-600 border border-gray-200 transition"
                            title="Manage candidate stage"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent className="w-56 p-2 bg-white rounded-2xl shadow-xl border border-gray-100">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 py-1">
                            Move Candidate Stage
                          </p>

                          <div className="space-y-1">
                            {nextOptions.map((opt) => (
                              <button
                                key={opt.key}
                                onClick={() => statusHandler(opt.key, item._id)}
                                className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-xl transition ${
                                  opt.key === "rejected"
                                    ? "text-rose-600 hover:bg-rose-50"
                                    : "text-gray-700 hover:bg-pink-50 hover:text-pink-700"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>

                          {item.statusHistory?.length > 0 && (
                            <div className="pt-1.5 mt-1.5 border-t border-gray-100">
                              <button
                                onClick={() => openHistoryModal(item)}
                                className="w-full text-left px-2.5 py-1 text-[11px] text-gray-500 hover:text-purple-600 flex items-center gap-1.5"
                              >
                                <History size={12} /> View Stage Timeline
                              </button>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <span className="text-[11px] text-gray-400 font-medium">Concluded</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-gray-500 text-sm">
                No applicants have submitted applications for this job opening yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Status History Audit Trail Modal */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="sm:max-w-md p-6 bg-white rounded-3xl border border-gray-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <History size={18} className="text-purple-600" />
              Application Status History
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-4">
              Audit trail for candidate:{" "}
              <strong className="text-gray-800">
                {historyItem?.applicant?.fullname || "Applicant"}
              </strong>
            </p>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {historyItem?.statusHistory?.map((hist, idx) => {
                const conf = STATUS_CONFIG[hist.status] || STATUS_CONFIG.applied;
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
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${conf.style}`}
                      >
                        {conf.label}
                      </span>
                      <p className="text-[11px] text-gray-400 mt-1">{formattedTime}</p>
                      {hist.comment && (
                        <p className="text-xs text-gray-700 mt-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <span className="font-semibold text-gray-800">Recruiter note:</span> {hist.comment}
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

export default ApplicantsTable;
