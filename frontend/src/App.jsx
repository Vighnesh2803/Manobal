// file: frontend/src/App.jsx (FINAL AND CORRECTED)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'; 

// --- Component Imports ---
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import LandingPage from './pages/LandingPage.jsx';

// Protected Pages
import Dashboard from './pages/Dashboard.jsx';
import Chatbot from './pages/chatbot.jsx';
import Helpline from './pages/Helpline.jsx';
import Streaks from './pages/Streaks.jsx';
import MoodTracker from './pages/MoodTracker.jsx'; 
import MoodLog from './pages/MoodLog.jsx';         
import AIDetector from './pages/AIDetector.jsx';   
import ShareData from './pages/ShareData.jsx';     // Trusted Viewer Page

// Structural Components
import PrivateRoute from './pages/PrivateRoute.jsx'; 
import Layout from './pages/Layout.jsx';      // <-- IMPORTANT: Imported from components/

import './index.css';


function App() {
    return (
        <Router>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<LandingPage />} />
                
                {/* --- Private/Protected Routes (NESTED STRUCTURE) --- */}
                {/* Parent Route runs the Auth Check (PrivateRoute) and provides the Navbar/Layout. */}
                <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                    
                    {/* These child routes render inside the <Outlet> of Layout.jsx */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/chatbot" element={<Chatbot />} />
                    <Route path="/helpline" element={<Helpline />} />
                    <Route path="/streaks" element={<Streaks />} />
                    
                    {/* Data Logging & Analysis */}
                    <Route path="/moods" element={<MoodTracker />} />     
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