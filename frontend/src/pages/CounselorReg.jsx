// file: frontend/src/pages/CounselorReg.jsx

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
            // Updated to match the new backend route
            await axios.post('http://localhost:8000/counselor/register', counselor);

            alert("Registration Successful! You are now part of the Manobal Expert Network.");
            navigate('/login');

        } catch (err) {
            console.error(err);
            alert("Registration failed. Please use a unique professional email.");
        }
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white p-6 flex flex-col items-center justify-center relative overflow-hidden font-sans">
            {/* Background Aesthetic Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />

            <div className="max-w-2xl w-full relative z-10">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                        Expert <br /> <span className="text-amber-500">Onboarding</span>
                    </h1>
                    <p className="text-slate-500 font-bold italic mt-4 uppercase tracking-[0.2em] text-xs">Join our neural resilience network</p>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <div className="md:col-span-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-2">Personal Identity</label>
                         <input
                            type="text"
                            placeholder="Full Professional Name"
                            value={counselor.name}
                            className="w-full p-5 bg-black/40 rounded-2xl border border-white/10 focus:border-amber-500 transition-all outline-none"
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                        />
                    </div>

                    <input
                        type="email"
                        placeholder="Professional Email"
                        value={counselor.email}
                        className="w-full p-5 bg-black/40 rounded-2xl border border-white/10 focus:border-amber-500 transition-all outline-none"
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Secure Password"
                        value={counselor.password}
                        className="w-full p-5 bg-black/40 rounded-2xl border border-white/10 focus:border-amber-500 transition-all outline-none"
                        onChange={(e) => handleChange("password", e.target.value)}
                        required
                    />

                    <div className="md:col-span-2 h-[1px] bg-white/10 my-2" />

                    <input
                        type="text"
                        placeholder="Specialization"
                        value={counselor.specialization}
                        className="w-full p-5 bg-black/40 rounded-2xl border border-white/10 focus:border-amber-500 transition-all outline-none"
                        onChange={(e) => handleChange("specialization", e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Experience (e.g. 8+ Years)"
                        value={counselor.experience}
                        className="w-full p-5 bg-black/40 rounded-2xl border border-white/10 focus:border-amber-500 transition-all outline-none"
                        onChange={(e) => handleChange("experience", e.target.value)}
                        required
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black uppercase text-slate-500 ml-2">Available From</label>
                        <input
                            type="time"
                            value={counselor.available_from}
                            className="w-full p-5 bg-black/40 rounded-2xl border border-white/10 text-white"
                            onChange={(e) => handleChange("available_from", e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black uppercase text-slate-500 ml-2">Available To</label>
                        <input
                            type="time"
                            value={counselor.available_to}
                            className="w-full p-5 bg-black/40 rounded-2xl border border-white/10 text-white"
                            onChange={(e) => handleChange("available_to", e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <input
                            type="url"
                            placeholder="Tele-Health Link (Zoom / Meet)"
                            value={counselor.meeting_link}
                            className="w-full p-5 bg-black/40 rounded-2xl border border-white/10 focus:border-amber-500 transition-all outline-none"
                            onChange={(e) => handleChange("meeting_link", e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="md:col-span-2 mt-4 bg-amber-500 text-black p-6 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white transition-all shadow-xl hover:scale-[1.02]"
                    >
                        Initialize Expert Profile &rarr;
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CounselorReg;