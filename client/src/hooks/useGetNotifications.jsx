import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setNotifications, setUnreadCount } from "@/redux/authSlice";

const useGetNotifications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const res = await axios.get(`${USER_API_END_POINT}/notifications`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setNotifications(res.data.notifications));
        dispatch(setUnreadCount(res.data.unreadCount));
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [user, dispatch]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id = "all") => {
    try {
      const res = await axios.put(
        `${USER_API_END_POINT}/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  return { fetchNotifications, markAsRead };
};

export default useGetNotifications;
