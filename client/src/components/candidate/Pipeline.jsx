import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import MobileBottomNav from "../shared/MobileBottomNav";
import { useSelector, useDispatch } from "react-redux";
import useGetSavedJobs from "@/hooks/useGetSavedJobs";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import useGetExternalApplications from "@/hooks/useGetExternalApplications";
import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Plus, Layers } from "lucide-react";
import applicationApi from "@/api/applicationApi";
import userApi from "@/api/userApi";
import {
  addExternalApplication,
  updateExternalApplicationInState,
  removeExternalApplicationFromState,
} from "@/redux/applicationSlice";
import { toggleSavedJobInState } from "@/redux/jobSlice";
import { toast } from "sonner";

import PipelineStats from "./pipeline/PipelineStats";
import PipelineBoard from "./pipeline/PipelineBoard";
import SavedJobsTab from "./pipeline/SavedJobsTab";
import ExternalTrackerTab from "./pipeline/ExternalTrackerTab";
import ExternalAppModal from "./pipeline/ExternalAppModal";

const Pipeline = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

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
        const res = await applicationApi.updateExternalApplication(
          editingApp._id,
          formData
        );
        if (res.data.success) {
          dispatch(updateExternalApplicationInState(res.data.application));
          toast.success(res.data.message);
        }
      } else {
        const res = await applicationApi.createExternalApplication(formData);
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
      const res = await applicationApi.deleteExternalApplication(id);
      if (res.data.success) {
        dispatch(removeExternalApplicationFromState(id));
        toast.success("Application removed");
      }
    } catch {
      toast.error("Failed to delete application");
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      dispatch(toggleSavedJobInState(jobId));
      await userApi.toggleSaveJob(jobId);
      toast.success("Job removed from saved list");
    } catch {
      dispatch(toggleSavedJobInState(jobId));
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
        <PipelineStats
          savedCount={savedCount}
          portalAppliedCount={portalAppliedCount}
          externalAppliedCount={externalAppliedCount}
          interviewCount={interviewCount}
          offerCount={offerCount}
        />

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
          <PipelineBoard
            savedJobs={savedJobs}
            allAppliedJobs={allAppliedJobs}
            externalApplications={externalApplications}
            onUnsaveJob={handleUnsaveJob}
            onOpenAddModal={openAddModal}
            onDeleteExternal={handleDeleteExternal}
          />
        )}

        {/* TAB 2: SAVED JOBS */}
        {activeTab === "saved" && (
          <SavedJobsTab
            savedJobs={savedJobs}
            filteredSavedJobs={filteredSavedJobs}
            searchSaved={searchSaved}
            setSearchSaved={setSearchSaved}
            savedFilter={savedFilter}
            setSavedFilter={setSavedFilter}
            toApplyCount={toApplyCount}
            appliedSavedCount={appliedSavedCount}
          />
        )}

        {/* TAB 3: EXTERNAL APPLICATIONS */}
        {activeTab === "external" && (
          <ExternalTrackerTab
            externalApplications={externalApplications}
            onOpenAddModal={openAddModal}
            onDeleteExternal={handleDeleteExternal}
          />
        )}
      </main>

      {/* External Application Modal */}
      <ExternalAppModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingApp={editingApp}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleFormSubmit}
      />

      <MobileBottomNav />
    </div>
  );
};

export default Pipeline;
