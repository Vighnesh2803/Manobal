import React, { useState } from 'react';
// api.js se exported functions
import { generateAccessToken, revokeAccessToken } from '../api';

const ShareData = () => {
    const userId = parseInt(localStorage.getItem('manobal_user_id'));
    const [professionalName, setProfessionalName] = useState('');
    const [duration, setDuration] = useState(24);
    const [tokenData, setTokenData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleGenerateAccess = async () => {
        if (!professionalName.trim()) {
            setMessage("Please enter the Professional's Name.");
            return;
        }
        setLoading(true);
        try {
            // Matches @app.post("/access/generate")
            const data = await generateAccessToken(userId, professionalName, duration);
            setTokenData(data);
            setMessage("Access Token Generated Successfully!");
        } catch (error) {
            setMessage("Failed to generate token. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async () => {
        try {
            // Matches @app.delete("/access/revoke/{user_id}")
            await revokeAccessToken(userId);
            setTokenData(null);
            setMessage("All access revoked successfully.");
        } catch (error) {
            setMessage("Failed to revoke access.");
        }
    };

    return (
        <div className="flex-1 p-8 bg-gray-950 text-white min-h-screen flex flex-col items-center">
            <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                <h1 className="text-3xl font-bold text-indigo-400 mb-2">Trusted Access Protocol 🛡️</h1>
                <p className="text-gray-400 mb-8">Securely share your mood trends with a mental health professional.</p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Professional's Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Dr. Sameer"
                            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            value={professionalName}
                            onChange={(e) => setProfessionalName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Access Duration (Hours)</label>
                        <select 
                            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        >
                            <option value={1}>1 Hour</option>
                            <option value={24}>24 Hours</option>
                            <option value={168}>1 Week</option>
                        </select>
                    </div>

                    {!tokenData ? (
                        <button
                            onClick={handleGenerateAccess}
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-lg transition disabled:opacity-50"
                        >
                            {loading ? "Generating..." : "Generate Secure Token"}
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-6 bg-indigo-900/30 border border-indigo-500/50 rounded-2xl text-center">
                                <p className="text-sm text-indigo-300 mb-1">Share this Token with {tokenData.professional_name}:</p>
                                <p className="text-2xl font-mono font-bold text-white break-all">{tokenData.access_token}</p>
                                <p className="text-xs text-gray-500 mt-3 italic">Expires: {new Date(tokenData.expires_at).toLocaleString()}</p>
                            </div>
                            <button
                                onClick={handleRevoke}
                                className="w-full py-4 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-600/50 rounded-xl font-bold transition"
                            >
                                Revoke Access Immediately
                            </button>
                        </div>
                    )}

                    {message && (
                        <p className={`text-center text-sm font-medium ${message.includes('fail') ? 'text-red-400' : 'text-emerald-400'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-8 max-w-2xl text-center text-gray-500 text-sm">
                <p>🔒 Manobal uses end-to-end identification. Professionals can only view your mood trends and AI analysis; your identity remains private unless you choose otherwise.</p>
            </div>
        </div>
    );
};

// CRITICAL: Yeh default export hona zaroori hai white screen fix karne ke liye
export default ShareData;