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
  const [companyName, setCompanyName] = useState(""); // input field state
  const [loading, setLoading] = useState(false); // button loading state
  const dispatch = useDispatch();

  // function to register new company
  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Company name is required!");
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

      // if api call success → save company in redux and redirect to edit page
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);

        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navbar on top */}
      <Navbar />

      {/* page content wrapper */}
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        {/* heading + subtitle */}
        <div className="mb-10 text-center">
          <h1 className="font-extrabold text-3xl md:text-4xl tracking-tight text-gray-900">
            Create Your Company
          </h1>
          <p className="text-gray-500 mt-3 text-base max-w-lg mx-auto">
            Give your company a unique identity.  
            You can update this anytime later in settings.
          </p>
        </div>

        {/* form card */}
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-gray-100">
          {/* input field */}
          <div className="mb-6">
            <Label className="text-gray-700 font-medium">Company Name</Label>
            <Input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. JobHunt, Microsoft"
              className="mt-2 rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            />
          </div>

          {/* buttons row */}
          <div className="flex justify-end gap-4 mt-10">
            {/* cancel just goes back to company list */}
            <Button
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              className="rounded-xl px-6 hover:bg-gray-100"
            >
              Cancel
            </Button>

            {/* continue button → disabled if loading or input empty */}
            <Button
              disabled={loading || !companyName.trim()}
              onClick={registerNewCompany}
              className="rounded-xl px-6 font-semibold text-white shadow-lg 
                         bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                         hover:scale-105 hover:shadow-xl transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Continue →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
