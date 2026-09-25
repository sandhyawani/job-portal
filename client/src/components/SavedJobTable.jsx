import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Trash2, BookmarkCheck } from "lucide-react";
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
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {allSavedJobs && allSavedJobs.length > 0 ? (
            allSavedJobs.map((job) => (
              <TableRow key={job._id} className="hover:bg-gray-50/70 transition">
                <TableCell className="text-gray-500 text-sm">
                  {job?.createdAt?.split("T")[0] ?? "N/A"}
                </TableCell>
                <TableCell className="font-semibold text-gray-900">
                  {job?.title ?? "N/A"}
                </TableCell>
                <TableCell className="font-medium text-gray-700">
                  {job?.company?.name ?? "N/A"}
                </TableCell>
                <TableCell className="text-gray-600 text-sm">
                  {job?.location ?? "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => navigate(`/description/${job._id}`)}
                      size="sm"
                      variant="outline"
                      className="rounded-lg text-pink-600 border-pink-200 hover:bg-pink-50 text-xs font-medium"
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
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mb-3">
                    <BookmarkCheck className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-gray-800">You haven&apos;t saved any jobs yet.</p>
                  <p className="text-xs text-gray-500 mt-1 mb-4">Bookmark jobs you like and apply whenever you&apos;re ready.</p>
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

export default SavedJobTable;
