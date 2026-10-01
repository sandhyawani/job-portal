import React, { useEffect, useState, useMemo } from "react";
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
import Job from "./Job";

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

  // Strict frontend deduplication & current-job exclusion safeguard
  const uniqueSimilarJobs = useMemo(() => {
    if (!similarJobs || !Array.isArray(similarJobs)) return [];

    const currentId = String(singleJob?._id || jobId || "");
    const seenIds = new Set([currentId]);
    const seenTitleCompany = new Set();

    if (singleJob) {
      const currentComp = (singleJob.company?.name || "").toLowerCase().replace(/\s*\d+$/, "").trim();
      const currentTitle = (singleJob.title || "").toLowerCase().trim();
      seenTitleCompany.add(`${currentTitle}::${currentComp}`);
    }

    const result = [];
    for (const j of similarJobs) {
      if (!j || !j._id) continue;
      const jId = String(j._id);
      if (seenIds.has(jId)) continue;

      const compClean = (j.company?.name || "").toLowerCase().replace(/\s*\d+$/, "").trim();
      const titleClean = (j.title || "").toLowerCase().trim();
      const key = `${titleClean}::${compClean}`;

      if (seenTitleCompany.has(key)) continue;

      seenIds.add(jId);
      seenTitleCompany.add(key);
      result.push(j);
    }

    return result;
  }, [similarJobs, singleJob, jobId]);

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
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
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
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-8">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-20 px-4 sm:px-6">
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

        {/* Main 2:1 Content and Sidebar Grid with natural content heights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <JobContent singleJob={singleJob} />
          <JobSidebar company={company} singleJob={singleJob} workMode={workMode} />
        </div>

        {/* Similar Opportunities Section - Natural 32px spacing after content */}
        <section className="mt-8 pt-8 border-t border-slate-200/80 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Similar Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore related job openings matching role requirements, experience, and domain.
            </p>
          </div>

          {uniqueSimilarJobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {uniqueSimilarJobs.map((simJob) => (
                <Job key={simJob._id} job={simJob} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
              No similar opportunities available right now.
            </div>
          )}
        </section>

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
