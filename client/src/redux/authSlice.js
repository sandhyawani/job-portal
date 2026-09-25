import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null
    },
    reducers:{
        // actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
        },
        setSavedJobs:(state, action) => {
            if (state.user) {
                state.user.savedJobs = action.payload;
            }
        }
    }
});
export const {setLoading, setUser, setSavedJobs} = authSlice.actions;
export default authSlice.reducer;