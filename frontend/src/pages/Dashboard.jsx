import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData, getMoods } from '../api';

const Dashboard = () => {
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem('manobal_user_id'));
    const username = localStorage.getItem('manobal_username') || "User";

    const [dashboardData, setDashboardData] = useState({
        current_streak: 0,
        proactive_alert: { message: "Syncing Manobal Hub...", type: "info" },
        recent_logs: []
    });

    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardInfo = useCallback(async () => {
        if (!userId) return;
        try {
            const streakData = await getDashboardData(userId);
            const historyData = await getMoods(userId);
            const safeLogs = historyData?.mood_entries ? historyData.mood_entries.slice(0, 3) : [];

            setDashboardData({
                current_streak: streakData.current_streak || 0,
                proactive_alert: { message: "Stay mindful, stay resilient.", type: "info" },
                recent_logs: safeLogs
            });
        } catch (err) {
            console.error("Dashboard Sync Error:", err);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (!userId || isNaN(userId)) { navigate('/login'); return; }
        fetchDashboardInfo();
        const interval = setInterval(fetchDashboardInfo, 20000);
        return () => clearInterval(interval);
    }, [userId, navigate, fetchDashboardInfo]);

    const features = [
        { title: "Mood Log", description: "Journal your thoughts & AI feedback.", icon: "📝", link: "/moodlog" },
        { title: "AI Chatbot", description: "Empathetic AI companion.", icon: "🤖", link: "/chatbot" },
        { title: "Games Arena", description: "Focus & mindfulness challenges.", icon: "🎯", link: "/relax" },
        { title: "Zen Breathing", description: "Guided 3D breathing patterns.", icon: "🌀", link: "/breathing" },
        { title: "AI Analysis", description: "Visualize your emotional journey.", icon: "📈", link: "/aid" },
        { title: "Trusted Access", description: "Securely share with experts.", icon: "🛡️", link: "/access" },
        { title: "Counselors", description: "Expert professional support.", icon: "👨‍⚕️", link: "/counselors" },
        { title: "Helpline", description: "Immediate support in crisis.", icon: "📞", link: "/helpline" },
    ];

    if (isLoading) return (
        <div className="h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(255,215,0,0.3)]"></div>
            <p className="text-[10px] font-black text-[#FFD700] animate-pulse uppercase tracking-[0.4em]">Neural Link Synchronizing...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 relative overflow-x-hidden font-sans">
            {/* 🌌 Background Aesthetic Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[130px]" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-20 flex flex-col lg:row justify-between items-start lg:items-end border-b border-blue-500/10 pb-12">
                    <div>
                        <h1 className="text-7xl lg:text-9xl font-black mb-4 uppercase tracking-tighter italic leading-none">
                            HELLO, <br /> <span className="text-[#FFD700] drop-shadow-[0_0_25px_rgba(255,215,0,0.3)]">{username}</span>
                        </h1>
                        <p className="text-blue-400/50 font-black uppercase tracking-[0.5em] text-[10px]">Welcome to the Manobal Neural Node</p>
                    </div>
                    <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/40 hover:text-red-500 transition-colors mb-4 lg:mb-2">TERMINATE_SESSION_LOGOUT</button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* 🛡️ LEFT COLUMN: STREAK & LOGS */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="bg-gradient-to-br from-[#FFD700] to-[#B8860B] p-12 rounded-[4rem] transform transition hover:scale-[1.02] cursor-pointer shadow-2xl relative group overflow-hidden" onClick={() => navigate('/aid')}>
                             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                             <div className="flex justify-between items-start mb-8">
                                <span className="text-6xl group-hover:animate-bounce transition-all">🔥</span>
                                <span className="px-4 py-1 bg-black/20 rounded-full text-[10px] font-black uppercase tracking-widest text-black/60">Verified Streak</span>
                             </div>
                             <h3 className="text-black text-2xl font-black uppercase tracking-tighter italic">Current Resilience</h3>
                             <p className="text-[11rem] font-black text-black leading-none tracking-tighter">{dashboardData.current_streak}</p>
                             <p className="text-black/40 font-black text-[10px] uppercase tracking-[0.3em] mt-4">Consecutive Days of Strength</p>
                        </div>

                        <div className="bg-blue-900/10 border border-blue-500/10 p-10 rounded-[4rem] backdrop-blur-3xl shadow-xl">
                            <h2 className="text-[10px] font-black tracking-[0.6em] text-blue-400/50 uppercase mb-10 italic">Recent Neural Patterns</h2>
                            <div className="space-y-6">
                                {dashboardData.recent_logs.length > 0 ? (
                                    dashboardData.recent_logs.map((log, idx) => (
                                        <div key={idx} className="bg-[#020617]/40 border border-blue-500/10 p-8 rounded-[2.5rem] hover:border-[#FFD700]/30 transition-all group">
                                            <p className="font-medium text-blue-100 italic mb-4 text-sm group-hover:text-white transition-colors leading-relaxed">"{log.journal_entry?.slice(0, 60)}..."</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-[#FFD700] uppercase tracking-widest">Intensity: {log.mood_score}/10</span>
                                                <span className="text-[9px] text-blue-500/40 font-black uppercase tracking-widest">{log.entry_date}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-blue-300/20 italic text-sm text-center py-10 tracking-tight">System awaiting first neural entry...</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 🏮 RIGHT COLUMN: FEATURE GRID */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((f) => (
                            <div key={f.title} onClick={() => navigate(f.link)} className="p-10 rounded-[4rem] bg-blue-900/10 border border-blue-500/10 hover:border-[#FFD700]/40 transition-all duration-500 cursor-pointer group flex flex-col justify-between min-h-[260px] shadow-2xl backdrop-blur-3xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD700]/5 rounded-bl-[4rem] pointer-events-none" />
                                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500">{f.icon}</div>
                                <div>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-2 group-hover:text-[#FFD700] transition-colors">{f.title}</h3>
                                    <p className="text-blue-300/40 text-[11px] font-black leading-relaxed uppercase tracking-widest italic">{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
