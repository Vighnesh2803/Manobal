// file: frontend/src/pages/PrivateRoute.jsx (CORRECTED)

import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    
    // CRITICAL FIX: Use the correct key, 'manobal_user_id', which is saved in Login.jsx.
    const userId = localStorage.getItem('manobal_user_id'); 

    // If the user ID exists (meaning they are logged in), render the requested child component (e.g., Dashboard, AI Detector).
    if (userId) {
        return children;
    }

    // If there's no user ID, redirect them to the login page.
    // Using `replace` is good practice to prevent going back to the protected route via the browser's back button.
    return <Navigate to="/login" replace />;
};

export default PrivateRoute;