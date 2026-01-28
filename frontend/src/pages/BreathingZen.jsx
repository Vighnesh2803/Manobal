// file: frontend/src/pages/BreathingZen.jsx (ULTRA-ATTRACTIVE 3D EDITION)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BreathingZen = () => {
    const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale
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
                const newXp = xp + 15; // Higher reward for mindfulness
                setXp(newXp);
                localStorage.setItem('zen_xp', newXp);
            }, 8000);
        }
        return () => clearTimeout(timeout);
    }, [phase, xp]);

    // Dynamic styles based on breathing phase
    const getPhaseColor = () => {
        if (phase === 'Inhale') return 'from-cyan-400 to-blue-600 shadow-cyan-500/50';
        if (phase === 'Hold') return 'from-purple-500 to-indigo-700 shadow-purple-500/50';
        return 'from-emerald-400 to-teal-600 shadow-emerald-500/50';
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6 overflow-hidden relative">
            {/* Ambient Background Glow */}
            <div className={`absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 transition-all duration-[3000ms] ${
                phase === 'Inhale' ? 'bg-cyan-500' : phase === 'Hold' ? 'bg-purple-500' : 'bg-emerald-500'
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
                <Link to="/dashboard" className="group flex items-center gap-2 text-slate-500 font-black uppercase text-xs tracking-[0.3em] hover:text-white transition-all">
                    <span className="text-xl group-hover:-translate-x-2 transition-transform">&larr;</span> EXIT ZEN
                </Link>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 px-8 py-4 rounded-3xl text-right">
                    <p className="text-[10px] text-blue-400 font-black tracking-widest uppercase mb-1">Total Zen XP</p>
                    <p className="text-4xl font-black italic tracking-tighter text-white">{xp}</p>
                </div>
            </header>

            {/* The Main 3D Morphing Sphere */}
            <div className={`morph-sphere w-64 h-64 bg-gradient-to-tr ${getPhaseColor()} shadow-[0_0_100px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-[2000ms]`}>
                <div className="w-full h-full rounded-full border-4 border-white/20 animate-pulse scale-90" />
                <div className="absolute w-full h-full rounded-full border-2 border-white/10 animate-ping scale-75" />
            </div>

            <div className="mt-24 text-center z-10">
                <p className="text-slate-500 font-black tracking-[0.8em] uppercase text-[10px] mb-4 opacity-50">Deep Relaxation Mode</p>
                <h2 className={`text-8xl font-black italic uppercase tracking-tighter transition-colors duration-1000 ${
                    phase === 'Inhale' ? 'text-cyan-400' : phase === 'Hold' ? 'text-purple-400' : 'text-emerald-400'
                }`}>
                    {phase}
                </h2>
                <div className="mt-6 flex justify-center gap-2">
                    {[4, 7, 8].map((num, i) => (
                        <span key={i} className={`w-12 py-1 rounded-full text-[10px] font-black border ${
                            (phase === 'Inhale' && i === 0) || (phase === 'Hold' && i === 1) || (phase === 'Exhale' && i === 2)
                            ? 'bg-white text-black border-white' : 'border-white/20 text-white/20'
                        }`}>
                            {num}s
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BreathingZen;