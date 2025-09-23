import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
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
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const PostJob = () => {
  // job form data
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

  const [loading, setLoading] = useState(false); // for button loader
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company); // company list from redux

  // update state when typing in input fields
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // when company is selected from dropdown
  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (c) => c.name.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };

  // submit form
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs"); // go back to jobs list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* navbar on top */}
      <div className="fixed top-0 left-0 w-full z-50 shadow-md bg-white">
        <Navbar />
      </div>

      {/* form container */}
      <div className="relative z-10 flex items-center justify-center w-full pt-32 pb-16 px-4 overflow-visible">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-4xl p-10 bg-white border border-gray-200 shadow-2xl rounded-3xl space-y-6 transition-all duration-500 hover:shadow-3xl"
        >
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 text-transparent bg-clip-text text-center mb-8">
            Post New Job
          </h1>

          {/* form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Title</Label>
              <Input
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                placeholder="Frontend Engineer"
                className="shadow-md focus:ring-2 focus:ring-purple-500 rounded-xl"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                placeholder="Job Description"
                className="shadow-md focus:ring-2 focus:ring-purple-500 rounded-xl"
              />
            </div>

            <div>
              <Label>Requirements</Label>
              <Input
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                placeholder="HTML, CSS, JS..."
                className="shadow-md focus:ring-2 focus:ring-purple-500 rounded-xl"
              />
            </div>

            <div>
              <Label>Salary</Label>
              <Input
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                placeholder="60000"
                className="shadow-md focus:ring-2 focus:ring-purple-500 rounded-xl"
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="Mumbai"
                className="shadow-md focus:ring-2 focus:ring-purple-500 rounded-xl"
              />
            </div>

            <div>
              <Label>Job Type</Label>
              <Input
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                placeholder="Full-Time"
                className="shadow-md focus:ring-2 focus:ring-purple-500 rounded-xl"
              />
            </div>

            <div>
              <Label>Experience Level</Label>
              <Input
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                placeholder="0-3"
                className="shadow-md focus:ring-2 focus:ring-purple-500 rounded-xl"
              />
            </div>

            <div>
              <Label>No of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="shadow-md focus:ring-2 focus:ring-purple-500 rounded-xl"
              />
            </div>

            {/* select company dropdown */}
            {companies.length > 0 && (
              <div className="md:col-span-2">
                <Label>Select Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-full rounded-xl shadow-md focus:ring-2 focus:ring-purple-500">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] bg-white shadow-xl rounded-xl overflow-hidden">
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company.name.toLowerCase()}
                          className="text-gray-900 hover:bg-purple-50"
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

          {/* submit button */}
          <div>
            {loading ? (
              <Button
                className="w-full py-3 flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 text-white rounded-xl shadow-lg"
                disabled
              >
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transform transition"
              >
                Post New Job
              </Button>
            )}
          </div>

          {/* if no company available */}
          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center mt-2">
              *Please register a company first before posting a job
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
