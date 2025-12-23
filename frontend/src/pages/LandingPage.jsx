import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    { title: "Mood Tracker", description: "Monitor your emotional journey with a simple, private journal." },
    { title: "Chatbot Support", description: "Get instant, anonymous support and guidance whenever you need it." },
    { title: "Trusted Viewer", description: "Share your progress with a trusted friend or counselor for a support system." },
    { title: "Emergency Helpline", description: "Access fast, one-tap help in critical moments." },
    { title: "Gamified Tasks", description: "Complete fun, engaging tasks to help improve your mental well-being." },
    { title: "Streak Days", description: "Stay consistent and build a positive routine." }
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row w-full">
        {/* Left Section - Content */}
        <div className="flex flex-col justify-center items-start p-8 md:p-16 lg:w-1/2">
          <div className="max-w-xl mx-auto lg:mx-0">
            <h1 className="text-6xl md:text-7xl font-extrabold mb-4 leading-tight">
              Manobal
            </h1>
            <h2 className="text-3xl font-semibold text-amber-400 mb-6">Your Path to a Brighter Tomorrow</h2>
            <p className="text-lg text-gray-400 mb-8">
              Manobal is a compassionate space for suicide awareness and prevention. We provide powerful tools and a supportive community to help you navigate mental health challenges and find your way forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-gray-900 font-bold rounded-lg hover:bg-amber-600 transition duration-300 transform hover:scale-105 shadow-xl"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 border border-white text-white font-bold rounded-lg hover:bg-white hover:text-gray-900 transition duration-300 transform hover:scale-105 shadow-xl"
              >
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section - Features */}
        <div className="relative flex flex-col justify-center items-center p-8 md:p-16 lg:w-1/2 bg-gray-900 overflow-hidden">
          <div className="relative z-10 w-full max-w-xl">
            <h3 className="text-3xl font-bold text-center mb-8 text-white">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-lg border border-amber-500">
                  <h4 className="font-bold text-lg text-amber-400 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
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