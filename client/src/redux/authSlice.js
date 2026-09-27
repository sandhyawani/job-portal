import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    notifications: [],
    unreadCount: 0,
    profileCompletion: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload || [];
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload || 0;
    },
    setProfileCompletion: (state, action) => {
      state.profileCompletion = action.payload;
    },
  },
});

export const {
  setLoading,
  setUser,
  setNotifications,
  setUnreadCount,
  setProfileCompletion,
} = authSlice.actions;

export default authSlice.reducer;