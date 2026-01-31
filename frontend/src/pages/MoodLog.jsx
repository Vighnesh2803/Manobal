import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addMoodEntry } from '../api'; // api.js se import

const MoodLog = () => {
    const navigate = useNavigate();
    const [journal, setJournal] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    const userId = parseInt(localStorage.getItem('manobal_user_id')); //

    // =========================
    // 1️⃣ AI Analysis (Blue & Gold UI)
    // =========================
    const handleAnalyze = async () => {
        if (!journal.trim() || !userId) return;
        setIsAnalyzing(true);
        try {
            const response = await axios.post(
                'http://localhost:8000/ai/mood_rating',
                { user_id: userId, prompt: journal }
            );

            setAnalysisResult({
                mood_score: response.data.mood_score,
                analysis: response.data.analysis
            });
        } catch (error) {
            console.error("AI Error:", error);
            // AI Fail hone par user ko manual save ka rasta dikhayenge
            alert("AI Quota limit reached. You can still save manually below.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // =========================
    // 2️⃣ Save & Streak Sync (Fixed for New Accounts)
    // =========================
    const handleSaveEntry = async (manual = false) => {
        if (!userId) {
            alert("Session expired. Please login again.");
            navigate('/login');
            return;
        }

        setIsAnalyzing(true);
        try {
            // Agar manual save hai toh default score 5 aur fallback text bhejenge
            const score = manual ? 5 : (analysisResult?.mood_score || 5);
            const feedback = manual ? "Manual Entry (Self-Reflective)" : (analysisResult?.analysis || "Entry logged.");

            await addMoodEntry(userId, score, journal, feedback);

            setIsSaved(true);
            setTimeout(() => { navigate('/dashboard'); }, 1500);
        } catch (error) {
            console.error("Save Error:", error);
            alert("Connection error. Ensure backend is running.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 relative overflow-hidden font-sans">
            {/* 🌌 Background Orbs (Blue & Gold Theme) */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px]" />

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="mb-12 flex justify-between items-center">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 text-blue-400 font-black uppercase tracking-widest text-[10px] hover:text-[#FFD700] transition-colors">
                        <span className="bg-blue-500/10 p-3 rounded-full border border-blue-500/20">← EXIT NEURAL LINK</span>
                    </button>
                    <div className="px-5 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                        <p className="text-[10px] text-[#FFD700] font-black tracking-[0.3em] uppercase animate-pulse">Neural Node: Online</p>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* 🧠 Writing Area */}
                    <div className="lg:col-span-8">
                        <h1 className="text-6xl font-black mb-8 tracking-tighter italic leading-none">
                            How's your <span className="text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">Mind</span> today?
                        </h1>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-[#FFD700] rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                            <textarea
                                value={journal}
                                onChange={(e) => setJournal(e.target.value)}
                                placeholder="Pour your thoughts into the neural system..."
                                disabled={isSaved || isAnalyzing}
                                className="relative w-full h-[450px] bg-blue-950/20 backdrop-blur-3xl border border-blue-500/20 rounded-[3rem] p-12 focus:outline-none focus:border-[#FFD700]/50 transition-all text-xl leading-relaxed resize-none shadow-2xl placeholder-blue-300/20 italic"
                            />
                        </div>
                    </div>

                    {/* 📊 AI Analysis & Controls */}
                    <div className="lg:col-span-4 flex flex-col justify-end gap-6">
                        {analysisResult ? (
                            <div className="bg-blue-900/10 border border-blue-500/20 rounded-[2.5rem] p-8 animate-in zoom-in-95 duration-500">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-ping" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Neural Insight</span>
                                </div>
                                <div className="mb-8">
                                    <span className="text-6xl font-black italic text-[#FFD700]">{analysisResult.mood_score}</span>
                                    <span className="text-blue-400/50 font-bold ml-2">/10</span>
                                    <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-2 opacity-50">Vibe Intensity</p>
                                </div>
                                <p className="text-blue-100/70 italic text-sm leading-relaxed border-l-2 border-[#FFD700]/30 pl-4">
                                    "{analysisResult.analysis}"
                                </p>
                            </div>
                        ) : (
                            <div className="bg-blue-500/5 border border-dashed border-blue-500/20 rounded-[2.5rem] p-10 text-center">
                                <p className="text-blue-300/30 text-xs italic font-medium leading-relaxed">
                                    Your entries are processed by Manobal's neural engine for deep emotional trends.
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {!analysisResult ? (
                                <>
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing || !journal.trim()}
                                        className="w-full py-6 rounded-[2rem] bg-[#FFD700] text-[#020617] font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-xl shadow-yellow-500/10 disabled:opacity-20 active:scale-95"
                                    >
                                        {isAnalyzing ? "Syncing Neurons..." : "Analyze Emotion →"}
                                    </button>
                                    
                                    {/* Manual Save Button (Fallback) */}
                                    <button
                                        onClick={() => handleSaveEntry(true)}
                                        disabled={isAnalyzing || !journal.trim()}
                                        className="w-full py-6 rounded-[2rem] border border-blue-500/30 bg-blue-500/5 text-blue-400 font-black uppercase tracking-widest text-[11px] hover:bg-blue-500/10 transition-all"
                                    >
                                        Bypass AI & Save
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleSaveEntry(false)}
                                    disabled={isAnalyzing || isSaved}
                                    className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 transition-all"
                                >
                                    {isSaved ? "Entry Secured ✓" : "Commit to Neural Link 🔥"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoodLog;


