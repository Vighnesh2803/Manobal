import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addMoodEntry } from '../api';   // ✅ IMPORTANT

const MoodLog = () => {
    const navigate = useNavigate();
    const [journal, setJournal] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    const userId = localStorage.getItem('manobal_user_id');

    // =========================
    // 1️⃣ AI ANALYSIS
    // =========================
    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const response = await axios.post(
                'http://localhost:8000/ai/mood_rating',
                {
                    user_id: parseInt(userId),
                    prompt: journal
                }
            );

            setAnalysisResult({
                mood_score: response.data.mood_score || 5,
                analysis: response.data.analysis || "Reflection complete."
            });

        } catch (error) {
            console.error("AI Error:", error);
            setAnalysisResult({
                mood_score: 5,
                analysis: "AI is reflecting. You can still save your journal."
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    // =========================
    // 2️⃣ SAVE MOOD (STREAK AUTO)
    // =========================
    const handleSaveAndStreak = async () => {
        setIsAnalyzing(true);
        try {
            await addMoodEntry(
                userId,
                analysisResult?.mood_score || 5,
                journal,
                analysisResult?.analysis || "Personal Reflection"
            );

            setIsSaved(true);
            alert("🔥 Mood Saved & Streak Updated!");

            setTimeout(() => {
                navigate('/dashboard');
            }, 1200);

        } catch (error) {
            console.error("Save Error:", error);
            alert("Failed to save. Check backend connection.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white p-6 lg:p-12 relative overflow-hidden font-sans">
            {/* 🔥 DESIGN UNCHANGED */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[100px]"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <header className="mb-16 text-center lg:text-left">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-amber-500 font-black tracking-[0.2em] text-xs uppercase mb-6 hover:text-white transition-colors"
                    >
                        ← BACK TO HUB
                    </button>
                    <h1 className="text-6xl lg:text-8xl font-black italic tracking-tighter uppercase leading-none">
                        MOOD <span className="text-amber-500 underline decoration-indigo-500/30">SANCTUARY</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7">
                        <div className="bg-slate-900/30 backdrop-blur-3xl border border-white/5 p-8 lg:p-10 rounded-[4rem] shadow-2xl relative">
                            <div className="absolute top-8 right-10 text-4xl animate-bounce">✍️</div>

                            <textarea
                                value={journal}
                                onChange={(e) => setJournal(e.target.value)}
                                disabled={isSaved}
                                placeholder="Aaj kaisa feel kar rahe ho? Dil khol kar likho..."
                                className="w-full h-80 bg-black/40 border border-white/10 rounded-[2.5rem] p-8 text-xl text-slate-200 outline-none resize-none"
                            />

                            {!analysisResult ? (
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || !journal}
                                    className="w-full mt-8 py-6 rounded-full font-black uppercase tracking-widest bg-white text-black hover:bg-amber-500"
                                >
                                    {isAnalyzing ? 'Decoding Emotions...' : 'ANALYZE WITH MANOBAL AI →'}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSaveAndStreak}
                                    disabled={isAnalyzing || isSaved}
                                    className="w-full mt-8 py-6 rounded-full font-black uppercase tracking-widest bg-emerald-500 text-black hover:bg-white"
                                >
                                    {isAnalyzing ? 'Saving Entry...' : isSaved ? '✓ SAVED' : 'SAVE LOG & LEVEL UP 🔥'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-slate-900/40 p-10 rounded-[4rem] h-full flex flex-col justify-center">
                            {analysisResult ? (
                                <>
                                    <div className="text-8xl font-black italic text-white mb-4">
                                        {analysisResult.mood_score}
                                        <span className="text-3xl text-indigo-500">/10</span>
                                    </div>
                                    <p className="italic text-slate-300">
                                        "{analysisResult.analysis}"
                                    </p>
                                </>
                            ) : (
                                <p className="italic text-slate-500">
                                    Waiting for your words to begin the analysis...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoodLog;
