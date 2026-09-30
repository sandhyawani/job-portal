import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Companies from '../admin/Companies';
import AdminCompanies from './AdminCompanies';

const RoleBasedCompanies = () => {
    const { user } = useSelector(store => store.auth);

    if (user?.role === 'admin') {
        return <AdminCompanies />;
    } else if (user?.role === 'recruiter') {
        return <Companies />;
    } else {
        return <Navigate to="/" replace />;
    }
};

export default RoleBasedCompanies;
