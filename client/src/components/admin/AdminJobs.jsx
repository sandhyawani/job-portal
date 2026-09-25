import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";
import { Briefcase, Users, Building2, Plus } from "lucide-react";

const AdminJobs = () => {
  // Fetch all jobs created by admin
  useGetAllAdminJobs();

  const { allAdminJobs } = useSelector((store) => store.job);
  const totalJobs = allAdminJobs?.length || 0;
  const totalApplicants = allAdminJobs?.reduce((acc, job) => acc + (job.applications?.length || 0), 0) || 0;
  const totalCompanies = new Set(allAdminJobs?.map((j) => j?.company?._id || j?.company?.name).filter(Boolean)).size;

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
      <Navbar />

      {/* page content */}
      <div className="relative z-10 max-w-6xl mx-auto pt-24 sm:pt-28 pb-16 px-4 sm:px-6">
        
        {/* Metric summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">Total Jobs Posted</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalJobs}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">Total Applications</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalApplicants}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-500">Registered Companies</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalCompanies}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search and create job actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <Input
            className="w-full sm:w-80 rounded-xl shadow-sm border-gray-200 focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Filter by name or role"
            onChange={(e) => setInput(e.target.value)}
          />

          <Button
            onClick={() => navigate("/admin/jobs/create")}
            className="w-full sm:w-auto rounded-xl px-6 py-2.5 font-semibold text-white shadow-md 
                       bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                       hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Post New Job
          </Button>
        </div>

        {/* Jobs list */}
        <div className="bg-white/80 backdrop-blur-lg shadow-md rounded-2xl p-4 sm:p-6 border border-gray-100">
          <AdminJobsTable />
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
