import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast"; // Optional for UI alerts
import { setAllAdminJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
          toast.success(`Loaded ${res.data.jobs.length} jobs successfully!`);
        } else {
          toast.error("Failed to load jobs. Please try again.");
        }
      } catch (error) {
        console.error("❌ Error fetching admin jobs:", error);
        toast.error("Server error while fetching jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllAdminJobs();
  }, [dispatch]);

  return { loading };
};

export default useGetAllAdminJobs;
