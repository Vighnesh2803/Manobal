// file: frontend/src/pages/AIDetector.jsx (AI Analysis/Data Visualization Page)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMoods } from '../api';
import moment from 'moment';
import { Line } from 'react-chartjs-2'; // Requires chart.js and react-chartjs-2 libraries!

// --- IMPORTANT: Chart.js Setup ---
// Make sure you have installed these packages:
// npm install chart.js react-chartjs-2
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
// ----------------------------------


const AIDetector = () => {
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem('manobal_user_id')); 

    const [moodEntries, setMoodEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Data Fetching ---
    useEffect(() => {
        if (!userId || isNaN(userId)) {
            navigate('/login');
            return;
        }

        const fetchMoodData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch historical mood data using the moods endpoint
                const response = await getMoods(userId);
                
                // Sort by date (oldest first for chart rendering)
                const sortedEntries = response.mood_entries.sort((a, b) => 
                    new Date(a.log_timestamp) - new Date(b.log_timestamp)
                );

                setMoodEntries(sortedEntries);

            } catch (err) {
                console.error("Mood Data Fetch Error:", err);
                // NOTE: This will capture the 'Unknown column log_timestamp' database error
                setError(err.detail || 'Failed to load historical mood data. (Check DB column names)');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMoodData();
    }, [userId, navigate]);

    // --- Chart Data Preparation ---
    const chartData = {
        labels: moodEntries.map(entry => moment(entry.log_timestamp).format('MMM D, YY')),
        datasets: [
            {
                label: 'Mood Score (1-10)',
                data: moodEntries.map(entry => entry.mood_score),
                borderColor: 'rgb(251, 191, 36)', // Amber 400
                backgroundColor: 'rgba(251, 191, 36, 0.5)',
                tension: 0.3,
                pointRadius: 5,
                pointBackgroundColor: 'rgb(79, 70, 229)', // Indigo
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white',
                }
            },
            title: {
                display: true,
                text: 'Mood Trends Over Time',
                color: 'white',
                font: {
                    size: 18,
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        // Add the actual analysis text to the tooltip
                        const entry = moodEntries[context.dataIndex];
                        return [
                            label, 
                            `Analysis: ${entry.ai_analysis_text || 'No AI analysis provided'}`
                        ];
                    }
                }
            }
        },
        scales: {
            y: {
                min: 1,
                max: 10,
                ticks: {
                    color: 'gray',
                    stepSize: 1,
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                }
            },
            x: {
                ticks: {
                    color: 'gray',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                }
            }
        }
    };


    // --- Render Content ---
    if (isLoading) {
        return <div className="text-center py-10 text-xl">Loading Analysis...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-red-500">Error Loading Data</h2>
                <p className="text-red-400 mt-2">{error}</p>
                <p className="text-gray-400 mt-4">
                    Please ensure the backend is running and the database column `log_timestamp` (or its equivalent) is correct in `main.py`.
                </p>
            </div>
        );
    }
    
    if (moodEntries.length === 0) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-amber-400">No Mood Entries Yet</h2>
                <p className="text-gray-400 mt-2">Start logging your mood to view trends here!</p>
                <button 
                    onClick={() => navigate('/moodlog')}
                    className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Go to Mood Log
                </button>
            </div>
        );
    }


    return (
        <div className="p-8 bg-gray-950 text-white">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-amber-400">
                AI Mood Trend Analysis 📈
            </h1>

            {/* --- 1. Line Chart Visualization --- */}
            <div className="max-w-4xl mx-auto bg-slate-800 p-6 rounded-xl shadow-2xl mb-12 border border-indigo-600">
                <Line data={chartData} options={chartOptions} />
            </div>
            
            {/* --- 2. Raw Data List --- */}
            <h2 className="text-3xl font-bold mb-6 text-indigo-400 border-b border-gray-700 pb-2">
                Recent Entries & AI Feedback
            </h2>
            <div className="space-y-4">
                {moodEntries.slice().reverse().map((entry) => (
                    <div key={entry.entry_id} className="bg-slate-800 p-5 rounded-lg shadow-md border border-slate-700">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-400 text-sm">
                                {moment(entry.log_timestamp).format('MMMM Do YYYY, h:mm a')}
                            </span>
                            <span className={`text-xl font-extrabold ${entry.mood_score < 4 ? 'text-red-400' : entry.mood_score < 7 ? 'text-yellow-400' : 'text-green-400'}`}>
                                Score: {entry.mood_score}/10
                            </span>
                        </div>
                        <p className="text-lg italic text-gray-300">
                            "{entry.journal_entry}"
                        </p>
                        <div className="mt-3 pt-3 border-t border-slate-700">
                            <p className="font-semibold text-amber-400">AI Analysis:</p>
                            <p className="text-sm text-gray-200">
                                {entry.ai_analysis_text || "No AI analysis available for this entry."}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AIDetector;