import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { toast } from "sonner";
import { setUser } from "../redux/authSlice";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    location: "",
    skills: "",
    experience: "",
    education: "",
    github: "",
    portfolio: "",
    expectedSalary: "",
    preferredWorkMode: "All",
    file: null,
  });

  useEffect(() => {
    if (user) {
      setInput({
        fullname: user.fullname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.profile?.bio || "",
        location: user.profile?.location || "",
        skills: user.profile?.skills?.join(", ") || "",
        experience: user.profile?.experience || "",
        education: user.profile?.education || "",
        github: user.profile?.github || "",
        portfolio: user.profile?.portfolio || "",
        expectedSalary: user.profile?.expectedSalary || "",
        preferredWorkMode: user.profile?.preferredWorkMode || "All",
        file: null,
      });
    }
  }, [user, open]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] || null });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("location", input.location);
    formData.append("skills", input.skills);
    formData.append("experience", input.experience);
    formData.append("education", input.education);
    formData.append("github", input.github);
    formData.append("portfolio", input.portfolio);
    formData.append("expectedSalary", input.expectedSalary);
    formData.append("preferredWorkMode", input.preferredWorkMode);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Edit Candidate Profile
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Update your profile details to improve job match accuracy and resume visibility.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-4 mt-2">
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Full Name *</Label>
              <Input
                name="fullname"
                type="text"
                required
                value={input.fullname}
                onChange={changeEventHandler}
                className="mt-1 text-xs rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">Email Address *</Label>
              <Input
                name="email"
                type="email"
                required
                value={input.email}
                onChange={changeEventHandler}
                className="mt-1 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Phone & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Phone Number *</Label>
              <Input
                name="phoneNumber"
                type="tel"
                required
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="mt-1 text-xs rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">City / Location</Label>
              <Input
                name="location"
                placeholder="e.g. Pune, India"
                value={input.location}
                onChange={changeEventHandler}
                className="mt-1 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Professional Bio */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">Professional Bio</Label>
            <textarea
              name="bio"
              rows={2}
              placeholder="Brief summary of your professional expertise and career interests..."
              value={input.bio}
              onChange={changeEventHandler}
              className="w-full mt-1 text-xs rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Skills (Comma-separated) */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">
              Technical Skills (comma-separated)
            </Label>
            <Input
              name="skills"
              placeholder="Python, React, Django, PostgreSQL, Git, Docker"
              value={input.skills}
              onChange={changeEventHandler}
              className="mt-1 text-xs rounded-xl"
            />
          </div>

          {/* Experience & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Experience Level</Label>
              <Input
                name="experience"
                placeholder="e.g. 2 years, Fresher, Senior"
                value={input.experience}
                onChange={changeEventHandler}
                className="mt-1 text-xs rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">Education Degree</Label>
              <Input
                name="education"
                placeholder="e.g. B.Tech Computer Science"
                value={input.education}
                onChange={changeEventHandler}
                className="mt-1 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* GitHub & Portfolio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700">GitHub Profile URL</Label>
              <Input
                name="github"
                placeholder="https://github.com/username"
                value={input.github}
                onChange={changeEventHandler}
                className="mt-1 text-xs rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">Portfolio / LinkedIn</Label>
              <Input
                name="portfolio"
                placeholder="https://linkedin.com/in/username"
                value={input.portfolio}
                onChange={changeEventHandler}
                className="mt-1 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Salary Expectations & Preferred Work Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Expected Salary (₹ LPA)
              </Label>
              <Input
                name="expectedSalary"
                type="number"
                placeholder="e.g. 8"
                value={input.expectedSalary}
                onChange={changeEventHandler}
                className="mt-1 text-xs rounded-xl"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Preferred Work Mode
              </Label>
              <select
                name="preferredWorkMode"
                value={input.preferredWorkMode}
                onChange={changeEventHandler}
                className="w-full mt-1 text-xs rounded-xl border border-slate-200 p-2 bg-white"
              >
                <option value="All">Flexible / Any</option>
                <option value="Remote">Remote Only</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <Label className="text-xs font-semibold text-slate-700">
              Upload Resume (PDF, DOC, DOCX - Max 5MB)
            </Label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={fileChangeHandler}
              className="mt-1 text-xs rounded-xl file:mr-3 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
