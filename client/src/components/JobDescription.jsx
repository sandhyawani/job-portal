// src/components/JobDescription.jsx

import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import { Star } from "lucide-react";
import TrustBadge from "./TrustBadge";

/* UTIL */
const normalizeUrl = (url) =>
  url?.startsWith("http") ? url : `https://${url}`;

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [isApplied, setIsApplied] = useState(false);
  const [checking, setChecking] = useState(true);

  const { id: jobId } = useParams();
  const dispatch = useDispatch();

  /* =====================================================
     🔒 CHECK IF USER HAS ALREADY APPLIED  (SOURCE OF TRUTH)
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
     APPLY JOB (GET)
     ====================== */
  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login to apply");
      return;
    }

    // 🔒 HARD BLOCK
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
      const res = await axios.get(
        `${JOB_API_END_POINT}/get/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setSingleJob(res.data.job));
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch]);

  if (!singleJob || checking) return null;

  const company = singleJob.company;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-6xl mx-auto pt-28 px-6 pb-20">
        <div className="bg-white/80 backdrop-blur-xl border rounded-3xl shadow-2xl p-10">

          {/* ================= HEADER ================= */}
          <div className="flex flex-col lg:flex-row justify-between gap-8 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                {singleJob.title}
              </h1>

              <div className="flex flex-wrap gap-3 mt-5">
                <Badge className="bg-pink-100 text-pink-700">
                  {singleJob.position} Positions
                </Badge>
                <Badge className="bg-purple-100 text-purple-700">
                  {singleJob.jobType}
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-700">
                  {singleJob.salary}
                </Badge>
              </div>
            </div>

            {/* APPLY BUTTON */}
            <div className="lg:self-center">
              <Button
                disabled={isApplied}
                onClick={isApplied ? undefined : applyJobHandler}
                className={`px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl transition
                  ${
                    isApplied
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-105"
                  }
                `}
              >
                {isApplied ? "✓ Applied" : "Apply Now"}
              </Button>
            </div>
          </div>

          {/* ================= COMPANY + TRUST ================= */}
          {company && (
            <div className="mb-12 rounded-2xl border bg-gradient-to-r from-pink-50 to-purple-50 p-6 flex gap-5 items-start">
              <img
                src={company.logo || "/logo.png"}
                alt={company.name}
                className="w-16 h-16 rounded-xl border bg-white object-cover"
              />

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {company.name}
                  </h3>
                  <TrustBadge trustLevel={company.trustLevel} />
                </div>

                {company.description && (
                  <p className="text-gray-600 text-sm mt-1 max-w-xl">
                    {company.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-5 mt-3 text-sm">
                  <span className="text-gray-500">
                    📍 {singleJob.location}
                  </span>

                  {company.trustScore && (
                    <span className="flex items-center gap-1 text-yellow-600">
                      <Star size={14} fill="currentColor" />
                      <span className="font-semibold">
                        {company.trustScore}/100
                      </span>
                      <span className="text-gray-500">Trust Score</span>
                    </span>
                  )}

                  {company.website && (
                    <a
                      href={normalizeUrl(company.website)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-600 font-medium hover:underline"
                    >
                      🌐 Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= JOB OVERVIEW ================= */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
            Job Overview
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Detail label="Role" value={singleJob.title} />
            <Detail label="Location" value={singleJob.location} />
            <Detail label="Experience" value={singleJob.experienceLevel} />
            <Detail label="Salary" value={singleJob.salary} />
            <Detail
              label="Applicants"
              value={singleJob.applications?.length || 0}
            />
            <Detail
              label="Posted On"
              value={singleJob.createdAt?.split("T")[0]}
            />
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-3">About this role</h3>
            <p className="text-gray-700 leading-relaxed">
              {singleJob.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= DETAIL CARD ================= */
const Detail = ({ label, value }) => (
  <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-semibold text-gray-900 mt-1">
      {value}
    </p>
  </div>
);

export default JobDescription;
