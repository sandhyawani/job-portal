import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Briefcase, Building2, CheckCircle2, Clock, XCircle, Search } from "lucide-react";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = (allAppliedJobs || []).filter((app) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const titleMatch = app.job?.title?.toLowerCase().includes(term);
    const companyMatch = app.job?.company?.name?.toLowerCase().includes(term);
    const statusMatch = app.status?.toLowerCase().includes(term);
    return titleMatch || companyMatch || statusMatch;
  });

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "accepted") {
      return {
        style: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Accepted / Shortlisted",
        stage: "Stage 3 of 3 • Offer / Shortlisted",
        icon: <CheckCircle2 size={13} className="text-emerald-600" />,
      };
    }
    if (s === "rejected") {
      return {
        style: "bg-rose-50 text-rose-700 border-rose-200",
        label: "Not Selected",
        stage: "Stage 3 of 3 • Application Closed",
        icon: <XCircle size={13} className="text-rose-600" />,
      };
    }
    return {
      style: "bg-amber-50 text-amber-700 border-amber-200",
      label: "Under Review",
      stage: "Stage 2 of 3 • In Recruiter Screening",
      icon: <Clock size={13} className="text-amber-600" />,
    };
  };

  return (
    <div className="space-y-4">
      {allAppliedJobs && allAppliedJobs.length > 2 && (
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by job title, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 focus:bg-white transition"
            />
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {filteredJobs.length} {filteredJobs.length === 1 ? "application" : "applications"}
          </span>
        </div>
      )}

      <div className="overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="text-xs font-bold text-gray-600">Applied Date</TableHead>
              <TableHead className="text-xs font-bold text-gray-600">Job Role</TableHead>
              <TableHead className="text-xs font-bold text-gray-600">Company</TableHead>
              <TableHead className="text-xs font-bold text-gray-600">Status & Stage</TableHead>
              <TableHead className="text-right text-xs font-bold text-gray-600">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((appliedJob) => {
                const statusMeta = getStatusBadge(appliedJob.status);
                const company = appliedJob.job?.company;

                return (
                  <TableRow key={appliedJob._id} className="hover:bg-gray-50/70 transition">
                    <TableCell className="text-gray-500 text-xs">
                      {appliedJob?.createdAt?.split("T")[0] ?? "Recently"}
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold text-gray-900 text-sm">
                        {appliedJob.job?.title ?? "Position Unavailable"}
                      </div>
                      {appliedJob.job?.location && (
                        <div className="text-[11px] text-gray-400 font-normal">
                          📍 {appliedJob.job.location}
                        </div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {company?.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-7 h-7 rounded-lg border border-gray-100 object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 text-xs font-bold">
                            <Building2 size={14} />
                          </div>
                        )}
                        <span className="font-medium text-gray-800 text-xs truncate max-w-[130px]">
                          {company?.name ?? "Company"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusMeta.style}`}
                        >
                          {statusMeta.icon}
                          {statusMeta.label}
                        </span>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {statusMeta.stage}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      {appliedJob.job?._id ? (
                        <Button
                          onClick={() => navigate(`/description/${appliedJob.job._id}`)}
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-pink-600 border-pink-200 hover:bg-pink-50 text-xs font-semibold px-3 py-1"
                        >
                          View Job
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">Archived</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mb-3">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-gray-800">
                      {searchTerm ? "No applications match your search query." : "You haven't applied to any jobs yet."}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 mb-4">
                      {searchTerm ? "Try searching for a different keyword." : "Discover open roles and submit your applications."}
                    </p>
                    {searchTerm ? (
                      <Button
                        onClick={() => setSearchTerm("")}
                        size="sm"
                        variant="outline"
                        className="rounded-xl text-xs font-semibold"
                      >
                        Clear Search
                      </Button>
                    ) : (
                      <Button
                        onClick={() => navigate("/jobs")}
                        size="sm"
                        className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-medium shadow-sm"
                      >
                        Explore Jobs
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AppliedJobTable;
