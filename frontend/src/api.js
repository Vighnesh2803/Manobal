import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Axios Instance for cleaner calls
const API = axios.create({
    baseURL: API_BASE_URL,
});

/* =========================
   AUTH
========================= */
export const registerUser = async (username, email, password) => {
  const res = await API.post('/register', { username, email, password });
  return res.data;
};

export const loginUser = async (username, password) => {
  const res = await API.post('/login', { username, password });
  return res.data;
};

/* =========================
   DASHBOARD / STREAK
========================= */
export const getDashboardData = async (userId) => {
  const res = await API.get(`/dashboard/data/${parseInt(userId)}`);
  return res.data;
};

export const getStreak = async (userId) => {
  const res = await API.get(`/dashboard/data/${parseInt(userId)}`);
  return res.data.current_streak || 0;
};

/* =========================
   MOODS & AI ANALYSIS
========================= */

/* ✅ FIXED: Corrected route to match main.py '@app.get("/moods/{user_id}")' */
export const getMoods = async (userId) => {
  const res = await API.get(`/moods/${parseInt(userId)}`); 
  return res.data;
};

/* AI mood rating call */
export const getAIMoodAnalysis = async (userId, prompt) => {
  const res = await API.post('/ai/mood_rating', {
    user_id: parseInt(userId),
    prompt: prompt,
  });
  return res.data;
};

/* Save mood entry and update streak */
export const addMoodEntry = async (userId, moodScore, journalEntry, aiAnalysis) => {
  const res = await API.post('/moods', {
    user_id: parseInt(userId),
    mood_score: parseInt(moodScore),
    journal_entry: journalEntry,
    // Backend expects ai_analysis_text via the model logic
    ai_analysis: aiAnalysis || null, 
  });
  return res.data;
};

/* =========================
   CHATBOT
======================== */
export const chatWithAI = async (userId, prompt) => {
  const res = await API.post('/chatbot', {
    user_id: parseInt(userId),
    prompt,
  }, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
  });
  return res.data;
};

/* =========================
   TRUSTED ACCESS / SHARE
========================= */
export const generateAccessToken = async (userId, professionalName, durationHours) => {
  // Matches '@app.post("/access/generate")'
  const res = await API.post('/access/generate', {
    user_id: parseInt(userId),
    professional_name: professionalName,
    duration_hours: parseInt(durationHours),
  });
  return res.data;
};

/* View shared data using generated token */
export const viewSharedData = async (token) => {
  // Matches '@app.get("/access/view/{token}")'
  const res = await API.get(`/access/view/${token}`);
  return res.data;
};

/* Revoke token */
// api.js mein revoke function check karein
export const revokeAccessToken = async (userId) => {
    const response = await API.post(`/access/revoke/${userId}`);
    return response.data;
};

/* =========================
   COUNSELORS
========================= */
export const getCounselorsList = async () => {
  const res = await API.get('/counselors/list');
  return res.data;
};
