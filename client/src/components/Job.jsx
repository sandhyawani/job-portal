import React from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const Job = ({ job }) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-pink-50 to-white border border-gray-100 
      hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out">

      {/* Top Row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">
          {job?.createdAt
            ? (daysAgoFunction(job.createdAt) === 0 ? 'Today' : `${daysAgoFunction(job.createdAt)} days ago`)
            : 'Recently'}
        </p>
        <Button variant="outline" className="rounded-full hover:bg-pink-50" size="icon">
          <Bookmark className="text-pink-500" />
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3 my-3">
        <Avatar className="w-14 h-14 border border-gray-200 shadow-sm">
          <AvatarImage src={job?.company?.logo || '/src/assets/logo.png'} alt={job?.company?.name} />
        </Avatar>
        <div>
          <h1 className="font-semibold text-lg text-gray-900">{job?.company?.name || 'Company Name'}</h1>
          <p className="text-sm text-gray-500">{job?.location || 'India'}</p>
        </div>
      </div>

      {/* Job Title & Description */}
      <div>
        <h1 className="font-bold text-xl text-gray-900 my-2">{job?.title || 'Job Title'}</h1>
        <p className="text-sm text-gray-600 line-clamp-3">
          {job?.description || 'Job description will appear here. Short summary of the role and requirements.'}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge className="bg-pink-100 text-pink-700 font-semibold">
          {job?.position || 1} Positions
        </Badge>
        <Badge className="bg-pink-200 text-pink-600 font-semibold">
          {job?.jobType || 'Full-Time'}
        </Badge>
        <Badge className="bg-pink-300 text-pink-700 font-semibold">
          {job?.salary || 'Not Disclosed'} LPA
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-6">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="border-pink-500 text-pink-500 hover:bg-pink-50 transition-all rounded-full px-5 flex-1"
        >
          View Details
        </Button>
        <Button className="rounded-full flex-1 px-5 bg-gradient-to-r from-pink-500 to-pink-700 
          hover:from-pink-600 hover:to-pink-800 text-white font-medium shadow-lg">
          Save For Later
        </Button>
      </div>
    </div>
  );
};

export default Job;
