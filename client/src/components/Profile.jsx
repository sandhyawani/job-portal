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
  CheckCircle,
  Sparkles,
  Upload,
} from "lucide-react";
import { Badge } from "./ui/badge";
import AppliedJobTable from "./AppliedJobTable";
import SavedJobTable from "./SavedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";
import useGetSavedJobs from "../hooks/useGetSavedJobs";

const Profile = () => {
  useGetAppliedJobs();
  useGetSavedJobs();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("applied");
  const { user } = useSelector((store) => store.auth);
  const { allAppliedJobs, allSavedJobs } = useSelector((store) => store.job);

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
  const checks = [
    Boolean(user?.fullname),
    Boolean(user?.email),
    Boolean(user?.phoneNumber),
    Boolean(user?.profile?.bio),
    Boolean(cleanSkills.length > 0),
    Boolean(user?.profile?.resume),
    Boolean(user?.profile?.profilePhoto),
  ];
  const completedChecks = checks.filter(Boolean).length;
  const profileStrength = Math.round((completedChecks / checks.length) * 100);

  return (
    <div className="bg-slate-50 min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <Navbar />

      {/* Main Profile Container */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200/80 rounded-3xl shadow-md mb-8 overflow-hidden">
        
        {/* Cover Banner */}
        <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <ShieldCheck size={14} /> Verified Candidate
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="px-6 sm:px-8 pb-8">
          
          {/* Header Row: Avatar, Info & Edit Button */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-4 border-white shadow-xl shrink-0 bg-white">
                {user?.profile?.profilePhoto && (
                  <AvatarImage
                    src={user.profile.profilePhoto}
                    alt={user?.fullname || "Profile"}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-bold text-3xl flex items-center justify-center size-full">
                  {user?.fullname ? user.fullname[0].toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>

              <div className="mb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
                    {user?.fullname || "Unnamed Candidate"}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-50 text-pink-700 border border-pink-200">
                    {user?.role === "student" ? "Candidate" : "Recruiter"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1 max-w-xl leading-relaxed">
                  {user?.profile?.bio || "No professional bio added yet."}
                </p>
              </div>
            </div>

            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="rounded-xl border-gray-200 text-gray-700 hover:border-pink-300 hover:text-pink-600 shadow-2xs flex items-center gap-2 self-start sm:self-end text-sm font-semibold transition"
            >
              <Pen size={15} /> Edit Profile
            </Button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
            <div className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0">
                <Briefcase size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Applied Jobs</p>
                <p className="text-lg font-bold text-gray-900">{allAppliedJobs?.length || 0}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Bookmark size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-500 uppercase">Saved Jobs</p>
                <p className="text-lg font-bold text-gray-900">{allSavedJobs?.length || 0}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/70 flex flex-col justify-center">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-gray-600 flex items-center gap-1">
                  <Sparkles size={13} className="text-amber-500" /> Profile Strength
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
                    <p className="text-xs text-gray-500 mt-0.5">
                      ✓ Active for recruiter applications
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
      </div>

      {/* Applied & Saved Jobs Section */}
      {user?.role === "student" && (
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
