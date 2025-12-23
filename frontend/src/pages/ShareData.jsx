// file: frontend/src/pages/ShareData.jsx (Full Page Component)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAccessToken, revokeAccessToken, viewSharedData } from '../api';
import moment from 'moment';

const ShareData = () => {
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem('manobal_user_id')); 

    // State for generating and revoking tokens
    const [professionalName, setProfessionalName] = useState('');
    const [durationHours, setDurationHours] = useState(48); // Default to 48 hours
    const [generatedTokenInfo, setGeneratedTokenInfo] = useState(null); 
    const [generateTokenError, setGenerateTokenError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // State for viewing data with a token (for testing or professional view)
    const [inputAccessToken, setInputAccessToken] = useState('');
    const [sharedData, setSharedData] = useState(null); 
    const [viewDataError, setViewDataError] = useState('');
    const [isViewing, setIsViewing] = useState(false);

    // Ensure user is logged in
    useEffect(() => {
        if (!userId || isNaN(userId)) {
            navigate('/login');
        }
    }, [userId, navigate]);


    const handleGenerateToken = async () => {
        setGenerateTokenError('');
        if (!professionalName.trim() || durationHours < 1) {
            setGenerateTokenError('Professional name and duration are required.');
            return;
        }
        setIsGenerating(true);
        try {
            const response = await generateAccessToken(userId, professionalName, durationHours);
            setGeneratedTokenInfo(response);
            setProfessionalName(''); 
        } catch (error) {
            console.error('Failed to generate token:', error);
            setGenerateTokenError(error.detail || 'Could not generate access token.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRevokeToken = async () => {
        if (!userId) return;
        if (!window.confirm("Are you sure you want to revoke this access token? This cannot be undone.")) return;
        
        setIsGenerating(true);
        try {
            await revokeAccessToken(userId);
            setGeneratedTokenInfo(null); // Clear displayed token
            alert('Access token revoked successfully!');
        } catch (error) {
            setGenerateTokenError(error.detail || 'Could not revoke access token.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleViewSharedData = async () => {
        setViewDataError('');
        setSharedData(null); 
        if (!inputAccessToken.trim()) {
            setViewDataError('Access token is required to view data.');
            return;
        }
        setIsViewing(true);
        try {
            const data = await viewSharedData(inputAccessToken);
            setSharedData(data);
        } catch (error) {
            console.error('Failed to view data:', error);
            setViewDataError(error.detail || 'Invalid or expired access token.');
        } finally {
            setIsViewing(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center p-8 bg-gray-950 text-white">
            <div className="max-w-4xl w-full mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-indigo-400">
                    Trusted Viewer Access Protocol 🛡️
                </h1>
                <p className="text-lg text-gray-400 mb-8">
                    Generate a temporary token to share anonymized mood trend analytics with your professional counselor.
                </p>

                {/* --- GENERATE/REVOKE SECTION --- */}
                <div className="bg-slate-800 p-8 rounded-xl shadow-2xl mb-12 border border-indigo-600">
                    {generatedTokenInfo ? (
                        <div className="token-display p-4 bg-slate-700 rounded-lg mb-4">
                            <h3 className="text-xl font-bold text-indigo-300 mb-2">Access Active for {generatedTokenInfo.professional_name}</h3>
                            <p className="text-gray-200">Share this code with your counselor:</p>
                            <code className="block bg-gray-900 text-amber-400 p-3 my-3 rounded-md overflow-auto select-all text-sm break-all font-mono">
                                {generatedTokenInfo.access_token}
                            </code>
                            <p className="text-sm text-gray-400">
                                Expires: {moment(generatedTokenInfo.expires_at).format('MMMM Do YYYY, h:mm:ss a')}
                            </p>
                            <button 
                                onClick={handleRevokeToken} 
                                disabled={isGenerating} 
                                className="mt-4 px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-semibold"
                            >
                                {isGenerating ? 'Revoking...' : 'Revoke Access Now'}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={(e) => { e.preventDefault(); handleGenerateToken(); }} className="space-y-4">
                            <h3 className="text-xl font-bold text-white mb-4">Create New Access Token</h3>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Professional's Name (e.g., Dr. Jane Doe)"
                                    className="w-full p-3 bg-slate-700 rounded-md text-white"
                                    value={professionalName}
                                    onChange={(e) => setProfessionalName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Duration in Hours (Max 720)"
                                    className="w-full p-3 bg-slate-700 rounded-md text-white"
                                    value={durationHours}
                                    onChange={(e) => setDurationHours(parseInt(e.target.value))}
                                    min="1"
                                    max="720"
                                    required
                                />
                            </div>
                            {generateTokenError && <p className="text-red-400 text-sm">{generateTokenError}</p>}
                            <button
                                type="submit"
                                disabled={isGenerating}
                                className="w-full p-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition"
                            >
                                {isGenerating ? 'Generating...' : 'Generate Secure Token'}
                            </button>
                        </form>
                    )}
                </div>

                {/* --- VIEW DATA SECTION (FOR TESTING) --- */}
                <div className="bg-slate-800 p-8 rounded-xl shadow-2xl">
                    <h2 className="text-xl font-bold mb-4 text-white">Test Access</h2>
                    <p className="text-sm text-gray-400 mb-4">
                        (Use this section to verify the token works or for professional access).
                    </p>
                    <input
                        type="text"
                        placeholder="Paste Access Token Here"
                        className="w-full p-3 bg-slate-700 rounded-md text-white mb-4"
                        value={inputAccessToken}
                        onChange={(e) => setInputAccessToken(e.target.value)}
                    />
                    {viewDataError && <p className="text-red-400 text-sm">{viewDataError}</p>}
                    <button
                        onClick={handleViewSharedData}
                        disabled={isViewing || !inputAccessToken.trim()}
                        className="w-full p-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition"
                    >
                        {isViewing ? 'Fetching Trends...' : 'View Anonymized Trends'}
                    </button>

                    {sharedData && sharedData.user_data_trends && (
                        <div className="mt-6 p-4 bg-slate-700 rounded-lg text-left">
                            <h4 className="font-semibold text-green-400">Data Received</h4>
                            <p className="text-sm text-gray-300">Total Entries: {sharedData.user_data_trends.length}</p>
                            {/* Display first 3 entries */}
                            <ul className="mt-2 text-sm space-y-1">
                                {sharedData.user_data_trends.slice(0, 3).map((entry, index) => (
                                    <li key={index}>
                                        Score: <span className="font-bold">{entry.mood_score}</span> on {moment(entry.log_timestamp).format('MMM D')}
                                    </li>
                                ))}
                            </ul>
                            {sharedData.user_data_trends.length > 3 && <p className="text-xs text-gray-500 mt-2">... and {sharedData.user_data_trends.length - 3} more entries.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareData;