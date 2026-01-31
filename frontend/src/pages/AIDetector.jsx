// file: frontend/src/pages/AIDetector.jsx (ULTRA-PREMIUM EDITION)

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
    Filler // Important for the area chart effect
} from 'chart.js';

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
    const userId = parseInt(localStorage.getItem('manobal_user_id'));

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
                // Calls @app.get("/moods/history/{user_id}")
                const response = await getMoods(userId);
                const rawData = response.mood_entries || [];

                // Sort oldest to newest for chronological graph
                const sortedEntries = [...rawData].sort(
                    (a, b) => new Date(a.entry_date) - new Date(b.entry_date)
                );

                setMoodEntries(sortedEntries);
            } catch (err) {
                console.error("Analysis Fetch Error:", err);
                setError('Failed to sync with Manobal Neural server.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMoodData();
    }, [userId, navigate]);

    // Chart Configuration with Area Fill
    const chartData = {
        labels: moodEntries.map(entry => moment(entry.entry_date).format('MMM D')),
        datasets: [
            {
                label: 'Mood Level',
                data: moodEntries.map(entry => entry.mood_score),
                borderColor: '#F59E0B', 
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 4,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#6366F1',
                fill: true, // Requires Filler plugin
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0F172A',
                titleFont: { size: 14, weight: 'bold' },
                padding: 15,
                callbacks: {
                    label: (context) => {
                        const entry = moodEntries[context.dataIndex];
                        return ` Mood: ${entry.mood_score}/10 | ${entry.ai_analysis_text || 'Log Saved'}`;
                    }
                }
            }
        },
        scales: {
            y: { min: 0, max: 10, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748B' } },
            x: { grid: { display: false }, ticks: { color: '#64748B' } }
        }
    };

    if (isLoading) return (
        <div className="h-screen bg-[#020202] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-amber-500 font-black tracking-widest uppercase text-xs">Accessing Neural Patterns...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020202] text-white p-6 lg:p-12 relative font-sans">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]" />
            
            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-16 flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic">Neural <span className="text-amber-500">Analytics</span></h1>
                        <p className="text-slate-500 font-bold italic mt-2">Visualizing your resilience journey through Manobal AI.</p>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="text-[10px] font-black tracking-[0.3em] text-slate-500 hover:text-white transition-all uppercase">← Return to Hub</button>
                </header>

                {moodEntries.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 p-20 rounded-[3rem] text-center backdrop-blur-3xl">
                        <p className="text-2xl font-bold text-slate-400 italic mb-8">System requires entry data to generate trajectory.</p>
                        <button onClick={() => navigate('/moodlog')} className="bg-white text-black px-12 py-4 rounded-full font-black uppercase tracking-widest hover:bg-amber-500 transition-all">Start Log</button>
                    </div>
                ) : (
                    <>
                        {/* Visualization */}
                        <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl mb-12 shadow-2xl h-[450px]">
                             <Line data={chartData} options={chartOptions} />
                        </div>

                        {/* Analysis List */}
                        <h2 className="text-xs font-black tracking-[0.5em] text-indigo-500 uppercase mb-8 ml-4 italic">Neural Log History</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            {[...moodEntries].reverse().map((entry, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:border-indigo-500/50 transition-all group">
                                    <div className="flex justify-between items-center mb-6">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{moment(entry.entry_date).format('MMMM D, YYYY')}</p>
                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black ${
                                            entry.mood_score >= 7 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                        }`}>SCORE: {entry.mood_score}/10</span>
                                    </div>
                                    <p className="text-slate-200 text-lg mb-6 italic font-medium leading-relaxed">"{entry.journal_entry}"</p>
                                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2">Manobal Insight</p>
                                        <p className="text-sm text-slate-400 font-medium leading-relaxed">{entry.ai_analysis_text || "Deep reflection complete."}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AIDetector;