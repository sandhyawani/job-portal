import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import authApi from "@/api/authApi";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2, Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
    file: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (input.password !== input.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (input.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!input.role) {
      toast.error("Please select a role");
      return;
    }

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
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-16 pb-8 px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-xl border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-md bg-white my-auto"
        >
          <div className="text-center mb-4">
            <h1 className="font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-xs text-slate-500 mt-1">Join JobPortal to discover opportunities or hire talent</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Full Name */}
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1">Full Name</Label>
              <Input
                type="text"
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                placeholder="John Doe"
                className="h-9 sm:h-10 rounded-xl border-slate-200 text-xs sm:text-sm px-3"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1">Email</Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="john.doe@example.com"
                className="h-9 sm:h-10 rounded-xl border-slate-200 text-xs sm:text-sm px-3"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1">Phone Number</Label>
              <Input
                type="text"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                placeholder="8080808080"
                className="h-9 sm:h-10 rounded-xl border-slate-200 text-xs sm:text-sm px-3"
                required
              />
            </div>

            {/* Role */}
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1">Select Role</Label>
              <div className="flex items-center justify-around h-9 sm:h-10 px-3 border border-slate-200 rounded-xl bg-slate-50/50">
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                    className="w-3.5 h-3.5 cursor-pointer text-primary-600 accent-primary-600"
                    required
                  />
                  <span>Student</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                    className="w-3.5 h-3.5 cursor-pointer text-primary-600 accent-primary-600"
                    required
                  />
                  <span>Recruiter</span>
                </label>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="Enter password"
                  className="h-9 sm:h-10 rounded-xl border-slate-200 text-xs sm:text-sm pl-3 pr-9"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1">Confirm Password</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={input.confirmPassword}
                  onChange={changeEventHandler}
                  placeholder="Confirm password"
                  className="h-9 sm:h-10 rounded-xl border-slate-200 text-xs sm:text-sm pl-3 pr-9"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div className="flex flex-col sm:col-span-2">
              <Label className="text-xs font-semibold text-slate-700 mb-1">Profile Photo (Optional)</Label>
              <Input
                type="file"
                accept="image/*,application/pdf"
                onChange={changeFileHandler}
                className="cursor-pointer h-9 sm:h-10 rounded-xl border-slate-200 text-xs file:mr-2 file:py-0.5 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700"
              />
            </div>
          </div>

          {/* Submit Button */}
          {loading ? (
            <Button className="w-full mt-4 h-9 sm:h-10 flex items-center justify-center rounded-xl bg-primary-600 text-white font-semibold text-sm" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-4 h-9 sm:h-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-xs transition cursor-pointer"
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
