// file: frontend/src/api.js (FINAL VERSION - Corrected Export Names)

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Ensure this matches your FastAPI server address

// Function to register a new user
export const registerUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Function to log in a user
export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Function to add a mood entry (CRITICAL FIX for persistence)
export const addMoodEntry = async (userId, moodScore, journalEntry, aiAnalysis) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/moods`, {
            user_id: userId,
            mood_score: moodScore,
            journal_entry: journalEntry,
            ai_analysis: aiAnalysis // Sent to backend
        });
        return response.data;
    } catch (error) {
        console.error('Add mood entry error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Function to get a user's mood entries (RENAMED TO MATCH AIDetector.jsx)
export const getMoods = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/moods/${userId}`);
        // Assuming your backend /moods/{userId} returns { mood_entries: [...] }
        return response.data; // Return the whole data object, AIDetector will access .mood_entries
    } catch (error) {
        console.error('Get moods error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Function to update user streak
export const updateStreak = async (userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/streaks/update`, {
            user_id: userId
        });
        return response.data;
    } catch (error) {
        console.error('Update streak error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Function to get user streak
export const getStreak = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/streaks/${userId}`);
        return response.data.streak_count;
    } catch (error) {
        console.error('Get streak error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Function to chat with AI
export const chatWithAI = async (userId, prompt, sessionId = null) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat`, {
            user_id: userId,
            prompt: prompt,
            session_id: sessionId
        });
        return response.data.message;
    } catch (error) {
        console.error('Chat with AI error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Function to get dashboard data
export const getDashboardData = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dashboard/data/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Get dashboard data error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Function to analyze mood with AI
export const analyzeMoodWithAI = async (journalEntry) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/ai/mood_rating`, {
            journal_entry: journalEntry
        });
        return response.data; // Returns { mood_score: int, analysis: string }
    } catch (error) {
        console.error('AI mood analysis error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Function to generate a new access token
export const generateAccessToken = async (userId, professionalName, durationHours) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/access/generate`, {
            user_id: userId,
            professional_name: professionalName,
            duration_hours: durationHours
        });
        return response.data; // Expects { message, access_token, expires_at, professional_name }
    } catch (error) {
        console.error('Generate access token error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Function to revoke an existing access token
export const revokeAccessToken = async (userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/access/revoke`, {
            user_id: userId
        });
        return response.data; // Expects { message }
    } catch (error) {
        console.error('Revoke access token error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Function for a professional to view data using an access token
export const viewSharedData = async (accessToken) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/access/view_data/${accessToken}`);
        return response.data; // Expects { professional_name, user_data_trends, message }
    } catch (error) {
        console.error('View shared data error:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};