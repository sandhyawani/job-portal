import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applicants: null,
    externalApplications: [],
    loading: false,
  },
  reducers: {
    setAllApplicants: (state, action) => {
      state.applicants = action.payload;
    },
    setExternalApplications: (state, action) => {
      state.externalApplications = action.payload || [];
    },
    addExternalApplication: (state, action) => {
      state.externalApplications.unshift(action.payload);
    },
    updateExternalApplicationInState: (state, action) => {
      const updated = action.payload;
      const index = state.externalApplications.findIndex(
        (app) => app._id === updated._id
      );
      if (index > -1) {
        state.externalApplications[index] = updated;
      }
    },
    removeExternalApplicationFromState: (state, action) => {
      const id = action.payload;
      state.externalApplications = state.externalApplications.filter(
        (app) => app._id !== id
      );
    },
    setApplicationLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setAllApplicants,
  setExternalApplications,
  addExternalApplication,
  updateExternalApplicationInState,
  removeExternalApplicationFromState,
  setApplicationLoading,
} = applicationSlice.actions;

export default applicationSlice.reducer;