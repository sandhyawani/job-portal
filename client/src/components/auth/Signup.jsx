import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import authApi from "@/api/authApi";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle input changes
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] || null });
  };

  // Submit form
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await authApi.register(formData);

      if (res.data.success) {
        toast.success(res.data.message || "Registered successfully!");
        navigate("/login");
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.friendlyMessage || error.response?.data?.message || error.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto pt-20 pb-8 px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg bg-white"
        >
          <h1 className="font-bold text-2xl sm:text-3xl mb-6 text-center text-slate-900 tracking-tight">Create Account</h1>

          <div className="flex flex-col space-y-3.5">
            {/* Full Name */}
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1.5">Full Name</Label>
              <Input
                type="text"
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                placeholder="John Doe"
                className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm px-3"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1.5">Email</Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="john.doe@example.com"
                className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm px-3"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1.5">Phone Number</Label>
              <Input
                type="text"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                placeholder="8080808080"
                className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm px-3"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1.5">Password</Label>
              <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="Enter password"
                className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm px-3"
                required
              />
            </div>

            {/* Role */}
            <div className="flex flex-col pt-1">
              <Label className="text-xs font-semibold text-slate-700 mb-2">Select Role</Label>
              <RadioGroup className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                    className="w-4 h-4 cursor-pointer text-primary-600 accent-primary-600"
                  />
                  <span>Student</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                    className="w-4 h-4 cursor-pointer text-primary-600 accent-primary-600"
                  />
                  <span>Recruiter</span>
                </label>
              </RadioGroup>
            </div>

            {/* File Upload */}
            <div className="flex flex-col pt-1">
              <Label className="text-xs font-semibold text-slate-700 mb-1.5">Profile Photo (Optional)</Label>
              <Input
                type="file"
                accept="image/*,application/pdf"
                onChange={changeFileHandler}
                className="cursor-pointer h-10 rounded-xl border-slate-200 text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700"
              />
            </div>
          </div>

          {/* Submit Button */}
          {loading ? (
            <Button className="w-full mt-5 h-10 flex items-center justify-center rounded-xl bg-primary-600 text-white font-semibold" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-5 h-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-xs transition"
            >
              Create Account
            </Button>
          )}

          <p className="text-xs text-center text-slate-500 mt-3">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
