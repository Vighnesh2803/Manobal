// file: frontend/src/pages/Login.jsx (FINAL CORRECTION)

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
        // Removed validation for username containing only letters/spaces, as backend often requires alphanumeric
        if (!username) {
            newErrors.username = 'Username is required';
        }
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!validate()) {
            return;
        }
        try {
            // Note: In a final app, you should use the imported API function from api.js
            // For now, keeping the direct axios call but updating the base URL dynamically is recommended.
            const response = await axios.post('http://127.0.0.1:8000/login', {
                username,
                password,
            });
            
            // --- CRITICAL FIX: Save using the correct key 'manobal_user_id' ---
            localStorage.setItem('manobal_user_id', response.data.user_id);
            // Also store the username for display in Navbar/Dashboard
            localStorage.setItem('manobal_username', response.data.username); 

            setMessage(response.data.message);
            
            // Use a slight delay to allow the message to show before navigating
            setTimeout(() => {
                navigate('/dashboard');
            }, 500); 

        } catch (error) {
            setMessage(error.response?.data?.detail || 'Login failed');
            console.error("Login Error:", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-gray-200">
            {/* Left side: Hero Section */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-900 p-8">
                <div className="text-center">
                    <h1 className="text-5xl font-extrabold mb-4 text-white">Welcome Back to <span className="text-amber-400">Manobal</span></h1>
                    <p className="text-lg text-gray-400">
                        Login in to find a safe space and connect with support.
                    </p>
                </div>
            </div>
            
            {/* Right side: Login Form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md bg-slate-800 p-8 rounded-lg shadow-2xl border border-amber-500">
                    <h2 className="text-3xl font-bold text-center mb-6 text-amber-400">User Login</h2>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); if (errors.username) setErrors({ ...errors, username: '' }); }}
                                className="mt-1 p-3 w-full bg-slate-700 border border-amber-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
                                required
                            />
                            {errors.username && <p className="mt-1 text-red-400 text-sm">{errors.username}</p>}
                        </div>
                        
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }); }}
                                className="mt-1 p-3 w-full bg-slate-700 border border-amber-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 top-6 flex items-center px-4 text-gray-400 hover:text-white"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                            {errors.password && <p className="mt-1 text-red-400 text-sm">{errors.password}</p>}
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full p-3 bg-amber-500 text-gray-900 font-semibold rounded-md hover:bg-amber-600 transition duration-300 transform hover:scale-105"
                        >
                            Login
                        </button>
                    </form>

                    {message && (
                        <p className={`mt-4 text-center text-sm ${message.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>
                            {message}
                        </p>
                    )}

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-cyan-400 hover:underline">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;