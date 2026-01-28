// file: frontend/src/pages/Counselors.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Counselors = () => {
    const [counselors, setCounselors] = useState([]);

    useEffect(() => {
        const fetchCounselors = async () => {
            try {
                const res = await axios.get('http://localhost:8000/counselors');
                setCounselors(res.data);
            } catch (err) {
                console.error("Error fetching counselors", err);
            }
        };
        fetchCounselors();
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8">
            <header className="mb-12">
                <Link to="/dashboard" className="text-amber-400 font-bold uppercase text-xs tracking-widest">← Dashboard</Link>
                <h1 className="text-5xl font-black mt-4 uppercase italic">Professional <span className="text-amber-400">Counselors</span></h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {counselors.map((c) => (
                    <div key={c.id} className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-white/5 hover:border-amber-500/50 transition-all group">
                        <img src={c.image_url} alt={c.name} className="w-24 h-24 rounded-full mb-6 border-2 border-amber-500" />
                        <h3 className="text-2xl font-black uppercase italic">{c.name}</h3>
                        <p className="text-amber-400 font-bold text-sm mb-4">{c.specialization}</p>
                        <p className="text-slate-400 text-sm mb-6">Experience: {c.experience}</p>
                        <a href={`mailto:${c.contact_email}`} className="inline-block bg-amber-500 text-black px-6 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-amber-400">
                            Book Session
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Counselors;