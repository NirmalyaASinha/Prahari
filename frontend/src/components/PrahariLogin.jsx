import React, { useState } from 'react';
import { Shield, Fingerprint, Terminal } from 'lucide-react';

export default function PrahariLogin({ onLoginSuccess }) {
  const [analystId, setAnalystId] = useState('');
  const [passkey, setPasskey] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleInitialize = (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    // Simulate a brief authentication delay for the premium feel
    setTimeout(() => {
      console.log('Initializing Sentinel with:', { analystId, passkey });
      if (onLoginSuccess) onLoginSuccess();
    }, 1200);
  };

  const handleSimulateThreat = (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    // Simulate brief credentials verification before triggering simulated threat environment
    setTimeout(() => {
      console.log('Simulating Threat Session:', { analystId, passkey });
      if (onLoginSuccess) onLoginSuccess(true);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0a0f1d] to-slate-950 z-0"></div>
        <div className="absolute inset-0 animated-grid opacity-30 z-10"></div>
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-900/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-20 w-full max-w-lg animate-fade-in-up">
        {/* Glass-morphism Login Card */}
        <div className="glass-card p-10 relative overflow-hidden group">
          {/* Subtle scanning line animation */}
          <div className="absolute inset-0 pointer-events-none border-t-2 border-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-[scanning_3s_linear_infinite]" style={{ background: 'linear-gradient(to bottom, rgba(6,182,212,0.05) 0%, transparent 100%)', backgroundSize: '100% 200%' }}></div>

          {/* Header */}
          <div className="mb-10 text-center relative z-10">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-100 to-slate-300 tracking-wider mb-2">
              PRAHARI
            </h1>
            <p className="text-xs text-cyan-400/80 font-mono tracking-[0.3em] uppercase">
              Securing Telemetry
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-900 via-cyan-500 to-rose-900 mx-auto mt-6 rounded-full opacity-80"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleInitialize} className="space-y-6 relative z-10">
            {/* Analyst ID Input */}
            <div className="group/input">
              <label className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 mb-2 tracking-[0.2em] uppercase">
                <Terminal className="w-3 h-3 text-cyan-500/70" />
                Analyst ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={analystId}
                  onChange={(e) => setAnalystId(e.target.value)}
                  placeholder="Enter analyst identifier..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-600 font-mono text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 shadow-inner"
                  required
                />
                <div className="absolute inset-0 rounded-lg border border-cyan-400/0 group-focus-within/input:border-cyan-400/20 group-focus-within/input:animate-border-glow pointer-events-none"></div>
              </div>
            </div>

            {/* Passkey Input */}
            <div className="group/input">
              <label className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 mb-2 tracking-[0.2em] uppercase">
                <Fingerprint className="w-3 h-3 text-cyan-500/70" />
                Biometric Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-600 font-mono text-lg tracking-[0.3em] focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 shadow-inner"
                  required
                />
                 <div className="absolute inset-0 rounded-lg border border-cyan-400/0 group-focus-within/input:border-cyan-400/20 group-focus-within/input:animate-border-glow pointer-events-none"></div>
              </div>
            </div>

            {/* Button Group */}
            <div className="pt-6 space-y-4">
              {/* Initialize Sentinel Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="relative w-full overflow-hidden group/btn bg-cyan-950/40 border border-cyan-800/50 hover:border-cyan-500/50 text-cyan-100 rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 via-cyan-500/10 to-cyan-600/0 opacity-0 group-hover/btn:opacity-100 transition-opacity translate-x-[-100%] group-hover/btn:translate-x-[100%] duration-1000"></div>
                <div className="relative px-6 py-4 flex items-center justify-center gap-3">
                  {isAuthenticating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                      <span className="text-sm font-semibold tracking-widest uppercase text-cyan-400">Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-semibold tracking-widest uppercase">Initialize Sentinel</span>
                    </>
                  )}
                </div>
              </button>

              {/* Simulate Threat Session Button */}
              <button
                type="button"
                onClick={handleSimulateThreat}
                className="w-full px-6 py-3 bg-transparent hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 text-rose-400/80 hover:text-rose-400 font-mono text-xs uppercase tracking-widest rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500/50"></span>
                Simulate Threat Environment (ATO)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
