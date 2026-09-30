import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AdminJobs from '../admin/AdminJobs';
import SuperAdminJobs from './SuperAdminJobs';

const RoleBasedJobs = () => {
    const { user } = useSelector(store => store.auth);

    if (user?.role === 'admin') {
        return <SuperAdminJobs />;
    } else if (user?.role === 'recruiter') {
        return <AdminJobs />;
    } else {
        return <Navigate to="/" replace />;
    }
};

export default RoleBasedJobs;
