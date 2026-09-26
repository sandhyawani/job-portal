import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Contact,
  Mail,
  Pen,
  Briefcase,
  Bookmark,
  FileText,
  ExternalLink,
  ShieldCheck,
  Building2,
  Plus,
  Users,
  Sparkles,
  Upload,
  Check,
} from "lucide-react";
import { Badge } from "./ui/badge";
import AppliedJobTable from "./AppliedJobTable";
import SavedJobTable from "./SavedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";
import useGetSavedJobs from "../hooks/useGetSavedJobs";
import useGetAllAdminJobs from "../hooks/useGetAllAdminJobs";
import useGetAllCompanies from "../hooks/useGetAllCompanies";

const Profile = () => {
  const { user } = useSelector((store) => store.auth);
  const isRecruiter = user?.role === "recruiter";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Data fetching based on active role
  useGetAppliedJobs();
  useGetSavedJobs();
  useGetAllAdminJobs();
  useGetAllCompanies();

  const [open, setOpen] = useState(false);
  const initialTab = searchParams.get("tab") === "saved" ? "saved" : "applied";
  const [activeTab, setActiveTab] = useState(initialTab);

  React.useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "saved" || tabParam === "applied") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  if (!user) return null;

  const { allAppliedJobs, allSavedJobs, allAdminJobs } = useSelector((store) => store.job);
  const { companies } = useSelector((store) => store.company);

  const totalApplicants =
    allAdminJobs?.reduce((acc, job) => acc + (job.applications?.length || 0), 0) || 0;

  const activePipelineCount = (allAppliedJobs || []).filter(
    (app) => !["rejected", "withdrawn", "hired"].includes((app.status || "").toLowerCase())
  ).length;

  const jobsWithApplicants =
    allAdminJobs?.filter((job) => (job.applications?.length || 0) > 0).length || 0;

  const isResume = Boolean(user?.profile?.resume);

  // Parse skills cleanly (splits comma-separated entries)
  const cleanSkills =
    user?.profile?.skills
      ?.flatMap((skill) => {
        if (typeof skill !== "string") return [skill];
        return skill.split(/[,]+/);
      })
      .map((s) => (typeof s === "string" ? s.trim() : s))
      .filter(Boolean) || [];

  // Calculate profile completeness score
  const candidateChecks = [
    Boolean(user?.fullname),
    Boolean(user?.email),
    Boolean(user?.phoneNumber),
    Boolean(user?.profile?.bio),
    Boolean(cleanSkills.length > 0),
    Boolean(user?.profile?.resume),
    Boolean(user?.profile?.profilePhoto),
  ];
  const recruiterChecks = [
    Boolean(user?.fullname),
    Boolean(user?.email),
    Boolean(user?.phoneNumber),
    Boolean(user?.profile?.bio),
    Boolean(companies?.length > 0),
    Boolean(allAdminJobs?.length > 0),
    Boolean(user?.profile?.profilePhoto),
  ];
  const activeChecks = isRecruiter ? recruiterChecks : candidateChecks;
  const completedChecks = activeChecks.filter(Boolean).length;
  const profileStrength = Math.round((completedChecks / activeChecks.length) * 100);

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <Navbar />

      {/* Main Profile Container */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200/80 rounded-3xl shadow-md mb-8 overflow-hidden">
        
        {/* Cover Banner */}
        <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            {isRecruiter ? (
              <>
                <Building2 size={14} /> Verified Recruiter
              </>
            ) : (
              <>
                <ShieldCheck size={14} /> Verified Candidate
              </>
            )}
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="px-6 sm:px-8 pb-8">
          
          {/* Header Row: Avatar, Info & Edit Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <Avatar className="-mt-12 sm:-mt-16 h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-4 border-white shadow-xl shrink-0 bg-white ring-1 ring-gray-100">
                {user?.profile?.profilePhoto && (
                  <AvatarImage
                    src={user.profile.profilePhoto}
                    alt={user?.fullname || "Profile"}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-bold text-3xl flex items-center justify-center size-full">
                  {user?.fullname ? user.fullname[0].toUpperCase() : isRecruiter ? "R" : "C"}
                </AvatarFallback>
              </Avatar>

              <div className="mt-1 sm:mt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
                    {user?.fullname || (isRecruiter ? "Hiring Manager" : "Unnamed Candidate")}
                  </h1>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      isRecruiter
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : "bg-pink-50 text-pink-700 border-pink-200"
                    }`}
                  >
                    {isRecruiter ? "Recruiter" : "Candidate"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1 max-w-xl leading-relaxed">
                  {user?.profile?.bio ||
                    (isRecruiter
                      ? "Talent Acquisition & Hiring Partner."
                      : "No professional bio added yet.")}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="rounded-xl border-gray-200 text-gray-700 hover:border-pink-300 hover:text-pink-600 shadow-2xs flex items-center gap-2 text-sm font-semibold transition mt-2 sm:mt-0"
            >
              <Pen size={15} /> Edit Profile
            </Button>
          </div>

          {/* Contact Details Strip */}
          <div className="py-4 border-t border-gray-100 flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
              <Mail size={15} className="text-pink-600" />
              <span className="font-medium text-gray-800">{user?.email || "No email"}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
              <Contact size={15} className="text-purple-600" />
              <span className="font-medium text-gray-800">{user?.phoneNumber || "No phone added"}</span>
            </div>
          </div>

          {isRecruiter ? (
            <div>
              {/* Recruiter Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                <div className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 flex items-center justify-between shadow-2xs">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Jobs Posted</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">{allAdminJobs?.length || 0}</p>
                  </div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Briefcase size={18} />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 flex items-center justify-between shadow-2xs">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Total Applicants</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">{totalApplicants}</p>
                  </div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Users size={18} />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 flex items-center justify-between shadow-2xs">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Active Pipelines</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">{jobsWithApplicants}</p>
                  </div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 flex items-center justify-between shadow-2xs">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Companies</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">{companies?.length || 0}</p>
                  </div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <Building2 size={18} />
                  </div>
                </div>
              </div>

              {/* Recruiter Quick Hub */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/40 to-pink-50/50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Recruiter Quick Hub</h3>
                  <p className="text-xs text-gray-600 mt-0.5">Post openings, review candidates, or manage company profiles.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={() => navigate("/admin/jobs/create")}
                    size="sm"
                    className="rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Post New Job
                  </Button>
                  <Button
                    onClick={() => navigate("/admin/companies")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-gray-200 bg-white text-gray-700 hover:text-pink-600 text-xs font-semibold"
                  >
                    Companies
                  </Button>
                  <Button
                    onClick={() => navigate("/admin/jobs")}
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-gray-200 bg-white text-gray-700 hover:text-pink-600 text-xs font-semibold"
                  >
                    Manage Postings
                  </Button>
                </div>
              </div>

              {/* Recruiter Companies Showcase */}
              <div className="pt-5 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Your Registered Companies ({companies?.length || 0})
                  </h3>
                  <button
                    onClick={() => navigate("/admin/companies/create")}
                    className="text-xs font-semibold text-pink-600 hover:text-pink-700 transition"
                  >
                    + Register Company
                  </button>
                </div>

                {companies && companies.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {companies.map((company) => (
                      <div
                        key={company._id}
                        className="p-3.5 rounded-xl border border-gray-200/80 bg-white hover:border-pink-300 transition flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={company?.logo || "/logo.png"}
                            alt={company?.name}
                            className="w-10 h-10 rounded-lg border border-gray-200 object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm text-gray-900 truncate">{company.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{company.location || "India"}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => navigate(`/admin/companies/${company._id}`)}
                          variant="ghost"
                          size="sm"
                          className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                    <p className="text-sm font-semibold text-gray-800">No companies registered yet</p>
                    <p className="text-xs text-gray-500 mt-1 mb-3">Add your company profile to start posting verified jobs.</p>
                    <Button
                      onClick={() => navigate("/admin/companies/create")}
                      size="sm"
                      className="rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold"
                    >
                      Register Company
                    </Button>
                  </div>
                )}
              </div>

              {/* Recruiter Active Job Openings & Candidate Review */}
              <div className="pt-6 mt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Recent Job Postings & Candidate Reviews ({allAdminJobs?.length || 0})
                  </h3>
                  <button
                    onClick={() => navigate("/admin/jobs/create")}
                    className="text-xs font-semibold text-pink-600 hover:text-pink-700 transition"
                  >
                    + Post New Job
                  </button>
                </div>

                {allAdminJobs && allAdminJobs.length > 0 ? (
                  <div className="space-y-2.5">
                    {allAdminJobs.slice(0, 4).map((adminJob) => {
                      const count = adminJob.applications?.length || 0;
                      return (
                        <div
                          key={adminJob._id}
                          className="p-3.5 rounded-xl border border-gray-200/80 bg-white hover:border-pink-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-gray-900 truncate">
                                {adminJob.title}
                              </h4>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                {adminJob.jobType || "Full-Time"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                              {adminJob.company?.name || "Company"} • {adminJob.location || "India"}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              onClick={() => navigate(`/admin/jobs/${adminJob._id}/applicants`)}
                              size="sm"
                              className="text-xs font-semibold rounded-xl bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-1.5 shadow-2xs"
                            >
                              <Users size={13} /> Review Applicants ({count})
                            </Button>
                            <Button
                              onClick={() => navigate(`/admin/jobs/${adminJob._id}/edit`)}
                              variant="outline"
                              size="sm"
                              className="text-xs font-semibold rounded-xl border-gray-200 text-gray-700 hover:text-pink-600"
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    {allAdminJobs.length > 4 && (
                      <div className="text-center pt-2">
                        <Button
                          onClick={() => navigate("/admin/jobs")}
                          variant="ghost"
                          size="sm"
                          className="text-xs font-semibold text-pink-600 hover:text-pink-700"
                        >
                          View All {allAdminJobs.length} Job Postings →
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                    <p className="text-sm font-semibold text-gray-800">No jobs posted yet</p>
                    <p className="text-xs text-gray-500 mt-1 mb-3">Create your first job listing to start receiving candidate applications.</p>
                    <Button
                      onClick={() => navigate("/admin/jobs/create")}
                      size="sm"
                      className="rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold"
                    >
                      Post a Job
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              {/* Quick Metrics Bar for Candidates */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                <div className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase">Applied</p>
                    <p className="text-lg font-bold text-gray-900">{allAppliedJobs?.length || 0}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase">In Pipeline</p>
                    <p className="text-lg font-bold text-gray-900">{activePipelineCount}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Bookmark size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase">Saved</p>
                    <p className="text-lg font-bold text-gray-900">{allSavedJobs?.length || 0}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 flex flex-col justify-center">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-600 flex items-center gap-1 text-[11px]">
                      <Sparkles size={12} className="text-amber-500" /> Strength
                    </span>
                    <span className="text-purple-700 font-bold">{profileStrength}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${profileStrength}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="pt-5 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Skills & Technologies ({cleanSkills.length})
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cleanSkills.length > 0 ? (
                    cleanSkills.map((skill, i) => (
                      <Badge
                        key={i}
                        className="bg-purple-50 text-purple-700 border border-purple-200/80 font-medium px-3 py-1 rounded-xl text-xs hover:bg-purple-100 transition shadow-none"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm italic">
                      No skills added. Click &ldquo;Edit Profile&rdquo; to add your technical stack.
                    </span>
                  )}
                </div>
              </div>

              {/* Resume Document Card */}
              <div className="pt-6 mt-6 border-t border-gray-100">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                  Attached Resume
                </h2>

                {isResume ? (
                  <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 shadow-2xs">
                        <FileText size={24} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate max-w-sm">
                          {user?.profile?.resumeOriginalName || "Resume.pdf"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <Check size={11} className="text-emerald-600 stroke-[2.5]" />
                          <span>Active for recruiter applications</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={user?.profile?.resume}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-pink-300 text-gray-700 hover:text-pink-600 text-xs font-semibold transition shadow-2xs"
                      >
                        <ExternalLink size={14} /> View Document
                      </a>
                      <Button
                        onClick={() => setOpen(true)}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-purple-600 hover:bg-purple-50 rounded-xl"
                      >
                        Replace
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                        <Upload size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">No resume attached</p>
                        <p className="text-xs text-gray-500">Upload your PDF resume to boost recruiter response by 3x.</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setOpen(true)}
                      size="sm"
                      className="rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs"
                    >
                      Upload Resume
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Applied & Saved Jobs Section (Students only) */}
      {!isRecruiter && (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 mb-10 transition-transform hover:-translate-y-1 duration-200">
          <div className="flex items-center gap-8 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("applied")}
              className={`pb-3.5 font-bold text-base transition-all flex items-center gap-2 border-b-2 ${
                activeTab === "applied"
                  ? "text-pink-600 border-pink-600 -mb-[1px]"
                  : "text-gray-500 hover:text-gray-800 border-transparent -mb-[1px]"
              }`}
            >
              <span>Applied Jobs</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                  activeTab === "applied"
                    ? "bg-pink-100 text-pink-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {allAppliedJobs?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`pb-3.5 font-bold text-base transition-all flex items-center gap-2 border-b-2 ${
                activeTab === "saved"
                  ? "text-pink-600 border-pink-600 -mb-[1px]"
                  : "text-gray-500 hover:text-gray-800 border-transparent -mb-[1px]"
              }`}
            >
              <span>Saved Jobs</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                  activeTab === "saved"
                    ? "bg-pink-100 text-pink-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {allSavedJobs?.length || 0}
              </span>
            </button>
          </div>

          {activeTab === "applied" ? <AppliedJobTable /> : <SavedJobTable />}
        </div>
      )}

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
