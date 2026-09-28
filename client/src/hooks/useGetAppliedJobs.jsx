import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAllAppliedJobs } from "../redux/jobSlice";
import { applicationApi } from "@/api/applicationApi";

const useGetAppliedJobs = (onFetchComplete) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await applicationApi.getAppliedJobs();

        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.applications));
          if (onFetchComplete) onFetchComplete(res.data.applications);
        }
      } catch (err) {
        console.error("Fetch Applied Jobs Error:", err.message);
      }
    };

    fetchAppliedJobs();
  }, [dispatch, onFetchComplete]);
};

export default useGetAppliedJobs;
