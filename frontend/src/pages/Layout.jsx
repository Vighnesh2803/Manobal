// file: frontend/src/components/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../pages/Navbar';

const Layout = () => {
    // Fetching session data for the Navbar
    const username = localStorage.getItem('manobal_username') || "User";

    return (
        <div className="flex flex-col min-h-screen bg-[#020202] text-white font-sans">
            {/* Sticky Navbar ensures it stays at the top while scrolling 
               
            */}
            <header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <Navbar username={username} />
            </header>

            {/* Main Content Area where all protected pages (Dashboard, AIDetector, etc.) 
                will render via <Outlet />
            */}
            <main className="flex-1 w-full max-w-screen-2xl mx-auto overflow-x-hidden">
                <Outlet />
            </main>

            {/* Subtle Footer (Optional but good for professional look) */}
            <footer className="p-8 border-t border-white/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-700 italic">
                    Manobal Resilience System v2.5 // Secure Neural Link
                </p>
            </footer>
        </div>
    );
};

export default Layout;
