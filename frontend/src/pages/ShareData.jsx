import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAccessToken, revokeAccessToken, viewSharedData } from '../api';
import moment from 'moment';

const ShareData = () => {
    const navigate = useNavigate();
    const userId = parseInt(localStorage.getItem('manobal_user_id'));

    const [professionalName, setProfessionalName] = useState('');
    const [durationHours, setDurationHours] = useState(48);
    const [generatedTokenInfo, setGeneratedTokenInfo] = useState(null);
    const [generateTokenError, setGenerateTokenError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const [inputAccessToken, setInputAccessToken] = useState('');
    const [sharedData, setSharedData] = useState(null);
    const [viewDataError, setViewDataError] = useState('');
    const [isViewing, setIsViewing] = useState(false);

    useEffect(() => {
        if (!userId || isNaN(userId)) navigate('/login');
    }, [userId, navigate]);

    const handleGenerateToken = async () => {
        setGenerateTokenError('');

        if (!professionalName.trim() || durationHours < 1) {
            setGenerateTokenError('Professional name and duration are required.');
            return;
        }

        setIsGenerating(true);

        try {
            const response = await generateAccessToken(
                userId,
                professionalName,
                durationHours
            );

            // normalize backend response
            setGeneratedTokenInfo({
                professional_name: professionalName,
                access_token: response.access_token || response.token,
                expires_at: response.expires_at
            });

            setProfessionalName('');
        } catch (error) {
            setGenerateTokenError(
                error.response?.data?.detail ||
                'Could not generate access token.'
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRevokeToken = async () => {
        if (!userId) return;

        if (!window.confirm("Revoke this access token?")) return;

        setIsGenerating(true);

        try {
            await revokeAccessToken(userId);
            setGeneratedTokenInfo(null);
            alert('Access token revoked successfully!');
        } catch (error) {
            setGenerateTokenError(
                error.response?.data?.detail ||
                'Could not revoke access token.'
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleViewSharedData = async () => {
        setViewDataError('');
        setSharedData(null);

        if (!inputAccessToken.trim()) {
            setViewDataError('Access token required.');
            return;
        }

        setIsViewing(true);

        try {
            const data = await viewSharedData(inputAccessToken);
            setSharedData(data);
        } catch (error) {
            setViewDataError(
                error.response?.data?.detail ||
                'Invalid or expired access token.'
            );
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
                    Generate a temporary token to share mood analytics.
                </p>

                {/* TOKEN GENERATION */}
                <div className="bg-slate-800 p-8 rounded-xl shadow-2xl mb-12 border border-indigo-600">

                    {generatedTokenInfo ? (
                        <div className="p-4 bg-slate-700 rounded-lg">

                            <h3 className="text-xl font-bold text-indigo-300 mb-2">
                                Access Active for {generatedTokenInfo.professional_name}
                            </h3>

                            <code className="block bg-gray-900 text-amber-400 p-3 my-3 rounded-md overflow-auto font-mono">
                                {generatedTokenInfo.access_token}
                            </code>

                            <p className="text-sm text-gray-400">
                                Expires: {moment(generatedTokenInfo.expires_at)
                                    .format('MMMM Do YYYY, h:mm:ss a')}
                            </p>

                            <button
                                onClick={handleRevokeToken}
                                disabled={isGenerating}
                                className="mt-4 px-5 py-2 bg-red-600 rounded-md hover:bg-red-700"
                            >
                                Revoke Access
                            </button>

                        </div>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleGenerateToken();
                            }}
                            className="space-y-4"
                        >
                            <input
                                type="text"
                                placeholder="Professional Name"
                                className="w-full p-3 bg-slate-700 rounded-md"
                                value={professionalName}
                                onChange={(e) => setProfessionalName(e.target.value)}
                                required
                            />

                            <input
                                type="number"
                                className="w-full p-3 bg-slate-700 rounded-md"
                                value={durationHours}
                                onChange={(e) =>
                                    setDurationHours(parseInt(e.target.value))
                                }
                                min="1"
                                max="720"
                                required
                            />

                            {generateTokenError && (
                                <p className="text-red-400 text-sm">
                                    {generateTokenError}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isGenerating}
                                className="w-full p-3 bg-indigo-600 rounded-md"
                            >
                                Generate Token
                            </button>
                        </form>
                    )}
                </div>

                {/* VIEW DATA */}
                <div className="bg-slate-800 p-8 rounded-xl shadow-2xl">

                    <input
                        type="text"
                        placeholder="Paste Access Token"
                        className="w-full p-3 bg-slate-700 rounded-md mb-4"
                        value={inputAccessToken}
                        onChange={(e) => setInputAccessToken(e.target.value)}
                    />

                    {viewDataError && (
                        <p className="text-red-400 text-sm">{viewDataError}</p>
                    )}

                    <button
                        onClick={handleViewSharedData}
                        disabled={isViewing}
                        className="w-full p-3 bg-green-600 rounded-md"
                    >
                        View Shared Trends
                    </button>

                    {sharedData?.user_data_trends && (
                        <div className="mt-6 text-left">
                            <p>Total Entries: {sharedData.user_data_trends.length}</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ShareData;
