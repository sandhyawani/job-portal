import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '@/utils/constant';
import Navbar from '../shared/Navbar';
import { Search, Edit, Trash2, Shield, User, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters and pagination
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        fullname: '',
        phoneNumber: '',
        role: 'student',
        isActive: true
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, limit: 10 });
            if (search) params.append('search', search);
            if (role) params.append('role', role);

            const res = await axios.get(`${ADMIN_API_END_POINT}/users?${params.toString()}`, { withCredentials: true });
            if (res.data.success) {
                setUsers(res.data.users);
                setTotalPages(res.data.totalPages);
                setTotalUsers(res.data.totalUsers);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, role, page]);

    const handleInputChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: inputType === 'checkbox' ? checked : value
        }));
    };

    const handleOpenModal = (user) => {
        setEditingUser(user);
        setFormData({
            fullname: user.fullname,
            phoneNumber: user.phoneNumber,
            role: user.role,
            isActive: user.isActive !== false // defaults to true if undefined
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${ADMIN_API_END_POINT}/users/${editingUser._id}`, formData, { withCredentials: true });
            if (res.data.success) {
                toast.success('User updated successfully');
                fetchUsers();
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update user');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to completely delete this user? This cannot be undone. Consider deactivating them instead.')) return;
        try {
            const res = await axios.delete(`${ADMIN_API_END_POINT}/users/${id}`, { withCredentials: true });
            if (res.data.success) {
                toast.success('User deleted successfully');
                if (users.length === 1 && page > 1) {
                    setPage(page - 1);
                } else {
                    fetchUsers();
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleToggleActive = async (user) => {
        try {
            const res = await axios.put(`${ADMIN_API_END_POINT}/users/${user._id}`, { isActive: !user.isActive }, { withCredentials: true });
            if (res.data.success) {
                toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
                fetchUsers();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update user status');
        }
    };

    const getRoleIcon = (roleName) => {
        switch (roleName) {
            case 'admin': return <Shield size={16} className="text-purple-600 mr-1" />;
            case 'recruiter': return <Briefcase size={16} className="text-blue-600 mr-1" />;
            default: return <User size={16} className="text-gray-600 mr-1" />;
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Users Management</h1>
                        <p className="text-gray-500 mt-1">Total Users: {totalUsers}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
                    <div className="relative flex-grow min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Search users by name or email..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                    <select className="border rounded-md px-4 py-2" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
                        <option value="">All Roles</option>
                        <option value="student">Student</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading users...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map(u => (
                                        <tr key={u._id}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{u.fullname}</div>
                                                        <div className="text-sm text-gray-500">{u.email}</div>
                                                        <div className="text-xs text-gray-400 mt-0.5">{u.phoneNumber}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="flex items-center text-sm font-medium">
                                                    {getRoleIcon(u.role)}
                                                    <span className="capitalize">{u.role}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button onClick={() => handleToggleActive(u)} className="flex items-center hover:opacity-80 transition" title={u.isActive !== false ? "Click to deactivate" : "Click to activate"}>
                                                    {u.isActive !== false ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <CheckCircle size={14} className="mr-1" /> Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            <XCircle size={14} className="mr-1" /> Inactive
                                                        </span>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleOpenModal(u)} className="text-primary-600 hover:text-primary-900 mr-4 p-1">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:text-red-900 p-1">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                                                No users found.
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
                                            Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(page * 10, totalUsers)}</span> of <span className="font-medium">{totalUsers}</span> results
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
                                    Edit User
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                                        <input type="text" name="fullname" required value={formData.fullname} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                                        <input type="text" name="phoneNumber" required value={formData.phoneNumber} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Role</label>
                                        <select name="role" value={formData.role} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                                            <option value="student">Student</option>
                                            <option value="recruiter">Recruiter</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleInputChange} className="h-4 w-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
                                        <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-slate-700">Account Active (can login)</label>
                                    </div>
                                </div>
                                <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500">
                                    Note: Password and Email cannot be changed here. The user must use standard account recovery options.
                                </div>
                            </div>
                            <div className="bg-slate-50 px-6 py-4 sm:flex sm:flex-row-reverse gap-3 border-t border-slate-200 rounded-b-2xl">
                                <button type="submit" className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-5 py-2.5 bg-primary-600 text-sm font-semibold text-white hover:bg-primary-700 transition shadow-xs cursor-pointer">
                                    Save Changes
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto mt-2 sm:mt-0 inline-flex justify-center rounded-xl border border-slate-300 px-4 py-2.5 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
