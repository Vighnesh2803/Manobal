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
    if (!validate()) {
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/register', {
        username,
        email,
        password,
      });
      setMessage(response.data.message);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-gray-200">
      {/* Left side: Hero Section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-900 p-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-4 text-white">Join <span className="text-amber-400">Manobal</span> Today!</h1>
          <p className="text-lg text-gray-400">
            Create an account to start your journey towards better mental health.
          </p>
        </div>
      </div>

      {/* Right side: Registration Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md bg-slate-800 p-8 rounded-lg shadow-2xl border border-amber-500">
          <h2 className="text-3xl font-bold text-center mb-6 text-amber-400">User Register</h2>
          <form onSubmit={handleRegister} className="space-y-6">
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
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }); }}
                className="mt-1 p-3 w-full bg-slate-700 border border-amber-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
                required
              />
              {errors.email && <p className="mt-1 text-red-400 text-sm">{errors.email}</p>}
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
              Register
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-amber-400">
              {message}
            </p>
          )}
          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;