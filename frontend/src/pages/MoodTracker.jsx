import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const MoodTracker = () => {
    // Get the user ID from the browser's local storage
    const userId = localStorage.getItem('user_id');

    const [selectedMood, setSelectedMood] = useState(null);
    const [journalEntry, setJournalEntry] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const moodOptions = [
        { value: 1, label: 'Very Sad' },
        { value: 2, label: 'Sad' },
        { value: 3, label: 'Neutral' },
        { value: 4, label: 'Happy' },
        { value: 5, label: 'Very Happy' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!selectedMood) {
            setMessage('Please select a mood.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/moods', {
                user_id: parseInt(userId),
                mood_score: selectedMood.value,
                journal_entry: journalEntry,
            });
            setMessage(response.data.message);
            // After submission, redirect to the dashboard
            navigate('/dashboard'); 
        } catch (error) {
            setMessage(error.response?.data?.detail || 'Failed to submit mood entry.');
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-gray-200">
            <div className="flex w-full items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md bg-slate-800 p-8 rounded-lg shadow-2xl border border-amber-500">
                    <h2 className="text-3xl font-bold text-center mb-6 text-amber-400">Mood Tracker</h2>
                    <p className="text-center text-gray-400 mb-6">How are you feeling today?</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Select your mood</label>
                            <Select
                                options={moodOptions}
                                onChange={setSelectedMood}
                                value={selectedMood}
                                isClearable
                                className="mt-1"
                                styles={{
                                    control: (baseStyles) => ({
                                        ...baseStyles,
                                        backgroundColor: '#334155',
                                        borderColor: '#fbbf24',
                                        color: 'white',
                                        padding: '4px',
                                        '&:hover': {
                                            borderColor: '#fbbf24',
                                        },
                                        boxShadow: 'none'
                                    }),
                                    singleValue: (baseStyles) => ({
                                        ...baseStyles,
                                        color: '#fff',
                                    }),
                                    menu: (baseStyles) => ({
                                        ...baseStyles,
                                        backgroundColor: '#334155',
                                    }),
                                    option: (baseStyles, { isFocused, isSelected }) => ({
                                        ...baseStyles,
                                        backgroundColor: isSelected ? '#a5f3fc' : isFocused ? '#475569' : '#334155',
                                        color: isSelected ? '#111827' : '#fff',
                                        '&:hover': {
                                            backgroundColor: '#475569',
                                        },
                                    }),
                                }}
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Journal Entry (Optional)</label>
                            <textarea
                                value={journalEntry}
                                onChange={(e) => setJournalEntry(e.target.value)}
                                rows="4"
                                className="mt-1 p-3 w-full bg-slate-700 border border-amber-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-white"
                            ></textarea>
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full p-3 bg-amber-500 text-gray-900 font-semibold rounded-md hover:bg-amber-600 transition duration-300 transform hover:scale-105"
                        >
                            Submit Mood
                        </button>
                    </form>

                    {message && (
                        <p className="mt-4 text-center text-sm text-amber-400">
                            {message}
                        </p>
                    )}
                     <Link to="/dashboard" className="mt-6 text-center block text-sm text-gray-400 hover:underline">
                        Go Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MoodTracker;