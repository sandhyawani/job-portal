import { createSlice } from "@reduxjs/toolkit";

const initialFilters = {
  keyword: "",
  location: "All",
  workMode: "All",
  jobType: "All",
  experience: "All",
  salaryMin: "",
  salaryMax: "",
  datePosted: "all",
  sort: "newest",
};

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    similarJobs: [],
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
    savedJobs: [],
    filters: initialFilters,
    pagination: {
      totalJobs: 0,
      currentPage: 1,
      totalPages: 1,
    },
    loading: false,
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload || [];
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload || null;
    },
    setSimilarJobs: (state, action) => {
      state.similarJobs = action.payload || [];
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload || [];
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload || "";
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload || [];
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload || "";
      state.filters.keyword = action.payload || "";
    },
    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload || [];
    },
    toggleSavedJobInState: (state, action) => {
      const jobId = action.payload;
      const index = state.savedJobs.findIndex(
        (item) => (item._id || item) === jobId
      );
      if (index > -1) {
        state.savedJobs.splice(index, 1);
      } else {
        state.savedJobs.push(jobId);
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = { ...initialFilters };
      state.searchedQuery = "";
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setJobLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setSimilarJobs,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setSavedJobs,
  toggleSavedJobInState,
  setFilters,
  resetFilters,
  setPagination,
  setJobLoading,
} = jobSlice.actions;

export default jobSlice.reducer;
