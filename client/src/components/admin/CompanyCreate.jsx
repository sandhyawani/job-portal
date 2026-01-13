import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);

        navigate(`/admin/companies/${res.data.company._id}`);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to create company"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        {/* Page heading */}
        <div className="mb-10 text-center">
          <h1 className="font-extrabold text-3xl md:text-4xl tracking-tight text-gray-900">
            Create Company
          </h1>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Add a company to start posting and managing jobs.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="mb-6">
            <Label className="text-gray-700 font-medium">Company Name</Label>
            <Input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. JobHunt, Microsoft"
              className="mt-2 rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <div className="flex justify-end gap-4 mt-10">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              className="rounded-xl px-6"
            >
              Cancel
            </Button>

            <Button
              disabled={loading || !companyName.trim()}
              onClick={registerNewCompany}
              className="rounded-xl px-6 font-semibold text-white shadow-lg 
                         bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                         hover:scale-105 hover:shadow-xl transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
