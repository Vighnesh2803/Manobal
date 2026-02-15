import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Counselors = () => {
    const navigate = useNavigate();
    const [counselors, setCounselors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCounselor, setSelectedCounselor] = useState(null);

    // 🔥 API Fetching Logic with Final Fix
    const fetchCounselors = async () => {
        setIsLoading(true);
        try {
            // Direct call to avoid 'getCounselorsList' undefined issues
            const response = await axios.get('http://localhost:8000/counselors/list');
            
            if (response.data && Array.isArray(response.data)) {
                setCounselors(response.data);
            } else {
                // Agar DB khali hai toh empty array set karein
                setCounselors([]);
            }
        } catch (error) {
            console.error("Neural Sync Error:", error);
            // Error handling alert
        } finally {
            // Yeh spinner ko 100% stop karega
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCounselors();
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 lg:p-20 relative overflow-x-hidden font-sans">
            {/* 🌌 Cyberpunk Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-blue-500/10 pb-12">
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-blue-400 font-black mb-8 tracking-[0.5em] text-[10px] uppercase block hover:text-[#FFD700] transition-all"
                        >
                            &larr; EXIT TO HUB
                        </button>
                        <h1 className="text-8xl lg:text-[10rem] font-black italic tracking-tighter uppercase leading-[0.85]">
                            ELITE <br />
                            <span className="text-[#FFD700] drop-shadow-[0_0_25px_rgba(255,215,0,0.3)]">EXPERTS</span>
                        </h1>
                    </div>

                    <button
                        onClick={() => navigate('/counselor-register')}
                        className="bg-[#FFD700] text-[#020617] px-14 py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl shadow-yellow-500/10 active:scale-95"
                    >
                        + JOIN THE NETWORK
                    </button>
                </header>

                {isLoading ? (
                    /* 🌀 Syncing Spinner */
                    <div className="flex flex-col items-center justify-center py-48">
                        <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mb-6"></div>
                        <p className="text-blue-400 font-black tracking-[0.4em] text-[10px] uppercase opacity-50">Authenticating Neural Profiles...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {counselors.length > 0 ? counselors.map((c, index) => (
                            <div
                                key={c.id || index}
                                className="bg-blue-900/10 border border-blue-500/10 p-12 rounded-[4rem] backdrop-blur-3xl hover:border-[#FFD700]/30 transition-all duration-500 group flex flex-col justify-between shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD700]/5 rounded-bl-[4rem] pointer-events-none" />
                                
                                <div>
                                    <div className="mb-10">
                                        <h3 className="text-4xl font-black italic mb-3 leading-tight group-hover:text-[#FFD700] transition-colors tracking-tight">{c.name}</h3>
                                        <span className="inline-block px-5 py-2 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                                            {c.specialization}
                                        </span>
                                    </div>

                                    <div className="space-y-4 mb-12">
                                        <div className="flex justify-between items-center text-sm border-b border-blue-500/5 pb-3">
                                            <span className="text-blue-300/30 uppercase font-black text-[9px] tracking-[0.2em]">Experience</span>
                                            <span className="font-bold text-white italic">{c.experience}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-blue-300/30 uppercase font-black text-[9px] tracking-[0.2em]">Sync Window</span>
                                            <span className="font-bold text-[#FFD700]">{c.available_from} - {c.available_to}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedCounselor(c)}
                                    className="w-full py-6 bg-blue-500/10 text-white border border-blue-500/20 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-[#FFD700] hover:text-[#020617] hover:border-[#FFD700] transition-all shadow-xl active:scale-95"
                                >
                                    INITIALIZE SESSION &rarr;
                                </button>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-20 bg-white/5 rounded-[4rem] border border-dashed border-white/10">
                                <p className="text-gray-500 uppercase tracking-widest font-bold">No Neural Profiles Found in Registry</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 💎 Premium Booking Modal */}
            {selectedCounselor && (
                <div className="fixed inset-0 bg-[#020617]/95 backdrop-blur-xl flex items-center justify-center z-[100] p-8 animate-in fade-in duration-300">
                    <div className="bg-blue-950/40 border border-[#FFD700]/20 p-16 rounded-[4rem] text-center max-w-xl w-full shadow-[0_0_150px_rgba(255,215,0,0.1)] relative">
                        <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-blue-500/20">
                            <span className="text-5xl">🩺</span>
                        </div>
                        <h2 className="text-5xl font-black italic mb-4 uppercase tracking-tighter text-white">{selectedCounselor.name}</h2>
                        <p className="text-blue-400/60 mb-12 italic text-sm tracking-wide">Ready for telehealth synchronization?</p>

                        <div className="flex flex-col gap-5">
                            <a
                                href={selectedCounselor.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-[#FFD700] text-[#020617] py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all text-center"
                            >
                                START SESSION
                            </a>
                            <button
                                onClick={() => setSelectedCounselor(null)}
                                className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.4em] hover:text-red-500 transition-colors mt-4"
                            >
                                TERMINATE CONNECTION
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Counselors;