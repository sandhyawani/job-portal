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
  MoreHorizontal,
  FileText,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  Eye,
  ExternalLink,
  Github,
  Globe,
  MapPin,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import applicationApi from "@/api/applicationApi";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import ResumeModal from "../shared/ResumeModal";

const PIPELINE_STATUSES = [
  { value: "review", label: "Move to Review" },
  { value: "shortlisted", label: "Shortlist Candidate" },
  { value: "interview", label: "Schedule Interview" },
  { value: "offer", label: "Extend Offer" },
  { value: "hired", label: "Mark Hired" },
  { value: "rejected", label: "Reject" },
];

const ApplicantsTable = ({ applications = [], onStatusUpdate }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [viewingResume, setViewingResume] = useState(null);
  const [statusModalApp, setStatusModalApp] = useState(null);
  const [targetStatus, setTargetStatus] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [recruiterNotes, setRecruiterNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const openStatusChangeDialog = (app, status) => {
    setStatusModalApp(app);
    setTargetStatus(status);
    setInterviewDate(app.interviewDate ? app.interviewDate.split("T")[0] : "");
    setRecruiterNotes(app.notes || "");
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!statusModalApp || !targetStatus) return;

    try {
      setLoading(true);
      const res = await applicationApi.updateStatus(statusModalApp._id, {
        status: targetStatus,
        notes: recruiterNotes,
        interviewDate: targetStatus === "interview" ? interviewDate : undefined,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setStatusModalApp(null);
        if (onStatusUpdate) onStatusUpdate();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "pending").toLowerCase();
    if (s === "rejected") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (s === "hired") {
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    }
    if (s === "offer") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s === "interview") {
      return "bg-amber-50 text-amber-800 border-amber-200";
    }
    if (s === "shortlisted" || s === "accepted") {
      return "bg-purple-50 text-purple-800 border-purple-200";
    }
    if (s === "review") {
      return "bg-primary-50 text-primary-700 border-primary-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs custom-scrollbar">
        <Table className="w-full text-left text-xs min-w-[720px]">
          <TableHeader className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <TableRow>
              <TableHead className="p-3.5 w-60">Candidate</TableHead>
              <TableHead className="p-3.5 w-48">Contact</TableHead>
              <TableHead className="p-3.5 w-40">Skills</TableHead>
              <TableHead className="p-3.5 w-28">Resume</TableHead>
              <TableHead className="p-3.5 w-28">Date Applied</TableHead>
              <TableHead className="p-3.5 w-28">Status</TableHead>
              <TableHead className="p-3.5 text-right w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-100">
            {applications.length > 0 ? (
              applications.map((item) => {
                const applicant = item.applicant;
                const profile = applicant?.profile || {};
                return (
                  <TableRow key={item._id} className="hover:bg-slate-50/60 transition">
                    {/* Candidate Name & Bio */}
                    <TableCell className="p-3.5 max-w-[240px]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar className="w-8 h-8 rounded-full border border-slate-200 shrink-0">
                          <AvatarImage
                            src={profile.profilePhoto}
                            alt={applicant?.fullname || "Candidate"}
                          />
                          <AvatarFallback className="bg-primary-600 text-white font-bold text-xs uppercase">
                            {applicant?.fullname?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <button
                            onClick={() => setSelectedCandidate(item)}
                            className="font-bold text-slate-900 hover:text-primary-600 text-left block truncate w-full"
                          >
                            {applicant?.fullname || "Unknown"}
                          </button>
                          <span className="text-[11px] text-slate-400 block truncate" title={profile.bio}>
                            {profile.bio || "No bio"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell className="p-3.5">
                      <div className="space-y-0.5 text-slate-600">
                        <div className="flex items-center gap-1">
                          <Mail size={12} className="text-slate-400" />
                          <span>{applicant?.email}</span>
                        </div>
                        {applicant?.phoneNumber && (
                          <div className="flex items-center gap-1">
                            <Phone size={12} className="text-slate-400" />
                            <span>{applicant?.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Skills Chips */}
                    <TableCell className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {(profile.skills || []).slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                        {(profile.skills || []).length > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{profile.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Resume */}
                    <TableCell className="p-3.5">
                      {profile.resume ? (
                        <button
                          type="button"
                          onClick={() =>
                            setViewingResume({
                              url: profile.resume,
                              name: applicant?.fullname,
                              originalName:
                                profile.resumeOriginalName ||
                                `${applicant?.fullname || "Candidate"}_Resume.pdf`,
                            })
                          }
                          className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800 font-semibold cursor-pointer"
                        >
                          <FileText size={13} />
                          <span>View Resume</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No resume</span>
                      )}
                    </TableCell>

                    {/* Date Applied */}
                    <TableCell className="p-3.5 text-slate-500">
                      {item.createdAt?.split("T")[0]}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="p-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </TableCell>

                    {/* Actions Popover */}
                    <TableCell className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedCandidate(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                          title="View Candidate Profile"
                        >
                          <Eye size={15} />
                        </button>

                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                              aria-label="Update status"
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </PopoverTrigger>

                          <PopoverContent align="end" className="w-48 p-1.5 rounded-xl bg-white border border-slate-200 shadow-lg">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 block">
                              Move Candidate Stage
                            </span>
                            {PIPELINE_STATUSES.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => openStatusChangeDialog(item, option.value)}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition"
                              >
                                {option.label}
                              </button>
                            ))}
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                  No applicants match the active filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Candidate Profile Drawer / Dialog */}
      <Dialog
        open={Boolean(selectedCandidate)}
        onOpenChange={(open) => !open && setSelectedCandidate(null)}
      >
        <DialogContent className="sm:max-w-lg bg-white rounded-3xl p-6 border border-slate-200 max-h-[85vh] overflow-y-auto">
          {selectedCandidate && (
            <div>
              <DialogHeader className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 rounded-full border border-slate-200 shrink-0">
                    <AvatarImage
                      src={selectedCandidate.applicant?.profile?.profilePhoto}
                      alt={selectedCandidate.applicant?.fullname || "Candidate"}
                    />
                    <AvatarFallback className="bg-primary-600 text-white font-bold text-base uppercase">
                      {selectedCandidate.applicant?.fullname?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-base font-bold text-slate-900">
                      {selectedCandidate.applicant?.fullname}
                    </DialogTitle>
                    <span className="text-xs text-slate-500">
                      Applied on {selectedCandidate.createdAt?.split("T")[0]}
                    </span>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 text-xs mt-4">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">
                    Professional Bio
                  </span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedCandidate.applicant?.profile?.bio || "No bio provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Email</span>
                    <span className="font-semibold text-slate-800">
                      {selectedCandidate.applicant?.email}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Phone</span>
                    <span className="font-semibold text-slate-800">
                      {selectedCandidate.applicant?.phoneNumber || "N/A"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-1.5">
                    Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedCandidate.applicant?.profile?.skills || []).map(
                      (skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 font-semibold"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {selectedCandidate.applicant?.profile?.resume && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setViewingResume({
                          url: selectedCandidate.applicant.profile.resume,
                          name: selectedCandidate.applicant.fullname,
                          originalName:
                            selectedCandidate.applicant.profile.resumeOriginalName ||
                            `${selectedCandidate.applicant.fullname || "Candidate"}_Resume.pdf`,
                        })
                      }
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-xs shadow-xs hover:bg-primary-700 cursor-pointer transition"
                    >
                      <FileText size={15} /> View Full Resume (PDF)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resume Preview Modal */}
      <ResumeModal
        open={Boolean(viewingResume)}
        onClose={() => setViewingResume(null)}
        resumeUrl={viewingResume?.url}
        candidateName={viewingResume?.name}
        originalName={viewingResume?.originalName}
      />

      {/* Status Transition Dialog */}
      <Dialog
        open={Boolean(statusModalApp)}
        onOpenChange={(open) => !open && setStatusModalApp(null)}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6 border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 capitalize">
              Update Candidate Stage to "{targetStatus}"
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              The candidate will receive an immediate notification regarding their application update.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleStatusSubmit} className="space-y-3.5 mt-2">
            {targetStatus === "interview" && (
              <div>
                <Label className="text-xs font-semibold text-slate-700">
                  Interview Date & Time
                </Label>
                <Input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="mt-1 text-xs rounded-xl"
                />
              </div>
            )}

            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Recruiter Notes / Instructions (Optional)
              </Label>
              <textarea
                placeholder="e.g. Please join via Google Meet at 11 AM with your portfolio ready."
                value={recruiterNotes}
                onChange={(e) => setRecruiterNotes(e.target.value)}
                rows={3}
                className="w-full mt-1 text-xs rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStatusModalApp(null)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="text-xs font-bold rounded-xl bg-primary-600 hover:bg-primary-700 text-white"
              >
                {loading ? "Updating..." : "Confirm Status Change"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicantsTable;
