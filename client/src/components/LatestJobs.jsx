import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import LatestJobCards from "./LatestJobCards";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { setAllJobs } from "@/redux/jobSlice";

const LatestJobs = () => {
  const dispatch = useDispatch();
  const { allJobs } = useSelector((store) => store.job);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true });
        console.log("API Response:", res.data); // ✅ debug
        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.log("Error fetching jobs:", error);
      }
      setLoading(false);
    };
    fetchJobs();
  }, [dispatch]);

  if (loading) return <p className="text-center">Loading jobs...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {allJobs.length > 0 ? (
        allJobs.map((job) => <LatestJobCards key={job._id} job={job} />)
      ) : (
        <p className="text-center text-gray-500">No Job Available</p>
      )}
    </div>
  );
};

export default LatestJobs;
