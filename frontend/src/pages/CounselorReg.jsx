import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CounselorReg = () => {
    const navigate = useNavigate();
    
    // 1. Initial State: Synced with main.py 'CounselorCreate' model
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
            // 2. Payload Construction: Ensuring exact match with Pydantic model
            const payload = {
                name: counselor.name,
                email: counselor.email,
                password: counselor.password,
                specialization: counselor.specialization,
                experience: counselor.experience,
                available_from: counselor.available_from,
                available_to: counselor.available_to,
                meeting_link: counselor.meeting_link
            };

            console.log("Submitting Expert Credentials:", payload);

            // 3. Axios POST Request to FastAPI Node
            const response = await axios.post('http://localhost:8000/counselor/register', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status === "success") {
                alert("Success! Welcome to the Manobal Elite Expert Network.");
                navigate('/login');
            }
        } catch (err) {
            // 4. Robust Error Handling (Catches 400/404/Network errors)
            if (err.response) {
                console.error("Backend Rejection:", err.response.data);
                alert(`Registration failed: ${err.response.data.detail || "Validation Error"}`);
            } else {
                alert("Network Error: Please ensure your FastAPI server is active.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#030712] text-white p-8 flex flex-col items-center justify-center relative overflow-hidden font-sans">
            {/* Neural Aesthetic Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[100px]" />

            <div className="max-w-4xl w-full relative z-10">
                <header className="mb-12 text-center">
                    <h1 className="text-7xl lg:text-9xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 leading-none">
                        Expert <br /> <span className="text-[#FFD700] drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]">Registry</span>
                    </h1>
                    <p className="text-blue-400 font-bold italic mt-4 uppercase tracking-[0.5em] text-[12px]">Neural Resilience Infrastructure</p>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-900/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/5 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 hover:border-yellow-500/20 transition-all duration-500"
                >
                    <div className="md:col-span-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2 block ml-2">Professional Identity</label>
                        <input
                            type="text"
                            placeholder="Full Name (e.g. Dr. Aryan Khan)"
                            className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 focus:border-[#FFD700] transition-all outline-none text-white"
                            value={counselor.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-2">Secure Email</label>
                        <input
                            type="email"
                            placeholder="expert@manobal.org"
                            className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 focus:border-[#FFD700] transition-all outline-none"
                            value={counselor.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-2">Credential Key</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 focus:border-[#FFD700] transition-all outline-none"
                            value={counselor.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-2">Clinical Focus</label>
                        <input
                            type="text"
                            placeholder="e.g. CBT Specialist"
                            className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 focus:border-[#FFD700] transition-all outline-none"
                            value={counselor.specialization}
                            onChange={(e) => handleChange("specialization", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-2">Tenure</label>
                        <input
                            type="text"
                            placeholder="e.g. 5+ Years"
                            className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 focus:border-[#FFD700] transition-all outline-none"
                            value={counselor.experience}
                            onChange={(e) => handleChange("experience", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-2">Available From</label>
                        <input
                            type="time"
                            className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 focus:border-[#FFD700] transition-all outline-none text-white"
                            value={counselor.available_from}
                            onChange={(e) => handleChange("available_from", e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-2">Available To</label>
                        <input
                            type="time"
                            className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 focus:border-[#FFD700] transition-all outline-none text-white"
                            value={counselor.available_to}
                            onChange={(e) => handleChange("available_to", e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-2">Tele-Health Node (Link)</label>
                        <input
                            type="url"
                            placeholder="https://zoom.us/j/..."
                            className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 focus:border-[#FFD700] transition-all outline-none"
                            value={counselor.meeting_link}
                            onChange={(e) => handleChange("meeting_link", e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="md:col-span-2 mt-4 bg-[#FFD700] text-black p-6 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-[1.03] transition-all active:scale-95 shadow-xl shadow-yellow-500/10"
                    >
                        Initialize Expert Profile &rarr;
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CounselorReg;