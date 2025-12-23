import React from 'react';
import { Link } from 'react-router-dom';

const Helpline = () => {
    const indianHelplines = [
        { name: "KIRAN National Helpline", number: "1800-599-0019", description: "Provides free psychological support and mental health services." },
        { name: "AASRA", number: "98204-66726", description: "A 24/7 helpline for suicide prevention and crisis intervention." },
        { name: "Vandrevala Foundation", number: "99996-66500", description: "Offers 24x7 emotional and psychological support services." },
        { name: "Connecting India", number: "1800-209-4353", description: "A free, confidential helpline for emotional support and crisis management." }
    ];

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl w-full mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 mt-8 text-amber-400">
                    Emergency Helpline
                </h1>
                <p className="text-lg text-gray-400 mb-8">
                    If you are in distress or need immediate support, please reach out. You are not alone.
                </p>

                <div className="bg-slate-800 p-8 rounded-lg shadow-2xl border border-amber-500 mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-red-500">
                        In a Crisis? Call Now.
                    </h3>
                    {/* The number below is a placeholder, you can use a real one. */}
                    <a href="tel:9820466726" className="inline-block p-4 sm:p-6 bg-red-600 text-white font-extrabold text-2xl sm:text-4xl rounded-full hover:bg-red-700 transition duration-300 transform hover:scale-110">
                        📞 98204-66726
                    </a>
                    <p className="mt-4 text-sm text-gray-500">
                        This is a 24/7 national helpline for crisis intervention.
                    </p>
                </div>

                <div className="bg-slate-800 p-8 rounded-lg shadow-2xl border border-amber-500">
                    <h3 className="text-2xl font-bold mb-6 text-amber-400">
                        Other Helplines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {indianHelplines.map((helpline, index) => (
                            <div key={index} className="bg-slate-700 p-4 rounded-lg shadow-md border border-cyan-500">
                                <h4 className="font-bold text-lg text-cyan-400 mb-1">{helpline.name}</h4>
                                <p className="text-sm text-gray-400 mb-2">{helpline.description}</p>
                                <a href={`tel:${helpline.number}`} className="text-blue-400 hover:underline">
                                    {helpline.number}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <Link to="/dashboard" className="mt-8 text-center block text-sm text-gray-400 hover:underline">
                    Go Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Helpline;