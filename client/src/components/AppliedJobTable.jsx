import React from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Link } from "react-router-dom";

const AppliedJobTable = () => {
  const { allAppliedJobs = [] } = useSelector((store) => store.job);

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "rejected") return "bg-rose-50 text-rose-700 border-rose-200";
    if (s === "hired") return "bg-emerald-50 text-emerald-800 border-emerald-200";
    if (s === "offer") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "interview") return "bg-amber-50 text-amber-800 border-amber-200";
    if (s === "shortlisted" || s === "accepted")
      return "bg-purple-50 text-purple-800 border-purple-200";
    if (s === "review") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <Table className="w-full text-left text-xs">
        <TableHeader className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
          <TableRow>
            <TableHead className="p-3.5">Date Applied</TableHead>
            <TableHead className="p-3.5">Job Role</TableHead>
            <TableHead className="p-3.5">Company</TableHead>
            <TableHead className="p-3.5">Location</TableHead>
            <TableHead className="p-3.5 text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-slate-100">
          {allAppliedJobs && allAppliedJobs.length > 0 ? (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id} className="hover:bg-slate-50/60 transition">
                <TableCell className="p-3.5 text-slate-500">
                  {appliedJob?.createdAt?.split("T")[0] ?? "N/A"}
                </TableCell>

                <TableCell className="p-3.5 font-bold text-slate-900">
                  <Link
                    to={`/description/${appliedJob.job?._id}`}
                    className="hover:text-indigo-600 transition"
                  >
                    {appliedJob.job?.title ?? "N/A"}
                  </Link>
                </TableCell>

                <TableCell className="p-3.5 font-medium text-slate-700">
                  {appliedJob.job?.company?.name ?? "N/A"}
                </TableCell>

                <TableCell className="p-3.5 text-slate-500">
                  {appliedJob.job?.location ?? "N/A"}
                </TableCell>

                <TableCell className="p-3.5 text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusBadge(
                      appliedJob.status
                    )}`}
                  >
                    {appliedJob.status ?? "APPLIED"}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                You haven't applied to any jobs yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
