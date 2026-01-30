import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStreak } from '../api'; 

function Streaks() {
    const navigate = useNavigate();
    const [streakCount, setStreakCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = parseInt(localStorage.getItem('manobal_user_id')); 

    useEffect(() => {
        if (!userId) {
            setError("Session Expired. Please log in again.");
            setIsLoading(false);
            return;
        }

        const fetchStreak = async () => {
            setIsLoading(true);
            try {
                // Calls @app.get("/dashboard/data/{user_id}")
                const count = await getStreak(userId);
                setStreakCount(count || 0); 
            } catch (err) {
                console.error("Streak Fetch Error:", err);
                setError("Unable to sync your resilience data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStreak();
    }, [userId]);

    if (isLoading) return (
        <div className="h-screen bg-[#020202] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-amber-500 font-black tracking-widest uppercase text-xs">Syncing Momentum...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020202] text-white p-6 lg:p-12 relative overflow-hidden font-sans">
            {/* Background Aesthetic Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]"></div>
            
            <div className="max-w-3xl mx-auto relative z-10 text-center">
                <header className="mb-12 text-left">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="text-amber-500 font-black tracking-[0.3em] text-[10px] uppercase mb-6 hover:text-white transition-all"
                    >
                        ← BACK TO HUB
                    </button>
                    <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        RESILIENCE <br /> <span className="text-amber-500">MOMENTUM</span>
                    </h2>
                </header>

                {/* The Flame Display */}
                <div className="bg-slate-900/20 backdrop-blur-3xl p-12 lg:p-20 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent"></div>
                    
                    <div className="relative z-10">
                        <span className="text-8xl lg:text-9xl mb-6 block animate-bounce drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]">🔥</span>
                        <p className="text-[12rem] lg:text-[15rem] font-black text-white leading-none tracking-tighter group-hover:scale-105 transition-transform duration-700">
                            {streakCount}
                        </p>
                        <p className="text-amber-500 text-sm font-black uppercase tracking-[0.5em] mt-4">Consecutive Days Strong</p>
                    </div>
                </div>

                {/* Gamification Info Card */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/5">
                        <h3 className="text-xl font-black uppercase italic mb-4 text-white border-l-4 border-amber-500 pl-4">The Science</h3>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium italic">
                            Consistency is the key to mental fitness. By logging your mood daily, you build a habit of mindfulness that strengthens your emotional core.
                        </p>
                    </div>

                    <div className="bg-slate-900/40 p-10 rounded-[3rem] border border-white/5 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-black uppercase italic mb-4 text-amber-500">Milestones</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Next Badge: 7 Days</p>
                        </div>
                        <div className="mt-6 w-full bg-black/50 h-3 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="bg-amber-500 h-full transition-all duration-1000" 
                                style={{ width: `${Math.min((streakCount / 7) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button 
                    onClick={() => navigate('/moodlog')}
                    className="mt-16 w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs hover:bg-amber-500 hover:scale-[1.02] transition-all shadow-xl"
                >
                    EXTEND STREAK TODAY →
                </button>
            </div>
        </div>
    );
}

export default Streaks;