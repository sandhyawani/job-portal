import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import authApi from "@/api/authApi";
import { setLoading, setUser } from "@/redux/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await authApi.login(formData);
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        if (res.data.user?.role === "recruiter") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.friendlyMessage || error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === "recruiter") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-16 pb-8 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md border border-slate-200 rounded-2xl sm:rounded-3xl shadow-md p-6 sm:p-7 bg-white my-auto"
        >
          <div className="text-center mb-5">
            <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">Login</h1>
            <p className="text-xs text-slate-500 mt-1">Welcome back! Please enter your details</p>
          </div>

          <div className="space-y-3.5">
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1">Email</Label>
              <Input
                type="email"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
                placeholder="name@example.com"
                className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm px-3"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  name="password"
                  onChange={handleInputChange}
                  placeholder="••••••"
                  className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm pl-3 pr-9"
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

            <div className="flex flex-col pt-0.5">
              <Label className="text-xs font-semibold text-slate-700 mb-1.5">Select Role</Label>
              <RadioGroup className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === "student"}
                    onChange={handleInputChange}
                    className="w-4 h-4 cursor-pointer text-primary-600 accent-primary-600"
                  />
                  <span>Student</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={formData.role === "recruiter"}
                    onChange={handleInputChange}
                    className="w-4 h-4 cursor-pointer text-primary-600 accent-primary-600"
                  />
                  <span>Recruiter</span>
                </label>
              </RadioGroup>
            </div>

            {loading ? (
              <Button className="w-full h-10 rounded-xl bg-primary-600 text-white font-semibold mt-2" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-xs transition mt-2 cursor-pointer"
              >
                Sign In
              </Button>
            )}

            <p className="text-xs text-center text-slate-500 mt-3">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary-600 font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
