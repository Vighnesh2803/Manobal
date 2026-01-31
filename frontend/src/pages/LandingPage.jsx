// file: frontend/src/pages/LandingPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    { title: "Neural Mood Log", description: "Journal your thoughts and receive deep AI-driven emotional insights." },
    { title: "Empathetic Chatbot", description: "A non-judgmental AI companion available 24/7 for immediate support." },
    { title: "Trusted Access", description: "Generate secure tokens to share your trajectory with professionals." },
    { title: "Zen Breathing", description: "Guided 3D breathing patterns to help regulate stress and anxiety." },
    { title: "Elite Experts", description: "Connect with verified counselors for professional tele-health sessions." },
    { title: "Resilience Streaks", description: "Build a consistent routine and track your mental health progress." }
  ];

  return (
    <div className="flex min-h-screen bg-[#020202] text-white overflow-hidden font-sans">
      <div className="flex flex-col lg:flex-row w-full">

        {/* LEFT CONTENT - Brand Identity */}
        <div className="flex flex-col justify-center items-start p-8 md:p-16 lg:w-1/2 relative">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px]" />
          
          <div className="max-w-xl mx-auto lg:mx-0 relative z-10">
            <h1 className="text-7xl md:text-9xl font-black mb-4 tracking-tighter uppercase leading-[0.85]">
              Mana<span className="text-amber-500 italic">bal</span>
            </h1>
            <h2 className="text-2xl font-bold text-amber-500 mb-8 uppercase tracking-[0.2em] italic">
              Your Path to a Brighter Tomorrow
            </h2>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
              Manobal is a compassionate space for suicide awareness and prevention. 
              We provide powerful AI tools and a professional network to help you 
              navigate mental health challenges and find your way forward.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <Link
                to="/login"
                className="w-full sm:w-auto text-center px-10 py-5 bg-amber-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-2xl hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto text-center px-10 py-5 border border-white/20 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl hover:scale-105"
              >
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT FEATURES - Grid System */}
        <div className="relative flex flex-col justify-center items-center p-8 md:p-16 lg:w-1/2 bg-white/5 backdrop-blur-3xl border-l border-white/5">
          <div className="relative z-10 w-full max-w-xl">
            <h3 className="text-xs font-black tracking-[0.5em] text-center mb-12 text-slate-500 uppercase italic">
                Neural Support Ecosystem
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-amber-500/50 transition-all duration-500 group"
                >
                  <h4 className="font-black text-lg text-white mb-3 uppercase tracking-tight group-hover:text-amber-500 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed italic">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;