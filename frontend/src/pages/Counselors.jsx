// file: frontend/src/pages/Counselors.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCounselorsList } from '../api'; // Use centralized API

const Counselors = () => {
    const navigate = useNavigate();
    const [counselors, setCounselors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCounselor, setSelectedCounselor] = useState(null);

    const fetchCounselors = async () => {
        setIsLoading(true);
        try {
            // Fetching from backend @app.get("/counselors/list")
            const data = await getCounselorsList();
            setCounselors(data);
        } catch (error) {
            console.error("Fetch Error:", error);
            // Fallback for demo
            setCounselors([
                {
                    id: 1,
                    name: "Dr. Sameer Malan",
                    specialization: "Clinical Neuropsychologist",
                    experience: "12 Years",
                    available_from: "10:00 AM",
                    available_to: "04:00 PM",
                    meeting_link: "https://zoom.us"
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCounselors();
    }, []);

    return (
        <div className="min-h-screen bg-[#020202] text-white p-6 lg:p-16 relative overflow-hidden font-sans">
            {/* Background Aesthetic */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px]" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                    <div>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-amber-500 font-black mb-6 tracking-[0.4em] text-[10px] uppercase block"
                        >
                            &larr; BACK TO HUB
                        </button>
                        <h1 className="text-7xl lg:text-9xl font-black italic tracking-tighter uppercase leading-none">
                            ELITE <br />
                            <span className="text-amber-500">EXPERTS</span>
                        </h1>
                    </div>

                    <button
                        onClick={() => navigate('/counselor-register')} // Navigate to your dedicated registration page
                        className="bg-white text-black px-12 py-6 rounded-full font-black uppercase hover:bg-amber-500 hover:scale-105 transition-all shadow-2xl"
                    >
                        + JOIN THE NETWORK
                    </button>
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-amber-500 font-black tracking-widest text-xs uppercase">Authenticating Profiles...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {counselors.map((c, index) => (
                            <div
                                key={c.id || index}
                                className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl hover:border-amber-500/50 transition-all group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="mb-8">
                                        <h3 className="text-3xl font-black italic mb-2 group-hover:text-amber-500 transition-colors">{c.name}</h3>
                                        <span className="px-4 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {c.specialization}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-10">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 uppercase font-black text-[9px] tracking-widest">Experience</span>
                                            <span className="font-bold">{c.experience}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 uppercase font-black text-[9px] tracking-widest">Availability</span>
                                            <span className="font-bold text-slate-300">{c.available_from} - {c.available_to}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedCounselor(c)}
                                    className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all shadow-xl"
                                >
                                    BOOK SESSION &rarr;
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Premium Booking Modal */}
            {selectedCounselor && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-6">
                    <div className="bg-slate-900 border border-amber-500/30 p-12 rounded-[3.5rem] text-center max-w-lg w-full shadow-[0_0_100px_rgba(245,158,11,0.1)]">
                        <span className="text-5xl mb-6 block">🩺</span>
                        <h2 className="text-4xl font-black italic mb-2 uppercase">{selectedCounselor.name}</h2>
                        <p className="text-slate-400 mb-8 italic">Ready for your telehealth session?</p>

                        <div className="flex flex-col gap-4">
                            <a
                                href={selectedCounselor.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setSelectedCounselor(null)}
                                className="block w-full bg-amber-500 text-black py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white transition-all"
                            >
                                START SESSION NOW
                            </a>

                            <button
                                onClick={() => setSelectedCounselor(null)}
                                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-red-500 transition-colors"
                            >
                                TERMINATE BOOKING
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Counselors;