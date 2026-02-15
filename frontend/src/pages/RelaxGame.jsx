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
            <div className="relative w-full h-[450px] bg-black border-[6px] border-cyan-500/20 rounded-[4rem] overflow-hidden shadow-[0_0_80px_rgba(34,211,238,0.1)] flex items-center justify-center">
                <div className="absolute top-10 left-12 z-20 text-5xl font-black text-white italic tracking-tighter drop-shadow-2xl">HITS: {hits}</div>
                <button 
                    onMouseDown={(e) => { e.stopPropagation(); setHits(h => h + 1); addXP(10 * userLevel); setPos({ x: Math.random() * 80 + 10, y: Math.random() * 70 + 15 }); }}
                    className="absolute border-4 border-cyan-400 rounded-2xl shadow-[0_0_40px_#22d3ee] active:scale-50 transition-all duration-150 flex items-center justify-center cursor-crosshair group"
                    style={{ width: `${targetSize}px`, height: `${targetSize}px`, left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping group-hover:scale-150"></div>
                </button>
            </div>
        );
    };

    // --- GAME 2: MEMORY FLASH (RESIZED & STREAK REMOVED) ---
    const MemoryFlash = () => {
        const [active, setActive] = useState(null);
        const speed = Math.max(1500 - (userLevel * 130), 200);

        useEffect(() => {
            const timer = setInterval(() => setActive(Math.floor(Math.random() * 4)), speed);
            return () => clearInterval(timer);
        }, [speed]);

        return (
            <div className="flex flex-col items-center gap-12 p-12 bg-slate-900/20 rounded-[4rem] border border-white/5 backdrop-blur-xl">
                <p className="text-amber-500 font-black tracking-[0.8em] uppercase text-xs animate-pulse">Neural Synchronization Active</p>
                <div className="flex gap-8">
                    {['⚡', '🔥', '💎', '🪐'].map((icon, i) => (
                        <div key={i} onClick={() => { if(active === i) { addXP(15 * userLevel); } }} 
                            className={`w-32 h-32 rounded-[3rem] flex items-center justify-center text-6xl cursor-pointer transition-all duration-300 ${active === i ? 'bg-amber-500 shadow-[0_0_70px_#f59e0b] scale-110 -translate-y-2' : 'bg-slate-950 border-2 border-slate-800 hover:border-amber-500/50'}`}>{icon}</div>
                    ))}
                </div>
            </div>
        );
    };

    // --- GAME 3: ZEN SMASHER ---
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
            setItems(prev => prev.filter(item => item.id !== id));
            addXP(25);
        };

        return (
            <div className="relative w-full h-[450px] bg-slate-950 border-[6px] border-red-500/10 rounded-[4rem] overflow-hidden shadow-2xl">
                <style>{` @keyframes slide-up { from { bottom: -15%; } to { bottom: 115%; } } .s-btn { animation: slide-up 3s linear forwards; } `}</style>
                {items.map((item) => (
                    <button key={item.id} onMouseDown={() => handleSmash(item.id)}
                        className="s-btn absolute px-10 py-5 bg-gradient-to-t from-red-800 to-red-600 border-b-8 border-red-950 rounded-2xl font-black text-white text-sm active:scale-75 shadow-[0_10px_30px_rgba(220,38,38,0.4)] transition-transform"
                        style={{ left: `${item.x}%` }}>SMASH</button>
                ))}
            </div>
        );
    };

    // --- GAME 4: COSMIC ORBIT ---
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
            <div onMouseMove={() => addXP(1)} className="relative w-full h-[450px] bg-black rounded-[4rem] border-[6px] border-indigo-500/10 overflow-hidden cursor-crosshair flex items-center justify-center">
                <div className="absolute w-8 h-8 bg-indigo-400 rounded-full shadow-[0_0_50px_#818cf8] transition-all duration-700 ease-out"
                    style={{ left: `${orbit.x}%`, top: `${orbit.y}%`, transform: 'translate(-50%, -50%)' }} />
                <p className="text-[12px] text-slate-800 font-black tracking-[1em] uppercase animate-pulse">Neural Path Tracing...</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 select-none font-sans">
            {/* Achievement Header (Hyper-Attractive) */}
            <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16 p-10 bg-gradient-to-br from-slate-900/60 to-black/40 backdrop-blur-3xl rounded-[4rem] border border-white/10 shadow-[0_20px_100px_rgba(0,0,0,0.5)]">
                <div>
                    <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">RELAX<span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">.ARENA</span></h1>
                    <div className="mt-6 flex items-center gap-6 bg-black/40 p-4 rounded-3xl border border-white/5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Intensity:</span>
                        <input type="range" min="1" max="10" value={userLevel} onChange={(e) => setUserLevel(parseInt(e.target.value))} className="w-40 accent-cyan-400 cursor-pointer h-2" />
                        <span className="text-cyan-400 font-black text-2xl drop-shadow-md">{userLevel}</span>
                    </div>
                </div>
                <div className="relative group mt-8 md:mt-0">
                    <div className="absolute -inset-2 bg-cyan-500 rounded-[3.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative bg-black px-16 py-8 rounded-[3rem] font-black text-6xl border border-cyan-500/30 flex flex-col items-center">
                        <span className="text-cyan-400">{xp}</span>
                        <span className="text-[10px] text-slate-500 tracking-[0.5em] uppercase">Total Zen XP</span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto">
                {currentGame === 'menu' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {[
                            { id: 'shooter', icon: '🎯', name: 'Cyber Shooter', desc: 'Reflex Calibration', color: 'hover:border-cyan-500 hover:shadow-cyan-500/20' },
                            { id: 'memory', icon: '💎', name: 'Memory Flash', desc: 'Neural Focus', color: 'hover:border-amber-500 hover:shadow-amber-500/20' },
                            { id: 'smasher', icon: '🥊', name: 'Zen Smasher', desc: 'Stress Release', color: 'hover:border-red-500 hover:shadow-red-500/20' },
                            { id: 'orbit', icon: '🌀', name: 'Cosmic Orbit', desc: 'Flow State', color: 'hover:border-indigo-500 hover:shadow-indigo-500/20' }
                        ].map(game => (
                            <div key={game.id} onClick={() => setCurrentGame(game.id)} className={`group relative p-12 bg-slate-900/20 border-2 border-white/5 rounded-[4rem] cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:bg-slate-900/50 border-b-8 border-r-8 ${game.color}`}>
                                <span className="text-7xl block mb-8 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">{game.icon}</span>
                                <h3 className="text-3xl font-black uppercase tracking-tight italic text-white/90">{game.name}</h3>
                                <p className="text-slate-500 text-[10px] font-bold mt-2 uppercase tracking-[0.3em]">{game.desc}</p>
                                <div className="mt-8 text-xs font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors tracking-[0.5em]">Start Arena &rarr;</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center animate-in zoom-in duration-500">
                        {currentGame === 'shooter' && <CyberShooter />}
                        {currentGame === 'memory' && <MemoryFlash />}
                        {currentGame === 'smasher' && <ZenSmasher />}
                        {currentGame === 'orbit' && <CosmicOrbit />}
                        <button onClick={() => setCurrentGame('menu')} className="mt-20 px-16 py-6 bg-white/5 border border-white/10 rounded-full text-slate-500 font-black text-xs tracking-[0.8em] hover:text-white hover:border-red-500/50 hover:bg-red-500/5 uppercase transition-all shadow-2xl">Quit Session</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RelaxGame;