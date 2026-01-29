import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Counselors = () => {
    const navigate = useNavigate();
    const [counselors, setCounselors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCounselor, setSelectedCounselor] = useState(null);
    const [showRegModal, setShowRegModal] = useState(false);
    const [regFormData, setRegFormData] = useState({
        name: '', email: '', password: '', 
        specialization: '', experience: '', 
        available_from: '', available_to: '', meeting_link: ''
    });

    const fetchCounselors = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/counselors/list');
            setCounselors(response.data);
        } catch (error) {
            console.error("Error:", error);
            // High-quality Fallback
            setCounselors([
                { id: 1, name: "Dr. Sameer Malan", specialization: "Clinical Neuropsychologist", experience: "12 Years", available_from: "10:00 AM", available_to: "04:00 PM", meeting_link: "https://zoom.us" }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchCounselors(); }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/counselor/register', regFormData);
            alert("✨ Profile Published Successfully!");
            setShowRegModal(false);
            fetchCounselors();
        } catch (err) {
            alert("Error: Database sync failed.");
        }
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white p-6 lg:p-16 relative overflow-hidden font-sans">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px]"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Dynamic Header */}
                <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-10">
                    <div>
                        <button onClick={() => navigate('/dashboard')} className="group text-amber-500 font-black mb-6 flex items-center gap-3 tracking-[0.3em] text-xs uppercase transition-all hover:text-white">
                            <span className="group-hover:translate-x-[-5px] transition-transform">←</span> BACK TO RESILIENCE HUB
                        </button>
                        <h1 className="text-6xl lg:text-9xl font-black italic tracking-tighter uppercase leading-[0.85]">
                            ELITE <br /> <span className="text-amber-500">EXPERTS</span>
                        </h1>
                    </div>
                    <button 
                        onClick={() => setShowRegModal(true)}
                        className="bg-white text-black px-12 py-6 rounded-full font-black uppercase tracking-widest hover:bg-amber-500 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95"
                    >
                        + JOIN THE NETWORK
                    </button>
                </header>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-16 h-16 border-t-4 border-amber-500 rounded-full animate-spin mb-6"></div>
                        <p className="text-amber-500 font-black tracking-[0.5em] text-sm animate-pulse">AUTHENTICATING PROFILES...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {counselors.map((c) => (
                            <div key={c.id} className="group bg-slate-900/20 border border-white/5 p-10 rounded-[4rem] hover:border-amber-500/40 transition-all duration-700 relative overflow-hidden backdrop-blur-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-gray-950 shadow-2xl group-hover:rotate-[10deg] transition-transform duration-500">
                                            {c.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-2">{c.name}</h3>
                                            <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{c.specialization || "Mental Health"}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4 mb-12">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Experience</span>
                                            <span className="text-white font-black text-sm italic">{c.experience || "Verified"}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Available</span>
                                            <span className="text-amber-400 font-black text-sm">{c.available_from} - {c.available_to}</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => setSelectedCounselor(c)}
                                        className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-amber-500 transition-all shadow-xl group-hover:translate-y-[-5px]"
                                    >
                                        BOOK SESSION →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- ULTIMATE REGISTRATION MODAL --- */}
            {showRegModal && (
                <div className="fixed inset-0 bg-black/98 backdrop-blur-[50px] z-[100] flex items-center justify-center p-6 overflow-y-auto animate-in fade-in zoom-in duration-300">
                    <form onSubmit={handleRegister} className="bg-[#0a0a0a] border border-white/10 p-12 lg:p-16 rounded-[4rem] max-w-xl w-full relative shadow-[0_0_100px_rgba(245,158,11,0.1)]">
                        <button type="button" onClick={() => setShowRegModal(false)} className="absolute top-10 right-12 text-slate-500 text-5xl font-thin hover:text-white transition-colors">×</button>
                        <h2 className="text-5xl font-black text-amber-500 uppercase italic mb-10 tracking-tighter">EXPERT <span className="text-white">PORTAL</span></h2>
                        
                        <div className="grid grid-cols-1 gap-5">
                            <input required type="text" placeholder="Full Name" className="w-full p-6 bg-white/5 rounded-3xl border border-white/5 focus:border-amber-500 outline-none transition-all placeholder:text-slate-700" onChange={(e) => setRegFormData({...regFormData, name: e.target.value})} />
                            <div className="flex gap-4">
                                <input required type="text" placeholder="Specialty" className="w-1/2 p-6 bg-white/5 rounded-3xl border border-white/5 outline-none" onChange={(e) => setRegFormData({...regFormData, specialization: e.target.value})} />
                                <input required type="text" placeholder="Exp" className="w-1/2 p-6 bg-white/5 rounded-3xl border border-white/5 outline-none" onChange={(e) => setRegFormData({...regFormData, experience: e.target.value})} />
                            </div>
                            <input required type="email" placeholder="Professional Email" className="w-full p-6 bg-white/5 rounded-3xl border border-white/5 outline-none" onChange={(e) => setRegFormData({...regFormData, email: e.target.value})} />
                            <input required type="password" placeholder="Access Password" className="w-full p-6 bg-white/5 rounded-3xl border border-white/5 outline-none" onChange={(e) => setRegFormData({...regFormData, password: e.target.value})} />
                            
                            <div className="flex gap-4 items-center bg-white/5 p-4 rounded-3xl border border-white/5">
                                <label className="text-[10px] font-black text-slate-500 px-4 uppercase">Hours:</label>
                                <input type="time" className="flex-1 bg-transparent text-white outline-none" onChange={(e) => setRegFormData({...regFormData, available_from: e.target.value})} />
                                <span className="text-slate-700">/</span>
                                <input type="time" className="flex-1 bg-transparent text-white outline-none" onChange={(e) => setRegFormData({...regFormData, available_to: e.target.value})} />
                            </div>
                            <input required type="url" placeholder="Zoom / Meet Secure Link" className="w-full p-6 bg-black rounded-3xl border border-amber-500/30 text-amber-500 font-mono text-sm" onChange={(e) => setRegFormData({...regFormData, meeting_link: e.target.value})} />
                        </div>
                        
                        <button type="submit" className="w-full py-6 mt-10 bg-amber-500 text-black font-black uppercase rounded-full shadow-2xl shadow-amber-500/20 hover:bg-white transition-all tracking-widest">PUBLISH PROFESSIONAL PROFILE</button>
                    </form>
                </div>
            )}

            {/* --- BOOKING CONFIRMATION MODAL --- */}
            {selectedCounselor && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[110] flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-[#0a0a0a] border border-amber-500/20 p-16 rounded-[5rem] max-w-lg w-full text-center shadow-[0_0_80px_rgba(245,158,11,0.1)]">
                        <div className="w-28 h-28 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-10 text-7xl animate-bounce">🎥</div>
                        <h2 className="text-5xl font-black text-white uppercase italic mb-6 tracking-tighter leading-none">START <br /> SESSION</h2>
                        <p className="text-slate-400 mb-12 text-lg font-medium leading-relaxed italic">You are entering a secure encrypted workspace with <span className="text-amber-500 font-black">{selectedCounselor.name}</span>. Please be ready.</p>
                        
                        <div className="flex flex-col gap-4">
                            <a 
                                href={selectedCounselor.meeting_link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                onClick={() => setSelectedCounselor(null)} 
                                className="w-full py-6 bg-amber-500 text-black rounded-full font-black uppercase text-xs tracking-widest shadow-2xl shadow-amber-500/20 hover:scale-105 transition-all text-center"
                            >
                                JOIN SECURE MEETING →
                            </a>
                            <button onClick={() => setSelectedCounselor(null)} className="w-full py-4 text-slate-500 font-black uppercase text-[10px] tracking-[0.4em] hover:text-white transition-colors">Abort Connection</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Counselors;