// file: frontend/src/pages/AIDetector.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMoods } from '../api';
import moment from 'moment';
import { Line } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler // FIX: Plugin imported to enable 'fill' option
} from 'chart.js';

// Register components and the Filler plugin
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler 
);

const AIDetector = () => {
    const navigate = useNavigate();
    const storedId = localStorage.getItem('manobal_user_id');
    const userId = storedId ? parseInt(storedId) : null;

    const [moodEntries, setMoodEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId || isNaN(userId)) {
            navigate('/login');
            return;
        }

        const fetchMoodData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Calls backend @app.get("/moods/{user_id}")
                const response = await getMoods(userId);
                
                // Safe check: handle both object and direct array response
                const rawData = response.mood_entries || (Array.isArray(response) ? response : []);

                if (rawData.length === 0) {
                    setMoodEntries([]);
                    return;
                }

                // Sorting oldest to newest for the chart
                const sortedEntries = [...rawData].sort((a, b) => {
                    const dateA = new Date(a.log_timestamp || a.entry_date);
                    const dateB = new Date(b.log_timestamp || b.entry_date);
                    return dateA - dateB;
                });

                setMoodEntries(sortedEntries);
            } catch (err) {
                console.error("Analysis Fetch Error:", err);
                setError(err.response?.data?.detail || 'Failed to sync with Manobal Analysis server.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMoodData();
    }, [userId, navigate]);

    // Chart Configuration
    const chartData = {
        labels: moodEntries.map(entry => moment(entry.log_timestamp || entry.entry_date).format('MMM D')),
        datasets: [
            {
                label: 'Mood Intensity',
                data: moodEntries.map(entry => entry.mood_score),
                borderColor: '#F59E0B', 
                backgroundColor: 'rgba(245, 158, 11, 0.2)', // Requires Filler plugin
                fill: true, 
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#6366F1',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1E293B',
                padding: 12,
                callbacks: {
                    label: function(context) {
                        const entry = moodEntries[context.dataIndex];
                        return [
                            ` Mood Score: ${entry.mood_score}/10`,
                            ` AI Analysis: ${entry.ai_analysis_text || 'No summary available'}`
                        ];
                    }
                }
            }
        },
        scales: {
            y: {
                min: 0,
                max: 10,
                grid: { color: '#334155' },
                ticks: { color: '#94A3B8' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94A3B8' }
            }
        }
    };

    if (isLoading) return <div className="h-screen bg-gray-950 flex items-center justify-center text-amber-400 animate-pulse font-bold">ANALYZING TRENDS...</div>;

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6 lg:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-black text-amber-500 tracking-tight uppercase mb-2 italic">Mood Intelligence Analysis</h1>
                    <p className="text-slate-400">Deep-dive into your mental well-being trends powered by Manobal AI.</p>
                </header>

                {error ? (
                    <div className="bg-red-900/20 border border-red-500 text-red-400 p-6 rounded-2xl text-center font-bold">⚠️ {error}</div>
                ) : moodEntries.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900 rounded-3xl border border-slate-800">
                        <h2 className="text-2xl font-bold mb-4">Insufficient Data</h2>
                        <p className="text-slate-400 mb-6">Log your first mood entry to see the AI analysis in action.</p>
                        <button onClick={() => navigate('/moodlog')} className="bg-amber-500 text-black px-8 py-3 rounded-full font-bold uppercase transition-all hover:bg-amber-400">Start Logging</button>
                    </div>
                ) : (
                    <>
                        {/* Visualization Section */}
                        <section className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl mb-12">
                            <h2 className="text-xl font-bold mb-8 flex items-center uppercase tracking-wider">
                                <span className="w-2 h-8 bg-amber-500 mr-4 rounded-full"></span>
                                Emotional Trajectory
                            </h2>
                            <div className="h-80 lg:h-96">
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </section>

                        {/* Analysis Feedback List */}
                        <section>
                            <h2 className="text-xl font-bold mb-8 flex items-center uppercase tracking-wider">
                                <span className="w-2 h-8 bg-indigo-500 mr-4 rounded-full"></span>
                                Historical AI Feedback
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                {[...moodEntries].reverse().map((entry, index) => (
                                    <div key={index} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500 transition-all">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                {moment(entry.log_timestamp || entry.entry_date).format('MMMM D, YYYY')}
                                            </span>
                                            <div className={`px-3 py-1 rounded-full text-xs font-black ${
                                                entry.mood_score >= 7 ? 'bg-green-500/10 text-green-400' : 
                                                entry.mood_score >= 4 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                                SCORE: {entry.mood_score}/10
                                            </div>
                                        </div>
                                        <p className="text-slate-200 italic mb-4">"{entry.journal_entry}"</p>
                                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2 block">AI Summary</span>
                                            <p className="text-sm text-slate-400 leading-relaxed">
                                                {entry.ai_analysis_text || "Analysis pending..."}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default AIDetector;