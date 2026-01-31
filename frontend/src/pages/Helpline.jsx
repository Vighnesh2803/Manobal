import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Helpline = () => {
    const navigate = useNavigate();
    const indianHelplines = [
        { name: "KIRAN National", number: "1800-599-0019", description: "Provides free psychological support and mental health services." },
        { name: "AASRA Support", number: "98204-66726", description: "A 24/7 helpline for suicide prevention and crisis intervention." },
        { name: "Vandrevala", number: "99996-66500", description: "Offers 24x7 emotional and psychological support services." },
        { name: "Connecting India", number: "1800-209-4353", description: "Confidential helpline for emotional support and crisis management." }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 lg:p-16 relative overflow-hidden font-sans">
            
            {/* 🌌 Background Emergency Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />

            <div className="max-w-6xl mx-auto relative z-10 text-center">
                
                <header className="mb-16 flex flex-col items-center">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-400 font-black mb-8 tracking-[0.5em] text-[10px] uppercase hover:text-[#FFD700] transition-colors"
                    >
                        &larr; EXIT TO HUB
                    </button>
                    <h1 className="text-7xl lg:text-9xl font-black tracking-tighter uppercase italic leading-none">
                        SOS <span className="text-[#FFD700] drop-shadow-[0_0_25px_rgba(255,215,0,0.3)]">HELPLINE</span>
                    </h1>
                    <p className="text-blue-300/40 font-black italic mt-6 uppercase tracking-[0.4em] text-[10px]">Immediate synchronization with professional support</p>
                </header>

                {/* 🚨 CRITICAL RESPONSE SECTION */}
                <div className="bg-blue-950/20 border border-red-500/30 p-12 lg:p-20 rounded-[4rem] backdrop-blur-3xl shadow-2xl mb-16 relative group">
                    <div className="absolute inset-0 bg-red-500/5 rounded-[4rem] animate-pulse pointer-events-none" />
                    <h3 className="text-sm font-black mb-8 text-red-500 uppercase tracking-[0.5em]">Emergency Pulse Active</h3>
                    
                    <a href="tel:9820466726" className="inline-flex items-center gap-6 px-12 py-8 bg-red-600 text-white font-black text-4xl lg:text-6xl rounded-[2.5rem] hover:scale-105 transition-all shadow-2xl shadow-red-500/30 active:scale-95 group">
                        <span className="text-5xl group-hover:rotate-12 transition-transform">📞</span> 
                        98204-66726
                    </a>
                    
                    <p className="mt-10 text-[11px] text-blue-300/50 font-black uppercase tracking-widest leading-relaxed">
                        This is a <span className="text-white">24/7 National Protocol</span> for crisis intervention.
                    </p>
                </div>

                {/* 🛡️ OTHER SUPPORT NODES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    {indianHelplines.map((helpline, index) => (
                        <div key={index} className="bg-blue-900/10 p-10 rounded-[3rem] border border-blue-500/10 hover:border-[#FFD700]/30 transition-all group backdrop-blur-3xl">
                            <h4 className="font-black text-xl text-white mb-2 uppercase italic tracking-tighter group-hover:text-[#FFD700] transition-colors">{helpline.name}</h4>
                            <p className="text-xs text-blue-300/40 mb-6 font-medium leading-relaxed italic">"{helpline.description}"</p>
                            <a 
                                href={`tel:${helpline.number}`} 
                                className="inline-block px-8 py-3 bg-blue-500/10 text-blue-400 font-black rounded-full border border-blue-500/20 text-[11px] tracking-widest hover:bg-[#FFD700] hover:text-[#020617] hover:border-[#FFD700] transition-all"
                            >
                                CALL NODE &rarr; {helpline.number}
                            </a>
                        </div>
                    ))}
                </div>

                <p className="mt-20 text-[9px] text-blue-500/30 uppercase tracking-[0.8em] font-black">Manobal v1.5 • Neural Support Ecosystem</p>
            </div>
        </div>
    );
};

export default Helpline;