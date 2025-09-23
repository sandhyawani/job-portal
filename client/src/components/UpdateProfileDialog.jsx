import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    file: null,
  });

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);

    // ✅ Send skills properly (not JSON)
    input.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .forEach((skill) => {
        formData.append("skills[]", skill);
      });

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
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px] bg-white rounded-2xl shadow-lg border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Update Profile
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Make changes to your profile information here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-6">
          {/* Full Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="fullname"
              className="text-right font-medium text-gray-700"
            >
              Name
            </Label>
            <Input
              id="fullname"
              name="fullname"
              type="text"
              value={input.fullname}
              onChange={changeEventHandler}
              className="col-span-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="email"
              className="text-right font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={input.email}
              onChange={changeEventHandler}
              className="col-span-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Phone Number */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="phoneNumber"
              className="text-right font-medium text-gray-700"
            >
              Phone
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              className="col-span-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Bio */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="bio"
              className="text-right font-medium text-gray-700"
            >
              Bio
            </Label>
            <Input
              id="bio"
              name="bio"
              type="text"
              value={input.bio}
              onChange={changeEventHandler}
              className="col-span-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Skills */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="skills" className="text-right">
              Skills
            </Label>
            <Input
              id="skills"
              name="skills"
              value={input.skills}
              onChange={changeEventHandler}
              placeholder="e.g. HTML, CSS, JavaScript"
              className="col-span-3"
            />
          </div>

          {/* Resume Upload */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="file"
              className="text-right font-medium text-gray-700"
            >
              Resume
            </Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept="application/pdf"
              onChange={fileChangeHandler}
              className="col-span-3 rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-400 shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl shadow-md transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
