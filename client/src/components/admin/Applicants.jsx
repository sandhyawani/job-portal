import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../shared/Navbar";
import MobileBottomNav from "../shared/MobileBottomNav";
import ApplicantsTable from "./ApplicantsTable";
import applicationApi from "@/api/applicationApi";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";
import {
  Users,
  Search,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../ui/button";

const Applicants = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { applicants } = useSelector((store) => store.application);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchApplicants = useCallback(async () => {
    try {
      setLoading(true);
      const res = await applicationApi.getApplicants(id);
      dispatch(setAllApplicants(res.data.job));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, dispatch]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const applicationsList = applicants?.applications || [];

  // Filter applicants by keyword & status
  const filteredApplicants = applicationsList.filter((app) => {
    const candidate = app.applicant || {};
    const profile = candidate.profile || {};

    if (statusFilter !== "all") {
      const s = (app.status || "").toLowerCase();
      if (statusFilter === "shortlisted" && s !== "shortlisted" && s !== "accepted")
        return false;
      else if (statusFilter !== "shortlisted" && s !== statusFilter) return false;
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = candidate.fullname?.toLowerCase().includes(term);
      const matchEmail = candidate.email?.toLowerCase().includes(term);
      const matchSkills = (profile.skills || []).some((sk) =>
        sk.toLowerCase().includes(term)
      );
      return matchName || matchEmail || matchSkills;
    }

    return true;
  });

  // Calculate pipeline breakdown
  const pendingCount = applicationsList.filter((a) => a.status === "pending").length;
  const reviewCount = applicationsList.filter((a) => a.status === "review").length;
  const shortlistedCount = applicationsList.filter(
    (a) => a.status === "shortlisted" || a.status === "accepted"
  ).length;
  const interviewCount = applicationsList.filter((a) => a.status === "interview").length;

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-8">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6">
        <Link
          to="/admin/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-600 mb-3 transition"
        >
          <ArrowLeft size={14} /> Back to Posted Jobs
        </Link>

        {/* Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold mb-2">
                <Users size={14} /> Candidate Pipeline
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {applicants?.title || "Job Applicants"}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {applicants?.company?.name || "Company"} · {applicationsList.length} Total Applicants
              </p>
            </div>

            <Button
              onClick={fetchApplicants}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-semibold border-slate-200"
            >
              Refresh Pipeline
            </Button>
          </div>

          {/* Pipeline Stage Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-6 pt-6 border-t border-slate-100 text-xs">
            <button
              onClick={() => setStatusFilter("pending")}
              className={`p-3 rounded-2xl border text-left transition ${
                statusFilter === "pending"
                  ? "bg-primary-50 border-primary-200 font-bold"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                New Applied
              </span>
              <span className="text-lg font-black text-slate-900">{pendingCount}</span>
            </button>

            <button
              onClick={() => setStatusFilter("review")}
              className={`p-3 rounded-2xl border text-left transition ${
                statusFilter === "review"
                  ? "bg-primary-50 border-primary-200 font-bold"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                Under Review
              </span>
              <span className="text-lg font-black text-slate-900">{reviewCount}</span>
            </button>

            <button
              onClick={() => setStatusFilter("shortlisted")}
              className={`p-3 rounded-2xl border text-left transition ${
                statusFilter === "shortlisted"
                  ? "bg-primary-50 border-primary-200 font-bold"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                Shortlisted
              </span>
              <span className="text-lg font-black text-purple-700">
                {shortlistedCount}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("interview")}
              className={`p-3 rounded-2xl border text-left transition ${
                statusFilter === "interview"
                  ? "bg-primary-50 border-primary-200 font-bold"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                Interviews
              </span>
              <span className="text-lg font-black text-amber-700">{interviewCount}</span>
            </button>

            <button
              onClick={() => setStatusFilter("all")}
              className={`p-3 rounded-2xl border text-left transition ${
                statusFilter === "all"
                  ? "bg-primary-50 border-primary-200 font-bold"
                  : "bg-slate-50 border-slate-100"
              }`}
            >
              <span className="text-[10px] text-slate-400 block uppercase font-bold">
                All Candidates
              </span>
              <span className="text-lg font-black text-slate-900">
                {applicationsList.length}
              </span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-2xl border border-slate-200 bg-white">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Filter candidates by name, email, or skill (e.g. React, Python)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs text-slate-900 bg-transparent outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700 font-semibold"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="review">Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applicants Table */}
        {loading && !applicants ? (
          <div className="py-12 flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ApplicantsTable
            applications={filteredApplicants}
            onStatusUpdate={fetchApplicants}
          />
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default Applicants;
