import { setAllJobs, setPagination, setJobLoading } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = (customParams = null) => {
  const dispatch = useDispatch();
  const { filters, pagination } = useSelector((store) => store.job);

  const fetchJobs = useCallback(async () => {
    try {
      dispatch(setJobLoading(true));
      const activeFilters = customParams || filters;

      const params = new URLSearchParams();
      if (activeFilters.keyword) params.append("keyword", activeFilters.keyword);
      if (activeFilters.location && activeFilters.location !== "All")
        params.append("location", activeFilters.location);
      if (activeFilters.workMode && activeFilters.workMode !== "All")
        params.append("workMode", activeFilters.workMode);
      if (activeFilters.jobType && activeFilters.jobType !== "All")
        params.append("jobType", activeFilters.jobType);
      if (activeFilters.experience && activeFilters.experience !== "All")
        params.append("experience", activeFilters.experience);
      if (activeFilters.salaryMin) params.append("salaryMin", activeFilters.salaryMin);
      if (activeFilters.salaryMax) params.append("salaryMax", activeFilters.salaryMax);
      if (activeFilters.datePosted && activeFilters.datePosted !== "all")
        params.append("datePosted", activeFilters.datePosted);
      if (activeFilters.sort) params.append("sort", activeFilters.sort);

      const page = customParams?.page || pagination?.currentPage || 1;
      params.append("page", page);
      params.append("limit", "12");

      const res = await axios.get(`${JOB_API_END_POINT}/get?${params.toString()}`, {
        withCredentials: true,
      });

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
    } finally {
      dispatch(setJobLoading(false));
    }
  }, [
    customParams,
    filters.keyword,
    filters.location,
    filters.workMode,
    filters.jobType,
    filters.experience,
    filters.salaryMin,
    filters.salaryMax,
    filters.datePosted,
    filters.sort,
    pagination?.currentPage,
    dispatch,
  ]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { refetch: fetchJobs };
};

export default useGetAllJobs;
