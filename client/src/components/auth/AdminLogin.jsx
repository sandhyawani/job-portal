import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";

import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import authApi from "@/api/authApi";
import { setLoading, setUser } from "@/redux/authSlice";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const res = await authApi.login({ ...formData, role: "admin" });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/admin/dashboard");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.friendlyMessage || error.response?.data?.message || error.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === "admin" || user.role === "recruiter") {
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
          className="w-full max-w-md border border-slate-200 rounded-2xl sm:rounded-3xl shadow-md p-6 sm:p-7 bg-white relative overflow-hidden my-auto"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary-600"></div>
          
          <div className="flex flex-col items-center mb-5">
            <div className="bg-primary-50 p-2.5 rounded-2xl mb-2 border border-primary-100">
              <ShieldCheck className="text-primary-600 w-6 h-6" />
            </div>
            <h1 className="font-bold text-2xl text-slate-900 text-center tracking-tight">Admin Portal</h1>
            <p className="text-xs text-slate-500 mt-0.5">Authorized personnel login</p>
          </div>

          <div className="space-y-3.5">
            <div className="flex flex-col">
              <Label className="text-xs font-semibold text-slate-700 mb-1">Admin Email</Label>
              <Input
                type="email"
                value={formData.email}
                name="email"
                onChange={handleInputChange}
                placeholder="admin@example.com"
                className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm px-3 focus-visible:ring-primary-500"
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
                  placeholder="••••••••"
                  className="h-10 rounded-xl border-slate-200 text-xs sm:text-sm pl-3 pr-9 focus-visible:ring-primary-500"
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

            {loading ? (
              <Button className="w-full h-10 rounded-xl bg-primary-600 text-white font-semibold mt-3" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full h-10 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold mt-3 shadow-xs transition cursor-pointer">
                Access Admin Panel
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
