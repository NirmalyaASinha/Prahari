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
    const now = new Date();
    const time = new Date(timestamp);
    const ms = (now.getMilliseconds() - time.getMilliseconds()).toString().padStart(2, '0');
    return `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}.${ms}`;
  };

  const getCategoryFromType = (type) => {
    if (type.includes('FPGA')) return 'FPGA';
    if (type.includes('AUTH')) return 'AUTH';
    if (type.includes('TRANSACTION')) return 'TRANSACTION';
    if (type.includes('THREAT')) return 'ALERT';
    return 'SYSTEM';
  };

  return (
    <div className="glass-card bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-100 uppercase tracking-widest">
          Live Threat Logs
        </h2>
        <button
          onClick={onClearLogs}
          className="p-2 rounded hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-slate-200"
          title="Clear logs"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Log Entries Container - max 8 entries visible with scroll */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-2 overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50"
      >
        {threatLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-xs">
            <span>No active threat logs</span>
          </div>
        ) : (
          threatLogs.map((log) => {
            const category = getCategoryFromType(log.type);
            return (
              <div
                key={log.id}
                className={`p-3 rounded border text-xs font-mono transition-all ${getSeverityColor(log.severity)}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-500">[{formatTimestamp(log.timestamp)}]</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getCategoryColor(category)}`}>
                    {category}
                  </span>
                  <span className="ml-auto font-semibold">{log.type}</span>
                </div>
                <div className="text-xs text-slate-400">Source: {log.source}</div>
              </div>
            );
          })
        )}
      </div>

      {/* Status Footer */}
      <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-500">
        <span>{threatLogs.length} active {threatLogs.length === 1 ? 'log' : 'logs'}</span>
      </div>
    </div>
  );
}