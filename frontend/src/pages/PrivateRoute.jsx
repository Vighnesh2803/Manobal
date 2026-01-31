// file: frontend/src/pages/PrivateRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Session check using localStorage
    const userId = localStorage.getItem('manobal_user_id');
    const isAuthenticated = !!userId;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Renders the protected content (Dashboard/Layout)
    return children ? children : <Outlet />;
};

export default PrivateRoute;