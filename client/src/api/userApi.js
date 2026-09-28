import apiClient from "./axios";

export const userApi = {
  toggleSaveJob: (jobId) =>
    apiClient.post(`/api/v1/user/save/${jobId}`),

  getSavedJobs: () =>
    apiClient.get("/api/v1/user/saved-jobs"),
};

export default userApi;
