import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Edit2, Eye, MoreHorizontal, Users, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

const AdminJobsTable = () => {
  const { allAdminJobs = [], searchJobByText = "" } = useSelector(
    (store) => store.job
  );
  const [filteredJobs, setFilteredJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

  useEffect(() => {
    const result = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      const term = searchJobByText.toLowerCase();
      return (
        job?.title?.toLowerCase().includes(term) ||
        job?.company?.name?.toLowerCase().includes(term) ||
        job?.location?.toLowerCase().includes(term)
      );
    });
    setFilteredJobs(result);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
      <Table className="w-full text-left text-xs">
        <TableHeader className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
          <TableRow>
            <TableHead className="p-3.5">Company</TableHead>
            <TableHead className="p-3.5">Job Title</TableHead>
            <TableHead className="p-3.5">Location</TableHead>
            <TableHead className="p-3.5">Salary</TableHead>
            <TableHead className="p-3.5">Applicants</TableHead>
            <TableHead className="p-3.5">Date Posted</TableHead>
            <TableHead className="p-3.5 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-slate-100">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
              const applicantCount = job.applications?.length || 0;
              return (
                <TableRow key={job._id} className="hover:bg-slate-50/60 transition">
                  <TableCell className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={job?.company?.logo || "/logo.png"}
                        alt={job?.company?.name}
                        className="w-8 h-8 rounded-lg border object-cover shrink-0"
                      />
                      <span className="font-bold text-slate-900 truncate max-w-[140px]">
                        {job?.company?.name || "Company"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="p-3.5 font-bold text-slate-900">
                    {job?.title}
                  </TableCell>

                  <TableCell className="p-3.5 text-slate-500">
                    {job?.location}
                  </TableCell>

                  <TableCell className="p-3.5 font-semibold text-slate-700">
                    ₹{job?.salary} LPA
                  </TableCell>

                  <TableCell className="p-3.5">
                    <Link
                      to={`/admin/jobs/${job._id}/applicants`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                    >
                      <Users size={12} />
                      {applicantCount} {applicantCount === 1 ? "applicant" : "applicants"}
                    </Link>
                  </TableCell>

                  <TableCell className="p-3.5 text-slate-500">
                    {job?.createdAt?.split("T")[0]}
                  </TableCell>

                  <TableCell className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link to={`/admin/jobs/${job._id}/applicants`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Candidates
                        </Button>
                      </Link>

                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
                            <MoreHorizontal size={16} />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent align="end" className="w-36 p-1 rounded-xl bg-white border border-slate-200 shadow-lg text-xs">
                          <button
                            onClick={() => navigate(`/admin/jobs/${job._id}/edit`)}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 text-left"
                          >
                            <Edit2 size={13} /> Edit Job
                          </button>
                          <button
                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 text-left"
                          >
                            <Eye size={13} /> View Applicants
                          </button>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-slate-400">
                No jobs found matching your search.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
