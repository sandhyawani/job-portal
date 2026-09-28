import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import userApi from "@/api/userApi";
import { setSavedJobs } from "@/redux/jobSlice";

const useGetSavedJobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const fetchSavedJobs = useCallback(async () => {
    if (!user || user.role !== "student") return;

    try {
      const res = await userApi.getSavedJobs();
      if (res.data.success) {
        dispatch(setSavedJobs(res.data.savedJobs));
      }
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    }
  }, [user, dispatch]);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  return { refetch: fetchSavedJobs };
};

export default useGetSavedJobs;
