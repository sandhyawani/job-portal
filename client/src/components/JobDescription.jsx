import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
  USER_API_END_POINT,
} from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { setSavedJobs } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  Calendar,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  Star,
  Users,
  Wallet,
  CheckCircle2,
  Share2,
  Zap,
  Sparkles,
  Calculator,
  ShieldCheck,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";
import TrustBadge from "./TrustBadge";
import ApplicationReadinessModal from "./ApplicationReadinessModal";
import { calculateSkillMatch } from "@/utils/skillMatcher";
import { calculateMonthlyTakeHome } from "@/utils/salaryCalculator";

/* UTILITIES */
const normalizeUrl = (url) =>
  url?.startsWith("http") ? url : `https://${url}`;

const formatSalary = (salary) => {
  if (!salary) return "Competitive";
  const num = Number(salary);
  if (!isNaN(num) && num > 1000) {
    return `₹${num.toLocaleString("en-IN")}`;
  }
  return salary.startsWith("₹") ? salary : `₹${salary}`;
};

const formatExperience = (exp) => {
  if (!exp && exp !== 0) return "Fresher / Any";
  if (!isNaN(exp)) return `${exp} Year${Number(exp) === 1 ? "" : "s"}`;
  return exp;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "Recently";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr?.split("T")?.[0] || dateStr;
  }
};

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [isApplied, setIsApplied] = useState(false);
  const [checking, setChecking] = useState(true);
  const [copied, setCopied] = useState(false);
  const [readinessModalOpen, setReadinessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const skillMatch = calculateSkillMatch(user?.profile?.skills, singleJob);
  const takeHome = calculateMonthlyTakeHome(singleJob?.salary);

  const shareJobHandler = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out this opening for ${singleJob?.title} at ${singleJob?.company?.name || "Company"}: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${singleJob?.title} | JobPortal`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User closed share dialog
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Job link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `💼 *${singleJob?.title}* at *${singleJob?.company?.name || "Company"}*\n📍 ${singleJob?.location} | 💰 ${formatSalary(singleJob?.salary)}\n\nApply here: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  useEffect(() => {
    if (!user) {
      setIsApplied(false);
      setChecking(false);
      return;
    }

    const checkApplied = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/has-applied/${jobId}`,
          { withCredentials: true }
        );
        setIsApplied(res.data.applied);
      } catch {
        setIsApplied(false);
      } finally {
        setChecking(false);
      }
    };

    checkApplied();
  }, [jobId, user]);

  const onApplyClick = () => {
    if (!user) {
      toast.error("Please login as a candidate to apply");
      navigate("/login");
      return;
    }
    if (user.role === "recruiter") {
      toast.error("Recruiters cannot apply for jobs. Please use a candidate account.");
      return;
    }
    if (isApplied) return;
    setReadinessModalOpen(true);
  };

  const handleConfirmApply = async () => {
    if (!user || user.role === "recruiter" || isApplied) return;

    try {
      setIsSubmitting(true);
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        toast.success(res.data.message || "Application submitted successfully!");
      }
    } catch (error) {
      toast.info(error.response?.data?.message || "Already applied");
      setIsApplied(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSaved = Boolean(
    user?.savedJobs?.some((saved) => {
      const id = typeof saved === "object" ? saved?._id : saved;
      return id?.toString() === jobId?.toString();
    })
  );

  const saveJobHandler = async () => {
    if (!user) {
      toast.error("Please login to save jobs");
      return;
    }

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/save-job/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setSavedJobs(res.data.savedJobs));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update saved jobs");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setSingleJob(res.data.job));
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch]);

  if (!singleJob || checking) return null;

  const company = singleJob.company;
  const requirements = Array.isArray(singleJob.requirements)
    ? singleJob.requirements
    : typeof singleJob.requirements === "string"
    ? singleJob.requirements.split(",").map((r) => r.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <Navbar />

      <div className="max-w-4xl mx-auto pt-24 px-4 sm:px-6">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-pink-600 mb-5 transition-colors"
        >
          <ArrowLeft size={14} /> Back to jobs
        </button>

        {/* Main Clean Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6 sm:p-8">
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 pb-6 border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {singleJob.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge className="bg-pink-50 text-pink-700 hover:bg-pink-100 text-xs px-2.5 py-0.5 rounded-md font-medium border border-pink-200">
                  {singleJob.position} Positions
                </Badge>
                <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs px-2.5 py-0.5 rounded-md font-medium border border-purple-200">
                  {singleJob.jobType}
                </Badge>
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs px-2.5 py-0.5 rounded-md font-medium border border-emerald-200">
                  {formatSalary(singleJob.salary)}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="shrink-0 flex items-center gap-2.5 w-full sm:w-auto">
              <Button
                onClick={shareJobHandler}
                variant="outline"
                className="px-3.5 py-2.5 rounded-xl font-semibold text-sm border-gray-200 text-gray-700 hover:border-pink-300 hover:text-pink-600 transition-all flex items-center gap-1.5"
                title="Share this job opening"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
              </Button>

              <Button
                onClick={saveJobHandler}
                variant="outline"
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isSaved
                    ? "border-pink-300 bg-pink-50 text-pink-700 hover:bg-pink-100"
                    : "border-gray-200 text-gray-700 hover:border-pink-300 hover:text-pink-600"
                }`}
                title={isSaved ? "Remove from saved" : "Save for later"}
              >
                <Bookmark
                  size={16}
                  className={`mr-1.5 ${
                    isSaved ? "fill-pink-600 text-pink-600" : ""
                  }`}
                />
                {isSaved ? "Saved" : "Save"}
              </Button>

              <Button
                disabled={isApplied}
                onClick={isApplied ? undefined : onApplyClick}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                  isApplied
                    ? "bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed hover:bg-gray-100"
                    : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:shadow-md"
                }`}
              >
                {isApplied ? "✓ Already Applied" : "Apply Now"}
              </Button>
            </div>
          </div>

          {company && (
            <div className="my-6 p-4 rounded-xl border border-gray-100 bg-gray-50/70 flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src={company.logo || "/logo.png"}
                alt={company.name}
                className="w-12 h-12 rounded-lg border border-gray-200 bg-white object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900 truncate">
                    {company.name}
                  </h3>
                  <TrustBadge trustLevel={company.trustLevel} />
                </div>

                {company.description && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {company.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-gray-400" />
                    {singleJob.location}
                  </span>

                  {company.trustScore && (
                    <span className="flex items-center gap-1 text-amber-600 font-medium">
                      <Star size={13} fill="currentColor" />
                      {company.trustScore}/100 Trust Score
                    </span>
                  )}

                  {company.website && (
                    <a
                      href={normalizeUrl(company.website)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-pink-600 font-medium hover:underline"
                    >
                      <Globe size={13} /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Skill Fit & Skill Gap Intelligent Analysis */}
          {user && skillMatch.hasSkills ? (
            <div className="my-6 p-5 rounded-2xl border border-purple-200/90 bg-gradient-to-br from-purple-50/70 via-pink-50/40 to-white shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Zap size={20} className="fill-current" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      Profile Skill Match:{" "}
                      <span className="text-purple-700 font-extrabold">
                        {skillMatch.matchPercentage}% Compatible
                      </span>
                      <Badge
                        className={`text-[10px] font-bold px-2 py-0.5 border ${
                          skillMatch.matchPercentage >= 70
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : skillMatch.matchPercentage >= 40
                            ? "bg-amber-100 text-amber-800 border-amber-300"
                            : "bg-slate-100 text-slate-800 border-slate-300"
                        }`}
                      >
                        {skillMatch.matchPercentage >= 70
                          ? "Strong Fit"
                          : skillMatch.matchPercentage >= 40
                          ? "Moderate Fit"
                          : "Growth Opportunity"}
                      </Badge>
                    </h4>
                    <p className="text-xs text-gray-500">
                      Evaluated against the skills verified on your candidate profile
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-44 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${skillMatch.matchPercentage}%` }}
                  />
                </div>
              </div>

              {/* Matched Skills */}
              {skillMatch.matchedSkills?.length > 0 && (
                <div className="mt-3.5">
                  <p className="text-xs font-bold text-emerald-800 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    Matching Skills ({skillMatch.matchedSkills.length})
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {skillMatch.matchedSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 font-semibold border border-emerald-200"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Gaps */}
              {skillMatch.missingSkills?.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-purple-100/60">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle size={13} className="text-amber-600" />
                      Identified Skill Gaps ({skillMatch.missingSkills.length})
                    </p>
                    <span className="text-[11px] text-gray-500 hidden sm:inline">
                      Tip: Brush up on these to maximize your shortlist chances
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {skillMatch.missingSkills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 font-medium border border-amber-200"
                      >
                        • {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : user && !skillMatch.hasSkills ? (
            <div className="my-6 p-4 rounded-2xl border border-purple-100 bg-purple-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-950">
                    Add skills to unlock role compatibility & gap insights
                  </h4>
                  <p className="text-xs text-purple-700/80 mt-0.5">
                    Your profile has no listed skills. Update your profile to see instant fit scores.
                  </p>
                </div>
              </div>
              <Link
                to="/profile"
                className="text-xs font-semibold px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-2xs text-center shrink-0 transition"
              >
                Add Skills to Profile
              </Link>
            </div>
          ) : !user ? (
            <div className="my-6 p-4 rounded-2xl border border-gray-200 bg-gray-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center shrink-0">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">
                    Sign in to view personalized Skill Fit & Skill Gap recommendations
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Compare your verified credentials directly with this role&apos;s requirements.
                  </p>
                </div>
              </div>
              <Link
                to="/login"
                className="text-xs font-semibold px-3.5 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl shadow-2xs text-center shrink-0 transition"
              >
                Sign In
              </Link>
            </div>
          ) : null}

          <div className="my-6">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Briefcase size={16} className="text-pink-600" />
              Job Overview
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <OverviewItem
                icon={<Briefcase size={16} className="text-pink-600" />}
                label="Role"
                value={singleJob.title}
              />
              <OverviewItem
                icon={<MapPin size={16} className="text-purple-600" />}
                label="Location"
                value={singleJob.location}
              />
              <OverviewItem
                icon={<Clock size={16} className="text-indigo-600" />}
                label="Experience"
                value={formatExperience(singleJob.experienceLevel)}
              />
              <OverviewItem
                icon={<Wallet size={16} className="text-emerald-600" />}
                label="Salary / CTC"
                value={formatSalary(singleJob.salary)}
              />
              <OverviewItem
                icon={<Users size={16} className="text-blue-600" />}
                label="Applicants"
                value={`${singleJob.applications?.length || 0} ${
                  (singleJob.applications?.length || 0) === 1 ? "person" : "people"
                }`}
              />
              <OverviewItem
                icon={<Calendar size={16} className="text-amber-600" />}
                label="Posted Date"
                value={formatDate(singleJob.createdAt)}
              />
            </div>
          </div>

          {takeHome.valid && (
            <div className="my-6 p-5 rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 via-teal-50/20 to-white shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Calculator size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      Estimated Monthly Take-Home Breakdown
                    </h4>
                    <p className="text-xs text-gray-500">
                      Real-world approximate in-hand pay based on Indian tax norms
                    </p>
                  </div>
                </div>
                {takeHome.inHandPercentage && (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-bold hidden sm:inline-flex">
                    ~{takeHome.inHandPercentage}% Take-Home
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs text-center">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Annual CTC
                  </p>
                  <p className="text-base font-bold text-gray-900 mt-1">
                    {takeHome.formattedAnnual}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-gray-100 shadow-2xs text-center">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Est. Monthly Gross
                  </p>
                  <p className="text-base font-bold text-gray-800 mt-1">
                    {takeHome.formattedGross}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-amber-100 bg-amber-50/20 shadow-2xs text-center">
                  <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">
                    Est. Deductions (Taxes & PF)
                  </p>
                  <p className="text-base font-bold text-amber-800 mt-1">
                    {takeHome.formattedDeductions || "-"}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-emerald-300 shadow-2xs text-center ring-2 ring-emerald-400/20">
                  <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                    Est. In-Hand / Month
                  </p>
                  <p className="text-lg font-extrabold text-emerald-600 mt-0.5">
                    {takeHome.formattedInHand}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 mt-3 text-center sm:text-left">
                *Estimated under standard new tax regime & nominal EPF. Actual take-home varies with employer benefit structure.
              </p>
            </div>
          )}

          <div className="my-6 p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-950 flex items-center gap-2">
                  ⚡ Active Hiring & Fast Response
                  {(singleJob.applications?.length || 0) <= 5 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                      Low Competition
                    </span>
                  )}
                </p>
                <p className="text-xs text-indigo-800 mt-0.5">
                  Recruiter reviews submissions within <strong>48-72 hours</strong>.{" "}
                  {singleJob.applications?.length || 0} candidate(s) currently applied.
                </p>
              </div>
            </div>

            <button
              onClick={shareToWhatsApp}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs shrink-0"
            >
              Share via WhatsApp
            </button>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-2">
              About this role
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {singleJob.description}
            </p>
          </div>

          {requirements.length > 0 && (
            <div className="pt-6 mt-6 border-t border-gray-100">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Key Requirements & Skills
              </h3>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                {requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>

      {/* Application Readiness Modal */}
      <ApplicationReadinessModal
        open={readinessModalOpen}
        setOpen={setReadinessModalOpen}
        job={singleJob}
        user={user}
        skillMatch={skillMatch}
        onConfirmApply={handleConfirmApply}
        isSubmitting={isSubmitting}
        isApplied={isApplied}
      />
    </div>
  );
};

const OverviewItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200/60 bg-gray-50/60 hover:bg-pink-50/30 transition-colors">
    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200/80 shadow-2xs flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate" title={value}>
        {value}
      </p>
    </div>
  </div>
);

export default JobDescription;
