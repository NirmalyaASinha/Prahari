import React, { useState } from 'react';

export default function PrahariLogin({ onLoginSuccess }) {
  const [analystId, setAnalystId] = useState('');
  const [passkey, setPasskey] = useState('');

  const handleInitialize = (e) => {
    e.preventDefault();
    console.log('Initializing Sentinel with:', { analystId, passkey });
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleSimulateThreat = (e) => {
    e.preventDefault();
    console.log('Simulating Threat Session:', { analystId, passkey });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* Glass-morphism Login Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg backdrop-blur-md p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-100 tracking-wider mb-2">
              PRAHARI
            </h1>
            <p className="text-sm text-slate-400 font-mono">
              SECURING TELEMETRY
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-slate-700 to-rose-900 mx-auto mt-4 rounded"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleInitialize} className="space-y-6">
            {/* Analyst ID Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 tracking-widest">
                ANALYST ID
              </label>
              <input
                type="text"
                value={analystId}
                onChange={(e) => setAnalystId(e.target.value)}
                placeholder="Enter your analyst ID"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition"
              />
            </div>

            {/* Passkey Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 tracking-widest">
                PASSKEY
              </label>
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter your passkey"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition"
              />
            </div>

            {/* Button Group */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {/* Initialize Sentinel Button */}
              <button
                type="submit"
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold rounded transition duration-300 text-sm tracking-wide"
              >
                Initialize Sentinel
              </button>

              {/* Simulate Threat Session Button */}
              <button
                type="button"
                onClick={handleSimulateThreat}
                className="px-6 py-3 bg-rose-900 hover:bg-rose-800 text-rose-400 font-semibold rounded transition duration-300 text-sm tracking-wide"
              >
                Simulate Threat Session (ATO)
              </button>
            </div>
          </form>
        </div>

        
      </div>
    </div>
  );
}
