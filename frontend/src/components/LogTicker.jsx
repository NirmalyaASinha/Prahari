import React, { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';

/**
 * LogTicker Component
 * Enhanced real-time log ticker with color coding and categories
 * @param {Array} threatLogs - Array of threat log objects
 * @param {Function} onClearLogs - Callback to clear logs
 */
export function LogTicker({ threatLogs = [], onClearLogs = () => {} }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [threatLogs]);

  const getCategoryColor = (category) => {
    switch(category) {
      case 'FPGA': return 'bg-cyan-900/50 text-cyan-300 border-cyan-600/50';
      case 'AUTH': return 'bg-blue-900/50 text-blue-300 border-blue-600/50';
      case 'TRANSACTION': return 'bg-purple-900/50 text-purple-300 border-purple-600/50';
      case 'SYSTEM': return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
      case 'ALERT': return 'bg-rose-900/50 text-rose-300 border-rose-600/50';
      default: return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'CRITICAL': return 'text-rose-400 bg-rose-950/30 border-rose-700/50';
      case 'HIGH': return 'text-orange-400 bg-orange-950/30 border-orange-700/50';
      case 'MEDIUM': return 'text-amber-400 bg-amber-950/30 border-amber-700/50';
      default: return 'text-slate-300 bg-slate-800/30 border-slate-700/50';
    }
  };

  const formatTimestamp = (timestamp) => {
    const time = new Date(timestamp);
    if (isNaN(time.getTime())) return '00:00:00.00';
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const ms = Math.floor(time.getMilliseconds() / 10).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  };

  const getCategoryFromType = (type) => {
    if (type.includes('FPGA')) return 'FPGA';
    if (type.includes('AUTH')) return 'AUTH';
    if (type.includes('TRANSACTION')) return 'TRANSACTION';
    if (type.includes('THREAT')) return 'ALERT';
    return 'SYSTEM';
  };

  return (
    <div className="glass-card flex flex-col h-[350px]">
      <div className="flex items-center justify-between p-5 border-b border-white/5 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-widest font-sans">
            Live Threat Stream
          </h2>
        </div>
        <button
          onClick={onClearLogs}
          className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-600/50"
          title="Clear logs"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Log Entries Container */}
      <div
        ref={scrollRef}
        className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent bg-[#030712]/40"
      >
        {threatLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-600 font-mono text-xs uppercase tracking-widest">
            <span>Awaiting Telemetry...</span>
          </div>
        ) : (
          threatLogs.map((log) => {
            const category = getCategoryFromType(log.type);
            return (
              <div
                key={log.id}
                className={`p-3 rounded-lg border text-[11px] font-mono transition-all animate-fade-in-up hover:-translate-y-0.5 hover:shadow-lg ${getSeverityColor(log.severity)}`}
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-slate-500/80">[{formatTimestamp(log.timestamp)}]</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border tracking-wider ${getCategoryColor(category)}`}>
                    {category}
                  </span>
                  <span className="ml-auto font-bold tracking-wider">{log.type}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400/90 mt-1 opacity-80">
                  <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                  Source: <span className="text-slate-300">{log.source}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Status Footer */}
      <div className="p-3 border-t border-white/5 bg-slate-900/50 text-[10px] uppercase tracking-[0.2em] font-mono text-slate-500 flex justify-between items-center">
        <span>{threatLogs.length} active {threatLogs.length === 1 ? 'event' : 'events'}</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          Stream Active
        </span>
      </div>
    </div>
  );
}