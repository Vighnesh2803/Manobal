import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MoodLog = () => {
    const navigate = useNavigate();
    const [journal, setJournal] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const userId = localStorage.getItem('manobal_user_id') || 14;
            // Clean model name fix for your 404 error
            const response = await axios.post('http://localhost:8000/ai/mood_rating', {
                user_id: userId,
                prompt: journal
            });
            setAnalysisResult(response.data);
        } catch (error) {
            setAnalysisResult({ 
                mood_score: 5, 
                analysis: "AI is reflecting. Please try in a moment!" 
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white p-6 lg:p-12 relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[100px]"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header Section */}
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
                    <p className="text-slate-500 mt-6 text-xl italic font-medium max-w-2xl">
                        "Your words are the mirror of your soul. Let our AI help you understand the colors of your mind today."
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Input Section (Journaling Area) */}
                    <div className="lg:col-span-7">
                        <div className="bg-slate-900/30 backdrop-blur-3xl border border-white/5 p-8 lg:p-10 rounded-[4rem] shadow-2xl relative">
                            <div className="absolute top-8 right-10 text-4xl animate-bounce">✍️</div>
                            <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tight text-indigo-400">Deep Reflection</h2>
                            
                            <textarea 
                                value={journal}
                                onChange={(e) => setJournal(e.target.value)}
                                placeholder="Aaj kaisa feel kar rahe ho? Dil khol kar likho..." 
                                className="w-full h-80 bg-black/40 border border-white/10 rounded-[2.5rem] p-8 text-xl text-slate-200 outline-none focus:border-amber-500/50 transition-all resize-none placeholder:text-slate-700"
                            />

                            <button 
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !journal}
                                className={`w-full mt-8 py-6 rounded-full font-black uppercase tracking-widest text-sm transition-all shadow-xl flex items-center justify-center gap-4 ${
                                    isAnalyzing 
                                    ? 'bg-slate-800 text-slate-500' 
                                    : 'bg-white text-black hover:bg-amber-500 hover:scale-[1.02] active:scale-95'
                                }`}
                            >
                                {isAnalyzing ? 'Decoding Emotions...' : 'ANALYZE WITH MANOBAL AI →'}
                            </button>
                        </div>
                    </div>

                    {/* AI PERSPECTIVE (Result Area) */}
                    <div className="lg:col-span-5">
                        <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[4rem] h-full flex flex-col justify-center relative overflow-hidden group">
                            {/* Decorative Grid */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
                            
                            <div className="relative z-10 text-center">
                                <span className="text-xs font-black uppercase tracking-[0.4em] text-amber-500 mb-8 block">AI PERSPECTIVE</span>
                                
                                {analysisResult ? (
                                    <div className="animate-in fade-in zoom-in duration-700">
                                        <div className="text-8xl font-black italic tracking-tighter text-white mb-2 leading-none">
                                            {analysisResult.mood_score}<span className="text-3xl text-indigo-500">/10</span>
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-10">VIBE INTENSITY</p>
                                        
                                        <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5 text-left italic leading-relaxed text-slate-300">
                                            "{analysisResult.analysis}"
                                        </div>
                                        
                                        <button 
                                            onClick={() => navigate('/analysis')}
                                            className="mt-10 text-xs font-black text-amber-500 underline underline-offset-8 hover:text-white transition-colors"
                                        >
                                            VIEW HISTORICAL TRENDS
                                        </button>
                                    </div>
                                ) : (
                                    <div className="py-20 opacity-30 italic font-medium text-slate-500">
                                        Waiting for your words <br /> to begin the analysis...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mood Quick-Selection (Future feature preview) */}
                <footer className="mt-20 flex flex-wrap justify-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
                    {['😔', '😐', '😊', '🔥', '🌊'].map((emo, i) => (
                        <div key={i} className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl cursor-pointer hover:bg-amber-500 transition-all hover:scale-110">
                            {emo}
                        </div>
                    ))}
                </footer>
            </div>
        </div>
    );
};

export default MoodLog;