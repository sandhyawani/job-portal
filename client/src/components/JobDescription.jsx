import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar'

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = {
                    ...singleJob,
                    applications: [...singleJob.applications, { applicant: user?._id }]
                };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Application failed');
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <div className="max-w-6xl mx-auto mt-24 px-6">
            <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200 p-8 hover:shadow-3xl transition-all duration-300">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-0 mb-10">
                    <div className="flex-1">
                        <h1 className="font-extrabold text-3xl md:text-4xl text-gray-900 tracking-tight">
                            {singleJob?.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 mt-5">
                            <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 font-semibold shadow-sm px-3 py-1">
                                {singleJob?.postion} Positions
                            </Badge>
                            <Badge className="bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 font-semibold shadow-sm px-3 py-1">
                                {singleJob?.jobType}
                            </Badge>
                            <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 font-semibold shadow-sm px-3 py-1">
                                {singleJob?.salary} LPA
                            </Badge>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <Button
                            onClick={isApplied ? null : applyJobHandler}
                            disabled={isApplied}
                            className={`rounded-xl px-7 py-3 text-white font-semibold shadow-lg transition-transform duration-300 ${isApplied
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 hover:shadow-xl"
                                }`}
                        >
                            {isApplied ? "Already Applied" : "Apply Now"}
                        </Button>
                    </div>
                </div>

                {/* Job Details */}
                <h2 className="border-b-2 border-gray-200 font-semibold py-3 text-xl text-gray-900 mb-6">
                    Job Description
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
                    <Detail label="Role" value={singleJob?.title} />
                    <Detail label="Location" value={singleJob?.location} />
                    <Detail label="Description" value={singleJob?.description} />
                    <Detail label="Experience" value={`${singleJob?.experienceLevel} `} />
                    <Detail label="Salary" value={`${singleJob?.salary} `} />
                    <Detail label="Total Applicants" value={singleJob?.applications?.length || 0} />
                    <Detail label="Posted Date" value={singleJob?.createdAt?.split("T")[0]} />
                </div>
            </div>
        </div>
    )
}

// Reusable Detail Component
const Detail = ({ label, value }) => (
    <div className="bg-gray-50/80 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
    </div>
)

export default JobDescription
