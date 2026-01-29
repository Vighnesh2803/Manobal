import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; 

// --- 1. AUTHENTICATION ---
export const registerUser = async (username, email, password) => {
    const response = await axios.post(`${API_BASE_URL}/register`, { username, email, password });
    return response.data;
};

export const loginUser = async (username, password) => {
    const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
    return response.data;
};

// Counselor Login
export const loginCounselor = async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/counselor/login`, { username: email, password });
    return response.data;
};

// --- 2. DASHBOARD & STREAKS ---
export const getDashboardData = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/data/${userId}`);
    return response.data;
};

export const getStreak = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/dashboard/data/${userId}`);
    return response.data.current_streak;
};

// --- 3. MOOD & AI ANALYTICS ---
export const addMoodEntry = async (userId, moodScore, journalEntry, aiAnalysis) => {
    const response = await axios.post(`${API_BASE_URL}/moods`, {
        user_id: parseInt(userId),
        mood_score: parseInt(moodScore),
        journal_entry: journalEntry,
        ai_analysis: aiAnalysis 
    });
    return response.data;
};

export const getMoods = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/moods/${userId}`);
    return response.data; 
};

export const analyzeMoodWithAI = async (userId, journalEntry) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/ai/mood_rating`, {
            user_id: parseInt(userId), 
            prompt: journalEntry 
        });
        return response.data; 
    } catch (error) {
        const errorDetail = error.response?.data?.detail;
        throw String(typeof errorDetail === 'string' ? errorDetail : "AI Limit Reached.");
    }
};

// --- 4. COUNSELOR SYSTEM ---
export const registerCounselor = async (counselorData) => {
    // Ensures specialization and experience are included
    const response = await axios.post(`${API_BASE_URL}/counselor/register`, counselorData);
    return response.data;
};

export const getCounselorsList = async () => {
    const response = await axios.get(`${API_BASE_URL}/counselors/list`);
    return response.data;
};

// --- 5. TRUSTED ACCESS (Fixes 422 Error) ---
export const generateAccessToken = async (userId, professionalName, durationHours) => {
    // Integer conversion is critical for Pydantic validation
    const response = await axios.post(`${API_BASE_URL}/access/generate`, {
        user_id: parseInt(userId), 
        professional_name: professionalName,
        duration_hours: parseInt(durationHours)
    });
    return response.data;
};

export const revokeAccessToken = async (userId) => {
    const response = await axios.delete(`${API_BASE_URL}/access/revoke/${userId}`);
    return response.data;
};