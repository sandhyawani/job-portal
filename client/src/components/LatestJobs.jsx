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
        console.log("API Response:", res.data); 
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-gray-100 bg-white shadow-2xs animate-pulse flex flex-col justify-between h-48"
          >
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-100 rounded w-20"></div>
              </div>
              <div className="h-3 bg-gray-100 rounded w-1/4 mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-100 rounded w-4/5"></div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-gray-50">
              <div className="h-5 bg-gray-100 rounded-md w-16"></div>
              <div className="h-5 bg-gray-100 rounded-md w-16"></div>
              <div className="h-5 bg-gray-100 rounded-md w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

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
