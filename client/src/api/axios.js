import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error messaging
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred. Please try again.";
    
    // Attach friendly message to error object
    error.friendlyMessage = message;
    return Promise.reject(error);
  }
);

export default apiClient;
