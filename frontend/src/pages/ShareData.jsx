import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAccessToken, revokeAccessToken, viewSharedData } from '../api'; 
import moment from 'moment';

// Step 1: Chart.js Imports
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const ShareData = () => {
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem('manobal_user_id'));

    const [professionalName, setProfessionalName] = useState('');
    const [durationHours, setDurationHours] = useState(48);
    const [generatedTokenInfo, setGeneratedTokenInfo] = useState(null);
    const [generateTokenError, setGenerateTokenError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const [inputAccessToken, setInputAccessToken] = useState('');
    const [sharedData, setSharedData] = useState(null);
    const [viewDataError, setViewDataError] = useState('');
    const [isViewing, setIsViewing] = useState(false);

    useEffect(() => {
        if (!userId || isNaN(userId)) navigate('/login');
    }, [userId, navigate]);

    const handleGenerateToken = async () => {
        setGenerateTokenError('');
        if (!professionalName.trim() || durationHours < 1) {
            setGenerateTokenError('Professional name and duration are required.');
            return;
        }
        setIsGenerating(true);
        try {
            const response = await generateAccessToken(userId, professionalName, durationHours); 
            setGeneratedTokenInfo({
                professional_name: professionalName,
                access_token: response.access_token || response.token,
                expires_at: response.expires_at
            });
            setProfessionalName('');
        } catch (error) {
            setGenerateTokenError(error.response?.data?.detail || 'Could not generate token.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRevokeToken = async () => {
        if (!userId) return;
        if (!window.confirm("Revoke this access token?")) return;
        setIsGenerating(true);
        try {
            await revokeAccessToken(userId);
            setGeneratedTokenInfo(null);
            alert('Access token revoked!');
        } catch (error) {
            setGenerateTokenError('Could not revoke access token.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleViewSharedData = async () => {
        setViewDataError('');
        setSharedData(null);
        if (!inputAccessToken.trim()) {
            setViewDataError('Access token required.');
            return;
        }
        setIsViewing(true);
        try {
            const data = await viewSharedData(inputAccessToken); 
            setSharedData(data);
        } catch (error) {
            setViewDataError(error.response?.data?.detail || 'Invalid or expired access token.');
        } finally {
            setIsViewing(false);
        }
    };

    // Chart Configuration
    const prepareChartData = () => {
        if (!sharedData?.user_data_trends) return null;
        const sorted = [...sharedData.user_data_trends].reverse();
        return {
            labels: sorted.map(e => moment(e.entry_date).format('MMM D')),
            datasets: [{
                label: 'Mood Level',
                data: sorted.map(e => e.mood_score),
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.05)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#3b82f6'
            }]
        };
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 lg:p-16 relative overflow-x-hidden font-sans">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[100px]" />

            <div className="max-w-4xl mx-auto relative z-10 text-center">
                <header className="mb-16">
                    <button onClick={() => navigate('/dashboard')} className="text-blue-400 font-black mb-8 tracking-[0.5em] text-[10px] uppercase hover:text-[#FFD700] transition-colors">
                        &larr; EXIT TO HUB
                    </button>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none">
                        Viewer <span className="text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">Access</span>
                    </h1>
                </header>

                {/* TOKEN GENERATION SECTION */}
                <div className="bg-blue-900/10 border border-blue-500/10 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl mb-12">
                    {generatedTokenInfo ? (
                        <div className="space-y-6">
                            <h3 className="text-xl font-black italic uppercase text-blue-300">Access Active for {generatedTokenInfo.professional_name}</h3>
                            <div className="bg-[#020617] p-5 rounded-2xl border border-[#FFD700]/30">
                                <code className="text-2xl font-black text-[#FFD700] tracking-widest">{generatedTokenInfo.access_token}</code>
                            </div>
                            <p className="text-[10px] text-blue-400/50 uppercase font-black">Expires: {moment(generatedTokenInfo.expires_at).format('LLL')}</p>
                            <button onClick={handleRevokeToken} className="px-10 py-4 bg-red-600/20 text-red-500 border border-red-600/30 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all">Revoke Access</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <input type="text" placeholder="Professional Name" className="w-full p-5 bg-blue-950/20 rounded-2xl border border-blue-500/10 outline-none" value={professionalName} onChange={(e) => setProfessionalName(e.target.value)} />
                            <input type="number" className="w-full p-5 bg-blue-950/20 rounded-2xl border border-blue-500/10 outline-none" value={durationHours} onChange={(e) => setDurationHours(parseInt(e.target.value))} />
                            <button onClick={handleGenerateToken} disabled={isGenerating} className="w-full p-5 bg-[#FFD700] text-black rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl">{isGenerating ? 'Generating...' : 'Generate Neural Token'}</button>
                        </div>
                    )}
                </div>

                {/* VIEW DATA SECTION */}
                <div className="bg-blue-900/10 border border-blue-500/10 p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
                    <input type="text" placeholder="Paste Access Token" className="w-full p-5 bg-blue-950/20 rounded-2xl border border-blue-500/10 outline-none mb-6" value={inputAccessToken} onChange={(e) => setInputAccessToken(e.target.value)} />
                    <button onClick={handleViewSharedData} disabled={isViewing} className="w-full p-5 bg-emerald-500 text-[#020617] rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl mb-6">{isViewing ? 'Fetching...' : 'View Shared Trends'}</button>

                    {viewDataError && <p className="text-red-400 text-xs mb-4">{viewDataError}</p>}

                    {/* 🔥 FEATURE 1: Moodgraphy */}
                    {sharedData?.user_data_trends && (
                        <div className="mt-8 space-y-12">
                            <div className="bg-blue-950/40 border border-blue-500/10 p-8 rounded-[3rem] h-[350px]">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FFD700] mb-6 text-left ml-4">Neural Trajectory Map</h4>
                                <Line 
                                    data={prepareChartData()} 
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: { 
                                            y: { min: 0, max: 10, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#3b82f6' } },
                                            x: { grid: { display: false }, ticks: { color: '#64748B' } }
                                        },
                                        plugins: { legend: { display: false } }
                                    }} 
                                />
                            </div>

                            {/* 🔥 FEATURE 2: Detailed Entries */}
                            <div className="space-y-4 text-left">
                                <div className="flex justify-between items-center mb-6 px-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Shared Neural Logs (Total: {sharedData.user_data_trends.length})</h4>
                                </div>
                                {sharedData.user_data_trends.map((entry, idx) => (
                                    <div key={idx} className="bg-[#020617]/40 border border-blue-500/10 p-8 rounded-[2.5rem] hover:border-[#FFD700]/30 transition-all group shadow-xl">
                                        <div className="flex justify-between mb-4">
                                            <p className="text-[10px] font-black text-blue-400/50 uppercase tracking-widest">{moment(entry.entry_date).format('MMMM D, YYYY')}</p>
                                            <span className="px-4 py-1 bg-[#FFD700]/10 text-[#FFD700] rounded-full text-[10px] font-black border border-[#FFD700]/20">SCORE: {entry.mood_score}/10</span>
                                        </div>
                                        <p className="text-blue-100 italic text-lg leading-relaxed group-hover:text-white transition-colors">"{entry.journal_entry}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareData;