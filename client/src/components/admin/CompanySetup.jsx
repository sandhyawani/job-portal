import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";
import TrustPreview from "../TrustPreview";

const CompanySetup = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useGetCompanyById(id);

  const { singleCompany } = useSelector((store) => store.company);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    email: "",
    registrationNumber: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] || null });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    try {
      setLoading(true);

      const res = await axios.put(
        `${COMPANY_API_END_POINT}/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!singleCompany) return;

    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      email: singleCompany.email || "",
      registrationNumber: singleCompany.registrationNumber || "",
      file: null,
    });
  }, [singleCompany]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            onClick={() => navigate("/admin/companies")}
            variant="outline"
            className="rounded-xl flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back
          </Button>
          <h1 className="font-extrabold text-2xl">Company Setup</h1>
        </div>

        {/* Company update form */}
        <form
          onSubmit={submitHandler}
          className="bg-white rounded-2xl shadow-lg border p-8"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <InputField label="Company Name" name="name" value={input.name} onChange={changeEventHandler} />
            <InputField label="Description" name="description" value={input.description} onChange={changeEventHandler} />
            <InputField label="Website" name="website" value={input.website} onChange={changeEventHandler} />
            <InputField label="Location" name="location" value={input.location} onChange={changeEventHandler} />
            <InputField label="Official Email" name="email" value={input.email} onChange={changeEventHandler} />
            <InputField
              label="Registration Number (GST)"
              name="registrationNumber"
              value={input.registrationNumber}
              onChange={changeEventHandler}
            />

            <div>
              <Label>Logo</Label>
              <Input type="file" accept="image/*" onChange={changeFileHandler} />
            </div>
          </div>

          {/* Trust indicator */}
          <TrustPreview
            trustLevel={singleCompany?.trustLevel}
            trustScore={singleCompany?.trustScore}
          />

          <div className="mt-8">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Update Company"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <Label>{label}</Label>
    <Input className="mt-2" {...props} />
  </div>
);

export default CompanySetup;
