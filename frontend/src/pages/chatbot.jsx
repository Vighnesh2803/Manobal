// file: frontend/src/pages/Chatbot.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { type: 'ai', text: 'Hello! I am Manobal, your supportive AI companion. How can I help you feel better today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    
    // Proper User ID retrieval
    const userId = localStorage.getItem('manobal_user_id');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            // SYNCED: Added timeout and direct payload mapping for main.py
            const response = await axios.post('http://localhost:8000/chat', {
                user_id: parseInt(userId),
                prompt: userMsg 
            }, { 
                timeout: 30000 // 30 seconds wait for AI response
            });

            // Handle backend response key 'message' from main.py
            const aiText = response.data.message || "I am processing your thoughts, please continue.";
            setMessages(prev => [...prev, { type: 'ai', text: aiText }]);

        } catch (error) {
            console.error("Chat Error:", error);
            let errorDetail = "Manobal is resting. Please check if the backend is running.";
            
            if (error.code === 'ECONNABORTED') {
                errorDetail = "AI is taking a bit longer to think. Please try a shorter message.";
            } else if (error.response?.data?.detail) {
                errorDetail = error.response.data.detail;
            }

            setMessages(prev => [...prev, { type: 'ai', text: `⚠️ ${errorDetail}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden">
            {/* Header */}
            <header className="p-5 border-b border-amber-500/30 bg-slate-900/50 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="text-amber-400 font-black hover:scale-110 transition-transform px-3 py-1 bg-white/5 rounded-lg">← BACK</Link>
                    <div>
                        <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">Manobal AI Support 🤖</h2>
                        <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest animate-pulse">Online Support</span>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                        <div className={`max-w-[85%] px-6 py-4 rounded-[2rem] shadow-2xl transition-all ${
                            msg.type === 'user' 
                            ? 'bg-amber-500 text-black font-bold rounded-br-none' 
                            : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                        }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="px-6 py-4 rounded-[2rem] bg-slate-900/50 text-slate-500 italic text-xs animate-pulse border border-slate-800 rounded-tl-none">
                            Manobal is thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-6 bg-slate-900/50 border-t border-slate-800 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Share your feelings with Manobal..."
                        className="flex-grow bg-black border-2 border-slate-800 rounded-full px-6 py-4 focus:border-amber-500 outline-none transition-all text-sm shadow-inner"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !input.trim()}
                        className={`px-8 py-4 rounded-full font-black uppercase transition-all shadow-lg active:scale-95 ${
                            isLoading || !input.trim() 
                            ? 'bg-slate-800 text-slate-600 grayscale cursor-not-allowed' 
                            : 'bg-amber-500 text-black hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]'
                        }`}
                    >
                        Go
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chatbot;