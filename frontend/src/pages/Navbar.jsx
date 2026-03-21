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
        window.location.reload(); 
    };

    return (
        <nav className="bg-[#020617]/40 backdrop-blur-2xl border-b border-blue-500/10 p-5 sticky top-0 z-[100] transition-all duration-500 shadow-2xl">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6">

                {/*  Brand Logo - Glowing Gold */}
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center group">
                    <span className="text-3xl font-black tracking-tighter uppercase italic group-hover:scale-105 transition-all duration-300">
                        MANO<span className="text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">BAL</span>
                    </span>
                </Link>

                {/*  Desktop Navigation */}
                {isAuthenticated && (
                    <div className="hidden lg:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/50">
                        <Link to="/dashboard" className="hover:text-white transition-colors">Hub</Link>
                        <Link to="/moodlog" className="hover:text-[#FFD700] transition-colors">Neural Log</Link>
                        <Link to="/aid" className="hover:text-white transition-colors">Analytics</Link>
                        <Link to="/counselors" className="hover:text-white transition-colors">Experts</Link>
                        <Link to="/access" className="text-blue-300 hover:text-[#FFD700] transition-colors border-x border-blue-500/10 px-4">Trusted Access</Link>
                        <Link to="/helpline" className="text-red-500 hover:text-red-400 animate-pulse border border-red-500/20 px-4 py-1 rounded-full">SOS 🆘</Link>
                    </div>
                )}

                {/*  User Profile Node */}
                <div className="flex items-center space-x-8">
                    {isAuthenticated ? (
                        <>
                            <div className="hidden md:flex flex-col items-end border-r border-blue-500/10 pr-6">
                                <span className="text-[9px] font-black text-[#FFD700] uppercase tracking-widest opacity-70 italic">Neural Link</span>
                                <span className="text-[11px] font-bold text-white lowercase tracking-tight">@{username || "user"}</span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="px-8 py-3 bg-blue-500/5 border border-blue-500/20 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all transform active:scale-95 shadow-xl"
                            >
                                Terminate
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center space-x-8 text-[10px] font-black uppercase tracking-[0.3em]">
                            <Link to="/login" className="text-blue-400/50 hover:text-white transition-colors">Login</Link>
                            <Link
                                to="/register"
                                className="px-10 py-3 bg-[#FFD700] text-[#020617] rounded-xl hover:scale-105 transition-all shadow-2xl shadow-yellow-500/20"
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
