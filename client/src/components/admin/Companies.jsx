import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import MobileBottomNav from "../shared/MobileBottomNav";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";
import { Building2, Plus, Search } from "lucide-react";

const Companies = () => {
  useGetAllCompanies();

  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
              <Building2 size={14} /> Organization Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Manage Registered Companies
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Verify company profiles, configure trust credentials, and manage brand settings.
            </p>
          </div>

          <Button
            onClick={() => navigate("/admin/companies/create")}
            className="rounded-xl px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs self-start sm:self-auto gap-1.5"
          >
            <Plus size={16} /> Register Company
          </Button>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 max-w-md mb-6 p-2 rounded-2xl border border-slate-200 bg-white">
          <Search size={16} className="text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Search company by name..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full text-xs text-slate-900 bg-transparent outline-none"
          />
        </div>

        <CompaniesTable />
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default Companies;
