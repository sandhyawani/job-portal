import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";

const AdminJobs = () => {
  // Fetch all jobs created by admin
  useGetAllAdminJobs();

  // Search input state
  const [input, setInput] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Sync search text with Redux store
  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      {/* navbar */}
      <div className="fixed top-0 left-0 w-full z-50 shadow-sm backdrop-blur-md bg-white/70">
        <Navbar />
      </div>

      {/* page content */}
      <div className="relative z-10 max-w-6xl mx-auto pt-28 pb-16 px-6">
        
        {/* Search and create job actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <Input
            className="w-full sm:w-80 rounded-xl shadow-sm border-gray-200 focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Filter by name or role"
            onChange={(e) => setInput(e.target.value)}
          />

          <Button
            onClick={() => navigate("/admin/jobs/create")}
            className="rounded-xl px-6 py-3 font-semibold text-white shadow-lg 
                       bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                       hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            + New Job
          </Button>
        </div>

        {/* Jobs list */}
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-gray-100">
          <AdminJobsTable />
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
