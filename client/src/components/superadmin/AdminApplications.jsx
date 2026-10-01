import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '@/utils/constant';
import Navbar from '../shared/Navbar';
import { Search, Edit, Trash2, FileText, CheckCircle, Clock, XCircle, Info, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import ResumeModal from '../shared/ResumeModal';

const AdminApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewingResume, setViewingResume] = useState(null);
    
    // Filters and pagination
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalApplications, setTotalApplications] = useState(0);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState(null);
    const [formData, setFormData] = useState({
        status: '',
        notes: '',
        interviewDate: ''
    });

    const ALLOWED_TRANSITIONS = {
        pending: ["review", "shortlisted", "rejected"],
        review: ["shortlisted", "interview", "rejected"],
        shortlisted: ["interview", "offer", "rejected"],
        interview: ["offer", "shortlisted", "rejected"],
        offer: ["hired", "rejected"],
        hired: ["rejected"],
        rejected: ["review", "pending"],
    };

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, limit: 10 });
            if (search) params.append('search', search);
            if (status) params.append('status', status);

            const res = await axios.get(`${ADMIN_API_END_POINT}/applications?${params.toString()}`, { withCredentials: true });
            if (res.data.success) {
                setApplications(res.data.applications);
                setTotalPages(res.data.totalPages);
                setTotalApplications(res.data.totalApplications);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [search, status, page]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOpenModal = (app) => {
        setEditingApp(app);
        setFormData({
            status: app.status || 'pending',
            notes: app.notes || '',
            interviewDate: app.interviewDate ? new Date(app.interviewDate).toISOString().split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${ADMIN_API_END_POINT}/applications/${editingApp._id}`, formData, { withCredentials: true });
            if (res.data.success) {
                toast.success('Application updated successfully');
                fetchApplications();
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update application');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('WARNING: Internal applications are permanent historical records. The backend blocks direct deletion. Proceeding will trigger the rejection response.')) return;
        try {
            const res = await axios.delete(`${ADMIN_API_END_POINT}/applications/${id}`, { withCredentials: true });
            if (res.data.success) {
                toast.success('Application deleted successfully');
                fetchApplications();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete application');
        }
    };

    const getStatusBadge = (s) => {
        switch (s) {
            case 'pending': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"><Clock size={12} className="mr-1" /> Pending</span>;
            case 'review': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"><Info size={12} className="mr-1" /> Review</span>;
            case 'shortlisted': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">Shortlisted</span>;
            case 'interview': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"><Calendar size={12} className="mr-1" /> Interview</span>;
            case 'offer': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Offer</span>;
            case 'hired': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1" /> Hired</span>;
            case 'rejected': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"><XCircle size={12} className="mr-1" /> Rejected</span>;
            default: return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{s}</span>;
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Applications Management</h1>
                        <p className="text-gray-500 mt-1">Total Applications: {totalApplications}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-grow min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Search applications by candidate name or email..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <select className="border rounded-md px-4 py-2" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="review">Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading applications...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job / Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {applications.map(app => (
                                        <tr key={app._id}>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">{app.applicant?.fullname || 'Unknown'}</span>
                                                    <span className="text-xs text-gray-500">{app.applicant?.email || 'No email'}</span>
                                                    {app.applicant?.profile?.resume && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setViewingResume({
                                                                url: app.applicant.profile.resume,
                                                                name: app.applicant.fullname,
                                                                originalName: app.applicant.profile.resumeOriginalName || `${app.applicant.fullname || 'Candidate'}_Resume.pdf`
                                                            })}
                                                            className="text-xs text-primary-600 hover:underline mt-1 flex items-center cursor-pointer"
                                                        >
                                                            <FileText size={12} className="mr-1" /> View Resume
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">{app.job?.title || 'Unknown Job'}</span>
                                                    <span className="text-xs text-gray-500">{app.job?.company?.name || 'Unknown Company'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(app.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleOpenModal(app)} className="text-primary-600 hover:text-primary-900 mr-4 p-1">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(app._id)} className="text-red-600 hover:text-red-900 p-1">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {applications.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                                                No applications found.
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
                                            Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(page * 10, totalApplications)}</span> of <span className="font-medium">{totalApplications}</span> results
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsModalOpen(false)}
                    />
                    
                    {/* Modal Dialog Content */}
                    <div className="relative z-10 bg-white rounded-2xl text-left shadow-2xl w-full max-w-lg border border-slate-200 max-h-[90vh] overflow-y-auto my-auto">
                        <form onSubmit={handleSave}>
                            <div className="bg-white px-6 pt-6 pb-5">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">
                                    Update Application Status
                                </h3>
                                
                                <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <p className="text-sm font-medium text-slate-700">Current Status: {getStatusBadge(editingApp?.status || 'pending')}</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">New Status</label>
                                        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                                            <option value="pending">Pending</option>
                                            <option value="review">Review</option>
                                            <option value="shortlisted">Shortlisted</option>
                                            <option value="interview">Interview</option>
                                            <option value="offer">Offer</option>
                                            <option value="hired">Hired</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        <p className="mt-1.5 text-xs text-slate-500">Allowed transitions from {editingApp?.status}: <span className="font-medium text-slate-700">{ALLOWED_TRANSITIONS[editingApp?.status]?.join(', ') || 'None'}</span></p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Admin Notes (Optional)</label>
                                        <textarea name="notes" rows={3} value={formData.notes} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Add a note to this transition..." />
                                    </div>
                                    {formData.status === 'interview' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Interview Date</label>
                                            <input type="date" name="interviewDate" value={formData.interviewDate} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                        </div>
                                    )}
                                </div>
                                
                            </div>
                            <div className="bg-slate-50 px-6 py-4 sm:flex sm:flex-row-reverse gap-3 border-t border-slate-200 rounded-b-2xl">
                                <button type="submit" className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-5 py-2.5 bg-primary-600 text-sm font-semibold text-white hover:bg-primary-700 transition shadow-xs cursor-pointer">
                                    Update Status
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto mt-2 sm:mt-0 inline-flex justify-center rounded-xl border border-slate-300 px-4 py-2.5 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ResumeModal
                open={Boolean(viewingResume)}
                onClose={() => setViewingResume(null)}
                resumeUrl={viewingResume?.url}
                candidateName={viewingResume?.name}
                originalName={viewingResume?.originalName}
            />
        </div>
    );
};

export default AdminApplications;
