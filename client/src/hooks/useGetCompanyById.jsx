import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSingleCompany } from "@/redux/companySlice";
import { setAllJobs } from "@/redux/jobSlice";
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";

const useGetCompanyById = (companyId, onFetchComplete) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;

    const fetchSingleCompany = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get/${companyId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
          // Optional: Fetch company jobs
          const jobsRes = await axios.get(
            `${JOB_API_END_POINT}/get?company=${companyId}`,
            { withCredentials: true }
          );
          if (jobsRes.data.success) {
            dispatch(setAllJobs(jobsRes.data.jobs));
          }

          if (onFetchComplete) onFetchComplete(res.data.company);
        } else {
          setError("Failed to fetch company details");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
        console.error("Fetch Company Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSingleCompany();
  }, [companyId, dispatch, onFetchComplete]);

  return { loading, error };
};

export default useGetCompanyById;
