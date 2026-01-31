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
    const [error, setError] = useState(null);

    const fetchDashboardInfo = useCallback(async () => {
        if (!userId) return;

        try {
            // STREAK & MOOD HISTORY FETCH
            const streakData = await getDashboardData(userId);
            const historyData = await getMoods(userId);

            const safeLogs = historyData?.mood_entries
                ? historyData.mood_entries.slice(0, 3)
                : [];

            setDashboardData({
                current_streak: streakData.current_streak || 0,
                proactive_alert: {
                    message: "Stay mindful, stay resilient.",
                    type: "info"
                },
                recent_logs: safeLogs
            });

            setError(null);
        } catch (err) {
            console.error("Dashboard Sync Error:", err);
            setError("Connection to Manobal AI failed.");
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (!userId || isNaN(userId)) {
            navigate('/login');
            return;
        }

        fetchDashboardInfo();

        // 20-second background refresh
        const interval = setInterval(fetchDashboardInfo, 20000);
        return () => clearInterval(interval);

    }, [userId, navigate, fetchDashboardInfo]);

    const features = [
        { title: "Mood Log", description: "Journal your thoughts & AI feedback.", icon: "📝", link: "/moodlog", color: "text-blue-400" },
        { title: "AI Chatbot", description: "Empathetic AI companion.", icon: "🤖", link: "/chatbot", color: "text-green-400" },
        { title: "Games Arena", description: "Focus & mindfulness challenges.", icon: "🎯", link: "/relax", color: "text-purple-400" },
        { title: "Zen Breathing", description: "Guided 3D breathing patterns.", icon: "🌀", link: "/breathing", color: "text-cyan-400" },
        { title: "AI Analysis", description: "Visualize your emotional journey.", icon: "📈", link: "/aid", color: "text-red-400" },
        { title: "Trusted Access", description: "Securely share with experts.", icon: "🛡️", link: "/access", color: "text-orange-400" },
        { title: "Counselors", description: "Expert professional support.", icon: "👨‍⚕️", link: "/counselors", color: "text-amber-400" },
        { title: "Helpline", description: "Immediate support in crisis.", icon: "📞", link: "/helpline", color: "text-pink-400" },
    ];

    if (isLoading) return (
        <div className="h-screen bg-[#020202] flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-black text-amber-500 animate-pulse uppercase tracking-widest">Neural Link Active...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020202] text-white p-6 lg:p-12 relative overflow-hidden font-sans">
            <div className="max-w-7xl mx-auto relative z-10">
                
                <header className="mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-white/5 pb-10">
                    <div>
                        <h1 className="text-6xl lg:text-8xl font-black mb-4 uppercase tracking-tighter italic">
                            HELLO, <br /> <span className="text-amber-500">{username}</span>
                        </h1>
                    </div>
                    <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-red-500 transition-colors mb-4">TERMINATE SESSION [LOGOUT]</button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* LEFT COLUMN: STREAK & LOGS */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-10 rounded-[4rem] transform transition hover:scale-[1.02] cursor-pointer shadow-2xl" onClick={() => navigate('/aid')}>
                            <span className="text-7xl mb-6 block">🔥</span>
                            <h3 className="text-black text-2xl font-black uppercase tracking-tighter">Current Streak</h3>
                            <p className="text-[10rem] font-black text-black leading-none">{dashboardData.current_streak}</p>
                            <p className="text-black/60 font-black text-[10px] uppercase tracking-widest mt-2">Days of Resilience</p>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-10 rounded-[4rem] backdrop-blur-3xl">
                            <h2 className="text-xs font-black tracking-[0.5em] text-slate-500 uppercase mb-8">Neural Log History</h2>
                            <div className="space-y-4">
                                {dashboardData.recent_logs.length > 0 ? (
                                    dashboardData.recent_logs.map((log, idx) => (
                                        <div key={idx} className="bg-black/40 border border-white/5 p-6 rounded-[2rem] hover:border-indigo-500/50 transition-colors">
                                            <p className="font-bold text-slate-200 italic mb-2">"{log.journal_entry?.slice(0, 50)}..."</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Mood: {log.mood_score}/10</span>
                                                <span className="text-[10px] text-slate-600 font-bold uppercase">{log.entry_date}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-600 italic">No neural data detected.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FEATURE GRID */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((f) => (
                            <div key={f.title} onClick={() => navigate(f.link)} className="p-8 rounded-[3rem] bg-white/5 border border-white/5 hover:border-amber-500/50 transition-all cursor-pointer group flex flex-col justify-between min-h-[220px]">
                                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-1">{f.title}</h3>
                                    <p className="text-slate-500 text-xs font-bold leading-relaxed">{f.description}</p>
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
