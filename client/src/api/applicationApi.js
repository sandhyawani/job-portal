import apiClient from "./axios";

export const applicationApi = {
  applyJob: (jobId) =>
    apiClient.post(`/api/v1/application/apply/${jobId}`),

  hasApplied: (jobId) =>
    apiClient.get(`/api/v1/application/has-applied/${jobId}`),

  getAppliedJobs: () =>
    apiClient.get("/api/v1/application/get"),

  getApplicants: (jobId) =>
    apiClient.get(`/api/v1/application/${jobId}/applicants`),

  updateStatus: (applicationId, data) =>
    apiClient.post(`/api/v1/application/status/${applicationId}/update`, data, {
      headers: { "Content-Type": "application/json" },
    }),

  getExternalApplications: () =>
    apiClient.get("/api/v1/application/external"),

  createExternalApplication: (data) =>
    apiClient.post("/api/v1/application/external", data, {
      headers: { "Content-Type": "application/json" },
    }),

  updateExternalApplication: (id, data) =>
    apiClient.put(`/api/v1/application/external/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    }),

  deleteExternalApplication: (id) =>
    apiClient.delete(`/api/v1/application/external/${id}`),
};

export default applicationApi;
