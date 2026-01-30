import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

/* =========================
   AUTH
========================= */
export const registerUser = async (username, email, password) => {
  const res = await axios.post(`${API_BASE_URL}/register`, {
    username,
    email,
    password,
  });
  return res.data;
};

export const loginUser = async (username, password) => {
  const res = await axios.post(`${API_BASE_URL}/login`, {
    username,
    password,
  });
  return res.data;
};

/* =========================
   DASHBOARD / STREAK
========================= */
export const getDashboardData = async (userId) => {
  const res = await axios.get(
    `${API_BASE_URL}/dashboard/data/${parseInt(userId)}`
  );
  return res.data;
};

// ✅ Streaks.jsx expects THIS
export const getStreak = async (userId) => {
  const res = await axios.get(
    `${API_BASE_URL}/dashboard/data/${parseInt(userId)}`
  );
  return res.data.current_streak || 0;
};

/* =========================
   MOODS
========================= */
export const addMoodEntry = async (
  userId,
  moodScore,
  journalEntry,
  aiAnalysis
) => {
  const res = await axios.post(`${API_BASE_URL}/moods`, {
    user_id: parseInt(userId),
    mood_score: parseInt(moodScore),
    journal_entry: journalEntry,
    ai_analysis: aiAnalysis || null,
  });
  return res.data;
};

export const getMoods = async (userId) => {
  const res = await axios.get(
    `${API_BASE_URL}/moods/${parseInt(userId)}`
  );
  return res.data;
};

/* =========================
   CHATBOT
========================= */
export const chatWithAI = async (userId, prompt) => {
  const res = await axios.post(
    `${API_BASE_URL}/chatbot`,
    {
      user_id: parseInt(userId),
      prompt,
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    }
  );
  return res.data;
};

/* =========================
   TRUSTED ACCESS / SHARE
========================= */
export const generateAccessToken = async (
  userId,
  professionalName,
  durationHours
) => {
  const res = await axios.post(`${API_BASE_URL}/access/generate`, {
    user_id: parseInt(userId),
    professional_name: professionalName,
    duration_hours: parseInt(durationHours),
  });
  return res.data;
};

export const revokeAccessToken = async (userId) => {
  const res = await axios.delete(
    `${API_BASE_URL}/access/revoke/${parseInt(userId)}`
  );
  return res.data;
};

/* =========================
   COUNSELORS
========================= */
export const getCounselorsList = async () => {
  const res = await axios.get(`${API_BASE_URL}/counselors/list`);
  return res.data;
};
