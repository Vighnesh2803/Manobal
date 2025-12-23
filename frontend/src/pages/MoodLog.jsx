// file: frontend/src/pages/MoodLog.jsx (FINAL AI-DRIVEN VERSION - CORRECTED IMPORTS)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: Corrected import from getMoodEntries to getMoods
import { addMoodEntry, updateStreak, analyzeMoodWithAI, getMoods } from '../api'; 
import moment from 'moment'; 

const MoodLog = () => {
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem('manobal_user_id'));

    const [journalEntry, setJournalEntry] = useState('');
    const [aiMoodAnalysis, setAiMoodAnalysis] = useState(null); // Stores AI's score and analysis
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const [aiError, setAiError] = useState('');
    const [submissionError, setSubmissionError] = useState('');
    const [pastMoods, setPastMoods] = useState([]);
    const [isLoadingPastMoods, setIsLoadingPastMoods] = useState(true);

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
        fetchPastMoods();
    }, [userId, navigate]);

    // Function to fetch past mood entries
    const fetchPastMoods = async () => {
        if (!userId) return;
        setIsLoadingPastMoods(true);
        try {
            // NOTE: getMoods returns { mood_entries: [...] }
            const data = await getMoods(userId);
            setPastMoods(data.mood_entries); // Access the array from the returned object
        } catch (error) {
            console.error('Error fetching past moods:', error);
            // This is the correct line to capture the database/network error detail
            setAiError(error.detail || 'Error fetching past moods data.'); 
        } finally {
            setIsLoadingPastMoods(false);
        }
    };

    // --- Handle AI Mood Analysis (CRITICAL) ---
    const handleAnalyzeMoodWithAI = async () => {
        if (!journalEntry.trim()) {
            setAiError("Please write something in your journal before analyzing.");
            return;
        }
        setIsLoadingAI(true);
        setAiError('');
        setAiMoodAnalysis(null);

        try {
            // This calls the fixed/mocked FastAPI endpoint
            const result = await analyzeMoodWithAI(journalEntry);
            setAiMoodAnalysis(result);
            setAiError(''); 
        } catch (error) {
            console.error('AI Mood Analysis Error:', error);
            // This catches the error (including the MOCKED response fail or 500 error)
            const detailMessage = error.detail || 'Failed to get AI analysis. Check backend server and API key.';
            setAiError(detailMessage);
        } finally {
            setIsLoadingAI(false);
        }
    };

    // --- Handle Mood Entry Submission (CRITICAL) ---
    const handleSubmitMood = async (e) => {
        e.preventDefault();
        setSubmissionError('');

        if (!journalEntry.trim()) {
            setSubmissionError("Journal entry cannot be empty.");
            return;
        }

        // REQUIREMENT: Must have a score from the AI analysis before saving
        if (!aiMoodAnalysis || !aiMoodAnalysis.mood_score) {
            setSubmissionError("Please analyze your mood with the AI before saving the entry.");
            return;
        }

        const scoreToSave = aiMoodAnalysis.mood_score;
        const analysisToSave = aiMoodAnalysis.analysis; // Get analysis text

        try {
            // 1. Add Mood Entry - Using the required 4 parameters
            await addMoodEntry(userId, scoreToSave, journalEntry, analysisToSave); 
            
            // 2. Update Streak
            await updateStreak(userId); 
            
            // 3. Clear State & Notify
            setJournalEntry('');
            setAiMoodAnalysis(null);
            setAiError('');
            fetchPastMoods(); 
            alert(`Mood entry saved! Score: ${scoreToSave}/10. Streak updated.`);

        } catch (error) {
            console.error('Error saving mood entry:', error);
            setSubmissionError(error.detail || 'Failed to save mood entry. Check database connection/structure.');
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center p-8 bg-gray-900 text-white">
            <div className="max-w-4xl w-full mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 mt-8 text-amber-400">
                    New AI-Driven Mood Entry
                </h1>
                <p className="text-lg text-gray-400 mb-10">
                    Reflect on your day and let Manobal AI analyze your emotional state.
                </p>

                <div className="bg-slate-800 p-8 rounded-xl shadow-2xl mb-12">
                    <form onSubmit={handleSubmitMood} className="space-y-6">
                        {/* Journal Entry Text Area */}
                        <div>
                            <label htmlFor="journal" className="block text-lg font-medium text-gray-300 mb-2 text-left">
                                📝 What's on your mind today?
                            </label>
                            <textarea
                                id="journal"
                                className="w-full p-4 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200"
                                rows="6"
                                placeholder="Write about your thoughts, feelings, and experiences..."
                                value={journalEntry}
                                onChange={(e) => setJournalEntry(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        {/* AI Analysis Button and Output */}
                        <div className="text-left">
                            <button
                                type="button"
                                onClick={handleAnalyzeMoodWithAI}
                                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-200"
                                disabled={isLoadingAI || !journalEntry.trim()}
                            >
                                {isLoadingAI ? 'Analyzing...' : 'Analyze Mood with AI'}
                            </button>
                            
                            {/* AI Error Display */}
                            {aiError && <p className="text-red-400 mt-2 font-bold">{aiError}</p>}
                            
                            {/* AI Analysis Display */}
                            {aiMoodAnalysis && (
                                <div className="mt-4 p-4 bg-slate-700 rounded-lg border border-indigo-500">
                                    <h3 className="text-xl font-semibold text-indigo-300">AI's Analysis:</h3>
                                    <p className="text-lg mt-2">
                                        Suggested Mood Score: <span className="font-bold text-amber-300">{aiMoodAnalysis.mood_score} / 10</span>
                                    </p>
                                    <p className="text-gray-300 mt-1 italic">
                                        "{aiMoodAnalysis.analysis}"
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Submission Button & Error */}
                        {submissionError && <p className="text-red-400 text-center">{submissionError}</p>}
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-amber-500 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-200 text-xl"
                            disabled={isLoadingAI || !aiMoodAnalysis} // Disable until analysis is complete
                        >
                            Save Entry (Score: {aiMoodAnalysis ? aiMoodAnalysis.mood_score : '?'}/10)
                        </button>
                    </form>
                </div>

                {/* Past Mood Entries Section Placeholder */}
                <h2 className="text-3xl font-bold mb-4 text-indigo-400">Past Entries</h2>
                {isLoadingPastMoods ? (
                    <p className="text-gray-400">Loading past entries...</p>
                ) : pastMoods.length === 0 ? (
                    <p className="text-gray-400">No entries recorded yet.</p>
                ) : (
                    <div className="w-full space-y-4 text-left">
                        {pastMoods.map((entry, index) => (
                            <div key={index} className="bg-slate-700 p-4 rounded-lg">
                                <p className="font-semibold text-lg text-amber-300">Score: {entry.mood_score}/10</p>
                                <p className="text-gray-300 italic my-1">"{entry.journal_entry}"</p>
                                <p className="text-sm text-gray-400">Logged: {moment(entry.log_timestamp).format('MMMM Do YYYY, h:mm a')}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodLog;