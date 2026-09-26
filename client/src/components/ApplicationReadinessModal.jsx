import React from "react";
import {
  Dialog,
  DialogContent,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  AlertTriangle,
  FileText,
  User,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";

const ApplicationReadinessModal = ({
  open,
  setOpen,
  job,
  user,
  skillMatch,
  onConfirmApply,
  isSubmitting,
  isApplied,
}) => {
  if (!job || !user) return null;

  const hasResume = Boolean(user?.profile?.resume);
  const hasPhone = Boolean(user?.phoneNumber);
  const companyName = job?.company?.name || "Company";

  // Readiness score
  const checks = [
    Boolean(user?.fullname),
    Boolean(user?.email),
    hasPhone,
    hasResume,
    (user?.profile?.skills?.length || 0) > 0,
  ];
  const passedChecks = checks.filter(Boolean).length;
  const readinessPercent = Math.round((passedChecks / checks.length) * 100);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-3xl border border-gray-100 shadow-2xl bg-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
              Application Readiness Check
            </span>
            <span className="text-xs font-semibold bg-white/10 px-2 py-0.5 rounded-md">
              {readinessPercent}% Profile Ready
            </span>
          </div>

          <h2 className="text-xl font-bold mt-2 text-white leading-tight">
            {job.title}
          </h2>
          <p className="text-pink-100 text-xs mt-0.5">
            Applying to <span className="font-semibold">{companyName}</span>
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {isApplied ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Application Successfully Submitted!
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Your profile and credentials have been forwarded to {companyName}&apos;s hiring team.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <Link to="/profile">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto text-xs font-semibold rounded-xl border-gray-200"
                  >
                    Track in My Applications
                  </Button>
                </Link>
                <Button
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto text-xs font-semibold rounded-xl bg-pink-600 hover:bg-pink-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Candidate Info Verification */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <User size={14} className="text-pink-600" />
                  Applicant Credentials
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="text-gray-500">Full Name:</span>
                    <span className="font-semibold text-gray-900">{user.fullname}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium text-gray-900">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <span className="text-gray-500">Contact Number:</span>
                    {hasPhone ? (
                      <span className="font-medium text-gray-900">{user.phoneNumber}</span>
                    ) : (
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <AlertTriangle size={12} /> Missing phone
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Resume Attached Check */}
              <div
                className={`rounded-2xl p-4 border transition-all ${
                  hasResume
                    ? "bg-emerald-50/50 border-emerald-200"
                    : "bg-amber-50/60 border-amber-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        hasResume
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        {hasResume ? "Resume Attached" : "No Resume Uploaded"}
                      </p>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        {hasResume ? (
                          <span className="font-medium text-emerald-800">
                            {user.profile?.resumeOriginalName || "resume.pdf"} (attached for recruiter review)
                          </span>
                        ) : (
                          "Recruiters are 3x more likely to shortlist profiles with an attached resume."
                        )}
                      </p>
                    </div>
                  </div>

                  {hasResume ? (
                    <a
                      href={user.profile?.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 hover:underline shrink-0"
                    >
                      Preview <ExternalLink size={12} />
                    </a>
                  ) : (
                    <Link
                      to="/profile"
                      className="text-xs font-semibold text-pink-600 hover:text-pink-700 bg-white border border-pink-200 px-2.5 py-1 rounded-lg shrink-0 shadow-2xs"
                    >
                      Upload
                    </Link>
                  )}
                </div>
              </div>

              {/* Skill Match & Gap Evaluation */}
              {skillMatch && skillMatch.hasSkills && (
                <div className="bg-purple-50/50 border border-purple-200/80 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-purple-600" />
                      Profile Skill Alignment
                    </span>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs font-bold">
                      {skillMatch.matchPercentage}% Compatible
                    </Badge>
                  </div>

                  {skillMatch.matchedSkills?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 mb-1">
                        Matching Skills ({skillMatch.matchedSkills.length}):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skillMatch.matchedSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-medium border border-emerald-200"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {skillMatch.missingSkills?.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-amber-700 mb-1">
                        Skill Gaps ({skillMatch.missingSkills.length}):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skillMatch.missingSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-200"
                          >
                            • {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl text-xs font-semibold border-gray-200 text-gray-600"
                >
                  Cancel
                </Button>

                <Button
                  onClick={onConfirmApply}
                  disabled={isSubmitting}
                  className="rounded-xl text-xs font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-sm px-5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Confirm & Submit Application
                      <ArrowRight size={14} className="ml-1.5" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationReadinessModal;
