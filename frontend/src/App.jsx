import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/* ---------- Public Pages ---------- */
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import LandingPage from './pages/LandingPage.jsx';

/* ---------- Protected Pages ---------- */
import Dashboard from './pages/Dashboard.jsx';
import Chatbot from './pages/Chatbot.jsx';
import Helpline from './pages/Helpline.jsx';
import Streaks from './pages/Streaks.jsx';
import MoodLog from './pages/MoodLog.jsx';
import AIDetector from './pages/AIDetector.jsx';
import ShareData from './pages/ShareData.jsx';

/* ---------- Extra Features ---------- */
import RelaxGame from './pages/RelaxGame.jsx';
import BreathingZen from './pages/BreathingZen.jsx';
import Counselors from './pages/Counselors.jsx';
import CounselorReg from './pages/CounselorReg.jsx';

/* ---------- Layout + Protection ---------- */
import PrivateRoute from './pages/PrivateRoute.jsx';
import Layout from './pages/Layout.jsx';

import './index.css';

function App() {
    return (
        <Router>
            <Routes>

                {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/counselor-register" element={<CounselorReg />} />

                {/* Protected */}
                <Route element={<PrivateRoute><Layout /></PrivateRoute>}>

                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/aid" element={<AIDetector />} />
                    <Route path="/chatbot" element={<Chatbot />} />

                    <Route path="/moodlog" element={<MoodLog />} />
                    <Route path="/streaks" element={<Streaks />} />

                    <Route path="/access" element={<ShareData />} />
                    <Route path="/helpline" element={<Helpline />} />
                    <Route path="/counselors" element={<Counselors />} />

                    <Route path="/relax" element={<RelaxGame />} />
                    <Route path="/breathing" element={<BreathingZen />} />

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>

                {/* Global fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </Router>
    );
}

export default App;

