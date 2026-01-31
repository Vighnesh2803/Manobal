import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!username) {
            newErrors.username = 'Username is required';
        } else if (!/^[a-zA-Z\s]+$/.test(username)) {
            newErrors.username = 'Username can only contain letters and spaces';
        }
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email address is invalid';
        }
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!validate()) return;
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/register', {
                username,
                email,
                password,
            });
            setMessage("Identity Secured. Redirecting...");
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* 🌌 Background Glows (Blue & Gold Theme) */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px]" />

            <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-0 bg-blue-950/20 backdrop-blur-3xl border border-blue-500/10 rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                
                {/* 🚀 Left Side: Brand Visual */}
                <div className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-blue-900/20 to-transparent border-r border-blue-500/10">
                    <h1 className="text-7xl font-black tracking-tighter italic leading-none mb-6">
                        MANO<span className="text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">BAL</span>
                    </h1>
                    <p className="text-xl text-blue-200/60 font-light leading-relaxed">
                        Start your journey to <span className="text-white font-bold border-b border-[#FFD700]">mental strength</span>. 
                        Your privacy is our priority in this neural ecosystem.
                    </p>
                </div>
                
                {/* 🏮 Right Side: Registration Form */}
                <div className="p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-black italic tracking-tight text-white mb-2">Create <span className="text-[#FFD700]">Account</span></h2>
                        <p className="text-xs text-blue-400 font-black uppercase tracking-[0.3em]">Join the Support Network</p>
                    </div>
                    
                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/70 ml-4">Full Name</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-4 bg-blue-900/10 border border-blue-500/20 rounded-2xl focus:outline-none focus:border-[#FFD700]/50 transition-all text-white placeholder-blue-300/20"
                                placeholder="Enter your name"
                                required
                            />
                            {errors.username && <p className="ml-4 text-red-400 text-[10px] font-bold uppercase">{errors.username}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/70 ml-4">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 bg-blue-900/10 border border-blue-500/20 rounded-2xl focus:outline-none focus:border-[#FFD700]/50 transition-all text-white placeholder-blue-300/20"
                                placeholder="name@domain.com"
                                required
                            />
                            {errors.email && <p className="ml-4 text-red-400 text-[10px] font-bold uppercase">{errors.email}</p>}
                        </div>
                        
                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/70 ml-4">Secure Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 bg-blue-900/10 border border-blue-500/20 rounded-2xl focus:outline-none focus:border-[#FFD700]/50 transition-all text-white"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-10 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-[#FFD700]"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                            {errors.password && <p className="ml-4 text-red-400 text-[10px] font-bold uppercase">{errors.password}</p>}
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full py-5 bg-[#FFD700] text-[#020617] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-yellow-500/10 active:scale-95 mt-4"
                        >
                            Register Identity
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-6 p-4 rounded-xl text-center text-[10px] font-black uppercase tracking-widest border bg-blue-500/5 border-blue-500/20 text-[#FFD700]`}>
                            {message}
                        </div>
                    )}

                    <p className="mt-8 text-center text-[10px] font-black text-blue-400/50 uppercase tracking-widest">
                        Already part of Manobal?{' '}
                        <Link to="/login" className="text-[#FFD700] hover:underline">Access Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;