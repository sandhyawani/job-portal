import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isHeroPage = location.pathname === "/"; 

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        isHeroPage
          ? "bg-transparent border-transparent text-white"
          : "bg-white border-gray-200 text-gray-800 shadow-md"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1
            className={`text-2xl font-extrabold drop-shadow-lg transition-colors duration-300 ${
              isHeroPage
                ? "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
                : "text-gray-900"
            }`}
          >
            Job<span className={isHeroPage ? "text-pink-500" : "text-pink-600"}>Portal</span>
          </h1>
        </Link>

        {/* Navigation Links */}
        <ul
          className={`hidden md:flex items-center gap-8 font-medium transition-colors duration-300 ${
            isHeroPage ? "text-white/80" : "text-gray-700"
          }`}
        >
          {user && user.role === "recruiter" ? (
            <>
              <li>
                <Link to="/admin/companies" className="hover:text-pink-400 transition-colors duration-300">
                  Companies
                </Link>
              </li>
              <li>
                <Link to="/admin/jobs" className="hover:text-pink-400 transition-colors duration-300">
                  Jobs
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/" className="hover:text-pink-400 transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-pink-400 transition-colors duration-300">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-pink-400 transition-colors duration-300">
                  Browse
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Auth / Profile */}
        {!user ? (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button
                className={`rounded-full px-5 py-2 shadow-md transition-colors duration-300 ${
                  isHeroPage
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                    : "bg-pink-500 text-white hover:bg-pink-600"
                }`}
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                className={`rounded-full px-5 py-2 shadow-md transition-colors duration-300 ${
                  isHeroPage
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                    : "bg-pink-500 text-white hover:bg-pink-600"
                }`}
              >
                Signup
              </Button>
            </Link>
          </div>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Avatar
                className={`cursor-pointer ring-2 hover:ring-purple-400 transition-all shadow-sm ${
                  isHeroPage ? "ring-white/60" : "ring-pink-400"
                }`}
              >
                <AvatarImage
                  src={user?.profile?.profilePhoto || "/default-avatar.png"}
                  alt={user?.fullname || "Profile"}
                />
              </Avatar>
            </PopoverTrigger>
            <PopoverContent
              className={`w-72 rounded-2xl p-4 shadow-xl border transition-colors duration-300 ${
                isHeroPage
                  ? "bg-white/20 backdrop-blur-lg border-white/20 text-white"
                  : "bg-white border-gray-200 text-gray-900"
              }`}
            >
              <div className="flex gap-3 items-center">
                <Avatar className="h-12 w-12 ring-2 ring-purple-300">
                  <AvatarImage
                    src={user?.profile?.profilePhoto || "/default-avatar.png"}
                    alt={user?.fullname || "Profile"}
                  />
                </Avatar>
                <h4 className="font-semibold text-lg uppercase">{user?.fullname}</h4>
              </div>

              <div className="flex flex-col mt-4 space-y-2">
                {user?.role === "student" && (
                  <Link
                    to="/profile"
                    className={`flex w-fit items-center gap-2 cursor-pointer transition-colors duration-300 ${
                      isHeroPage ? "hover:text-pink-500" : "hover:text-pink-600"
                    }`}
                  >
                    <User2 size={18} />
                    View Profile
                  </Link>
                )}
                <div
                  onClick={logoutHandler}
                  className={`flex w-fit items-center gap-2 cursor-pointer transition-colors duration-300 ${
                    isHeroPage ? "hover:text-pink-500" : "hover:text-pink-600"
                  }`}
                >
                  <LogOut size={18} />
                  Logout
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
