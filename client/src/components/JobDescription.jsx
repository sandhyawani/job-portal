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
import { setSingleJob, toggleSavedJobInState } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import MobileBottomNav from "./shared/MobileBottomNav";
import {
  Star,
  MapPin,
  Clock,
  Briefcase,
  IndianRupee,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Building2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  Layers,
} from "lucide-react";
import TrustBadge from "./TrustBadge";
import { calculateJobMatch } from "@/utils/jobMatcher";
import Job from "./Job";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

const normalizeUrl = (url) => {
  if (!url) return "#";
  return url.startsWith("http") ? url : `https://${url}`;
};

const JobDescription = () => {
  const { singleJob, savedJobs = [] } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appliedDate, setAppliedDate] = useState(null);
  const [coverNote, setCoverNote] = useState("");

  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isCandidate = !user || user.role === "student";

  const isSaved = savedJobs.some(
    (item) => (item._id || item) === jobId
  );

  // Check application status
  useEffect(() => {
    if (!user) {
      setIsApplied(false);
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
      }
    };

    checkApplied();
  }, [jobId, user]);

  // Fetch job details & similar jobs
  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          if (res.data.similarJobs) {
            setSimilarJobs(res.data.similarJobs);
          }
        }
      } catch (err) {
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch]);

  const handleApplyClick = () => {
    if (!user) {
      toast.info("Please log in as a candidate to apply.");
      navigate("/login");
      return;
    }

    if (user.role === "recruiter") {
      toast.error("Recruiter accounts cannot apply to jobs.");
      return;
    }

    if (isApplied) return;

    // Open Pre-Submission Review Modal
    setShowApplyModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setApplying(true);
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        setAppliedDate(new Date());
        setShowApplyModal(false);
        setShowSuccessModal(true);
        toast.success("Application submitted successfully!");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to submit application";
      toast.info(msg);
      if (msg.toLowerCase().includes("already applied")) {
        setIsApplied(true);
        setShowApplyModal(false);
      }
    } finally {
      setApplying(false);
    }
  };

  const saveToggleHandler = async () => {
    if (!user) {
      toast.info("Please log in to save jobs.");
      navigate("/login");
      return;
    }

    try {
      setSaving(true);
      dispatch(toggleSavedJobInState(jobId));

      const res = await axios.post(
        `${USER_API_END_POINT}/save/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      dispatch(toggleSavedJobInState(jobId));
      toast.error("Failed to update saved job");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !singleJob) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Navbar />
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  const company = singleJob.company;
  const workMode =
    singleJob.workMode ||
    (singleJob.location?.toLowerCase().includes("remote")
      ? "Remote"
      : singleJob.location?.toLowerCase().includes("hybrid")
      ? "Hybrid"
      : "On-site");

  const match = isCandidate ? calculateJobMatch(singleJob, user) : null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-24 px-4 sm:px-6">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-4 transition cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to jobs
        </button>

        {/* Main Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            {/* Job Title & Meta */}
            <div className="flex items-start gap-4">
              <img
                src={company?.logo || "/logo.png"}
                alt={company?.name || "Company"}
                className="w-16 h-16 rounded-2xl border border-slate-200 bg-white object-cover shrink-0 p-1"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {singleJob.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-sm font-semibold text-slate-700">
                    {company?.name || "Company"}
                  </span>
                  {company?.trustLevel && (
                    <TrustBadge trustLevel={company.trustLevel} />
                  )}
                  {company?.trustScore > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold">
                      <Star size={12} fill="currentColor" />
                      {company.trustScore}/100 Trust Score
                    </span>
                  )}
                </div>

                {/* Key badges */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <MapPin size={13} className="text-slate-400" />
                    {singleJob.location}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span
                    className={`font-semibold ${
                      workMode === "Remote"
                        ? "text-emerald-700"
                        : workMode === "Hybrid"
                        ? "text-indigo-700"
                        : "text-slate-700"
                    }`}
                  >
                    {workMode}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500 font-medium">
                    {singleJob.jobType}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="font-semibold text-slate-800">
                    ₹{singleJob.salary} LPA
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons & Match Score */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-3 shrink-0">
              {match && match.score > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 self-start lg:self-end">
                  <Sparkles size={14} className="text-emerald-600" />
                  <span className="text-xs font-bold">{match.score}% Profile Match</span>
                </div>
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  onClick={saveToggleHandler}
                  disabled={saving}
                  variant="outline"
                  className="rounded-xl border-slate-200 text-xs font-semibold px-4 h-11 hover:bg-slate-50"
                >
                  <Bookmark
                    size={16}
                    className={`mr-1.5 ${
                      isSaved ? "fill-indigo-600 text-indigo-600" : ""
                    }`}
                  />
                  {isSaved ? "Saved" : "Save Job"}
                </Button>

                <Button
                  onClick={handleApplyClick}
                  disabled={isApplied || applying}
                  className={`rounded-xl text-xs font-bold px-6 h-11 transition shadow-xs ${
                    isApplied
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-default"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {isApplied ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={16} /> Applied
                    </span>
                  ) : applying ? (
                    "Submitting..."
                  ) : (
                    "Apply Now"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Match Breakdown Card */}
        {match && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs mb-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Why this job matches you
                  </h2>
                  <p className="text-xs text-slate-500">
                    Transparent analysis based on your saved profile and skills
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-indigo-600">
                  {match.score}%
                </span>
                <span className="text-xs text-slate-400 block font-medium">Match</span>
              </div>
            </div>

            {/* Score points breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500 block">Skills</span>
                <span className="text-sm font-bold text-slate-900">
                  {match.breakdown.skills.score} / 40 pts
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500 block">Experience</span>
                <span className="text-sm font-bold text-slate-900">
                  {match.breakdown.experience.score} / 25 pts
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500 block">Location</span>
                <span className="text-sm font-bold text-slate-900">
                  {match.breakdown.location.score} / 15 pts
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500 block">Job Type & Salary</span>
                <span className="text-sm font-bold text-slate-900">
                  {match.breakdown.jobType.score + match.breakdown.salary.score} / 20 pts
                </span>
              </div>
            </div>

            {/* Explanations list */}
            <div className="space-y-2 text-xs">
              {match.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-2 text-emerald-700 font-medium">
                  <span>{reason}</span>
                </div>
              ))}
              {match.missingKeySkills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-2 text-amber-700 font-medium">
                  <AlertTriangle size={13} className="shrink-0 text-amber-500" />
                  <span>{skill} experience preferred</span>
                </div>
              ))}
            </div>

            {/* Profile improvement */}
            {match.score < 80 && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Want to improve your match score?</span>
                <Link
                  to="/profile"
                  className="font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Update your profile skills →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Grid: Job Content (Left) + Company & Interview Prep (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details (2 cols) */}
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

          {/* Sidebar (1 col): Company profile */}
          <div className="space-y-6">
            {company && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  About the Company
                </h3>

                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={company.logo || "/logo.png"}
                    alt={company.name}
                    className="w-12 h-12 rounded-xl border border-slate-200 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {company.name}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {company.location || "India"}
                    </span>
                  </div>
                </div>

                {company.description && (
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {company.description}
                  </p>
                )}

                <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                  {company.website && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Website</span>
                      <a
                        href={normalizeUrl(company.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 font-medium hover:underline flex items-center gap-1"
                      >
                        Visit site <ExternalLink size={12} />
                      </a>
                    </div>
                  )}

                  {company.trustLevel && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Verification</span>
                      <TrustBadge trustLevel={company.trustLevel} />
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
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 w-full py-2 rounded-xl bg-indigo-50/70 hover:bg-indigo-50 transition"
                  >
                    <Building2 size={13} /> View full company profile
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Job Summary */}
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
                    {singleJob.createdAt?.split("T")[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* What happens when you apply guide */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-6 text-xs">
              <h4 className="font-bold text-slate-900 mb-3 text-sm">
                What happens when you apply?
              </h4>
              <ul className="space-y-3 text-slate-600 text-xs">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0 text-[11px]">
                    1
                  </span>
                  <span>
                    Your profile, contact details, and resume are delivered directly to the recruiter.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0 text-[11px]">
                    2
                  </span>
                  <span>
                    The hiring team reviews your credentials and updates your application status.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0 text-[11px]">
                    3
                  </span>
                  <span>
                    Track stage progress, interview times, and recruiter feedback in your Application Tracker.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* PRE-SUBMISSION APPLICATION REVIEW MODAL */}
        <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
          <DialogContent className="sm:max-w-lg bg-white rounded-3xl p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-slate-900">
                Review Your Application
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Confirm your details before submitting to {company?.name}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2 text-xs">
              {/* Target Job Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Applying For
                </span>
                <h4 className="text-sm font-bold text-slate-900">{singleJob?.title}</h4>
                <p className="text-slate-600 mt-0.5">
                  {company?.name} · {singleJob?.location} · ₹{singleJob?.salary} LPA
                </p>
              </div>

              {/* Candidate Profile Details */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Profile Information Being Submitted
                </span>
                <div className="grid grid-cols-2 gap-2.5 text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Full Name</span>
                    <span className="font-semibold text-slate-900">{user?.fullname || "Candidate"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Email Address</span>
                    <span className="font-semibold text-slate-900">{user?.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Phone</span>
                    <span className="font-semibold text-slate-900">{user?.phoneNumber || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Location</span>
                    <span className="font-semibold text-slate-900">{user?.profile?.location || "India"}</span>
                  </div>
                </div>
              </div>

              {/* Resume Section */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Attached Resume
                </span>
                {user?.profile?.resume ? (
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 truncate max-w-[260px]">
                      📄 {user.profile.resumeOriginalName || "Candidate_Resume.pdf"}
                    </span>
                    <a
                      href={user.profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      Preview <ExternalLink size={12} />
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <span className="text-[11px]">No resume uploaded yet.</span>
                    <Link to="/profile" className="font-bold underline text-[11px] text-indigo-600">
                      Upload Resume →
                    </Link>
                  </div>
                )}
              </div>

              {/* Optional Cover Note */}
              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  Brief Note to Hiring Team (Optional)
                </label>
                <textarea
                  rows={2}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Mention availability, relevant achievements, or why you're a great fit..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setShowApplyModal(false)}
                className="rounded-xl text-xs font-semibold px-4"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSubmit}
                disabled={applying}
                className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-6 shadow-xs"
              >
                {applying ? "Submitting..." : "Confirm & Submit Application"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* POST-SUBMISSION SUCCESS CONFIRMATION MODAL */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>

            <DialogTitle className="text-xl font-black text-slate-900">
              Application Submitted!
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              Your application has been delivered directly to the hiring team.
            </DialogDescription>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-5 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Position:</span>
                <span className="font-bold text-slate-900">{singleJob?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Company:</span>
                <span className="font-semibold text-slate-800">{company?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Submitted:</span>
                <span className="font-medium text-slate-700">
                  {appliedDate ? new Date(appliedDate).toLocaleDateString() : "Today"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-indigo-600 uppercase text-[11px]">Applied (Under Review)</span>
              </div>
            </div>

            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-3.5 mb-6 text-left text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-indigo-900 block mb-1">Next steps:</span>
              <p className="text-[11px] text-slate-600">
                You will be notified as soon as the recruiter reviews your application or schedules an interview round.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <Button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/applications");
                }}
                className="flex-1 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              >
                Track Application
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/jobs");
                }}
                className="flex-1 rounded-xl text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Explore More Jobs
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default JobDescription;
