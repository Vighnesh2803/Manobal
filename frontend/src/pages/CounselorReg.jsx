import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CounselorReg = () => {
    const navigate = useNavigate();
    const [counselor, setCounselor] = useState({
        name: '', email: '', password: '', specialization: '',
        experience: '', available_from: '10:00', available_to: '18:00', meeting_link: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Backend endpoint synced with main.py
            await axios.post('http://localhost:8000/counselor/register', counselor);
            alert("Registration Successful! Your profile is now live.");
            navigate('/counselors'); // Redirect to listing
        } catch (err) {
            alert("Error: Please check if email is unique or backend is running.");
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
            {/* Background Aesthetic Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]"></div>
            
            <form 
                onSubmit={handleSubmit} 
                className="relative z-10 bg-slate-900/40 backdrop-blur-3xl p-10 lg:p-14 rounded-[3.5rem] border border-white/5 w-full max-w-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
                <div className="text-center mb-10">
                    <h2 className="text-4xl lg:text-5xl font-black mb-2 uppercase text-amber-500 italic tracking-tighter">
                        EXPERT <span className="text-white">ONBOARDING</span>
                    </h2>
                    <p className="text-slate-500 font-medium italic">Join India's most resilient mental health network.</p>
                </div>

                <div className="space-y-5">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 gap-4">
                        <input required type="text" placeholder="Full Name (e.g. Dr. Sunny Patwa)" className="w-full p-5 bg-black/50 rounded-2xl border border-white/5 focus:border-amber-500 outline-none transition-all" onChange={(e) => setCounselor({...counselor, name: e.target.value})} />
                        <input required type="email" placeholder="Professional Email" className="w-full p-5 bg-black/50 rounded-2xl border border-white/5 focus:border-amber-500 outline-none transition-all" onChange={(e) => setCounselor({...counselor, email: e.target.value})} />
                        <input required type="password" placeholder="Create Secure Password" className="w-full p-5 bg-black/50 rounded-2xl border border-white/5 focus:border-amber-500 outline-none transition-all" onChange={(e) => setCounselor({...counselor, password: e.target.value})} />
                    </div>

                    {/* Expertise Info */}
                    <div className="flex gap-4">
                        <input required type="text" placeholder="Specialization" className="w-1/2 p-5 bg-black/50 rounded-2xl border border-white/5 focus:border-amber-500 outline-none transition-all" onChange={(e) => setCounselor({...counselor, specialization: e.target.value})} />
                        <input required type="text" placeholder="Exp (e.g. 5 Years)" className="w-1/2 p-5 bg-black/50 rounded-2xl border border-white/5 focus:border-amber-500 outline-none transition-all" onChange={(e) => setCounselor({...counselor, experience: e.target.value})} />
                    </div>

                    {/* Timing Section */}
                    <div className="bg-black/30 p-6 rounded-3xl border border-white/5">
                        <label className="text-[10px] font-black uppercase text-slate-500 mb-3 block tracking-widest">Consultation Hours</label>
                        <div className="flex items-center gap-4">
                            <input type="time" className="flex-1 p-4 bg-black rounded-xl border border-white/10 text-white" onChange={(e) => setCounselor({...counselor, available_from: e.target.value})} />
                            <span className="text-slate-600 font-bold">TO</span>
                            <input type="time" className="flex-1 p-4 bg-black rounded-xl border border-white/10 text-white" onChange={(e) => setCounselor({...counselor, available_to: e.target.value})} />
                        </div>
                    </div>

                    {/* Meeting Link */}
                    <div className="relative">
                        <input required type="url" placeholder="Your Zoom/Meet Link" className="w-full p-5 bg-black/50 rounded-2xl border border-amber-500/20 text-amber-500 font-mono text-sm outline-none" onChange={(e) => setCounselor({...counselor, meeting_link: e.target.value})} />
                        <span className="absolute right-5 top-5 opacity-20 text-xl">🔗</span>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full mt-10 bg-amber-500 text-black p-6 rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(245,158,11,0.2)]"
                >
                    JOIN MANOBAL EXPERTS →
                </button>
                
                <p className="text-center mt-6 text-slate-600 text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors" onClick={() => navigate('/login')}>
                    Already an expert? Log in here
                </p>
            </form>
        </div>
    );
};

export default CounselorReg;