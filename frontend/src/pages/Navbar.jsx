// file: frontend/src/pages/Navbar.jsx (FINAL VERSION)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ username }) => {
    const navigate = useNavigate();
    
    // Check if the user is currently logged in (used for conditional rendering of links)
    const isAuthenticated = localStorage.getItem('manobal_user_id');

    const handleLogout = () => {
        // Clear both User ID and Username to completely log out the session
        localStorage.removeItem('manobal_user_id'); 
        localStorage.removeItem('manobal_username'); 
        
        // Redirect the user to the landing page
        navigate('/');
    };

    return (
        <nav className="bg-gray-900 bg-opacity-90 backdrop-blur-sm p-4 sticky top-0 z-50 shadow-xl">
            <div className="container mx-auto flex justify-between items-center">
                
                {/* 1. Logo and App Name (Links to Dashboard/Home) */}
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
                    <span className="text-3xl font-extrabold text-amber-400">Manobal</span>
                </Link>

                {/* 2. Primary Navigation Links (Visible only when logged in) */}
                {isAuthenticated && (
                    <div className="hidden md:flex space-x-6 text-gray-300 text-sm font-medium">
                        <Link to="/dashboard" className="hover:text-amber-400 transition-colors">Dashboard</Link>
                        
                        {/* AI-Driven Mood Log (Replaces old /moods) */}
                        <Link to="/moodlog" className="hover:text-amber-400 transition-colors">Mood Log</Link>
                        
                        {/* AI Analysis/Detector Page (View History) */}
                        <Link to="/aid" className="hover:text-amber-400 transition-colors">Analysis</Link>
                        
                        <Link to="/chatbot" className="hover:text-amber-400 transition-colors">Chat AI</Link>
                        
                        {/* Trusted Access Feature Link */}
                        <Link to="/access" className="hover:text-indigo-400 transition-colors font-semibold text-indigo-300">
                            Trusted Access
                        </Link>
                        
                        {/* Crisis Helpline Link */}
                        <Link to="/helpline" className="hover:text-red-400 font-bold text-red-500">HELPLINE 🆘</Link>
                    </div>
                )}
                
                {/* 3. User Info and Logout Button */}
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <span className="text-gray-300 font-medium hidden sm:inline">Hello, {username}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition duration-300 transform hover:scale-105"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        // Authentication links for the public landing page (if applicable)
                        <div className="space-x-4">
                            <Link to="/login" className="text-gray-300 hover:text-white transition duration-300">Login</Link>
                            <Link to="/register" className="px-4 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm hover:bg-amber-600 transition duration-300">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;