import apiClient from "./axios";

export const jobApi = {
  getAllJobs: (params = {}) =>
    apiClient.get("/api/v1/job/get", { params }),

  getJobById: (id) =>
    apiClient.get(`/api/v1/job/get/${id}`),

  postJob: (jobData) =>
    apiClient.post("/api/v1/job/post", jobData, {
      headers: { "Content-Type": "application/json" },
    }),

  getAdminJobs: () =>
    apiClient.get("/api/v1/job/getadminjobs"),

  updateJob: (id, jobData) =>
    apiClient.put(`/api/v1/job/update/${id}`, jobData, {
      headers: { "Content-Type": "application/json" },
    }),
};

export default jobApi;
