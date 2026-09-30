import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import MobileBottomNav from "../shared/MobileBottomNav";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";
import { Briefcase, Plus, Search } from "lucide-react";

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold mb-2">
              <Briefcase size={14} /> Recruiter Operations
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Manage Job Postings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Search roles, manage candidate application pipelines, and update job details.
            </p>
          </div>

          <Button
            onClick={() => navigate("/admin/jobs/create")}
            className="rounded-xl px-4 py-2 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-xs self-start sm:self-auto gap-1.5"
          >
            <Plus size={16} /> Post New Job
          </Button>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 max-w-md mb-6 p-2 rounded-2xl border border-slate-200 bg-white">
          <Search size={16} className="text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full text-xs text-slate-900 bg-transparent outline-none"
          />
        </div>

        <AdminJobsTable />
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default AdminJobs;
