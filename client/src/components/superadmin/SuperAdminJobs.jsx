import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '@/utils/constant';
import Navbar from '../shared/Navbar';
import { Search, Edit, Trash2, Briefcase, MapPin, Users, Building2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const SuperAdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters and pagination
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [workMode, setWorkMode] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        salary: '',
        experienceLevel: '',
        location: '',
        jobType: '',
        workMode: 'On-site',
        position: '',
        status: 'active'
    });

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, limit: 10 });
            if (search) params.append('search', search);
            if (status) params.append('status', status);
            if (workMode) params.append('workMode', workMode);

            const res = await axios.get(`${ADMIN_API_END_POINT}/jobs?${params.toString()}`, { withCredentials: true });
            if (res.data.success) {
                setJobs(res.data.jobs);
                setTotalPages(res.data.totalPages);
                setTotalJobs(res.data.totalJobs);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [search, status, workMode, page]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOpenModal = (job) => {
        setEditingJob(job);
        setFormData({
            title: job.title || '',
            description: job.description || '',
            salary: job.salary || '',
            experienceLevel: job.experienceLevel || '',
            location: job.location || '',
            jobType: job.jobType || '',
            workMode: job.workMode || 'On-site',
            position: job.position || '',
            status: job.status || 'active'
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${ADMIN_API_END_POINT}/jobs/${editingJob._id}`, formData, { withCredentials: true });
            if (res.data.success) {
                toast.success('Job updated successfully');
                fetchJobs();
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update job');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to completely delete this job? If there are applications attached to it, the deletion will be rejected. Consider closing the job instead.')) return;
        try {
            const res = await axios.delete(`${ADMIN_API_END_POINT}/jobs/${id}`, { withCredentials: true });
            if (res.data.success) {
                toast.success('Job deleted successfully');
                if (jobs.length === 1 && page > 1) {
                    setPage(page - 1);
                } else {
                    fetchJobs();
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete job');
        }
    };

    const handleToggleStatus = async (job) => {
        try {
            const newStatus = job.status === 'active' ? 'closed' : 'active';
            const res = await axios.put(`${ADMIN_API_END_POINT}/jobs/${job._id}`, { status: newStatus }, { withCredentials: true });
            if (res.data.success) {
                toast.success(`Job ${newStatus === 'active' ? 'activated' : 'closed'}`);
                fetchJobs();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update job status');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Jobs Management</h1>
                        <p className="text-gray-500 mt-1">Total Jobs: {totalJobs}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-grow min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Search by job title or company name..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <select className="border rounded-md px-4 py-2" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                    </select>
                    <select className="border rounded-md px-4 py-2" value={workMode} onChange={(e) => { setWorkMode(e.target.value); setPage(1); }}>
                        <option value="">All Work Modes</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                    </select>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading jobs...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {jobs.map(job => (
                                        <tr key={job._id}>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">{job.title}</span>
                                                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                                                        <span className="flex items-center"><MapPin size={12} className="mr-1" />{job.location}</span>
                                                        <span className="flex items-center"><Briefcase size={12} className="mr-1" />{job.workMode}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {job.company ? (
                                                    <div className="flex items-center">
                                                        <Building2 size={16} className="text-gray-400 mr-2" />
                                                        <span className="text-sm text-gray-900">{job.company.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Unknown</span>
                                                )}
                                                {job.created_by && (
                                                    <div className="text-xs text-gray-500 mt-1">By: {job.created_by.fullname}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-sm text-gray-600">
                                                    <span className="flex items-center"><Users size={14} className="mr-1 text-primary-500" /> {job.applications?.length || 0} Apps</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button onClick={() => handleToggleStatus(job)} className="flex items-center hover:opacity-80 transition" title={job.status === 'active' ? "Click to close" : "Click to activate"}>
                                                    {job.status === 'active' ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <CheckCircle size={14} className="mr-1" /> Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            <XCircle size={14} className="mr-1" /> Closed
                                                        </span>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleOpenModal(job)} className="text-primary-600 hover:text-primary-900 mr-4 p-1">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(job._id)} className="text-red-600 hover:text-red-900 p-1">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {jobs.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                                                No jobs found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(page * 10, totalJobs)}</span> of <span className="font-medium">{totalJobs}</span> results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${page === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                disabled={page === totalPages}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${page === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                Next
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
                        </div>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
                            <form onSubmit={handleSave}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        Edit Job
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                            <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Location</label>
                                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Salary</label>
                                            <input type="number" name="salary" value={formData.salary} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Work Mode</label>
                                            <select name="workMode" value={formData.workMode} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                <option value="On-site">On-site</option>
                                                <option value="Hybrid">Hybrid</option>
                                                <option value="Remote">Remote</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <select name="status" value={formData.status} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                <option value="active">Active</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 bg-gray-50 border border-gray-100 p-3 rounded-md text-sm text-gray-600">
                                        Note: Company and Recruiter cannot be altered from this interface to preserve relational integrity.
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200 mt-2">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 sm:ml-3 sm:w-auto sm:text-sm">
                                        Save Changes
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminJobs;
