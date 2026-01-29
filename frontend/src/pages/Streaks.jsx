// file: frontend/src/pages/Streaks.jsx
import React, { useState, useEffect } from 'react';
// API function export verify karein api.js mein
import { getStreak } from '../api'; 

function Streaks() {
    const [streakCount, setStreakCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = parseInt(localStorage.getItem('manobal_user_id')); 

    useEffect(() => {
        if (!userId) {
            setError("User not logged in. Please log in again.");
            setIsLoading(false);
            return;
        }

        const fetchStreak = async () => {
            setIsLoading(true);
            try {
                // Backend call to dashboard/data/{user_id}
                const count = await getStreak(userId);
                // Ensure count is a number
                setStreakCount(count || 0); 
            } catch (err) {
                console.error("Failed to fetch streak:", err);
                setError("Could not load streak data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStreak();
    }, [userId]);

    if (isLoading) {
        return <div className="loading-container text-center text-xl text-gray-300 mt-10">Loading Streaks...</div>;
    }

    if (error) {
        return <div className="error-container text-center text-xl text-red- red-500 mt-10 font-bold bg-slate-800 p-4 rounded-lg">Error: {error}</div>;
    }

    return (
        <div className="streaks-container p-6 bg-slate-800 rounded-lg shadow-xl max-w-2xl mx-auto text-center mt-10">
            <h2 className="text-3xl font-bold mb-6 text-amber-400">Your Commitment to Wellness 💪</h2>
            
            <div className="streak-display bg-gray-900 p-8 rounded-lg mb-8 border-b-4 border-amber-500 shadow-inner">
                <span className="flame-icon text-7xl leading-none block mb-4 animate-pulse">🔥</span>
                <p className="streak-number text-8xl font-extrabold text-white leading-none tracking-tight">{streakCount}</p>
                <p className="streak-label text-2xl font-semibold text-gray-300 mt-2">Daily Check-in Streak</p>
            </div>

            <div className="gamification-info text-gray-300 text-left">
                <h3 className="text-2xl font-bold mb-4 text-white border-l-4 border-amber-400 pl-4">Why Streaks Matter</h3>
                <p className="mb-4 leading-relaxed">
                    Manobal utilizes <strong className="text-amber-400">gamification</strong> to encourage long-term commitment to your mental fitness journey.
                </p>
                <p className="mb-6 italic text-gray-400">Every successful mood log increases your streak. Don't lose your momentum!</p>
                
                <div className="badge-preview bg-slate-700/50 p-5 rounded-lg border border-slate-600">
                    <h4 className="text-xl font-semibold mb-3 text-amber-400 flex items-center gap-2">
                        <span>🎖️</span> Milestone Badges
                    </h4>
                    <p className="text-gray-400 text-sm">
                        Unlock special badges for reaching 7-day, 30-day, and 100-day streaks! (Coming Soon)
                    </p>
                </div>
            </div>
        </div>
    );
}


export default Streaks;