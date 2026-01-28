// file: frontend/src/pages/CounselorReg.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CounselorReg = () => {
    const [counselor, setCounselor] = useState({
        name: '', email: '', password: '', specialization: '',
        experience: '', available_from: '10:00', available_to: '18:00', meeting_link: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/counselor/register', counselor);
            alert("Registration Successful! Now users can book sessions with you.");
        } catch (err) {
            alert("Error registering counselor.");
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-10 flex justify-center">
            <form onSubmit={handleSubmit} className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/10 w-full max-w-lg shadow-2xl">
                <h2 className="text-3xl font-black mb-6 uppercase text-amber-500 italic">Counselor Registration</h2>
                <div className="space-y-4">
                    <input type="text" placeholder="Full Name" className="w-full p-4 bg-black rounded-xl border border-slate-800" onChange={(e) => setCounselor({...counselor, name: e.target.value})} />
                    <input type="email" placeholder="Professional Email" className="w-full p-4 bg-black rounded-xl border border-slate-800" onChange={(e) => setCounselor({...counselor, email: e.target.value})} />
                    <input type="password" placeholder="Create Password" className="w-full p-4 bg-black rounded-xl border border-slate-800" onChange={(e) => setCounselor({...counselor, password: e.target.value})} />
                    <div className="flex gap-4">
                        <input type="time" title="Available From" className="w-1/2 p-4 bg-black rounded-xl" onChange={(e) => setCounselor({...counselor, available_from: e.target.value})} />
                        <input type="time" title="Available To" className="w-1/2 p-4 bg-black rounded-xl" onChange={(e) => setCounselor({...counselor, available_to: e.target.value})} />
                    </div>
                    <input type="url" placeholder="Your Zoom/Meet Link" className="w-full p-4 bg-black rounded-xl border border-slate-800" onChange={(e) => setCounselor({...counselor, meeting_link: e.target.value})} />
                </div>
                <button type="submit" className="w-full mt-8 bg-amber-500 text-black p-4 rounded-xl font-black uppercase hover:bg-amber-400 transition-all">Join Manobal Experts</button>
            </form>
        </div>
    );
};

export default CounselorReg;