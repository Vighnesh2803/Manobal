import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        { id: "01", title: "Neural Mood Log", desc: "Journal your thoughts and receive deep AI-driven emotional insights." },
        { id: "02", title: "Empathetic Chatbot", desc: "A non-judgmental AI companion available 24/7 for immediate support." },
        { id: "03", title: "Trusted Access", desc: "Generate secure tokens to share your trajectory with professionals." },
        { id: "04", title: "Zen Breathing", desc: "Guided 3D breathing patterns to help regulate stress and anxiety." }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-sans">
            {/* 🌌 Background Glows (Blue & Gold) */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
                
                {/* 🚀 Left Side: Brand & CTA */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <h1 className="text-9xl font-black tracking-tighter italic leading-none">
                            MANO<span className="text-[#FFD700] drop-shadow-[0_0_25px_rgba(255,215,0,0.4)]">BAL</span>
                        </h1>
                        <p className="text-xl text-blue-200/60 font-light max-w-lg leading-relaxed">
                            Your path to a <span className="text-white font-bold border-b-2 border-[#FFD700]">brighter tomorrow</span>. 
                            A compassionate neural ecosystem for mental resilience.
                        </p>
                    </div>

                    <div className="flex gap-6">
                        <button 
                            onClick={() => navigate('/login')}
                            className="px-12 py-4 bg-[#FFD700] text-[#020617] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-2xl shadow-yellow-500/20 active:scale-95"
                        >
                            Login
                        </button>
                        <button 
                            onClick={() => navigate('/register')}
                            className="px-12 py-4 border border-blue-500/30 bg-blue-500/5 backdrop-blur-xl font-black uppercase tracking-widest rounded-xl hover:bg-blue-500/10 transition-all"
                        >
                            Register
                        </button>
                    </div>
                </div>

                {/* 🏮 Right Side: Feature Grid */}
                <div className="space-y-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                        {features.map((f) => (
                            <div key={f.id} className="group p-8 rounded-[2.5rem] bg-blue-900/10 border border-blue-500/10 backdrop-blur-2xl hover:border-[#FFD700]/40 hover:-translate-y-2 transition-all duration-500 shadow-2xl">
                                <span className="text-[#FFD700] font-black text-xs tracking-widest mb-4 block opacity-50 group-hover:opacity-100">{f.id}</span>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-white group-hover:text-[#FFD700] transition-colors">{f.title}</h3>
                                <p className="text-xs text-blue-100/50 leading-relaxed italic italic">"{f.desc}"</p>
                            </div>
                        ))}
                    </div>
                    
                    {/* Additional Features Text */}
                    <div className="pt-4 px-4">
                        <p className="text-blue-400/50 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                            + Discover more advanced neural support features inside
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;