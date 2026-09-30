import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import MobileBottomNav from "./shared/MobileBottomNav";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Contact,
  Mail,
  Pen,
  FileText,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Github,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";
import { calculateProfileScore } from "@/utils/jobMatcher";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const isResume = Boolean(user?.profile?.resume);
  const profile = user?.profile || {};
  const scoreData = calculateProfileScore(user);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-16">
      <Navbar />

      <main className="max-w-4xl mx-auto pt-24 px-4 sm:px-6">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-5">
              <Avatar className="h-24 w-24 rounded-2xl border-2 border-slate-200 shadow-xs">
                <AvatarImage
                  src={profile?.profilePhoto}
                  alt={user?.fullname || "Profile"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-indigo-600 text-white font-bold text-4xl uppercase">
                  {user?.fullname?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {user?.fullname || "Unnamed User"}
                </h1>
                <p className="text-xs text-slate-500 mt-1 max-w-md">
                  {profile?.bio || "No professional bio added yet."}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                  <span className="capitalize font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {user?.role || "student"}
                  </span>
                  {profile?.location && (
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin size={12} className="text-slate-400" />
                      {profile.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:text-indigo-600 gap-1.5 self-start sm:self-auto h-10 px-4"
            >
              <Pen size={14} /> Edit Profile
            </Button>
          </div>

          {/* Profile Completion Widget */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-600" />
                <span>Profile Completion</span>
              </div>
              <span className="text-indigo-600 font-extrabold">{scoreData?.score}%</span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-4">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${scoreData?.score}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {scoreData?.checks?.map((check, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {check.completed ? (
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                  )}
                  <span
                    className={`${
                      check.completed ? "text-slate-600" : "text-slate-900 font-semibold"
                    }`}
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid sm:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Mail size={16} className="text-indigo-600" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Email</span>
                <span className="font-semibold text-slate-800">{user?.email || "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Contact size={16} className="text-indigo-600" />
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Phone</span>
                <span className="font-semibold text-slate-800">
                  {user?.phoneNumber || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Experience & Education & Links */}
          <div className="mt-4 grid sm:grid-cols-3 gap-4 text-xs text-slate-700">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Briefcase size={14} className="text-slate-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Experience</span>
              </div>
              <span className="font-semibold text-slate-800">
                {profile?.experience || "Not specified"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <GraduationCap size={14} className="text-slate-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Education</span>
              </div>
              <span className="font-semibold text-slate-800">
                {profile?.education || "Not specified"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Globe size={14} className="text-slate-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider">Links</span>
              </div>
              <div className="flex items-center gap-3">
                {profile?.github ? (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Github size={13} /> GitHub
                  </a>
                ) : null}
                {profile?.portfolio ? (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Globe size={13} /> Portfolio
                  </a>
                ) : null}
                {!profile?.github && !profile?.portfolio && (
                  <span className="text-slate-400">None added</span>
                )}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Skills ({profile?.skills?.length || 0})
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.length ? (
                profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No skills added yet</span>
              )}
            </div>
          </div>

          {/* Resume Section */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Resume Document
            </h2>
            {isResume ? (
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <FileText size={20} className="text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block truncate max-w-sm">
                      {profile?.resumeOriginalName || "Resume Document"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Uploaded & ready for recruiter review
                    </span>
                  </div>
                </div>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 shadow-2xs"
                >
                  View Resume <ExternalLink size={12} />
                </a>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-500">
                  No resume uploaded. Upload a PDF resume to improve your job match score.
                </p>
                <Button
                  onClick={() => setOpen(true)}
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs rounded-xl"
                >
                  Upload Resume
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Applied Jobs Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Applied Jobs History</h2>
          </div>
          <AppliedJobTable />
        </div>
      </main>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
      <MobileBottomNav />
    </div>
  );
};

export default Profile;
