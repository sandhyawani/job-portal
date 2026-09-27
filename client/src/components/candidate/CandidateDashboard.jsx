import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import MobileBottomNav from "../shared/MobileBottomNav";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import useGetSavedJobs from "@/hooks/useGetSavedJobs";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import { calculateProfileScore } from "@/utils/jobMatcher";
import { calculateJobMatch } from "@/utils/jobMatcher";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Sparkles,
  Send,
  Bookmark,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Search,
  MapPin,
  Briefcase,
  UserCheck,
  Edit,
  GraduationCap,
} from "lucide-react";
import Job from "../Job";
import UpdateProfileDialog from "../UpdateProfileDialog";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);
  const { allJobs = [], savedJobs = [] } = useSelector((store) => store.job);
  const { allAppliedJobs = [] } = useSelector((store) => store.job);

  useGetAllJobs();
  useGetSavedJobs();
  useGetAppliedJobs();

  const [updateOpen, setUpdateOpen] = useState(false);
  const [searchRole, setSearchRole] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Profile completion calculation
  const profileScoreData = calculateProfileScore(user);
  const profileScore = profileScoreData?.score || 0;

  // Metrics
  const applicationsCount = allAppliedJobs.length;
  const savedCount = savedJobs.length;
  const interviewCount = allAppliedJobs.filter((a) => a.status === "interview").length;

  // Recommended jobs based on candidate profile match
  const recommendedJobs = [...allJobs]
    .map((job) => ({
      ...job,
      match: calculateJobMatch(job, user),
    }))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, 3);

  // Applications needing attention
  const attentionItems = [];
  allAppliedJobs.forEach((app) => {
    if (app.status === "interview") {
      attentionItems.push({
        type: "interview",
        title: `Interview round scheduled for ${app.job?.title}`,
        detail: app.interviewDate
          ? `Scheduled on ${new Date(app.interviewDate).toLocaleDateString()}`
          : "Recruiter invited you for an interview",
        link: "/applications",
        badge: "Interview",
        color: "amber",
      });
    } else if (app.status === "shortlisted" || app.status === "accepted") {
      attentionItems.push({
        type: "shortlisted",
        title: `Shortlisted for ${app.job?.title}`,
        detail: `At ${app.job?.company?.name || "Company"}. Prepare your resume and portfolio.`,
        link: "/applications",
        badge: "Shortlisted",
        color: "purple",
      });
    }
  });

  // Saved job pending application
  if (savedJobs.length > 0 && attentionItems.length < 3) {
    const firstSaved = typeof savedJobs[0] === "object" ? savedJobs[0] : null;
    if (firstSaved) {
      const alreadyApplied = allAppliedJobs.some((a) => a.job?._id === firstSaved._id);
      if (!alreadyApplied) {
        attentionItems.push({
          type: "saved",
          title: `You saved ${firstSaved.title} but haven't applied yet`,
          detail: `At ${firstSaved.company?.name || "Company"}. Submit before the position fills.`,
          link: `/description/${firstSaved._id}`,
          badge: "Saved Job",
          color: "blue",
        });
      }
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${encodeURIComponent(searchRole)}&location=${encodeURIComponent(searchLocation)}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6">
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
                <Sparkles size={13} />
                Your Job Search Workspace
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {getGreeting()}, {user?.fullname?.split(" ")[0] || "Candidate"}
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Track your active applications, match with open positions, and prepare for interviews all in one place.
              </p>
            </div>

            {/* Profile Completion Bar */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 min-w-[240px]">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                <span>Profile Completion</span>
                <span className="text-indigo-600">{profileScore}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${profileScore}%` }}
                />
              </div>
              <button
                onClick={() => setUpdateOpen(true)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 mt-2 block"
              >
                {profileScore < 100 ? "Complete missing items →" : "Edit profile →"}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
            <Link
              to="/applications"
              className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-100 transition group"
            >
              <div className="flex items-center justify-between text-slate-400 group-hover:text-blue-600 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Applications
                </span>
                <Send size={15} />
              </div>
              <span className="text-xl font-extrabold text-slate-900">
                {applicationsCount}
              </span>
            </Link>

            <Link
              to="/pipeline"
              className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-100 transition group"
            >
              <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-600 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Saved Jobs
                </span>
                <Bookmark size={15} />
              </div>
              <span className="text-xl font-extrabold text-slate-900">
                {savedCount}
              </span>
            </Link>

            <Link
              to="/applications"
              className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-100/70 border border-slate-100 transition group"
            >
              <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-600 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Interviews
                </span>
                <Calendar size={15} />
              </div>
              <span className="text-xl font-extrabold text-slate-900">
                {interviewCount}
              </span>
            </Link>

            <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Skills Listed
                </span>
                <UserCheck size={15} />
              </div>
              <span className="text-xl font-extrabold text-slate-900">
                {user?.profile?.skills?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Left Section (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Search */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-3">
                Continue Your Search
              </h2>
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50">
                  <Search size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Role or skill (e.g. Python Developer)"
                    value={searchRole}
                    onChange={(e) => setSearchRole(e.target.value)}
                    className="w-full text-xs text-slate-900 bg-transparent outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 sm:w-48 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50">
                  <MapPin size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="City or Remote"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full text-xs text-slate-900 bg-transparent outline-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="rounded-xl px-5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Search Jobs
                </Button>
              </form>
            </div>

            {/* Applications Needing Attention */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900">
                  Applications Needing Attention
                </h2>
                <Link
                  to="/applications"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  View all →
                </Link>
              </div>

              {attentionItems.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 text-center border border-slate-100">
                  <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800">You're all caught up!</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    No urgent actions pending. Explore new jobs or prepare for upcoming opportunities.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {attentionItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition flex items-center justify-between gap-4 bg-white"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                          {item.type === "interview" ? (
                            <Calendar size={16} />
                          ) : (
                            <Sparkles size={16} />
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 mb-1 inline-block">
                            {item.badge}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.detail}</p>
                        </div>
                      </div>
                      <Link to={item.link}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs font-semibold border-slate-200 shrink-0"
                        >
                          Action
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended For You (Real Matching Jobs) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Recommended For You
                  </h2>
                  <p className="text-xs text-slate-500">
                    Top matches computed from your skills and profile preferences
                  </p>
                </div>
                <Link
                  to="/jobs"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  See all jobs →
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedJobs.map((job) => (
                  <Job key={job._id} job={job} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Checklist */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Profile Improvement
                </h3>
                <span className="text-xs font-extrabold text-indigo-600">
                  {profileScore}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Complete your profile to increase your visibility and improve matching accuracy.
              </p>

              <div className="space-y-2.5 text-xs">
                {profileScoreData?.checks?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {item.completed ? (
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                    )}
                    <span
                      className={`font-medium ${
                        item.completed ? "text-slate-700" : "text-slate-900 font-semibold"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setUpdateOpen(true)}
                className="w-full mt-5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Complete Profile
              </Button>
            </div>

            {/* Quick Practice shortcut */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 p-6 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-3">
                <GraduationCap size={20} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Practice Interview Questions
              </h3>
              <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
                Brush up on top technical, SQL, and HR questions before your next recruiter round.
              </p>
              <Link to="/interview-prep">
                <Button
                  variant="outline"
                  className="w-full rounded-xl text-xs font-semibold border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                >
                  Start Practice →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <UpdateProfileDialog open={updateOpen} setOpen={setUpdateOpen} />
      <MobileBottomNav />
    </div>
  );
};

export default CandidateDashboard;
