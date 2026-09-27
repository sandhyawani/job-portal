import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { setExternalApplications } from "@/redux/applicationSlice";

const useGetExternalApplications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const fetchExternalApps = useCallback(async () => {
    if (!user || user.role !== "student") return;

    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/external`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setExternalApplications(res.data.applications));
      }
    } catch (err) {
      console.error("Error fetching external applications:", err);
    }
  }, [user, dispatch]);

  useEffect(() => {
    fetchExternalApps();
  }, [fetchExternalApps]);

  return { refetch: fetchExternalApps };
};

export default useGetExternalApplications;
