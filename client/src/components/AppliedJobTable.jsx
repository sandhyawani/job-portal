import React from "react";
import { useSelector } from "react-redux";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";

const AppliedJobTable = () => {
  // Get all applied jobs from Redux store
  const { allAppliedJobs } = useSelector((store) => store.job);

  return (
    <div>
      <Table>
        {/* Table description */}
        <TableCaption>A list of your applied jobs</TableCaption>

        {/* Table header */}
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>

        {/* Table body */}
        <TableBody>
          {allAppliedJobs && allAppliedJobs.length > 0 ? (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                {/* Applied date */}
                <TableCell>{appliedJob?.createdAt?.split("T")[0] ?? "N/A"}</TableCell>

                {/* Job title */}
                <TableCell>{appliedJob.job?.title ?? "N/A"}</TableCell>

                {/* Company name */}
                <TableCell>{appliedJob.job?.company?.name ?? "N/A"}</TableCell>

                {/* Application status */}
                <TableCell className="text-right">
                  <Badge
                    className={`${
                      appliedJob?.status === "rejected"
                        ? "bg-red-400"
                        : appliedJob.status === "pending"
                        ? "bg-gray-400"
                        : "bg-green-400"
                    }`}
                  >
                    {appliedJob.status?.toUpperCase() ?? "APPLIED"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            // Empty state
            <TableRow>
              <TableCell colSpan={4} className="text-center">
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
