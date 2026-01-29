// file: frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

// --- Component Imports ---
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import LandingPage from './pages/LandingPage.jsx';

// Protected Pages
import Dashboard from './pages/Dashboard.jsx';
import Chatbot from './pages/chatbot.jsx';
import Helpline from './pages/Helpline.jsx';
import Streaks from './pages/Streaks.jsx'; 
import MoodLog from './pages/MoodLog.jsx';         
import AIDetector from './pages/AIDetector.jsx';   
import ShareData from './pages/ShareData.jsx';     

// NEW: Relaxation, Breathing & Counselor Ecosystem
import RelaxGame from './pages/RelaxGame.jsx'; 
import BreathingZen from './pages/BreathingZen.jsx'; 
import Counselors from './pages/Counselors.jsx'; 
import CounselorReg from './pages/CounselorReg.jsx'; 

// Structural Components
import PrivateRoute from './pages/PrivateRoute.jsx'; 
import Layout from './pages/Layout.jsx'; 

import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<LandingPage />} />
                
                {/* Public Counselor Registration (Self-Onboarding) */}
                <Route path="/counselor-register" element={<CounselorReg />} />
                
                {/* --- Private/Protected Routes (NESTED STRUCTURE) --- */}
                <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                    
                    {/* General Dashboard & Support */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/chatbot" element={<Chatbot />} />
                    <Route path="/helpline" element={<Helpline />} />
                    <Route path="/streaks" element={<Streaks />} />
                    
                    {/* Mind Relaxation & Breathing */}
                    <Route path="/relax" element={<RelaxGame />} /> 
                    <Route path="/breathing" element={<BreathingZen />} /> 

                    {/* FEATURE: Professional Counselor List (User View) */}
                    <Route path="/counselors" element={<Counselors />} /> 
                    
                    {/* Data Logging & Analysis */}  
                    <Route path="/moodlog" element={<MoodLog />} />       
                    <Route path="/aid" element={<AIDetector />} />         
                    
                    {/* Trusted Viewer Access Route */}
                    <Route path="/access" element={<ShareData />} /> 

                    {/* Fallback for unmatched protected paths */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;