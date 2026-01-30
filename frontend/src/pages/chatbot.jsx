import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { chatWithAI } from '../api'; 

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { type: 'ai', text: 'Hello! I am Manobal, your supportive AI companion. How can I help you feel better today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    
    const userId = localStorage.getItem('manobal_user_id');

    // Auto-scroll logic to keep the latest message in view
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            // Explicitly sending userId and prompt to the resilient API
            const data = await chatWithAI(userId, userMsg);

            // Backend returns data in {"response": "text"} format
            if (data && data.response) {
                setMessages(prev => [...prev, { type: 'ai', text: data.response }]);
            } else {
                throw new Error("Neural link returned no data.");
            }

        } catch (error) {
            console.error("Chat Error:", error);
            
            let errorDetail = "Manobal is processing a lot right now. Please try again in a second.";
            
            if (error.response?.data?.detail) {
                errorDetail = error.response.data.detail;
            } else if (error.message === "Network Error") {
                errorDetail = "Check your server connection. Backend might be offline.";
            }

            setMessages(prev => [...prev, { type: 'ai', text: `⚠️ ${errorDetail}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#020202] text-white overflow-hidden font-sans relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 blur-[120px] pointer-events-none" />

            <header className="p-6 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-6">
                    <Link to="/dashboard" className="text-[10px] font-black tracking-[0.3em] text-slate-500 hover:text-amber-500 transition-all uppercase">← EXIT HUB</Link>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">MANOBAL AI <span className="text-amber-500">ASSIST</span></h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${isLoading ? 'bg-amber-500' : 'bg-green-500'}`} />
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                {isLoading ? 'Processing Neural Data...' : 'Neural Link Active'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Messages Area */}
            <div className="flex-grow overflow-y-auto p-6 lg:p-12 space-y-8 scroll-smooth z-10">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                        <div className={`max-w-[80%] lg:max-w-[60%] px-8 py-5 rounded-[2.5rem] shadow-2xl transition-all ${
                            msg.type === 'user' 
                            ? 'bg-gradient-to-br from-amber-400 to-orange-600 text-black font-bold rounded-br-none' 
                            : 'bg-slate-900/40 border border-white/5 text-slate-100 rounded-tl-none backdrop-blur-md'
                        }`}>
                            <p className="text-sm lg:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="px-8 py-4 rounded-[2rem] bg-slate-900/20 text-amber-500/50 italic text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 rounded-tl-none animate-pulse">
                            Manobal is analyzing thoughts...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form with ID/Name Attributes to prevent Autofill Warnings */}
            <form onSubmit={handleSend} className="p-8 bg-black/60 border-t border-white/5 backdrop-blur-3xl z-20">
                <div className="max-w-5xl mx-auto flex gap-6">
                    <input
                        type="text"
                        id="user_query" // Unique ID
                        name="user_query" // Name attribute for browser autofill
                        autoComplete="off" // Prevents messy browser popups
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Share your raw thoughts with Manobal..."
                        className="flex-grow bg-[#080808] border border-white/5 rounded-full px-8 py-5 focus:border-amber-500/50 outline-none transition-all text-sm font-medium shadow-inner"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !input.trim()}
                        className={`px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-2xl active:scale-95 ${
                            isLoading || !input.trim() 
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                            : 'bg-white text-black hover:bg-amber-500 shadow-amber-500/20 shadow-lg'
                        }`}
                    >
                        SEND
                    </button>
                </div>
                <p className="text-center text-[9px] text-slate-600 mt-4 uppercase tracking-[0.3em] font-bold">Encrypted AI Connection • Manobal v1.5 Flash</p>
            </form>
        </div>
    );
};

export default Chatbot;