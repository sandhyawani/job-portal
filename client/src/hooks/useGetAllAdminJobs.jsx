import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAllAdminJobs } from "@/redux/jobSlice";
import { jobApi } from "@/api/jobApi";

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      setLoading(true);
      try {
        const res = await jobApi.getAdminJobs();

        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching admin jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAdminJobs();
  }, [dispatch]);

  return { loading };
};

export default useGetAllAdminJobs;
