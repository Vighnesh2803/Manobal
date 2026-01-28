// file: frontend/src/pages/RelaxGame.jsx (ULTRA-STABLE FINAL VERSION)

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const RelaxGame = () => {
    const [currentGame, setCurrentGame] = useState('menu');
    const [xp, setXp] = useState(() => parseInt(localStorage.getItem('zen_xp')) || 0);
    const [userLevel, setUserLevel] = useState(5); 

    useEffect(() => {
        localStorage.setItem('zen_xp', xp);
    }, [xp]);

    const addXP = useCallback((amount) => setXp(prev => prev + amount), []);

    // --- GAME 1: CYBER SHOOTER (Reflex) ---
    const CyberShooter = () => {
        const [pos, setPos] = useState({ x: 50, y: 50 });
        const [hits, setHits] = useState(0);
        const targetSize = Math.max(100 - (userLevel * 7), 30);
        const moveInterval = Math.max(1300 - (userLevel * 100), 250);

        useEffect(() => {
            const timer = setInterval(() => {
                setPos({ x: Math.random() * 80 + 10, y: Math.random() * 70 + 15 });
            }, moveInterval);
            return () => clearInterval(timer);
        }, [moveInterval]);

        return (
            <div className="relative w-full h-[400px] bg-black border-4 border-cyan-500/30 rounded-[3rem] overflow-hidden shadow-2xl flex items-center justify-center">
                <div className="absolute top-6 left-10 z-20 text-4xl font-black text-white italic">HITS: {hits}</div>
                <button 
                    onMouseDown={(e) => { e.stopPropagation(); setHits(h => h + 1); addXP(10 * userLevel); setPos({ x: Math.random() * 80 + 10, y: Math.random() * 70 + 15 }); }}
                    className="absolute border-4 border-cyan-400 rounded-xl shadow-[0_0_30px_#22d3ee] active:scale-50 transition-all duration-150 flex items-center justify-center cursor-crosshair"
                    style={{ width: `${targetSize}px`, height: `${targetSize}px`, left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                </button>
            </div>
        );
    };

    // --- GAME 2: MEMORY FLASH (Focus) ---
    const MemoryFlash = () => {
        const [active, setActive] = useState(null);
        const [streak, setStreak] = useState(0);
        const speed = Math.max(1500 - (userLevel * 130), 200);

        useEffect(() => {
            const timer = setInterval(() => setActive(Math.floor(Math.random() * 4)), speed);
            return () => clearInterval(timer);
        }, [speed]);

        return (
            <div className="flex flex-col items-center gap-10">
                <div className="bg-amber-500 text-black px-8 py-2 rounded-full font-black text-xs uppercase shadow-lg">STREAK: {streak}</div>
                <div className="flex gap-6">
                    {['⚡', '🔥', '💎', '🪐'].map((icon, i) => (
                        <div key={i} onClick={() => { if(active === i) { setStreak(s => s + 1); addXP(15 * userLevel); } else { setStreak(0); } }} 
                            className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl cursor-pointer transition-all ${active === i ? 'bg-amber-500 shadow-[0_0_50px_#f59e0b] scale-110' : 'bg-slate-900 border-2 border-slate-800'}`}>{icon}</div>
                    ))}
                </div>
            </div>
        );
    };

    // --- GAME 3: ZEN SMASHER (FIXED: Single Smash Logic) ---
    const ZenSmasher = () => {
        const [items, setItems] = useState([]);
        const spawnRate = Math.max(2000 - (userLevel * 180), 400);

        useEffect(() => {
            const spawn = setInterval(() => {
                const id = Math.random().toString(36).substr(2, 9);
                setItems(prev => [...prev, { id, x: Math.random() * 85 + 5 }]);
                setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 3000);
            }, spawnRate);
            return () => clearInterval(spawn);
        }, [spawnRate]);

        const handleSmash = (id) => {
            setItems(prev => prev.filter(item => item.id !== id)); // Fixed: Removes ONLY one item
            addXP(25);
        };

        return (
            <div className="relative w-full h-[400px] bg-slate-950 border-4 border-red-500/20 rounded-[3rem] overflow-hidden">
                <style>{` @keyframes slide-up { from { bottom: -15%; } to { bottom: 115%; } } .s-btn { animation: slide-up 3s linear forwards; } `}</style>
                {items.map((item) => (
                    <button key={item.id} onMouseDown={() => handleSmash(item.id)}
                        className="s-btn absolute px-6 py-3 bg-red-600 border-b-4 border-red-900 rounded-xl font-black text-white text-xs active:scale-75 shadow-xl"
                        style={{ left: `${item.x}%` }}>SMASH</button>
                ))}
            </div>
        );
    };

    // --- GAME 4: COSMIC ORBIT (Flow) ---
    const CosmicOrbit = () => {
        const [orbit, setOrbit] = useState({ x: 50, y: 50 });
        const speed = Math.max(1200 - (userLevel * 100), 200);

        useEffect(() => {
            const timer = setInterval(() => {
                setOrbit({ x: Math.random() * 70 + 15, y: Math.random() * 60 + 20 });
            }, speed);
            return () => clearInterval(timer);
        }, [speed]);

        return (
            <div onMouseMove={() => addXP(1)} className="relative w-full h-[400px] bg-black rounded-[3rem] border-2 border-indigo-500/30 overflow-hidden cursor-crosshair flex items-center justify-center">
                <div className="absolute w-4 h-4 bg-indigo-400 rounded-full shadow-[0_0_20px_#818cf8] transition-all duration-500 ease-out"
                    style={{ left: `${orbit.x}%`, top: `${orbit.y}%`, transform: 'translate(-50%, -50%)' }} />
                <p className="text-[10px] text-slate-700 font-black tracking-[0.6em] uppercase">Follow the Pulse</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white p-6 select-none">
            {/* Achievement Header */}
            <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 p-8 bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-2xl">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase">VIGHNESH<span className="text-cyan-400">.ARENA</span></h1>
                    <div className="mt-4 flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Level Selector:</span>
                        <input type="range" min="1" max="10" value={userLevel} onChange={(e) => setUserLevel(parseInt(e.target.value))} className="w-32 accent-cyan-400 cursor-pointer" />
                        <span className="text-cyan-400 font-black text-xl">{userLevel}</span>
                    </div>
                </div>
                <div className="bg-cyan-500 text-black px-12 py-6 rounded-[2.5rem] font-black text-5xl shadow-[0_0_50px_rgba(34,211,238,0.4)] border-b-8 border-cyan-800">
                    {xp} <span className="text-xs">XP</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto">
                {currentGame === 'menu' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        {[
                            { id: 'shooter', icon: '🎯', name: 'Cyber Shooter', color: 'hover:border-cyan-500' },
                            { id: 'memory', icon: '💎', name: 'Memory Flash', color: 'hover:border-amber-500' },
                            { id: 'smasher', icon: '🥊', name: 'Zen Smasher', color: 'hover:border-red-500' },
                            { id: 'orbit', icon: '🌀', name: 'Cosmic Orbit', color: 'hover:border-indigo-500' }
                        ].map(game => (
                            <div key={game.id} onClick={() => setCurrentGame(game.id)} className={`group p-10 bg-slate-900/30 border-2 border-slate-800 rounded-[3.5rem] cursor-pointer transition-all hover:-translate-y-4 hover:bg-slate-900 ${game.color} shadow-xl`}>
                                <span className="text-6xl block mb-6 group-hover:rotate-12 transition-transform">{game.icon}</span>
                                <h3 className="text-2xl font-black uppercase tracking-tight italic">{game.name}</h3>
                                <p className="text-slate-600 text-[10px] font-bold mt-2 uppercase tracking-widest">Start Arena &rarr;</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center animate-in zoom-in duration-300">
                        {currentGame === 'shooter' && <CyberShooter />}
                        {currentGame === 'memory' && <MemoryFlash />}
                        {currentGame === 'smasher' && <ZenSmasher />}
                        {currentGame === 'orbit' && <CosmicOrbit />}
                        <button onClick={() => setCurrentGame('menu')} className="mt-16 px-12 py-4 border-2 border-slate-800 rounded-full text-slate-500 font-black text-[10px] tracking-[0.5em] hover:text-white hover:border-cyan-500 uppercase transition-all shadow-xl">Quit Session</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RelaxGame;