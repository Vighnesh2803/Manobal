import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CounselorReg = () => {
    const navigate = useNavigate();
    const [counselor, setCounselor] = useState({
        name: '',
        email: '',
        password: '',
        specialization: '',
        experience: '',
        available_from: '10:00',
        available_to: '18:00',
        meeting_link: ''
    });

    const handleChange = (field, value) => {
        setCounselor({ ...counselor, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/counselor/register', counselor);
            alert("Registration Successful! Welcome to the Manobal Expert Network.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert("Registration failed. Please check your professional credentials.");
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8 flex flex-col items-center justify-center relative overflow-hidden font-sans">
            
            {/* 🌌 Background Glow Orbs (Blue & Gold Theme) */}
            <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[130px]" />

            <div className="max-w-3xl w-full relative z-10">
                <header className="mb-14 text-center">
                    <h1 className="text-6xl lg:text-8xl font-black tracking-tighter uppercase italic text-white leading-none">
                        Expert <br /> <span className="text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">Onboarding</span>
                    </h1>
                    <p className="text-blue-400/50 font-black italic mt-6 uppercase tracking-[0.4em] text-[10px]">Join our specialized neural resilience network</p>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="bg-blue-950/20 backdrop-blur-3xl p-12 rounded-[4rem] border border-blue-500/10 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 relative group hover:border-[#FFD700]/20 transition-all duration-700"
                >
                    <div className="md:col-span-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/70 mb-3 block ml-4">Professional Identity</label>
                         <input
                            type="text"
                            placeholder="Full Name (e.g. Dr. Vighnesh P.)"
                            value={counselor.name}
                            className="w-full p-6 bg-blue-900/10 rounded-2xl border border-blue-500/10 focus:border-[#FFD700]/50 transition-all outline-none text-white placeholder-blue-300/20"
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/70 ml-4">Expert Email</label>
                        <input
                            type="email"
                            placeholder="professional@manobal.com"
                            value={counselor.email}
                            className="w-full p-6 bg-blue-900/10 rounded-2xl border border-blue-500/10 focus:border-[#FFD700]/50 transition-all outline-none text-white"
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/70 ml-4">Credential Key</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={counselor.password}
                            className="w-full p-6 bg-blue-900/10 rounded-2xl border border-blue-500/10 focus:border-[#FFD700]/50 transition-all outline-none text-white"
                            onChange={(e) => handleChange("password", e.target.value)}
                            required
                        />
                    </div>

                    <div className="md:col-span-2 h-[1px] bg-blue-500/10 my-4" />

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/70 ml-4">Clinical Focus</label>
                        <input
                            type="text"
                            placeholder="Specialization (e.g. CBT)"
                            value={counselor.specialization}
                            className="w-full p-6 bg-blue-900/10 rounded-2xl border border-blue-500/10 focus:border-[#FFD700]/50 transition-all outline-none text-white"
                            onChange={(e) => handleChange("specialization", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/70 ml-4">Tenure</label>
                        <input
                            type="text"
                            placeholder="Experience (e.g. 10+ Years)"
                            value={counselor.experience}
                            className="w-full p-6 bg-blue-900/10 rounded-2xl border border-blue-500/10 focus:border-[#FFD700]/50 transition-all outline-none text-white"
                            onChange={(e) => handleChange("experience", e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/70 ml-4">Available From</label>
                        <input
                            type="time"
                            value={counselor.available_from}
                            className="w-full p-6 bg-blue-900/10 rounded-2xl border border-blue-500/10 text-white focus:border-[#FFD700]/50 outline-none"
                            onChange={(e) => handleChange("available_from", e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/70 ml-4">Available To</label>
                        <input
                            type="time"
                            value={counselor.available_to}
                            className="w-full p-6 bg-blue-900/10 rounded-2xl border border-blue-500/10 text-white focus:border-[#FFD700]/50 outline-none"
                            onChange={(e) => handleChange("available_to", e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/70 ml-4">Tele-Health Node (Link)</label>
                        <input
                            type="url"
                            placeholder="Zoom / Meet Professional Link"
                            value={counselor.meeting_link}
                            className="w-full p-6 bg-blue-900/10 rounded-2xl border border-blue-500/10 focus:border-[#FFD700]/50 transition-all outline-none text-white"
                            onChange={(e) => handleChange("meeting_link", e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="md:col-span-2 mt-6 bg-[#FFD700] text-[#020617] p-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-yellow-500/10 active:scale-95"
                    >
                        Initialize Expert Profile &rarr;
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CounselorReg;