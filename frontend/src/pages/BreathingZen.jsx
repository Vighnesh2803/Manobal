import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BreathingZen = () => {
    const [phase, setPhase] = useState('Inhale'); 
    const [xp, setXp] = useState(() => parseInt(localStorage.getItem('zen_xp')) || 0);

    useEffect(() => {
        let timeout;
        if (phase === 'Inhale') {
            timeout = setTimeout(() => setPhase('Hold'), 4000);
        } else if (phase === 'Hold') {
            timeout = setTimeout(() => setPhase('Exhale'), 7000);
        } else {
            timeout = setTimeout(() => {
                setPhase('Inhale');
                const newXp = xp + 15; 
                setXp(newXp);
                localStorage.setItem('zen_xp', newXp);
            }, 8000);
        }
        return () => clearTimeout(timeout);
    }, [phase, xp]);

    // Blue & Gold Dynamic Styles
    const getPhaseColor = () => {
        if (phase === 'Inhale') return 'from-blue-600 to-blue-400 shadow-blue-500/40';
        if (phase === 'Hold') return 'from-[#FFD700] to-[#B8860B] shadow-yellow-500/40';
        return 'from-blue-400 to-indigo-600 shadow-blue-400/40';
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 overflow-hidden relative font-sans">
            
            {/* 🌌 Ambient Background Glows */}
            <div className={`absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 transition-all duration-[3000ms] ${
                phase === 'Hold' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />

            <style>{`
                @keyframes 3d-morph {
                    0% { transform: scale(1) rotate(0deg); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                    50% { transform: scale(1.6) rotate(180deg); border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
                    100% { transform: scale(1) rotate(360deg); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                }
                .morph-sphere {
                    animation: 3d-morph ${phase === 'Inhale' ? '4s' : phase === 'Hold' ? '7s' : '8s'} ease-in-out infinite;
                }
            `}</style>

            <header className="absolute top-10 w-full max-w-7xl flex justify-between px-10 z-20">
                <Link to="/dashboard" className="group flex items-center gap-2 text-blue-400 font-black uppercase text-[10px] tracking-[0.4em] hover:text-[#FFD700] transition-all">
                    <span className="text-xl group-hover:-translate-x-2 transition-transform">&larr;</span> EXIT ZEN NODE
                </Link>
                <div className="bg-blue-900/10 backdrop-blur-3xl border border-blue-500/20 px-10 py-5 rounded-[2.5rem] text-right shadow-2xl">
                    <p className="text-[10px] text-[#FFD700] font-black tracking-widest uppercase mb-1 opacity-70">Total Zen XP</p>
                    <p className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{xp}</p>
                </div>
            </header>

            {/* 🏮 The Morphing Sphere (Blue & Gold Accents) */}
            <div className={`morph-sphere w-64 h-64 bg-gradient-to-tr ${getPhaseColor()} shadow-[0_0_120px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-[2000ms] border border-white/10`}>
                <div className="w-full h-full rounded-full border-4 border-white/10 animate-pulse scale-90" />
                <div className="absolute w-full h-full rounded-full border-2 border-[#FFD700]/20 animate-ping scale-75" />
            </div>

            <div className="mt-28 text-center z-10">
                <p className="text-blue-400 font-black tracking-[1em] uppercase text-[10px] mb-6 opacity-40">Neural Resonance Mode</p>
                <h2 className={`text-9xl font-black italic uppercase tracking-tighter transition-all duration-1000 ${
                    phase === 'Hold' ? 'text-[#FFD700] drop-shadow-[0_0_30px_rgba(255,215,0,0.3)]' : 'text-white'
                }`}>
                    {phase}
                </h2>
                
                {/* ⏱️ Timing Indicators */}
                <div className="mt-10 flex justify-center gap-4">
                    {[4, 7, 8].map((num, i) => (
                        <div key={i} className={`px-6 py-2 rounded-2xl text-[11px] font-black border transition-all duration-500 ${
                            (phase === 'Inhale' && i === 0) || (phase === 'Hold' && i === 1) || (phase === 'Exhale' && i === 2)
                            ? 'bg-[#FFD700] text-[#020617] border-[#FFD700] scale-110 shadow-lg shadow-yellow-500/20' : 'border-blue-500/20 text-blue-500/40'
                        }`}>
                            {num}S
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BreathingZen;