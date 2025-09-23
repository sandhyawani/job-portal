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
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
  // get jobs and search text from redux
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);

  // store filtered jobs here
  const [filterJobs, setFilterJobs] = useState(allAdminJobs);

  // to navigate on button click
  const navigate = useNavigate();

  // run filter whenever jobs or search text changes
  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true; // if no search text show all
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div>
      <Table>
        {/* small caption below table */}
        <TableCaption>A list of your recently posted jobs</TableCaption>

        {/* table heading */}
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        {/* table body with all jobs */}
        <TableBody>
          {filterJobs?.map((job, index) => (
            <TableRow key={job._id || index}>
              <TableCell>{job?.company?.name}</TableCell>
              <TableCell>{job?.title}</TableCell>
              {/* only date part from createdAt */}
              <TableCell>{job?.createdAt?.split("T")[0]}</TableCell>

              {/* last column = action buttons inside menu */}
              <TableCell className="text-right">
                <Popover>
                  {/* 3 dot button */}
                  <PopoverTrigger asChild>
                    <button className="p-2 rounded-full hover:bg-gray-100 transition">
                      <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </button>
                  </PopoverTrigger>

                  {/* menu opens here */}
                  <PopoverContent
                    align="end"
                    className="w-36 bg-white rounded-xl shadow-lg border border-gray-200 p-3 flex flex-col gap-2"
                  >
                    {/* edit button */}
                    <button
                      onClick={() => navigate(`/admin/companies/${job._id}`)}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4 text-indigo-600" />
                      <span className="text-gray-700">Edit</span>
                    </button>

                    {/* see applicants button */}
                    <button
                      onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4 text-indigo-600" />
                      <span className="text-gray-700">Applicants</span>
                    </button>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
