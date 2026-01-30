// file: frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

// --- Component Imports ---
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import LandingPage from './pages/LandingPage.jsx';

// Protected Pages (Ensure 'export default' exists in each file)
import Dashboard from './pages/Dashboard.jsx';
import Chatbot from './pages/chatbot.jsx';
import Helpline from './pages/Helpline.jsx';
import Streaks from './pages/Streaks.jsx'; 
import MoodLog from './pages/MoodLog.jsx';         
import AIDetector from './pages/AIDetector.jsx';   
import ShareData from './pages/ShareData.jsx';     

// Relaxation, Breathing & Counselor Ecosystem
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
                {/* Landing Page as default entry point */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Counselor Registration is public */}
                <Route path="/counselor-register" element={<CounselorReg />} />
                
                {/* --- Protected Routes (Nested in Layout) --- */}
                {/* PrivateRoute ensures user_id exists in localStorage */}
                <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                    
                    {/* Dashboard: Hub for all features */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* AI & Analytics */}
                    <Route path="/aid" element={<AIDetector />} />      
                    <Route path="/chatbot" element={<Chatbot />} />
                    
                    {/* Mood & Persistence */}
                    <Route path="/moodlog" element={<MoodLog />} />       
                    <Route path="/streaks" element={<Streaks />} />
                    
                    {/* Support & Access */}
                    <Route path="/access" element={<ShareData />} /> 
                    <Route path="/helpline" element={<Helpline />} />
                    <Route path="/counselors" element={<Counselors />} /> 

                    {/* Relaxation Tools */}
                    <Route path="/relax" element={<RelaxGame />} /> 
                    <Route path="/breathing" element={<BreathingZen />} /> 

                    {/* Fallback for invalid protected paths */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>

                {/* Final Catch-all Fallback to Landing Page */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;