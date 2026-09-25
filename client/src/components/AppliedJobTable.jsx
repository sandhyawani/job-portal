import React from "react";
import { useSelector } from "react-redux";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "accepted") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s === "rejected") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allAppliedJobs && allAppliedJobs.length > 0 ? (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id} className="hover:bg-gray-50/70 transition">
                <TableCell className="text-gray-500 text-sm">
                  {appliedJob?.createdAt?.split("T")[0] ?? "N/A"}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {appliedJob.job?.title ?? "N/A"}
                </TableCell>
                <TableCell className="font-medium text-gray-700">
                  {appliedJob.job?.company?.name ?? "N/A"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                      appliedJob.status
                    )}`}
                  >
                    {appliedJob.status?.toUpperCase() ?? "PENDING"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {appliedJob.job?._id ? (
                    <Button
                      onClick={() => navigate(`/description/${appliedJob.job._id}`)}
                      size="sm"
                      variant="outline"
                      className="rounded-lg text-pink-600 border-pink-200 hover:bg-pink-50 text-xs font-medium"
                    >
                      View
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-400">Unavailable</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mb-3">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-gray-800">You haven&apos;t applied to any jobs yet.</p>
                  <p className="text-xs text-gray-500 mt-1 mb-4">Discover open roles and submit your applications.</p>
                  <Button
                    onClick={() => navigate("/jobs")}
                    size="sm"
                    className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-medium shadow-sm"
                  >
                    Explore Jobs
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
