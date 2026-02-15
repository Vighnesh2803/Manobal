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
    Filler 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AIDetector = () => {
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem('manobal_user_id'));

    const [moodEntries, setMoodEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) { navigate('/login'); return; }

        const fetchMoodData = async () => {
            try {
                const response = await getMoods(userId);
                const rawData = response.mood_entries || [];
                const sortedEntries = [...rawData].sort((a, b) => new Date(a.entry_date) - new Date(b.entry_date));
                setMoodEntries(sortedEntries);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMoodData();
    }, [userId, navigate]);

    // 🎨 Blue & Gold Chart Config
    const chartData = {
        labels: moodEntries.map(entry => moment(entry.entry_date).format('MMM D')),
        datasets: [
            {
                label: 'Resilience Trajectory',
                data: moodEntries.map(entry => entry.mood_score),
                borderColor: '#FFD700', // Gold Line
                backgroundColor: 'rgba(255, 215, 0, 0.05)', // Subtle Gold Fill
                borderWidth: 4,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#3b82f6', // Blue Points
                pointBorderColor: '#fff',
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#020617',
                titleFont: { size: 14, weight: 'bold' },
                borderColor: 'rgba(59, 130, 246, 0.2)',
                borderWidth: 1,
                padding: 15,
                displayColors: false,
                callbacks: {
                    label: (context) => ` Mood: ${context.raw}/10 | Verified by Manobal AI`
                }
            }
        },
        scales: {
            y: { min: 0, max: 10, grid: { color: 'rgba(59, 130, 246, 0.05)' }, ticks: { color: '#3b82f6', font: { weight: 'bold' } } },
            x: { grid: { display: false }, ticks: { color: '#64748B' } }
        }
    };

    if (isLoading) return (
        <div className="h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(255,215,0,0.3)]"></div>
            <p className="text-[#FFD700] font-black tracking-widest uppercase text-[10px] animate-pulse">Syncing Neural Trajectory...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 relative font-sans overflow-x-hidden">
            {/* 🌌 Background Glows */}
            <div className="absolute top-0 left-0 w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-yellow-500/5 rounded-full blur-[100px]" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-20 flex justify-between items-end">
                    <div>
                        <h1 className="text-7xl lg:text-8xl font-black tracking-tighter uppercase italic leading-none">Neural <span className="text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">Analytics</span></h1>
                        <p className="text-blue-400/50 font-black uppercase tracking-[0.3em] text-[10px] mt-4">Visualizing resilience through Manobal Neural Link</p>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="text-[10px] font-black tracking-[0.4em] text-blue-500 hover:text-[#FFD700] transition-all uppercase mb-2">← Exit Hub</button>
                </header>

                {moodEntries.length === 0 ? (
                    <div className="bg-blue-900/10 border border-blue-500/10 p-24 rounded-[4rem] text-center backdrop-blur-3xl shadow-2xl">
                        <p className="text-xl font-bold text-blue-300/40 italic mb-10 tracking-tight">System requires entry data to generate emotional trajectory.</p>
                        <button onClick={() => navigate('/moodlog')} className="bg-[#FFD700] text-[#020617] px-14 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-yellow-500/10">Start First Log</button>
                    </div>
                ) : (
                    <>
                        {/* 📈 Visualization Area */}
                        <div className="bg-blue-950/20 border border-blue-500/10 p-12 rounded-[4rem] backdrop-blur-3xl mb-16 shadow-2xl h-[500px] relative group hover:border-[#FFD700]/30 transition-all duration-700">
                             <Line data={chartData} options={chartOptions} />
                        </div>

                        {/* 📜 History Grid */}
                        <div className="flex items-center gap-4 mb-10 ml-4">
                            <div className="h-px bg-blue-500/20 flex-grow" />
                            <h2 className="text-[10px] font-black tracking-[0.6em] text-blue-400 uppercase italic">Neural Log History</h2>
                            <div className="h-px bg-blue-500/20 flex-grow" />
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                            {[...moodEntries].reverse().map((entry, idx) => (
                                <div key={idx} className="bg-blue-900/10 border border-blue-500/10 p-10 rounded-[3rem] hover:border-[#FFD700]/40 transition-all duration-500 group shadow-xl">
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="flex flex-col">
                                            <p className="text-[10px] font-black text-blue-400/50 uppercase tracking-widest">{moment(entry.entry_date).format('MMMM D, YYYY')}</p>
                                        </div>
                                        <span className={`px-6 py-2 rounded-full text-[11px] font-black shadow-lg ${
                                            entry.mood_score >= 7 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20'
                                        }`}>SCORE: {entry.mood_score}/10</span>
                                    </div>
                                    <p className="text-blue-100 text-xl mb-8 italic font-light leading-relaxed group-hover:text-white transition-colors">"{entry.journal_entry}"</p>
                                    <div className="bg-[#020617]/40 p-6 rounded-3xl border border-blue-500/10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full animate-pulse" />
                                            <p className="text-[9px] font-black text-[#FFD700] uppercase tracking-widest">Neural Sync Insight</p>
                                        </div>
                                        <p className="text-sm text-blue-300/60 font-medium leading-relaxed italic">
                                            {entry.ai_analysis_text || "Pattern recognition complete."}
                                        </p>
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
