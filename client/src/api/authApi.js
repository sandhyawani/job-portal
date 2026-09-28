import apiClient from "./axios";

export const authApi = {
  register: (formData) =>
    apiClient.post("/api/v1/user/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  login: (credentials) =>
    apiClient.post("/api/v1/user/login", credentials, {
      headers: { "Content-Type": "application/json" },
    }),

  logout: () => apiClient.get("/api/v1/user/logout"),

  getProfile: () => apiClient.get("/api/v1/user/profile"),

  updateProfile: (formData) =>
    apiClient.post("/api/v1/user/profile/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getNotifications: () => apiClient.get("/api/v1/user/notifications"),

  markNotificationRead: (id = "all") =>
    apiClient.put(`/api/v1/user/notifications/${id}/read`),
};

export default authApi;
