import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import MobileBottomNav from "../shared/MobileBottomNav";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useGetSavedJobs from "@/hooks/useGetSavedJobs";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import useGetExternalApplications from "@/hooks/useGetExternalApplications";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Layers,
  Bookmark,
  Send,
  Calendar,
  Award,
  Plus,
  ExternalLink,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  Building2,
  MapPin,
  Clock,
  X,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import axios from "axios";
import { APPLICATION_API_END_POINT, USER_API_END_POINT } from "@/utils/constant";
import {
  addExternalApplication,
  updateExternalApplicationInState,
  removeExternalApplicationFromState,
} from "@/redux/applicationSlice";
import { toggleSavedJobInState } from "@/redux/jobSlice";
import { toast } from "sonner";
import Job from "../Job";

const Pipeline = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useSelector((store) => store.auth);
  const { savedJobs = [] } = useSelector((store) => store.job);
  const { allAppliedJobs = [] } = useSelector((store) => store.job);
  const { externalApplications = [] } = useSelector((store) => store.application);

  useGetSavedJobs();
  useGetAppliedJobs();
  useGetExternalApplications();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "pipeline");
  const [searchSaved, setSearchSaved] = useState("");
  const [savedFilter, setSavedFilter] = useState("all"); // "all" | "to_apply" | "applied"
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["pipeline", "saved", "external"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    source: "LinkedIn",
    appliedDate: new Date().toISOString().split("T")[0],
    status: "applied",
    jobUrl: "",
    salary: "",
    location: "",
    notes: "",
  });

  // Metrics
  const savedCount = savedJobs.length;
  const portalAppliedCount = allAppliedJobs.length;
  const externalAppliedCount = externalApplications.length;

  const interviewCount =
    allAppliedJobs.filter((a) => a.status === "interview").length +
    externalApplications.filter((a) => a.status === "interview").length;

  const offerCount =
    allAppliedJobs.filter((a) => a.status === "offer" || a.status === "hired").length +
    externalApplications.filter((a) => a.status === "offer").length;

  const openAddModal = (app = null) => {
    if (app) {
      setEditingApp(app);
      setFormData({
        company: app.company,
        role: app.role,
        source: app.source || "LinkedIn",
        appliedDate: app.appliedDate?.split("T")[0] || "",
        status: app.status || "applied",
        jobUrl: app.jobUrl || "",
        salary: app.salary || "",
        location: app.location || "",
        notes: app.notes || "",
      });
    } else {
      setEditingApp(null);
      setFormData({
        company: "",
        role: "",
        source: "LinkedIn",
        appliedDate: new Date().toISOString().split("T")[0],
        status: "applied",
        jobUrl: "",
        salary: "",
        location: "",
        notes: "",
      });
    }
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim()) {
      toast.error("Company and Role are required.");
      return;
    }

    try {
      if (editingApp) {
        const res = await axios.put(
          `${APPLICATION_API_END_POINT}/external/${editingApp._id}`,
          formData,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(updateExternalApplicationInState(res.data.application));
          toast.success(res.data.message);
        }
      } else {
        const res = await axios.post(
          `${APPLICATION_API_END_POINT}/external`,
          formData,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(addExternalApplication(res.data.application));
          toast.success(res.data.message);
        }
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save external application");
    }
  };

  const handleDeleteExternal = async (id) => {
    if (!window.confirm("Remove this external application from your pipeline?")) return;
    try {
      const res = await axios.delete(`${APPLICATION_API_END_POINT}/external/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(removeExternalApplicationFromState(id));
        toast.success("Application removed");
      }
    } catch (err) {
      toast.error("Failed to delete application");
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      dispatch(toggleSavedJobInState(jobId));
      await axios.post(`${USER_API_END_POINT}/save/${jobId}`, {}, { withCredentials: true });
      toast.success("Job removed from saved list");
    } catch {
      toast.error("Failed to update");
    }
  };

  const isJobApplied = (jobId) =>
    allAppliedJobs.some((a) => (a.job?._id || a.job) === jobId);

  const toApplyCount = savedJobs.filter((item) => {
    const job = typeof item === "object" ? item : null;
    return job && !isJobApplied(job._id);
  }).length;

  const appliedSavedCount = savedJobs.filter((item) => {
    const job = typeof item === "object" ? item : null;
    return job && isJobApplied(job._id);
  }).length;

  // Filtered saved jobs with triage
  const filteredSavedJobs = savedJobs.filter((item) => {
    const job = typeof item === "object" ? item : null;
    if (!job) return false;

    const hasApplied = isJobApplied(job._id);
    if (savedFilter === "to_apply" && hasApplied) return false;
    if (savedFilter === "applied" && !hasApplied) return false;

    if (!searchSaved) return true;
    const term = searchSaved.toLowerCase();
    return (
      job.title?.toLowerCase().includes(term) ||
      job.company?.name?.toLowerCase().includes(term) ||
      job.location?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6">
        {/* Workspace Title & Add Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="text-indigo-600" size={28} />
              Personal Job Pipeline
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Your central workspace for tracking both JobPortal and external applications.
            </p>
          </div>

          <Button
            onClick={() => openAddModal()}
            className="rounded-xl px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs gap-1.5 self-start sm:self-auto"
          >
            <Plus size={16} /> Track External Application
          </Button>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Saved Jobs</span>
              <Bookmark size={16} className="text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{savedCount}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Ready to apply</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Applied</span>
              <Send size={16} className="text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {portalAppliedCount + externalAppliedCount}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {portalAppliedCount} portal · {externalAppliedCount} external
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Interviews</span>
              <Calendar size={16} className="text-amber-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{interviewCount}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Active rounds</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Offers</span>
              <Award size={16} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{offerCount}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">Accepted & Offers</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
          <button
            onClick={() => handleTabChange("pipeline")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "pipeline"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Pipeline Board
          </button>
          <button
            onClick={() => handleTabChange("saved")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "saved"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Saved Jobs ({savedCount})
          </button>
          <button
            onClick={() => handleTabChange("external")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === "external"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            External Tracker ({externalAppliedCount})
          </button>
        </div>

        {/* TAB 1: PIPELINE BOARD */}
        {activeTab === "pipeline" && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
            {/* Column 1: Saved / To Apply */}
            <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Saved ({savedJobs.length})
                </span>
                <Bookmark size={14} className="text-indigo-600" />
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {savedJobs.length === 0 ? (
                  <div className="bg-white rounded-xl p-4 text-center border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400">No saved jobs yet</p>
                    <Link
                      to="/jobs"
                      className="text-xs text-indigo-600 font-semibold mt-1 inline-block"
                    >
                      Browse opportunities →
                    </Link>
                  </div>
                ) : (
                  savedJobs.map((item) => {
                    const job = typeof item === "object" ? item : null;
                    if (!job) return null;
                    return (
                      <div
                        key={job._id}
                        className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:border-indigo-300 transition"
                      >
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {job.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {job.company?.name || "Company"}
                        </p>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px]">
                          <span className="font-semibold text-slate-700">
                            ₹{job.salary} LPA
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUnsaveJob(job._id)}
                              className="text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Unsave"
                            >
                              <X size={13} />
                            </button>
                            <Link
                              to={`/description/${job._id}`}
                              className="font-semibold text-indigo-600 hover:underline"
                            >
                              Apply →
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Column 2: Applied */}
            <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Applied (
                  {allAppliedJobs.filter(
                    (a) => a.status === "pending" || a.status === "review"
                  ).length +
                    externalApplications.filter((a) => a.status === "applied").length}
                  )
                </span>
                <Send size={14} className="text-blue-600" />
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {/* Portal applications */}
                {allAppliedJobs
                  .filter((a) => a.status === "pending" || a.status === "review")
                  .map((app) => (
                    <div
                      key={app._id}
                      className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                          Portal Application
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {app.createdAt?.split("T")[0]}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {app.job?.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {app.job?.company?.name}
                      </p>
                      <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                        <span className="capitalize font-medium">
                          ● {app.status === "pending" ? "Applied" : "Under Review"}
                        </span>
                        <Link
                          to={`/description/${app.job?._id}`}
                          className="text-indigo-600 font-semibold hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}

                {/* External applications */}
                {externalApplications
                  .filter((a) => a.status === "applied")
                  .map((app) => (
                    <div
                      key={app._id}
                      className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {app.source}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openAddModal(app)}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <Edit3 size={11} />
                          </button>
                          <button
                            onClick={() => handleDeleteExternal(app._id)}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {app.role}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{app.company}</p>
                      {app.jobUrl && (
                        <a
                          href={app.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-indigo-600 hover:underline flex items-center gap-1 mt-2"
                        >
                          Job Link <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 3: Shortlisted / Interview */}
            <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Interviewing (
                  {allAppliedJobs.filter(
                    (a) =>
                      a.status === "shortlisted" ||
                      a.status === "accepted" ||
                      a.status === "interview"
                  ).length +
                    externalApplications.filter((a) => a.status === "interview").length}
                  )
                </span>
                <Calendar size={14} className="text-amber-600" />
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {allAppliedJobs
                  .filter(
                    (a) =>
                      a.status === "shortlisted" ||
                      a.status === "accepted" ||
                      a.status === "interview"
                  )
                  .map((app) => (
                    <div
                      key={app._id}
                      className="bg-white rounded-xl p-3.5 border-l-4 border-l-amber-500 border-slate-200 border shadow-2xs"
                    >
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-800">
                        {app.status === "interview" ? "Interview" : "Shortlisted"}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                        {app.job?.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{app.job?.company?.name}</p>
                      {app.interviewDate && (
                        <p className="text-[10px] text-amber-700 font-semibold mt-1.5 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(app.interviewDate).toLocaleDateString()}
                        </p>
                      )}
                      <Link
                        to={`/interview-prep?role=${encodeURIComponent(
                          app.job?.title || ""
                        )}`}
                        className="inline-block mt-2 text-[11px] font-semibold text-indigo-600 hover:underline"
                      >
                        Prepare for Interview →
                      </Link>
                    </div>
                  ))}

                {externalApplications
                  .filter((a) => a.status === "interview")
                  .map((app) => (
                    <div
                      key={app._id}
                      className="bg-white rounded-xl p-3.5 border-l-4 border-l-amber-500 border-slate-200 border shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-800">
                          Interview ({app.source})
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openAddModal(app)}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <Edit3 size={11} />
                          </button>
                          <button
                            onClick={() => handleDeleteExternal(app._id)}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{app.role}</h4>
                      <p className="text-[11px] text-slate-500">{app.company}</p>
                      {app.notes && (
                        <p className="text-[11px] text-slate-600 mt-1 bg-slate-50 p-1.5 rounded">
                          {app.notes}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Column 4: Offer / Hired */}
            <div className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200/80">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Offers & Hired (
                  {allAppliedJobs.filter(
                    (a) => a.status === "offer" || a.status === "hired"
                  ).length +
                    externalApplications.filter((a) => a.status === "offer").length}
                  )
                </span>
                <Award size={14} className="text-emerald-600" />
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {allAppliedJobs
                  .filter((a) => a.status === "offer" || a.status === "hired")
                  .map((app) => (
                    <div
                      key={app._id}
                      className="bg-white rounded-xl p-3.5 border-l-4 border-l-emerald-500 border-slate-200 border shadow-2xs"
                    >
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800">
                        {app.status === "hired" ? "Hired" : "Offer Received"}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">
                        {app.job?.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{app.job?.company?.name}</p>
                    </div>
                  ))}

                {externalApplications
                  .filter((a) => a.status === "offer")
                  .map((app) => (
                    <div
                      key={app._id}
                      className="bg-white rounded-xl p-3.5 border-l-4 border-l-emerald-500 border-slate-200 border shadow-2xs"
                    >
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800">
                        Offer ({app.source})
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{app.role}</h4>
                      <p className="text-[11px] text-slate-500">{app.company}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAVED JOBS */}
        {activeTab === "saved" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 flex-1 px-2">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search saved jobs by title, company, location..."
                  value={searchSaved}
                  onChange={(e) => setSearchSaved(e.target.value)}
                  className="w-full text-xs text-slate-900 outline-none bg-transparent"
                />
              </div>

              {/* Triage filter pills */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                <button
                  onClick={() => setSavedFilter("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    savedFilter === "all"
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All ({savedJobs.length})
                </button>
                <button
                  onClick={() => setSavedFilter("to_apply")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    savedFilter === "to_apply"
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  To Apply ({toApplyCount})
                </button>
                <button
                  onClick={() => setSavedFilter("applied")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    savedFilter === "applied"
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Applied ({appliedSavedCount})
                </button>
              </div>
            </div>

            {filteredSavedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Bookmark size={32} className="text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No saved jobs</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  When browsing jobs, click the bookmark icon to save opportunities here for later.
                </p>
                <Link to="/jobs">
                  <Button className="mt-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white">
                    Explore Jobs
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSavedJobs.map((job) => (
                  <Job key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EXTERNAL APPLICATIONS */}
        {activeTab === "external" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  External Applications
                </h2>
                <p className="text-xs text-slate-500">
                  Manage applications submitted via LinkedIn, Naukri, Indeed, or company sites.
                </p>
              </div>
              <Button
                onClick={() => openAddModal()}
                className="rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white gap-1"
              >
                <Plus size={15} /> Add Application
              </Button>
            </div>

            {externalApplications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Building2 size={32} className="text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">
                  No external applications tracked yet
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Track jobs you applied to on other platforms so you never lose track of an interview.
                </p>
                <Button
                  onClick={() => openAddModal()}
                  className="mt-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Add Your First Application
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="p-3.5">Company</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Source</th>
                      <th className="p-3.5">Applied Date</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {externalApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/50 transition">
                        <td className="p-3.5 font-bold text-slate-900">{app.company}</td>
                        <td className="p-3.5 text-slate-700 font-medium">{app.role}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {app.source}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">
                          {app.appliedDate?.split("T")[0]}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                              app.status === "interview"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : app.status === "offer"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : app.status === "rejected"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {app.jobUrl && (
                              <a
                                href={app.jobUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-indigo-600"
                                title="View URL"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                            <button
                              onClick={() => openAddModal(app)}
                              className="text-slate-400 hover:text-slate-700 cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteExternal(app._id)}
                              className="text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* External Application Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl border border-slate-200 p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              {editingApp ? "Edit External Application" : "Track External Application"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Record opportunities you applied to outside JobPortal.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-3.5 mt-2">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Company Name *</Label>
              <Input
                required
                placeholder="e.g. Google, TCS, Startup"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="mt-1 text-xs rounded-xl"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Job Role / Title *</Label>
              <Input
                required
                placeholder="e.g. Frontend Engineer, Full Stack Dev"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Source</Label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full mt-1 text-xs rounded-xl border border-slate-200 p-2 bg-white"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Naukri">Naukri</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Company Website">Company Website</option>
                  <option value="JobPortal">JobPortal</option>
                  <option value="Wellfound">Wellfound</option>
                  <option value="Referral">Referral</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Status</Label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full mt-1 text-xs rounded-xl border border-slate-200 p-2 bg-white capitalize"
                >
                  <option value="applied">Applied</option>
                  <option value="review">Under Review</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer Received</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Applied Date</Label>
                <Input
                  type="date"
                  value={formData.appliedDate}
                  onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                  className="mt-1 text-xs rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">Salary (Optional)</Label>
                <Input
                  placeholder="e.g. ₹12 LPA"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="mt-1 text-xs rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Job URL</Label>
              <Input
                placeholder="https://..."
                value={formData.jobUrl}
                onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                className="mt-1 text-xs rounded-xl"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Notes & Contact</Label>
              <textarea
                placeholder="Interview notes, HR contact details..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="w-full mt-1 text-xs rounded-xl border border-slate-200 p-2 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {editingApp ? "Save Changes" : "Add to Pipeline"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <MobileBottomNav />
    </div>
  );
};

export default Pipeline;
