import React, { useState, useEffect } from 'react';
import { getStreak } from '../api'; // Ensure api.js is created and correctly linked

function Streaks() {
    const [streakCount, setStreakCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = parseInt(localStorage.getItem('manobal_user_id')); // Make sure this key matches login

    useEffect(() => {
        if (!userId) {
            setError("User not logged in. Please log in again.");
            setIsLoading(false);
            return;
        }

        const fetchStreak = async () => {
            try {
                const count = await getStreak(userId);
                setStreakCount(count);
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
        return <div className="error-container text-center text-xl text-red-500 mt-10">Error: {error}</div>;
    }

    return (
        <div className="streaks-container p-6 bg-slate-800 rounded-lg shadow-xl max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-amber-400">Your Commitment to Wellness 💪</h2>
            
            <div className="streak-display bg-gray-900 p-8 rounded-lg mb-8 border-b-4 border-amber-500">
                <span className="flame-icon text-7xl leading-none block mb-4">🔥</span>
                <p className="streak-number text-8xl font-extrabold text-white leading-none">{streakCount}</p>
                <p className="streak-label text-2xl font-semibold text-gray-300 mt-2">Daily Check-in Streak</p>
            </div>

            <div className="gamification-info text-gray-300">
                <h3 className="text-2xl font-bold mb-4 text-white">Why Streaks Matter</h3>
                <p className="mb-4">
                    Manobal utilizes **gamification** to encourage long-term commitment to your mental fitness journey.
                </p>
                <p className="mb-6">Every successful mood log increases your streak. Don't lose your momentum!</p>
                
                <div className="badge-preview bg-slate-700 p-5 rounded-lg border-t border-gray-600">
                    <h4 className="text-xl font-semibold mb-3 text-amber-400">Milestone Badges (Future Feature)</h4>
                    <p className="text-gray-400">
                        Unlock special badges for reaching 7-day, 30-day, and 100-day streaks!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Streaks;