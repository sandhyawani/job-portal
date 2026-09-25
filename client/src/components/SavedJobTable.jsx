import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setSavedJobs } from "@/redux/authSlice";
import { setAllSavedJobs } from "@/redux/jobSlice";
import { toast } from "sonner";

const SavedJobTable = () => {
  const { allSavedJobs } = useSelector((store) => store.job);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const removeSavedJob = async (jobId) => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/save-job/${jobId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setSavedJobs(res.data.savedJobs));
        dispatch(setAllSavedJobs(allSavedJobs.filter((j) => j._id !== jobId)));
        toast.success("Job removed from saved list");
      }
    } catch {
      toast.error("Failed to remove saved job");
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableCaption>A list of your saved jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allSavedJobs && allSavedJobs.length > 0 ? (
            allSavedJobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell className="font-medium text-gray-900">
                  {job?.title ?? "N/A"}
                </TableCell>
                <TableCell>{job?.company?.name ?? "N/A"}</TableCell>
                <TableCell>{job?.location ?? "N/A"}</TableCell>
                <TableCell className="text-right flex items-center justify-end gap-2">
                  <Button
                    onClick={() => navigate(`/description/${job._id}`)}
                    size="sm"
                    variant="outline"
                    className="rounded-lg text-pink-600 border-pink-200 hover:bg-pink-50"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => removeSavedJob(job._id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-2"
                    title="Remove from saved"
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                You haven't saved any jobs yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SavedJobTable;
