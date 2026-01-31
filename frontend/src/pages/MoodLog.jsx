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

    const userId = parseInt(localStorage.getItem('manobal_user_id'));

    // =========================
    // 1️⃣ AI Analysis (FIXED SYNC)
    // =========================
    const handleAnalyze = async () => {
        if (!journal.trim() || !userId) return;

        setIsAnalyzing(true);
        try {
            // Frontend 'prompt' bhej raha hai jo backend 'ChatRequest' model se match karta hai
            const response = await axios.post(
                'http://localhost:8000/ai/mood_rating',
                { 
                    user_id: userId, 
                    prompt: journal 
                }
            );

            // Backend se aane wale score aur analysis ko state mein set karna
            setAnalysisResult({
                mood_score: response.data.mood_score,
                analysis: response.data.analysis
            });

        } catch (error) {
            console.error("AI Error:", error);
            // Fallback score 5 agar AI response na de
            setAnalysisResult({
                mood_score: 5,
                analysis: "Manobal is reflecting. You can still save your journal."
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    // =========================
    // 2️⃣ Save Mood & Sync Streak (FIXED LOGIC)
    // =========================
    const handleSaveAndStreak = async () => {
        if (!userId) {
            alert("Session expired. Please login again.");
            navigate('/login');
            return;
        }

        setIsAnalyzing(true);
        try {
            // FIXED: addMoodEntry call backend ke '/moods' endpoint ko hit karega
            // Isse database mein entry hogi aur streak logic trigger hoga
            await addMoodEntry(
                userId,
                analysisResult?.mood_score || 5,
                journal,
                analysisResult?.analysis || "Personal Reflection"
            );

            setIsSaved(true);
            
            // Streak update hone ke baad dashboard reload zaroori hai
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            console.error("Save Error:", error);
            alert("Database connection failed. Check if Backend is running at :8000");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 lg:p-12 relative overflow-hidden font-sans">
            {/* Background Aesthetic Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="mb-10 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all font-bold uppercase tracking-widest text-xs"
                    >
                        <span className="bg-white/10 p-2 rounded-full group-hover:bg-white/20">←</span>
                        Back to Hub
                    </button>
                    <div className="text-right">
                        <p className="text-[10px] text-indigo-400 font-black tracking-[0.3em] uppercase">System: Active</p>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Writing Area */}
                    <div className="lg:col-span-8">
                        <h1 className="text-5xl font-black mb-6 tracking-tighter italic">
                            How's your <span className="text-indigo-500">Mind</span> today?
                        </h1>
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <textarea
                                value={journal}
                                onChange={(e) => setJournal(e.target.value)}
                                placeholder="Start typing your thoughts..."
                                disabled={isSaved || isAnalyzing}
                                className="relative w-full h-[450px] bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 focus:outline-none focus:border-indigo-500/50 transition-all text-xl leading-relaxed resize-none shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* AI Feedback & Buttons */}
                    <div className="lg:col-span-4 flex flex-col justify-end">
                        {analysisResult ? (
                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">AI Intelligence</span>
                                </div>
                                <div className="mb-6">
                                    <span className="text-5xl font-black italic">{analysisResult.mood_score}</span>
                                    <span className="text-gray-500 font-bold">/10</span>
                                    <p className="text-[10px] text-gray-500 uppercase mt-1">Vibe Intensity</p>
                                </div>
                                <p className="text-gray-300 italic leading-relaxed text-sm italic">
                                    "{analysisResult.analysis}"
                                </p>
                            </div>
                        ) : (
                            <div className="bg-indigo-500/5 border border-dashed border-white/10 rounded-[2.5rem] p-8 mb-6 text-center">
                                <p className="text-gray-500 text-xs italic italic">Write your feelings for deep neural analysis.</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Step 1: Analyze pehle trigger hona chahiye taaki score fetch ho */}
                            {!analysisResult ? (
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || !journal.trim()}
                                    className="w-full py-6 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-indigo-500 hover:text-white transition-all shadow-xl disabled:opacity-30 active:scale-95"
                                >
                                    {isAnalyzing ? "Processing Neural Data..." : "Analyze Emotion →"}
                                </button>
                            ) : (
                                /* Step 2: Analysis milne ke baad Save button aayega */
                                <button
                                    onClick={handleSaveAndStreak}
                                    disabled={isAnalyzing || isSaved}
                                    className="w-full py-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
                                >
                                    {isSaved ? "Entry Secured ✓" : "Commit to History 🔥"}
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


