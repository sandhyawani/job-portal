import React from "react";
import Navbar from "../shared/Navbar";
import MobileBottomNav from "../shared/MobileBottomNav";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { Button } from "../ui/button";
import {
  Briefcase,
  Users,
  Calendar,
  Award,
  Building2,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

const RecruiterDashboard = () => {
  useGetAllAdminJobs();
  useGetAllCompanies();

  const { allAdminJobs = [] } = useSelector((store) => store.job);
  const { companies = [] } = useSelector((store) => store.company);

  // Compute operational statistics from real backend data
  const totalJobsCount = allAdminJobs.length;
  const activeJobsCount = allAdminJobs.filter((j) => j.status !== "closed").length;

  let totalApplicationsCount = 0;
  let shortlistedCount = 0;
  let interviewCount = 0;
  let hiredCount = 0;

  const unreviewedApplicants = [];
  const upcomingInterviews = [];

  allAdminJobs.forEach((job) => {
    const apps = job.applications || [];
    totalApplicationsCount += apps.length;
    apps.forEach((app) => {
      const s = (app.status || "").toLowerCase();
      if (s === "shortlisted" || s === "accepted") shortlistedCount++;
      if (s === "interview") {
        interviewCount++;
        upcomingInterviews.push({
          ...app,
          jobTitle: job.title,
          jobId: job._id,
          companyName: job.company?.name || "Company",
        });
      }
      if (s === "offer" || s === "hired") hiredCount++;
      if (s === "pending" || s === "review") {
        unreviewedApplicants.push({
          ...app,
          jobTitle: job.title,
          jobId: job._id,
          companyName: job.company?.name || "Company",
        });
      }
    });
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6">
        {/* Recruiter Workspace Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
                <LayoutDashboard size={13} /> Hiring Workspace
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Recruiter Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Manage your job postings, track applicant review stages, and coordinate hiring pipelines.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link to="/admin/companies/create">
                <Button
                  variant="outline"
                  className="rounded-xl text-xs font-semibold border-slate-200"
                >
                  <Building2 size={15} className="mr-1.5" /> New Company
                </Button>
              </Link>
              <Link to="/admin/jobs/create">
                <Button className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs">
                  <Plus size={15} className="mr-1.5" /> Post New Job
                </Button>
              </Link>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Active Jobs
              </span>
              <span className="text-2xl font-black text-slate-900">
                {activeJobsCount}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {totalJobsCount} total posted
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Applications
              </span>
              <span className="text-2xl font-black text-slate-900">
                {totalApplicationsCount}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Across all positions
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Shortlisted
              </span>
              <span className="text-2xl font-black text-purple-700">
                {shortlistedCount}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Qualified candidates
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Interviews
              </span>
              <span className="text-2xl font-black text-amber-700">
                {interviewCount}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Active rounds
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Hired / Offers
              </span>
              <span className="text-2xl font-black text-emerald-700">
                {hiredCount}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Finalized hires
              </span>
            </div>
          </div>
        </div>

        {/* Candidates Needing Attention Section */}
        {unreviewedApplicants.length > 0 && (
          <div className="bg-amber-50/60 border border-amber-200/90 rounded-3xl p-6 sm:p-7 shadow-xs mb-8">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-200/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Clock size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-amber-950">
                    Candidates Needing Review ({unreviewedApplicants.length})
                  </h2>
                  <p className="text-xs text-amber-800">
                    Newly submitted applications awaiting initial recruiter review
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {unreviewedApplicants.slice(0, 6).map((app, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {app.status || "Pending"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recent"}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                      {app.applicant?.fullname || "Candidate"}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600 mt-0.5 line-clamp-1">
                      For: {app.jobTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 truncate">
                      {app.applicant?.email || "No email"}
                    </p>
                  </div>

                  <Link
                    to={`/admin/jobs/${app.jobId}/applicants`}
                    className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <span>Evaluate Candidate</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Interviews Schedule */}
        {upcomingInterviews.length > 0 && (
          <div className="bg-indigo-50/60 border border-indigo-200/90 rounded-3xl p-6 sm:p-7 shadow-xs mb-8">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-indigo-200/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Calendar size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-indigo-950">
                    Scheduled Candidate Interviews ({upcomingInterviews.length})
                  </h2>
                  <p className="text-xs text-indigo-800">
                    Active interview rounds across your open positions
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {upcomingInterviews.slice(0, 3).map((app, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5 text-xs text-indigo-700 font-bold">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {app.interviewDate
                          ? new Date(app.interviewDate).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })
                          : "Scheduled"}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                      {app.applicant?.fullname || "Candidate"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {app.jobTitle}
                    </p>
                    {app.notes && (
                      <p className="text-[11px] text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg italic line-clamp-2">
                        "{app.notes}"
                      </p>
                    )}
                  </div>

                  <Link
                    to={`/admin/jobs/${app.jobId}/applicants`}
                    className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                  >
                    <span>Open Candidate Record</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posted Jobs */}
        <div id="applicants" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Posted Jobs</h2>
              <p className="text-xs text-slate-500">
                Review applicant pipelines and update role statuses
              </p>
            </div>
            <Link to="/admin/jobs">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View all jobs →
              </Button>
            </Link>
          </div>

          {allAdminJobs.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl">
              <Briefcase size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No jobs posted yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Create a company and publish your first job opening.
              </p>
              <Link to="/admin/jobs/create">
                <Button className="mt-3 text-xs rounded-xl bg-indigo-600 text-white">
                  Post a Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {allAdminJobs.slice(0, 6).map((job) => {
                const totalApps = job.applications?.length || 0;
                return (
                  <div
                    key={job._id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={job.company?.logo || "/logo.png"}
                        alt={job.company?.name}
                        className="w-10 h-10 rounded-xl border border-slate-200 object-cover p-0.5 bg-slate-50 shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                        <p className="text-xs text-slate-500">
                          {job.company?.name} · {job.location} · ₹{job.salary} LPA
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900 block">
                          {totalApps} {totalApps === 1 ? "applicant" : "applicants"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Posted: {job.createdAt?.split("T")[0]}
                        </span>
                      </div>

                      <Link to={`/admin/jobs/${job._id}/applicants`}>
                        <Button
                          size="sm"
                          className="rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 shadow-2xs"
                        >
                          Manage Pipeline →
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Registered Companies Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Companies</h2>
              <p className="text-xs text-slate-500">
                Verified hiring entities managed under your account
              </p>
            </div>
            <Link to="/admin/companies">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-semibold text-indigo-600"
              >
                Manage Companies →
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {companies.map((comp) => (
              <div
                key={comp._id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={comp.logo || "/logo.png"}
                    alt={comp.name}
                    className="w-10 h-10 rounded-xl border object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{comp.name}</h4>
                    <span className="text-[11px] text-slate-400">
                      {comp.location || "India"}
                    </span>
                  </div>
                </div>

                <Link to={`/admin/companies/${comp._id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-semibold text-indigo-600"
                  >
                    Edit
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default RecruiterDashboard;
