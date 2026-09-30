import { setAllJobs, setPagination, setJobLoading } from "@/redux/jobSlice";
import { jobApi } from "@/api/jobApi";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const useGetAllJobs = (customParams = null) => {
  const dispatch = useDispatch();
  const { filters, pagination } = useSelector((store) => store.job);

  const fetchJobs = useCallback(async () => {
    try {
      dispatch(setJobLoading(true));
      const activeFilters = customParams || filters;

      const params = {};
      if (activeFilters.keyword) params.keyword = activeFilters.keyword;
      if (activeFilters.location && activeFilters.location !== "All")
        params.location = activeFilters.location;
      if (activeFilters.workMode && activeFilters.workMode !== "All")
        params.workMode = activeFilters.workMode;
      if (activeFilters.jobType && activeFilters.jobType !== "All")
        params.jobType = activeFilters.jobType;
      if (activeFilters.experience && activeFilters.experience !== "All")
        params.experience = activeFilters.experience;
      if (activeFilters.salaryMin) params.salaryMin = activeFilters.salaryMin;
      if (activeFilters.salaryMax) params.salaryMax = activeFilters.salaryMax;
      if (activeFilters.datePosted && activeFilters.datePosted !== "all")
        params.datePosted = activeFilters.datePosted;
      if (activeFilters.sort) params.sort = activeFilters.sort;

      params.page = customParams?.page || pagination?.currentPage || 1;
      params.limit = 12;

      const res = await jobApi.getAllJobs(params);

      if (res.data.success) {
        dispatch(setAllJobs(res.data.jobs));
        dispatch(
          setPagination({
            totalJobs: res.data.totalJobs,
            currentPage: res.data.currentPage,
            totalPages: res.data.totalPages,
          })
        );
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error(error.friendlyMessage || error.response?.data?.message || error.message || "Failed to load jobs");
    } finally {
      dispatch(setJobLoading(false));
    }
  }, [customParams, filters, pagination?.currentPage, dispatch]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { refetch: fetchJobs };
};

export default useGetAllJobs;
