import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const PostJob = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });

  // Load job details when editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `${JOB_API_END_POINT}/get/${id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          const job = res.data.job;
          setInput({
            title: job.title,
            description: job.description,
            requirements: job.requirements.join(", "),
            salary: job.salary,
            location: job.location,
            jobType: job.jobType,
            experience: job.experienceLevel,
            position: job.position,
            companyId: job.company._id,
          });
        }
      } catch {
        toast.error("Failed to load job details");
      }
    };

    fetchJob();
  }, [id, isEditMode]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );

    if (selectedCompany) {
      setInput({ ...input, companyId: selectedCompany._id });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const url = isEditMode
        ? `${JOB_API_END_POINT}/update/${id}`
        : `${JOB_API_END_POINT}/post`;

      const method = isEditMode ? "put" : "post";

      const res = await axios[method](url, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="pt-28 pb-16 flex justify-center px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Page title */}
          <h1 className="text-3xl font-extrabold text-center text-pink-500 mb-8">
            {isEditMode ? "Update Job" : "Post New Job"}
          </h1>

          {/* Job form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              ["title", "Title"],
              ["description", "Description"],
              ["requirements", "Requirements"],
              ["salary", "Salary"],
              ["location", "Location"],
              ["jobType", "Job Type"],
              ["experience", "Experience Level"],
            ].map(([name, label]) => (
              <div key={name}>
                <Label>{label}</Label>
                <Input
                  name={name}
                  value={input[name]}
                  onChange={changeEventHandler}
                  className="mt-2"
                />
              </div>
            ))}

            <div>
              <Label>No of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="mt-2"
              />
            </div>

            {/* Company selection create mode only*/}
            {!isEditMode && companies.length > 0 && (
              <div className="md:col-span-2">
                <Label>Select Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="mt-2 rounded-lg">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    sideOffset={6}
                    className="z-[9999] bg-white rounded-xl shadow-xl"
                  >
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-12">
            <Button
              type="submit"
              disabled={loading}
              className="
                px-12 py-3 font-semibold rounded-xl
                text-white shadow-xl transition-all duration-300
                bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600
                hover:shadow-2xl hover:scale-105
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Please wait
                </span>
              ) : isEditMode ? (
                "Update Job"
              ) : (
                "Post Job"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
