// file: frontend/src/pages/Dashboard.jsx (FINAL & DYNAMIC VERSION - Fetches Live Data)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboardData } from '../api'; // Import the function to fetch data

// NOTE: Navbar import is permanently removed to fix the double header issue.

const Dashboard = () => {
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem('manobal_user_id')); 
    const username = localStorage.getItem('manobal_username') || "User"; // Get dynamic username

    // State for dynamic dashboard data
    const [dashboardData, setDashboardData] = useState({
        current_streak: 0,
        proactive_alert: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching and Authentication Check ---
    useEffect(() => {
        // 1. Authentication Check (Backup to PrivateRoute)
        if (!userId || isNaN(userId)) {
            navigate('/login');
            return;
        }

        // 2. Data Fetching
        const fetchDashboardInfo = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch data from the FastAPI endpoint
                const data = await getDashboardData(userId);
                setDashboardData(data);
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
                // CRITICAL: This detail will show the SQL error (e.g., 'Unknown column log_timestamp')
                setError(err.detail || 'Failed to load dashboard data. Please check backend connection.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardInfo();

    }, [userId, navigate]); 

    // --- Static Features Array (for tiles) ---
    // NOTE: Streaks is removed from this array as it will be rendered as a separate dynamic tile.
    const features = [
        { 
            title: "Mood Log", 
            description: "Record daily moods via AI analysis.", 
            icon: "📝", 
            link: "/moodlog"
        },
        { 
            title: "AI Chatbot", 
            description: "Instant, anonymous support with your companion.", 
            icon: "🤖", 
            link: "/chatbot" 
        },
        { 
            title: "AI Analysis", 
            description: "View historical mood trends and patterns.", 
            icon: "📈", 
            link: "/aid"
        },
        { 
            title: "Trusted Access", 
            description: "Securely share anonymized data with a counselor.", 
            icon: "🛡️", 
            link: "/access"
        },
        { 
            title: "Helpline", 
            description: "Find immediate help in critical moments.", 
            icon: "📞", 
            link: "/helpline"
        },
    ];


    // --- Render Loading/Error States ---
    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 text-white min-h-[50vh]">
                <p className="text-xl">Loading Dashboard... Please wait.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-white min-h-[50vh]">
                <p className="text-2xl font-bold text-red-500">Error: Database Connection / Data Fetch Failed</p>
                <p className="text-lg mt-3 text-red-400">Details: {error}</p>
                <p className="text-gray-400 mt-4">
                    **Action:** Please check your FastAPI terminal for the exact SQL error and fix the column name (`log_timestamp`) in `main.py`.
                </p>
            </div>
        );
    }
    
    // --- Render Main Dashboard ---
    return (
        <div className="flex-1 flex flex-col items-center p-8">
            <div className="max-w-6xl w-full mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-4 mt-8 text-white">
                    Welcome to <span className="text-amber-400">Manobal</span>
                </h1>
                <p className="text-xl text-gray-400 mb-12">
                    Your personal space for proactive resilience.
                </p>

                {/* --- PROACTIVE MONITORING ALERT (If Active) --- */}
                {dashboardData.proactive_alert && (
                    <div 
                        className="bg-red-700 text-white p-6 rounded-xl shadow-2xl mb-10 cursor-pointer transition-all hover:bg-red-800"
                        onClick={() => navigate('/chatbot')} // Click to go to chatbot
                    >
                        <h3 className="text-2xl font-bold mb-2">🚨 Proactive Alert</h3>
                        <p className="text-lg">{dashboardData.proactive_alert}</p>
                        <p className="text-sm mt-2 font-semibold underline">Click to chat with the Manobal AI now.</p>
                    </div>
                )}

                {/* --- CORE FEATURE TILES GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    
                    {/* Dynamic Streak Tile */}
                    <div
                        className="bg-amber-400 p-6 rounded-lg shadow-xl cursor-pointer flex flex-col justify-between transition-transform hover:scale-[1.03]"
                        onClick={() => navigate('/streaks')} 
                    >
                        <span className="text-4xl">🔥</span>
                        <h3 className="text-xl font-bold mt-4 text-gray-900">Current Streak</h3>
                        <p className="text-5xl font-extrabold my-2 text-gray-900">
                            {dashboardData.current_streak} 
                        </p>
                        <p className="mt-2 text-sm text-gray-800">Days of consistent check-ins.</p>
                    </div>
                    
                    {/* Mapping through all other features */}
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-slate-800 p-6 rounded-lg shadow-xl cursor-pointer flex flex-col justify-between transition-transform hover:scale-[1.03]"
                            onClick={() => navigate(feature.link)}
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-4xl text-amber-400">{feature.icon}</span>
                                <h3 className="text-xl font-bold mt-4 text-white">{feature.title}</h3>
                                <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); navigate(feature.link); }}
                                className={`mt-4 w-full px-4 py-2 font-semibold rounded-md transition-colors 
                                    ${feature.title === 'Helpline' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                            >
                                Go to {feature.title.split(' ')[0]}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;