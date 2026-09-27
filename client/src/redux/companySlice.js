import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "company",
  initialState: {
    singleCompany: null,
    companies: [],
    publicCompanies: [],
    searchCompanyByText: "",
  },
  reducers: {
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload || [];
    },
    setPublicCompanies: (state, action) => {
      state.publicCompanies = action.payload || [];
    },
    setSearchCompanyByText: (state, action) => {
      state.searchCompanyByText = action.payload;
    },
  },
});

export const {
  setSingleCompany,
  setCompanies,
  setPublicCompanies,
  setSearchCompanyByText,
} = companySlice.actions;

export default companySlice.reducer;