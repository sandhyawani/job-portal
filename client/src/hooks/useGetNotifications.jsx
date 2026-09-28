import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import authApi from "@/api/authApi";
import { setNotifications, setUnreadCount } from "@/redux/authSlice";

const useGetNotifications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const res = await authApi.getNotifications();
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
      const res = await authApi.markNotificationRead(id);
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
