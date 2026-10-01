import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import MobileBottomNav from "../shared/MobileBottomNav";
import { useParams, Link } from "react-router-dom";
import companyApi from "@/api/companyApi";
import {
  Building2,
  MapPin,
  Globe,
  Star,
  Briefcase,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import TrustBadge from "../TrustBadge";
import Job from "../Job";
import { Button } from "../ui/button";
import { normalizeUrl, getValidImageUrl } from "@/utils/formatters";

const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [openJobs, setOpenJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        const res = await companyApi.getCompanyById(id);
        if (res.data.success) {
          setCompany(res.data.company);
          setOpenJobs(res.data.openJobs || []);
        }
      } catch (err) {
        console.error("Failed to load company:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  if (loading || !company) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Navbar />
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading company profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 md:pb-8">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-20 px-4 sm:px-6">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-600 mb-3 transition"
        >
          <ArrowLeft size={14} /> Back to jobs
        </Link>

        {/* Company Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs mb-5">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={getValidImageUrl(company?.logo, "/logo.png")}
                alt={company?.name || "Company"}
                className="w-20 h-20 rounded-2xl border border-slate-200 object-cover bg-white p-1 shrink-0"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {company?.name || "Company"}
                </h1>
                <div className="flex flex-wrap items-center gap-2.5 mt-2">
                  <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <MapPin size={13} className="text-slate-400" />
                    {company?.location || "India"}
                  </span>
                  {company?.trustLevel && (
                    <TrustBadge trustLevel={company.trustLevel} showDetails={true} />
                  )}
                  {company?.trustScore > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-bold">
                      <Star size={12} fill="currentColor" />
                      {company.trustScore} / 100 Trust Score
                    </span>
                  )}
                </div>
              </div>
            </div>

            {normalizeUrl(company?.website) !== "#" && (
              <a
                href={normalizeUrl(company.website)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:text-primary-600 hover:bg-slate-50 shadow-2xs"
              >
                <Globe size={14} /> Official Website <ExternalLink size={12} />
              </a>
            )}
          </div>

          {company.description && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                About the Company
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                {company.description}
              </p>
            </div>
          )}
        </div>

        {/* Open Positions Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Open Positions at {company.name}
              </h2>
              <p className="text-xs text-slate-500">
                {openJobs.length} active {openJobs.length === 1 ? "opening" : "openings"}
              </p>
            </div>
          </div>

          {openJobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <Briefcase size={32} className="text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">
                No active openings at this time
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Check back soon or explore other opportunities on the job board.
              </p>
              <Link to="/jobs">
                <Button className="mt-4 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white">
                  Browse All Jobs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {openJobs.map((job) => (
                <Job key={job._id} job={{ ...job, company }} />
              ))}
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default CompanyDetail;
