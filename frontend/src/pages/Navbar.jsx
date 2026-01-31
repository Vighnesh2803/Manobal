// file: frontend/src/pages/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ username }) => {
    const navigate = useNavigate();

    // Session check for dynamic navigation
    const userId = localStorage.getItem('manobal_user_id');
    const isAuthenticated = !!userId;

    const handleLogout = () => {
        // Clear session and redirect to landing page
        localStorage.removeItem('manobal_user_id');
        localStorage.removeItem('manobal_username');
        navigate('/');
        window.location.reload(); // Ensures state is cleared
    };

    return (
        <nav className="bg-black/80 backdrop-blur-xl border-b border-white/5 p-4 sticky top-0 z-50 shadow-2xl">
            <div className="container mx-auto flex justify-between items-center px-4 md:px-8">

                {/* Brand Logo - Links to Dashboard if logged in */}
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center group">
                    <span className="text-2xl font-black tracking-tighter uppercase italic group-hover:text-amber-500 transition-colors">
                        Mana<span className="text-amber-500 italic">bal</span>
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                {isAuthenticated && (
                    <div className="hidden lg:flex items-center space-x-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                        <Link to="/moodlog" className="hover:text-white transition-colors">Mood Log</Link>
                        <Link to="/aid" className="hover:text-white transition-colors italic">Analysis</Link>
                        <Link to="/counselors" className="hover:text-white transition-colors">Experts</Link>
                        <Link to="/access" className="text-indigo-400 hover:text-indigo-300 transition-colors">Trusted Access</Link>
                        <Link to="/helpline" className="text-red-600 hover:text-red-500 animate-pulse font-black">SOS Helpline 🆘</Link>
                    </div>
                )}

                {/* User Profile / Auth Actions */}
                <div className="flex items-center space-x-6">
                    {isAuthenticated ? (
                        <>
                            <div className="hidden md:flex flex-col items-end mr-2">
                                <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Neural Link</span>
                                <span className="text-xs font-bold text-white lowercase">@{username || "user"}</span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all transform active:scale-95 shadow-lg"
                            >
                                Terminate
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest">
                            <Link to="/login" className="text-slate-500 hover:text-white transition-colors">Login</Link>
                            <Link
                                to="/register"
                                className="px-6 py-2 bg-amber-500 text-black rounded-full hover:bg-white transition-all shadow-xl"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
