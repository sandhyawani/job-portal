import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jobApi from "@/api/jobApi";
import applicationApi from "@/api/applicationApi";
import userApi from "@/api/userApi";
import { setSingleJob, toggleSavedJobInState } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import MobileBottomNav from "./shared/MobileBottomNav";
import { calculateJobMatch } from "@/utils/jobMatcher";

import JobHeader from "./job-details/JobHeader";
import MatchBreakdown from "./job-details/MatchBreakdown";
import JobContent from "./job-details/JobContent";
import JobSidebar from "./job-details/JobSidebar";
import ApplyModal from "./job-details/ApplyModal";
import ApplySuccessModal from "./job-details/ApplySuccessModal";

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
        const res = await applicationApi.hasApplied(jobId);
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
        const res = await jobApi.getJobById(jobId);

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          if (res.data.similarJobs) {
            setSimilarJobs(res.data.similarJobs);
          }
        }
      } catch {
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
      const res = await applicationApi.applyJob(jobId);

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

      const res = await userApi.toggleSaveJob(jobId);

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch {
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
    (typeof singleJob.location === "string" && singleJob.location.toLowerCase().includes("remote")
      ? "Remote"
      : typeof singleJob.location === "string" && singleJob.location.toLowerCase().includes("hybrid")
      ? "Hybrid"
      : "On-site");

  const match = isCandidate ? calculateJobMatch(singleJob, user) : null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-24 px-4 sm:px-6">
        <JobHeader
          singleJob={singleJob}
          company={company}
          workMode={workMode}
          isSaved={isSaved}
          saving={saving}
          isApplied={isApplied}
          applying={applying}
          match={match}
          onSaveToggle={saveToggleHandler}
          onApplyClick={handleApplyClick}
          onBack={() => navigate(-1)}
        />

        <MatchBreakdown match={match} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <JobContent singleJob={singleJob} similarJobs={similarJobs} />
          <JobSidebar company={company} singleJob={singleJob} workMode={workMode} />
        </div>

        <ApplyModal
          open={showApplyModal}
          onOpenChange={setShowApplyModal}
          singleJob={singleJob}
          company={company}
          user={user}
          coverNote={coverNote}
          setCoverNote={setCoverNote}
          onConfirm={handleConfirmSubmit}
          applying={applying}
        />

        <ApplySuccessModal
          open={showSuccessModal}
          onOpenChange={setShowSuccessModal}
          singleJob={singleJob}
          company={company}
          appliedDate={appliedDate}
          onTrack={() => {
            setShowSuccessModal(false);
            navigate("/applications");
          }}
          onExplore={() => {
            setShowSuccessModal(false);
            navigate("/jobs");
          }}
        />
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default JobDescription;
