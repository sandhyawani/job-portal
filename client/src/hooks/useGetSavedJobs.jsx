import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAllSavedJobs } from "../redux/jobSlice";
import { USER_API_END_POINT } from "../utils/constant";

const useGetSavedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/saved-jobs`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setAllSavedJobs(res.data.savedJobs));
        }
      } catch (err) {
        // Silently catch if not logged in or empty
      }
    };

    fetchSavedJobs();
  }, [dispatch]);
};

export default useGetSavedJobs;
