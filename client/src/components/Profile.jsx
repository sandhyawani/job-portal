import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, User2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import SavedJobTable from "./SavedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";
import useGetSavedJobs from "../hooks/useGetSavedJobs";

const Profile = () => {
  useGetAppliedJobs();
  useGetSavedJobs();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("applied");
  const { user } = useSelector((store) => store.auth);

  const isResume = Boolean(user?.profile?.resume);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12 px-4">
      <Navbar />

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-xl mb-8 p-6 sm:p-8 transition-transform hover:-translate-y-1 duration-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <Avatar className="h-20 w-20 sm:h-28 sm:w-28 ring-4 ring-purple-300/30 shadow-lg shrink-0">
              {user?.profile?.profilePhoto && (
                <AvatarImage
                  src={user.profile.profilePhoto}
                  alt={user?.fullname || "Profile"}
                />
              )}
              <AvatarFallback className="bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-bold text-2xl sm:text-4xl flex items-center justify-center size-full">
                {user?.fullname ? user.fullname[0].toUpperCase() : "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 uppercase">
                {user?.fullname || "Unnamed User"}
              </h1>
              <p className="text-gray-500 mt-1">
                {user?.profile?.bio || "No bio added"}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="flex items-center gap-2 border-purple-500 text-purple-600 hover:bg-purple-50 hover:border-purple-600 transition-all"
          >
            <Pen size={16} /> Edit Profile
          </Button>
        </div>

        {/* Contact Info */}
        <div className="my-6 border-t pt-4 flex flex-col sm:flex-row gap-4 sm:gap-10">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail size={18} className="text-purple-500" />
            <span className="font-medium">{user?.email || "Not provided"}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Contact size={18} className="text-purple-500" />
            <span className="font-medium">{user?.phoneNumber || "Not provided"}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="my-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {user?.profile?.skills?.length
              ? user.profile.skills.map((skill, i) => (
                  <Badge
                    key={i}
                    className="bg-purple-100 text-purple-700 font-medium px-3 py-1 rounded-full shadow-sm"
                  >
                    {skill}
                  </Badge>
                ))
              : <span className="text-gray-400 italic">No skills added</span>}
          </div>
        </div>

        {/* Resume */}
        <div className="my-6">
          <Label className="text-md font-bold text-gray-800">Resume</Label>
          {isResume ? (
            <a
              target="_blank"
              rel="noreferrer"
              href={user?.profile?.resume}
              className="text-purple-600 block mt-1 font-medium hover:underline"
            >
              {user?.profile?.resumeOriginalName || "View Resume"}
            </a>
          ) : (
            <span className="text-gray-400 italic block mt-1">No resume uploaded</span>
          )}
        </div>
      </div>

      {/* Applied & Saved Jobs Section */}
      {user?.role === "student" && (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-6 mb-10 transition-transform hover:-translate-y-1 duration-200">
          <div className="flex items-center gap-6 border-b pb-3 mb-5">
            <button
              onClick={() => setActiveTab("applied")}
              className={`font-bold text-lg pb-2 transition-all ${
                activeTab === "applied"
                  ? "text-pink-600 border-b-2 border-pink-600 -mb-[13px]"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Applied Jobs
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`font-bold text-lg pb-2 transition-all ${
                activeTab === "saved"
                  ? "text-pink-600 border-b-2 border-pink-600 -mb-[13px]"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Saved Jobs
            </button>
          </div>

          {activeTab === "applied" ? <AppliedJobTable /> : <SavedJobTable />}
        </div>
      )}

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
