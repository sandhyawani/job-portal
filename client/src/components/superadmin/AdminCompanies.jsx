import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '@/utils/constant';
import Navbar from '../shared/Navbar';
import { Search, Edit, Trash2, Building2, MapPin, ExternalLink, Mail, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const AdminCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters and pagination
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCompanies, setTotalCompanies] = useState(0);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website: '',
        location: '',
        email: '',
        trustLevel: 'LOW'
    });

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, limit: 10 });
            if (search) params.append('search', search);

            const res = await axios.get(`${ADMIN_API_END_POINT}/companies?${params.toString()}`, { withCredentials: true });
            if (res.data.success) {
                setCompanies(res.data.companies);
                setTotalPages(res.data.totalPages);
                setTotalCompanies(res.data.totalCompanies);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [search, page]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOpenModal = (company) => {
        setEditingCompany(company);
        setFormData({
            name: company.name || '',
            description: company.description || '',
            website: company.website || '',
            location: company.location || '',
            email: company.email || '',
            trustLevel: company.trustLevel || 'LOW'
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${ADMIN_API_END_POINT}/companies/${editingCompany._id}`, formData, { withCredentials: true });
            if (res.data.success) {
                toast.success('Company updated successfully');
                fetchCompanies();
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update company');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to completely delete this company? This is a destructive action that requires deleting all associated jobs first.')) return;
        try {
            const res = await axios.delete(`${ADMIN_API_END_POINT}/companies/${id}`, { withCredentials: true });
            if (res.data.success) {
                toast.success('Company deleted successfully');
                if (companies.length === 1 && page > 1) {
                    setPage(page - 1);
                } else {
                    fetchCompanies();
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete company');
        }
    };

    const getTrustLevelBadge = (level) => {
        switch (level) {
            case 'HIGH': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">High Trust</span>;
            case 'MEDIUM': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Med Trust</span>;
            default: return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Low Trust</span>;
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Companies Management</h1>
                        <p className="text-gray-500 mt-1">Total Companies: {totalCompanies}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-grow min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Search companies by name..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading companies...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recruiter/Owner</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trust Level</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {companies.map(c => (
                                        <tr key={c._id}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {c.logo ? (
                                                        <img src={c.logo} alt="" className="w-10 h-10 rounded-full mr-3 border object-cover" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 border">
                                                            <Building2 size={20} className="text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{c.name}</div>
                                                        {c.location && (
                                                            <div className="text-xs text-gray-500 flex items-center mt-0.5">
                                                                <MapPin size={12} className="mr-1" /> {c.location}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {c.userId ? (
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{c.userId.fullname}</div>
                                                        <div className="text-xs text-gray-500">{c.userId.email}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Orphaned</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 text-sm text-gray-600">
                                                    {c.email && (
                                                        <a href={`mailto:${c.email}`} className="flex items-center hover:text-primary-600">
                                                            <Mail size={12} className="mr-1" /> {c.email}
                                                        </a>
                                                    )}
                                                    {c.website && (
                                                        <a href={c.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-primary-600">
                                                            <ExternalLink size={12} className="mr-1" /> Website
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getTrustLevelBadge(c.trustLevel)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleOpenModal(c)} className="text-primary-600 hover:text-primary-900 mr-4 p-1">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-900 p-1">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {companies.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                                                No companies found.
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
                                            Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(page * 10, totalCompanies)}</span> of <span className="font-medium">{totalCompanies}</span> results
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
                                        Edit Company
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
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
                                            <label className="block text-sm font-medium text-gray-700">Trust Level</label>
                                            <select name="trustLevel" value={formData.trustLevel} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                                <option value="LOW">LOW</option>
                                                <option value="MEDIUM">MEDIUM</option>
                                                <option value="HIGH">HIGH</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Website</label>
                                            <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Public Email</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 bg-yellow-50 border border-yellow-100 p-3 rounded-md text-sm text-yellow-800 flex items-start">
                                        <ShieldAlert size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                                        <div>
                                            Note: The active status toggles are not supported because the native Company schema does not use them. Changing the owner must be done directly through the database to prevent orphaned job errors.
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
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

export default AdminCompanies;
