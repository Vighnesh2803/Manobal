import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../api'; 

const Dashboard = () => {
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem('manobal_user_id')); 
    const username = localStorage.getItem('manobal_username') || "User";

    const [dashboardData, setDashboardData] = useState({
        current_streak: 0,
        proactive_alert: { message: "Syncing Manobal Hub...", type: "info" }, 
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Memoized fetch function fixes redundant re-renders
    const fetchDashboardInfo = useCallback(async () => {
        if (!userId) return;
        try {
            // Calls @app.get("/dashboard/data/{user_id}") in backend
            const data = await getDashboardData(userId);
            setDashboardData({
                current_streak: data.current_streak || 0,
                proactive_alert: data.proactive_alert || { message: "Stay mindful, stay resilient.", type: "info" }
            });
            setError(null);
        } catch (err) {
            console.error("Dashboard Sync Error:", err);
            setError(err.response?.data?.detail || 'Connection to Manobal AI failed.');
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
        
        // Auto-refresh logic updates streak without manual reload
        const interval = setInterval(fetchDashboardInfo, 30000);
        return () => clearInterval(interval);
    }, [userId, navigate, fetchDashboardInfo]);

    const features = [
        { title: "Mood Log", description: "Journal your thoughts & get AI feedback.", icon: "📝", link: "/moodlog", color: "text-blue-400" },
        { title: "AI Chatbot", description: "Your empathetic AI companion awaits.", icon: "🤖", link: "/chatbot", color: "text-green-400" },
        { title: "Counselors", description: "Find expert support in your journey.", icon: "👨‍⚕️", link: "/counselors", color: "text-amber-400" },
        { title: "Games Arena", description: "Mindful challenges to boost focus.", icon: "🎯", link: "/relax", color: "text-purple-400" },
        { title: "Zen Breathing", description: "Guided 3D breathing patterns.", icon: "🌀", link: "/breathing", color: "text-cyan-400" },
        { title: "AI Analysis", description: "Visualize your emotional journey.", icon: "📈", link: "/aid", color: "text-red-400" },
        { title: "Trusted Access", description: "Securely share insights with experts.", icon: "🛡️", link: "/access", color: "text-orange-400" },
        { title: "Helpline", description: "Immediate support in urgent moments.", icon: "📞", link: "/helpline", color: "text-pink-400" },
    ];

    if (isLoading) return (
        <div className="h-screen bg-[#020202] flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-black text-amber-500 animate-pulse uppercase tracking-widest">Syncing Manobal Hub...</p>
        </div>
    );

    if (error) return (
        <div className="h-screen bg-[#050505] flex flex-col items-center justify-center p-10 text-center">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-5xl mb-6 text-red-500">📡</div>
            <h2 className="text-4xl font-black mb-4 text-red-500 uppercase tracking-tighter italic">Connection Lost</h2>
            <p className="text-slate-500 max-w-md mb-8 font-medium italic">"{error}"</p>
            <button onClick={fetchDashboardInfo} className="bg-red-600 hover:bg-white hover:text-black transition-all px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl">Retry Sync</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020202] text-white p-6 lg:p-16 relative overflow-hidden font-sans">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[150px]" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-20 flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-white/5 pb-12">
                    <div>
                        <h1 className="text-7xl lg:text-9xl font-black mb-4 tracking-tighter uppercase leading-[0.85]">
                            HELLO, <br /> <span className="text-amber-500 italic">{username}</span>
                        </h1>
                        <p className="text-slate-500 text-xl font-medium tracking-tight italic">Your personalized resilience hub is live.</p>
                    </div>
                    <button onClick={() => {localStorage.clear(); navigate('/login');}} className="mt-8 lg:mt-0 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-red-500 transition-colors">Terminate Session [Logout]</button>
                </header>

                <div className="mb-12 p-8 rounded-[3rem] bg-slate-900/20 border border-white/5 backdrop-blur-3xl flex items-center gap-6 shadow-2xl group hover:border-amber-500/30 transition-all">
                    <span className="text-5xl group-hover:scale-125 transition-transform duration-500">💡</span>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Manobal Insight</p>
                        <p className="text-xl font-bold text-slate-200">{dashboardData.proactive_alert.message}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {/* Gold Streak Card - FIXED: Navigation to /streaks */}
                    <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-10 rounded-[4rem] flex flex-col justify-between transform transition-all duration-500 hover:scale-[1.05] cursor-pointer shadow-[0_20px_60px_rgba(245,158,11,0.2)] group min-h-[350px]" 
                         onClick={() => navigate('/streaks')}> 
                        <span className="text-7xl mb-6 group-hover:animate-bounce">🔥</span>
                        <div>
                            <h3 className="text-gray-950 text-2xl font-black uppercase tracking-tighter mb-1">STREAK</h3>
                            <p className="text-[10rem] font-black text-gray-950 leading-none tracking-tighter">{dashboardData.current_streak}</p>
                            <p className="text-gray-900 font-black text-[10px] uppercase mt-2 tracking-[0.3em]">DAYS OF RESILIENCE</p>
                        </div>
                    </div>

                    {features.map((f) => (
                        <div key={f.title} onClick={() => navigate(f.link)} className="p-10 rounded-[4rem] bg-slate-900/20 border border-white/5 backdrop-blur-3xl transition-all duration-500 cursor-pointer group hover:border-amber-500/40 hover:translate-y-[-10px] flex flex-col justify-between min-h-[350px]">
                            <div>
                                <span className={`text-6xl block mb-10 group-hover:scale-110 transition-transform ${f.color}`}>{f.icon}</span>
                                <h3 className="text-3xl font-black uppercase mb-3 tracking-tighter italic leading-none">{f.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-bold italic">{f.description}</p>
                            </div>
                            <span className="text-[9px] font-black tracking-[0.4em] uppercase opacity-20 group-hover:opacity-100 group-hover:text-amber-500 transition-all flex items-center gap-3">
                                ACCESS SYSTEM <span className="text-2xl">&rarr;</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;