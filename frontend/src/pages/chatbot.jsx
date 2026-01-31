import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { chatWithAI } from '../api'; 

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { type: 'ai', text: 'Hello! I am Manobal, your supportive neural companion. How can I assist your mind today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    
    const userId = localStorage.getItem('manobal_user_id');

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
            const data = await chatWithAI(userId, userMsg);
            if (data && data.response) {
                setMessages(prev => [...prev, { type: 'ai', text: data.response }]);
            } else {
                throw new Error("Neural link silent.");
            }
        } catch (error) {
            setMessages(prev => [...prev, { type: 'ai', text: `⚠️ Connection unstable. Please retry.` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#020617] text-white overflow-hidden font-sans relative">
            {/* 🌌 Background Glows (Blue & Gold) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/5 blur-[120px] pointer-events-none" />

            <header className="p-8 border-b border-blue-500/10 bg-blue-950/20 backdrop-blur-3xl flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-8">
                    <Link to="/dashboard" className="text-[10px] font-black tracking-[0.4em] text-blue-400 hover:text-[#FFD700] transition-all uppercase">← EXIT NODE</Link>
                    <div>
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">MANOBAL <span className="text-[#FFD700]">ASSIST</span></h2>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`w-2 h-2 rounded-full animate-pulse ${isLoading ? 'bg-[#FFD700]' : 'bg-emerald-500'}`} />
                            <span className="text-[10px] text-blue-300/50 font-black uppercase tracking-widest">
                                {isLoading ? 'Syncing Neurons...' : 'Neural Link Active'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto p-8 lg:p-16 space-y-10 scroll-smooth z-10">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
                        <div className={`max-w-[85%] lg:max-w-[65%] px-10 py-6 rounded-[2.5rem] shadow-2xl transition-all border ${
                            msg.type === 'user' 
                            ? 'bg-[#FFD700] border-[#FFD700] text-[#020617] font-bold rounded-br-none' 
                            : 'bg-blue-900/10 border-blue-500/20 text-blue-100 rounded-tl-none backdrop-blur-xl'
                        }`}>
                            <p className="text-sm lg:text-base leading-relaxed italic">"{msg.text}"</p>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="px-10 py-4 rounded-[2rem] bg-blue-500/5 text-[#FFD700]/50 italic text-[10px] font-black uppercase tracking-[0.3em] border border-blue-500/10 rounded-tl-none animate-pulse">
                            Processing emotional trajectory...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 🏮 Input Form (Gold Styling) */}
            <form onSubmit={handleSend} className="p-10 bg-[#020617]/80 border-t border-blue-500/10 backdrop-blur-3xl z-20">
                <div className="max-w-6xl mx-auto flex gap-6">
                    <input
                        type="text"
                        autoComplete="off"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pour your thoughts into the neural system..."
                        className="flex-grow bg-blue-900/10 border border-blue-500/20 rounded-[2rem] px-10 py-6 focus:border-[#FFD700]/50 outline-none transition-all text-sm font-medium italic placeholder-blue-300/20"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !input.trim()}
                        className={`px-14 py-6 rounded-[2rem] font-black uppercase tracking-widest text-[11px] transition-all shadow-xl active:scale-95 ${
                            isLoading || !input.trim() 
                            ? 'bg-blue-900/20 text-blue-700 cursor-not-allowed border border-blue-500/10' 
                            : 'bg-[#FFD700] text-[#020617] hover:scale-105 shadow-yellow-500/20 shadow-2xl'
                        }`}
                    >
                        SEND
                    </button>
                </div>
                <p className="text-center text-[9px] text-blue-500/30 mt-6 uppercase tracking-[0.5em] font-black">Neural Link v1.5 Flash • Encrypted Emotional Connection</p>
            </form>
        </div>
    );
};

export default Chatbot;