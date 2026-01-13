import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";

const Companies = () => {
  useGetAllCompanies();

  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-12">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Manage Companies
            </h1>
            <p className="text-gray-500 mt-1">
              View, search, and manage registered companies
            </p>
          </div>

          <Button
            onClick={() => navigate("/admin/companies/create")}
            className="rounded-xl px-6 py-3 font-semibold text-white shadow-lg 
                       bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                       hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            + New Company
          </Button>
        </div>

        {/* Search filter */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-10 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Input
              className="w-full md:w-96 rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-400"
              placeholder="Search company by name"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <p className="text-sm text-gray-500 italic">
              {input ? `Filtering by "${input}"` : "Showing all companies"}
            </p>
          </div>
        </div>

        {/* Companies table */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-100">
          <CompaniesTable />
        </div>
      </div>
    </div>
  );
};

export default Companies;
