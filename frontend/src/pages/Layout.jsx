// file: frontend/src/components/Layout.jsx (CREATE THIS NEW FILE)

import React from 'react';
import { Outlet } from 'react-router-dom'; 

// NOTE: Navbar is imported from the pages directory
import Navbar from '../pages/Navbar'; 

const Layout = () => {
    // Get username from local storage for the Navbar display
    const username = localStorage.getItem('manobal_username') || "User"; 

    return (
        <div className="flex flex-col min-h-screen bg-gray-950 text-white">
            <Navbar username={username} />
            <main className="flex-1 p-4 sm:p-8">
                {/* Outlet renders the specific protected page: Dashboard, MoodLog, ShareData, etc. */}
                <Outlet /> 
            </main>
        </div>
    );
};

export default Layout;