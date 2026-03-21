import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../pages/Navbar';

const Layout = () => {
    // Session data for the Navbar
    const username = localStorage.getItem('manobal_username') || "User";

    return (
        <div className="flex flex-col min-h-screen bg-[#020617] text-white font-sans relative overflow-x-hidden">
            
            {/* 🌌 Global Background Glows (Landing Page Style) */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

            {/* 🛰️ Sticky Glassmorphic Navbar */}
            <header className="sticky top-0 z-[100] w-full border-b border-blue-500/10 bg-[#020617]/60 backdrop-blur-3xl shadow-2xl transition-all duration-500">
                <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
                    <Navbar username={username} />
                </div>
            </header>

            {/* 🚀 Main Neural Content */}
            <main className="flex-1 w-full max-w-screen-2xl mx-auto relative z-10 animate-in fade-in duration-1000">
                <Outlet />
            </main>

            {/* 🏮 Premium Footer */}
            <footer className="p-12 border-t border-blue-500/10 bg-blue-950/10 backdrop-blur-md relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-blue-500/20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-400/40 italic">
                            MANOBAL NEURAL SYSTEM <span className="text-[#FFD700]">v1.0</span>
                        </p>
                        <div className="h-px w-8 bg-blue-500/20" />
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500/20">
                        Secure Neural Link // All Data Encrypted // Maharashtra Protocol
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
