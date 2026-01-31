import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!username) newErrors.username = 'Username is required';
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!validate()) return;
        try {
            const response = await axios.post('http://127.0.0.1:8000/login', { username, password });
            
            localStorage.setItem('manobal_user_id', response.data.user_id);
            localStorage.setItem('manobal_username', response.data.username); 

            setMessage("Login successful! Syncing neural link...");
            setTimeout(() => { navigate('/dashboard'); }, 1500); 
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Identity verification failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* 🌌 Background Glows (Blue & Gold Theme) */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px]" />

            <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-0 bg-blue-950/20 backdrop-blur-3xl border border-blue-500/10 rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
                
                {/* 🚀 Left Side: Brand Visual */}
                <div className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-blue-900/20 to-transparent border-r border-blue-500/10">
                    <h1 className="text-7xl font-black tracking-tighter italic leading-none mb-6">
                        MANO<span className="text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">BAL</span>
                    </h1>
                    <p className="text-xl text-blue-200/60 font-light leading-relaxed">
                        Reconnect with your <span className="text-white font-bold border-b border-[#FFD700]">mental resilience</span>. 
                        Your neural data is secured and ready for synchronization.
                    </p>
                </div>
                
                {/* 🏮 Right Side: Login Form */}
                <div className="p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-black italic tracking-tight text-white mb-2">User <span className="text-[#FFD700]">Login</span></h2>
                        <p className="text-xs text-blue-400 font-black uppercase tracking-[0.3em]">Identity Verification Required</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/70 ml-4">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-4 bg-blue-900/10 border border-blue-500/20 rounded-2xl focus:outline-none focus:border-[#FFD700]/50 transition-all text-white placeholder-blue-300/20"
                                placeholder="Enter your identifier"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-blue-400/70 ml-4">Password</label>
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
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full py-5 bg-[#FFD700] text-[#020617] font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-yellow-500/10 active:scale-95"
                        >
                            Authorize Access
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-6 p-4 rounded-xl text-center text-[10px] font-black uppercase tracking-widest border ${
                            message.includes('successful') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                            {message}
                        </div>
                    )}

                    <p className="mt-10 text-center text-[10px] font-black text-blue-400/50 uppercase tracking-widest">
                        New to the ecosystem?{' '}
                        <Link to="/register" className="text-[#FFD700] hover:underline">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;