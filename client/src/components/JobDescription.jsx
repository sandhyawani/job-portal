// src/components/JobDescription.jsx

import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  Star,
  Users,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import TrustBadge from "./TrustBadge";

/* UTILITIES */
const normalizeUrl = (url) =>
  url?.startsWith("http") ? url : `https://${url}`;

const formatSalary = (salary) => {
  if (!salary) return "Competitive";
  const num = Number(salary);
  if (!isNaN(num) && num > 1000) {
    return `₹${num.toLocaleString("en-IN")}`;
  }
  return salary.startsWith("₹") ? salary : `₹${salary}`;
};

const formatExperience = (exp) => {
  if (!exp && exp !== 0) return "Fresher / Any";
  if (!isNaN(exp)) return `${exp} Year${Number(exp) === 1 ? "" : "s"}`;
  return exp;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "Recently";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr?.split("T")?.[0] || dateStr;
  }
};

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [isApplied, setIsApplied] = useState(false);
  const [checking, setChecking] = useState(true);

  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* =====================================================
     🔒 CHECK IF USER HAS ALREADY APPLIED (SOURCE OF TRUTH)
     ===================================================== */
  useEffect(() => {
    if (!user) {
      setIsApplied(false);
      setChecking(false);
      return;
    }

    const checkApplied = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/has-applied/${jobId}`,
          { withCredentials: true }
        );
        setIsApplied(res.data.applied);
      } catch {
        setIsApplied(false);
      } finally {
        setChecking(false);
      }
    };

    checkApplied();
  }, [jobId, user]);

  /* ======================
     APPLY JOB
     ====================== */
  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login to apply");
      return;
    }

    if (isApplied) return;

    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.info(error.response?.data?.message || "Already applied");
      setIsApplied(true);
    }
  };

  /* ======================
     FETCH JOB DETAILS
     ====================== */
  useEffect(() => {
    const fetchSingleJob = async () => {
      const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setSingleJob(res.data.job));
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch]);

  if (!singleJob || checking) return null;

  const company = singleJob.company;
  const requirements = Array.isArray(singleJob.requirements)
    ? singleJob.requirements
    : typeof singleJob.requirements === "string"
    ? singleJob.requirements.split(",").map((r) => r.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <Navbar />

      <div className="max-w-4xl mx-auto pt-24 px-4 sm:px-6">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-pink-600 mb-5 transition-colors"
        >
          <ArrowLeft size={14} /> Back to jobs
        </button>

        {/* Main Clean Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6 sm:p-8">
          
          {/* ================= HEADER ================= */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 pb-6 border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {singleJob.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge className="bg-pink-50 text-pink-700 hover:bg-pink-100 text-xs px-2.5 py-0.5 rounded-md font-medium border border-pink-200">
                  {singleJob.position} Positions
                </Badge>
                <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs px-2.5 py-0.5 rounded-md font-medium border border-purple-200">
                  {singleJob.jobType}
                </Badge>
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs px-2.5 py-0.5 rounded-md font-medium border border-emerald-200">
                  {formatSalary(singleJob.salary)}
                </Badge>
              </div>
            </div>

            {/* APPLY ACTION */}
            <div className="shrink-0 w-full sm:w-auto">
              <Button
                disabled={isApplied}
                onClick={isApplied ? undefined : applyJobHandler}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${
                  isApplied
                    ? "bg-gray-100 text-gray-500 border border-gray-300 cursor-not-allowed hover:bg-gray-100"
                    : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:shadow-md"
                }`}
              >
                {isApplied ? "✓ Already Applied" : "Apply Now"}
              </Button>
            </div>
          </div>

          {/* ================= COMPANY INFO BANNER ================= */}
          {company && (
            <div className="my-6 p-4 rounded-xl border border-gray-100 bg-gray-50/70 flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src={company.logo || "/logo.png"}
                alt={company.name}
                className="w-12 h-12 rounded-lg border border-gray-200 bg-white object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900 truncate">
                    {company.name}
                  </h3>
                  <TrustBadge trustLevel={company.trustLevel} />
                </div>

                {company.description && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {company.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-gray-400" />
                    {singleJob.location}
                  </span>

                  {company.trustScore && (
                    <span className="flex items-center gap-1 text-amber-600 font-medium">
                      <Star size={13} fill="currentColor" />
                      {company.trustScore}/100 Trust Score
                    </span>
                  )}

                  {company.website && (
                    <a
                      href={normalizeUrl(company.website)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-pink-600 font-medium hover:underline"
                    >
                      <Globe size={13} /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= JOB OVERVIEW ================= */}
          <div className="my-6">
            <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Briefcase size={16} className="text-pink-600" />
              Job Overview
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <OverviewItem
                icon={<Briefcase size={16} className="text-pink-600" />}
                label="Role"
                value={singleJob.title}
              />
              <OverviewItem
                icon={<MapPin size={16} className="text-purple-600" />}
                label="Location"
                value={singleJob.location}
              />
              <OverviewItem
                icon={<Clock size={16} className="text-indigo-600" />}
                label="Experience"
                value={formatExperience(singleJob.experienceLevel)}
              />
              <OverviewItem
                icon={<Wallet size={16} className="text-emerald-600" />}
                label="Salary / CTC"
                value={formatSalary(singleJob.salary)}
              />
              <OverviewItem
                icon={<Users size={16} className="text-blue-600" />}
                label="Applicants"
                value={`${singleJob.applications?.length || 0} ${
                  (singleJob.applications?.length || 0) === 1 ? "person" : "people"
                }`}
              />
              <OverviewItem
                icon={<Calendar size={16} className="text-amber-600" />}
                label="Posted Date"
                value={formatDate(singleJob.createdAt)}
              />
            </div>
          </div>

          {/* ================= ABOUT ROLE ================= */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-2">
              About this role
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {singleJob.description}
            </p>
          </div>

          {/* ================= REQUIREMENTS (IF PRESENT) ================= */}
          {requirements.length > 0 && (
            <div className="pt-6 mt-6 border-t border-gray-100">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Key Requirements & Skills
              </h3>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                {requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

/* ================= COMPACT OVERVIEW ITEM ================= */
const OverviewItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200/60 bg-gray-50/60 hover:bg-pink-50/30 transition-colors">
    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200/80 shadow-2xs flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate" title={value}>
        {value}
      </p>
    </div>
  </div>
);

export default JobDescription;
