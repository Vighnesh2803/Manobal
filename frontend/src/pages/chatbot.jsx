// file: frontend/src/pages/Chatbot.jsx (FINAL AND CORRECTED)

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Using axios directly for simplicity in this component

// The base URL for your FastAPI backend
const API_BASE_URL = 'http://localhost:8000'; 

// Helper function to safely get the user ID using the correct key
const getUserId = () => {
    const userId = localStorage.getItem('manobal_user_id'); // CRITICAL FIX: Use the correct key
    const parsedId = userId ? parseInt(userId) : null;
    return (parsedId && !isNaN(parsedId)) ? parsedId : null;
};

const Chatbot = () => {
    // Initial welcome message from the AI
    const [messages, setMessages] = useState([
        { 
            type: 'ai', 
            text: 'Hello! I am Manobal, your supportive AI companion. How can I help you feel better today?' 
        }
    ]);
    
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    
    // Retrieve userId correctly
    const userId = getUserId(); 
    
    // Check if the user is truly logged in for rendering messages
    const isLoggedIn = !!userId; 

    // Effect to scroll to the bottom whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        const userMessage = input.trim();

        if (!userMessage) return;
        
        // CRITICAL FIX: Ensure user ID is valid before sending the API request
        if (!isLoggedIn) {
             setMessages(prev => [...prev, { type: 'ai', text: 'Error: Please log in to use the chat. Your session may have expired.' }]);
             return;
        }

        // 1. Add user message to state immediately
        setMessages(prevMessages => [...prevMessages, { type: 'user', text: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            // 2. API Call to the FastAPI backend /chat endpoint
            const response = await axios.post(`${API_BASE_URL}/chat`, {
                user_id: userId,
                prompt: userMessage
            });

            // 3. Add AI response to state
            const aiResponseText = response.data.message;
            setMessages(prevMessages => [...prevMessages, { type: 'ai', text: aiResponseText }]);

        } catch (error) {
            console.error("Chat API Error:", error);
            const detail = error.response?.data?.detail || 'Could not reach the AI service.';
            
            // 4. Handle error with a system message
            setMessages(prevMessages => [...prevMessages, { 
                type: 'ai', 
                text: `⚠️ Connection Error: ${detail}` 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-h-screen bg-gray-950 text-white">
            
            {/* --- Chat Header --- */}
            <div className="bg-slate-800 p-3 border-b border-amber-400 shadow-lg flex items-center">
                <Link to="/dashboard" className="mr-4 text-amber-400 hover:text-amber-300 transition-colors">
                    &larr; Back to Dashboard
                </Link>
                <h2 className="text-xl font-semibold">Manobal AI Support <span className="text-amber-400">🤖</span></h2>
            </div>

            {/* --- Message Display Area --- */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {!isLoggedIn && (
                    <div className="text-center p-4 bg-red-900 bg-opacity-30 text-red-300 rounded-lg">
                        Session Expired or Not Logged In. Please refresh the page or log in again.
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-lg ${
                            msg.type === 'user' 
                                ? 'bg-amber-500 text-gray-900 rounded-br-none' // User message style
                                : 'bg-slate-700 text-white rounded-tl-none' // AI message style
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="px-4 py-3 rounded-xl bg-slate-700 text-gray-400 rounded-tl-none">
                            Manobal is thinking...
                        </div>
                    </div>
                )}
                {/* Scroll ref element */}
                <div ref={messagesEndRef} />
            </div>

            {/* --- Input Form --- */}
            <form onSubmit={handleSend} className="p-4 bg-slate-800 border-t border-slate-700">
                <div className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isLoggedIn ? "Share what's on your mind..." : "Log in to chat..."}
                        disabled={isLoading || !isLoggedIn}
                        className="flex-grow border border-slate-600 rounded-full p-3 bg-slate-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim() || !isLoggedIn}
                        className={`px-6 py-3 rounded-full font-semibold transition-colors duration-200 ${
                            isLoading || !input.trim() || !isLoggedIn
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-amber-500 text-gray-900 hover:bg-amber-600 shadow-md'
                        }`}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chatbot;