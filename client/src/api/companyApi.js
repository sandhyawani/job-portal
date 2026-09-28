import apiClient from "./axios";

export const companyApi = {
  getPublicCompanies: () =>
    apiClient.get("/api/v1/company/public"),

  getCompanies: () =>
    apiClient.get("/api/v1/company"),

  getCompanyById: (id) =>
    apiClient.get(`/api/v1/company/${id}`),

  registerCompany: (data) =>
    apiClient.post("/api/v1/company/register", data, {
      headers: { "Content-Type": "application/json" },
    }),

  updateCompany: (id, formData) =>
    apiClient.put(`/api/v1/company/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default companyApi;
