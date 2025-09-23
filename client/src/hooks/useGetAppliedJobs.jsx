import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAllAppliedJobs } from "../redux/jobSlice";
import { APPLICATION_API_END_POINT } from "../utils/constant";

const useGetAppliedJobs = (onFetchComplete) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
          withCredentials: true,
        });

        console.log("Applied Jobs API Response:", res.data);

        if (res.data.success) {
          // ✅ Corrected here
          dispatch(setAllAppliedJobs(res.data.applications));
          if (onFetchComplete) onFetchComplete(res.data.applications);
        } else {
          console.error("❌ Failed to fetch applied jobs.");
        }
      } catch (err) {
        console.error("❌ Fetch Applied Jobs Error:", err.message);
      }
    };

    fetchAppliedJobs();
  }, [dispatch, onFetchComplete]);
};

export default useGetAppliedJobs;
