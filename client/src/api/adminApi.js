import apiClient from "./axios";

export const adminApi = {
  getStats: () => apiClient.get("/api/v1/admin/stats"),

  // Interview Questions
  getInterviewQuestions: (params) => apiClient.get("/api/v1/admin/interview-questions", { params }),
  addInterviewQuestion: (data) => apiClient.post("/api/v1/admin/interview-questions", data),
  updateInterviewQuestion: (id, data) => apiClient.put(`/api/v1/admin/interview-questions/${id}`, data),
  deleteInterviewQuestion: (id) => apiClient.delete(`/api/v1/admin/interview-questions/${id}`),

  // Users
  getUsers: (params) => apiClient.get("/api/v1/admin/users", { params }),
  getUserById: (id) => apiClient.get(`/api/v1/admin/users/${id}`),
  updateUser: (id, data) => apiClient.put(`/api/v1/admin/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/api/v1/admin/users/${id}`),

  // Recruiters
  getRecruiters: (params) => apiClient.get("/api/v1/admin/recruiters", { params }),
  getRecruiterById: (id) => apiClient.get(`/api/v1/admin/recruiters/${id}`),
  updateRecruiter: (id, data) => apiClient.put(`/api/v1/admin/recruiters/${id}`, data),
  deleteRecruiter: (id) => apiClient.delete(`/api/v1/admin/recruiters/${id}`),

  // Companies
  getCompanies: (params) => apiClient.get("/api/v1/admin/companies", { params }),
  getCompanyById: (id) => apiClient.get(`/api/v1/admin/companies/${id}`),
  updateCompany: (id, data) => apiClient.put(`/api/v1/admin/companies/${id}`, data),
  deleteCompany: (id) => apiClient.delete(`/api/v1/admin/companies/${id}`),

  // Jobs
  getJobs: (params) => apiClient.get("/api/v1/admin/jobs", { params }),
  getJobById: (id) => apiClient.get(`/api/v1/admin/jobs/${id}`),
  updateJob: (id, data) => apiClient.put(`/api/v1/admin/jobs/${id}`, data),
  deleteJob: (id) => apiClient.delete(`/api/v1/admin/jobs/${id}`),

  // Applications
  getApplications: (params) => apiClient.get("/api/v1/admin/applications", { params }),
  getApplicationById: (id) => apiClient.get(`/api/v1/admin/applications/${id}`),
  updateApplicationStatus: (id, data) => apiClient.put(`/api/v1/admin/applications/${id}`, data),
  deleteApplication: (id) => apiClient.delete(`/api/v1/admin/applications/${id}`),
};

export default adminApi;
