import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
  // Redux state
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);

  // Filtered jobs for display
  const [filteredJobs, setFilteredJobs] = useState(allAdminJobs);

  const navigate = useNavigate();

  // Apply search filter on jobs list
  useEffect(() => {
    const result = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase())
      );
    });
    setFilteredJobs(result);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableCaption>Recently posted jobs</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Applicants</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredJobs?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No jobs found matching your search.
              </TableCell>
            </TableRow>
          ) : (
            filteredJobs?.map((job, index) => (
              <TableRow key={job._id || index} className="hover:bg-gray-50/70 transition">
                <TableCell className="font-medium text-gray-800">{job?.company?.name || "N/A"}</TableCell>
                <TableCell className="font-semibold text-gray-900">{job?.title}</TableCell>
                <TableCell>
                  <button
                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition"
                    title="View candidate applications"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{job?.applications?.length || 0}</span>
                  </button>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">{job?.createdAt?.split("T")[0]}</TableCell>

              <TableCell className="text-right">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition">
                      <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="end"
                    className="w-36 bg-white rounded-xl shadow-lg border border-gray-200 p-3 flex flex-col gap-2"
                  >
                    <button
                      onClick={() =>
                        navigate(`/admin/jobs/${job._id}/edit`)
                      }
                      className="flex items-center gap-2 px-2 py-1 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4 text-indigo-600" />
                      <span className="text-gray-700">Edit</span>
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/admin/jobs/${job._id}/applicants`)
                      }
                      className="flex items-center gap-2 px-2 py-1 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4 text-indigo-600" />
                      <span className="text-gray-700">Applicants</span>
                    </button>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))
        )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
