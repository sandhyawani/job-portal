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

const CompanySetup = () => {
  const params = useParams(); // get company id from url
  useGetCompanyById(params.id); // fetch company details using id
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const { singleCompany } = useSelector((store) => store.company); // get company details from redux
  const [loading, setLoading] = useState(false); // button loader
  const navigate = useNavigate();

  // handle text input fields
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // handle file input (logo)
  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  // submit form
  const submitHandler = async (e) => {
    e.preventDefault();

    // create formData to send text + file together
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true); // show loader
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message); // success message
        navigate("/admin/companies"); // go back to companies page
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message); // error message
    } finally {
      setLoading(false); // hide loader
    }
  };

  // when company details load → set them in form
  useEffect(() => {
    setInput({
      name: singleCompany.name || "",
      description: singleCompany.description || "",
      website: singleCompany.website || "",
      location: singleCompany.location || "",
      file: singleCompany.file || null,
    });
  }, [singleCompany]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-12">
        {/* header with back button */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            onClick={() => navigate("/admin/companies")}
            variant="outline"
            className="rounded-xl flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </Button>
          <h1 className="font-extrabold text-2xl text-gray-900">
            Company Setup
          </h1>
        </div>

        {/* form to update company */}
        <form
          onSubmit={submitHandler}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-700">Company Name</Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
                className="mt-2 rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <Label className="text-gray-700">Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="mt-2 rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <Label className="text-gray-700">Website</Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
                className="mt-2 rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <Label className="text-gray-700">Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="mt-2 rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <Label className="text-gray-700">Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="mt-2 rounded-xl border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* submit button */}
          <div className="mt-10">
            {loading ? (
              <Button
                disabled
                className="w-full rounded-xl py-3 font-semibold flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <Loader2 className="h-5 w-5 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full rounded-xl py-3 font-semibold text-white shadow-lg 
                           bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                           hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
              >
                Update Company →
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
