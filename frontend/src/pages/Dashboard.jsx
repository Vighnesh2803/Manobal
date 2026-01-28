// file: frontend/src/pages/Dashboard.jsx (ULTRA-ATTRACTIVE & DYNAMIC)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../api'; 

const Dashboard = () => {
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem('manobal_user_id')); 
    const username = localStorage.getItem('manobal_username') || "User";

    const [dashboardData, setDashboardData] = useState({
        current_streak: 0,
        proactive_alert: { 
            message: "Professional counselors are online. Need someone to talk to?", 
            type: "info" 
        }, 
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId || isNaN(userId)) {
            navigate('/login');
            return;
        }

        const fetchDashboardInfo = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getDashboardData(userId);
                setDashboardData(prev => ({ ...prev, ...data })); 
            } catch (err) {
                console.error("Dashboard Sync Error:", err);
                setError(err.response?.data?.detail || 'Connection failed.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardInfo();
    }, [userId, navigate]); 

    // SYNCED: All features in uniform color + New Counselor feature
    const features = [
        { title: "Mood Log", description: "Track your emotions, gain clarity.", icon: "📝", link: "/moodlog", color: "text-blue-400" },
        { title: "AI Chatbot", description: "Your empathetic AI companion awaits.", icon: "🤖", link: "/chatbot", color: "text-green-400" },
        { title: "Counselors", description: "Book sessions with expert professionals.", icon: "👨‍⚕️", link: "/counselors", color: "text-amber-400" },
        { title: "Games Arena", description: "Boost focus with mindful challenges.", icon: "🎯", link: "/relax", color: "text-purple-400" },
        { title: "Zen Breathing", description: "Find calm with guided 3D patterns.", icon: "🌀", link: "/breathing", color: "text-cyan-400" },
        { title: "AI Analysis", description: "Visualize your emotional journey.", icon: "📈", link: "/aid", color: "text-red-400" },
        { title: "Trusted Access", description: "Securely share insights with experts.", icon: "🛡️", link: "/access", color: "text-orange-400" },
        { title: "Helpline", description: "Immediate support in urgent moments.", icon: "📞", link: "/helpline", color: "text-pink-400" },
    ];

    if (isLoading) return (
        <div className="h-screen bg-[#050505] flex items-center justify-center text-xl font-black text-amber-400 animate-pulse uppercase tracking-widest">
            Syncing Manobal Hub...
        </div>
    );

    if (error) return (
        <div className="h-screen bg-gradient-to-br from-red-900 to-gray-950 flex flex-col items-center justify-center p-10 text-center text-white">
            <h2 className="text-4xl font-black mb-4 text-red-400">Connection Lost!</h2>
            <p className="text-lg max-w-md mb-6">{error}</p>
            <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 hover:bg-red-700 transition-all px-8 py-3 rounded-xl font-bold text-lg shadow-lg"
            >
                Retry Connection
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-12 font-sans relative overflow-hidden">
            {/* Background Aesthetic Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-blob" />
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section: Bold & Minimal */}
                <header className="mb-16">
                    <h1 className="text-5xl lg:text-8xl font-black mb-3 tracking-tighter uppercase leading-none">
                        HELLO, <span className="text-amber-400">{username}</span>
                    </h1>
                    <p className="text-slate-500 text-xl font-medium tracking-tight italic">Your personalized resilience hub is live.</p>
                </header>

                {/* Proactive Alert Section */}
                {dashboardData.proactive_alert && (
                    <div className="mb-12 p-6 rounded-[2rem] bg-slate-900/40 border border-white/5 backdrop-blur-md flex items-center gap-4 animate-fade-in shadow-xl">
                        <span className="text-3xl">💡</span>
                        <p className="text-lg font-semibold text-slate-200">{dashboardData.proactive_alert.message}</p>
                    </div>
                )}

                {/* Main Grid: Clean & Uniform */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    
                    {/* Gold/Amber Streak Card - The Star of the Dashboard */}
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-[2.5rem] flex flex-col justify-between transform transition-all duration-300 hover:scale-[1.03] cursor-pointer shadow-2xl shadow-amber-500/20 relative overflow-hidden group min-h-[300px]" onClick={() => navigate('/streaks')}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700 blur-2xl" />
                        <span className="text-6xl mb-4 group-hover:rotate-12 transition-transform">🔥</span>
                        <div>
                            <h3 className="text-gray-950 text-2xl font-black uppercase tracking-tighter leading-none mb-1">STREAK</h3>
                            <p className="text-9xl font-black text-gray-950 leading-none">{dashboardData.current_streak}</p>
                            <p className="text-gray-900 font-bold text-xs uppercase tracking-widest opacity-80 mt-2">Days Strong</p>
                        </div>
                    </div>

                    {/* Uniform Feature Cards Mapping */}
                    {features.map((f, i) => (
                        <div 
                            key={i} 
                            onClick={() => navigate(f.link)}
                            className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 backdrop-blur-md transition-all duration-300 cursor-pointer group hover:border-amber-500/50 hover:shadow-2xl flex flex-col justify-between min-h-[300px]"
                        >
                            <div>
                                <span className={`text-5xl block mb-6 group-hover:scale-110 transition-transform ${f.color}`}>{f.icon}</span>
                                <h3 className="text-2xl font-black uppercase mb-2 tracking-tight italic leading-tight">{f.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.description}</p>
                            </div>
                            <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-30 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                LAUNCH <span className="text-lg">&rarr;</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0, 0) scale(1); }
                }
                .animate-blob { animation: blob 10s infinite ease-in-out; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default Dashboard;