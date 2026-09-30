import React from 'react';
import { useSelector } from 'react-redux';
import RecruiterDashboard from '../admin/RecruiterDashboard';
import AdminDashboard from './AdminDashboard';

const RoleBasedDashboard = () => {
    const { user } = useSelector(store => store.auth);

    if (user?.role === 'admin') {
        return <AdminDashboard />;
    }

    // Default to recruiter dashboard since ProtectedRoute handles auth
    return <RecruiterDashboard />;
};

export default RoleBasedDashboard;
