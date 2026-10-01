import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '@/utils/constant';
import { Users, Briefcase, FileText, CheckSquare, Activity } from 'lucide-react';
import Navbar from '../shared/Navbar';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${ADMIN_API_END_POINT}/stats`, { withCredentials: true });
                if (res.data.success) {
                    setStats(res.data.stats);
                    setRecentActivity(res.data.recentActivity);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Users</p>
                                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                                <Users size={24} />
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Recruiters</p>
                                <p className="text-3xl font-bold mt-2">{stats.totalRecruiters}</p>
                            </div>
                            <div className="p-3 bg-green-50 text-green-600 rounded-full">
                                <Users size={24} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Jobs</p>
                                <p className="text-3xl font-bold mt-2">{stats.totalJobs}</p>
                            </div>
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                                <Briefcase size={24} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Applications</p>
                                <p className="text-3xl font-bold mt-2">{stats.totalApplications}</p>
                            </div>
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
                                <FileText size={24} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Interview Questions</p>
                                <p className="text-3xl font-bold mt-2">{stats.totalInterviewQuestions}</p>
                            </div>
                            <div className="p-3 bg-teal-50 text-teal-600 rounded-full">
                                <CheckSquare size={24} />
                            </div>
                        </div>
                    </div>
                )}

                {recentActivity && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Users */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Activity className="mr-2" size={20} /> Recent Users
                            </h2>
                            <ul className="divide-y divide-gray-100">
                                {recentActivity.recentUsers.map(user => (
                                    <li key={user._id} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{user.fullname}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{user.role}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recent Jobs */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Briefcase className="mr-2" size={20} /> Recent Jobs
                            </h2>
                            <ul className="divide-y divide-gray-100">
                                {recentActivity.recentJobs.map(job => (
                                    <li key={job._id} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{job.title}</p>
                                            <p className="text-sm text-gray-500">{job.company?.name}</p>
                                        </div>
                                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">{job.jobType}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
