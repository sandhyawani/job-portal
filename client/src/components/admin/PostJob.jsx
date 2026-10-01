import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import MobileBottomNav from "../shared/MobileBottomNav";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import jobApi from "@/api/jobApi";
import { toast } from "sonner";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft, Briefcase, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";

const PostJob = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  useGetAllCompanies();
  const { companies = [] } = useSelector((store) => store.company);

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "Full-time",
    workMode: "On-site",
    experience: "1-3 years",
    position: 1,
    responsibilities: "",
    benefits: "",
    companyId: "",
  });

  // Default company selection for new job
  useEffect(() => {
    if (!isEditMode && companies.length > 0) {
      setInput((prev) => (prev.companyId ? prev : { ...prev, companyId: companies[0]._id }));
    }
  }, [isEditMode, companies]);

  // Load job details when editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchJob = async () => {
      try {
        const res = await jobApi.getJobById(id);

        if (res.data.success) {
          const job = res.data.job;
          setInput({
            title: job.title || "",
            description: job.description || "",
            requirements: (job.requirements || []).join(", "),
            salary: job.salary || "",
            location: job.location || "",
            jobType: job.jobType || "Full-time",
            workMode: job.workMode || "On-site",
            experience: job.experienceLevel || "1-3 years",
            position: job.position || 1,
            responsibilities: (job.responsibilities || []).join("\n"),
            benefits: (job.benefits || []).join(", "),
            companyId: job.company?._id || "",
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

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.title.trim() || !input.description.trim() || !input.companyId) {
      toast.error("Please fill in all required fields including selecting a company.");
      return;
    }

    if (Number(input.salary) <= 0) {
      toast.error("Salary must be a positive number.");
      return;
    }

    try {
      setLoading(true);

      const res = isEditMode
        ? await jobApi.updateJob(id, input)
        : await jobApi.postJob(input);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error?.friendlyMessage || error?.response?.data?.message || error?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-8">
      <Navbar />

      <main className="pt-20 pb-8 max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          to="/admin/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-600 mb-4 transition"
        >
          <ArrowLeft size={14} /> Back to Posted Jobs
        </Link>

        <form
          onSubmit={submitHandler}
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs"
        >
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isEditMode ? "Edit Job Posting" : "Publish New Job Opening"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Provide accurate job details, requirements, and compensation to attract the best candidates.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Title */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">Job Title *</Label>
              <Input
                name="title"
                required
                placeholder="e.g. Senior Full Stack Developer"
                value={input.title}
                onChange={changeEventHandler}
                className="mt-1 text-xs rounded-xl"
              />
            </div>

            {/* Select Company (if multiple or create mode) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs font-semibold text-slate-700">Hiring Company *</Label>
                <Link
                  to="/admin/companies/create"
                  className="text-xs font-semibold text-primary-600 hover:underline"
                >
                  + Create Company
                </Link>
              </div>

              {companies.length === 0 ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  You need to register a company before posting jobs.{" "}
                  <Link to="/admin/companies/create" className="font-bold underline">
                    Register company now
                  </Link>
                </div>
              ) : (
                <select
                  name="companyId"
                  value={input.companyId}
                  onChange={changeEventHandler}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white"
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Job Description */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Job Overview & Summary *
              </Label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Describe the role, day-to-day impact, and what success looks like..."
                value={input.description}
                onChange={changeEventHandler}
                className="w-full mt-1 text-xs rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Responsibilities */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Key Responsibilities (one per line)
              </Label>
              <textarea
                name="responsibilities"
                rows={3}
                placeholder="Architect scalable REST APIs&#10;Collaborate with product designers&#10;Conduct code reviews"
                value={input.responsibilities}
                onChange={changeEventHandler}
                className="w-full mt-1 text-xs rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Requirements / Skills */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Required Skills & Qualifications (comma-separated) *
              </Label>
              <Input
                name="requirements"
                required
                placeholder="Python, Django, PostgreSQL, Docker, AWS"
                value={input.requirements}
                onChange={changeEventHandler}
                className="mt-1 text-xs rounded-xl"
              />
            </div>

            {/* Salary & Open Positions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">
                  Annual Salary (₹ LPA) *
                </Label>
                <Input
                  name="salary"
                  type="number"
                  required
                  placeholder="e.g. 12"
                  value={input.salary}
                  onChange={changeEventHandler}
                  className="mt-1 text-xs rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">
                  Open Positions
                </Label>
                <Input
                  name="position"
                  type="number"
                  min="1"
                  value={input.position}
                  onChange={changeEventHandler}
                  className="mt-1 text-xs rounded-xl"
                />
              </div>
            </div>

            {/* Location & Work Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Location *</Label>
                <Input
                  name="location"
                  required
                  placeholder="e.g. Pune, India or Remote"
                  value={input.location}
                  onChange={changeEventHandler}
                  className="mt-1 text-xs rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">Work Mode</Label>
                <select
                  name="workMode"
                  value={input.workMode}
                  onChange={changeEventHandler}
                  className="w-full mt-1 text-xs rounded-xl border border-slate-200 p-2 bg-white"
                >
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            {/* Job Type & Experience Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Job Type</Label>
                <select
                  name="jobType"
                  value={input.jobType}
                  onChange={changeEventHandler}
                  className="w-full mt-1 text-xs rounded-xl border border-slate-200 p-2 bg-white"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">Experience</Label>
                <Input
                  name="experience"
                  placeholder="e.g. 1-3 years or Entry Level"
                  value={input.experience}
                  onChange={changeEventHandler}
                  className="mt-1 text-xs rounded-xl"
                />
              </div>
            </div>

            {/* Benefits */}
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Perks & Benefits (comma-separated)
              </Label>
              <Input
                name="benefits"
                placeholder="Health Insurance, Flexible Hours, Annual Bonus, Learning Allowance"
                value={input.benefits}
                onChange={changeEventHandler}
                className="mt-1 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/jobs")}
              className="text-xs rounded-xl px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || companies.length === 0}
              className="rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white px-8"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : isEditMode ? (
                "Update Job"
              ) : (
                "Publish Job"
              )}
            </Button>
          </div>
        </form>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default PostJob;
