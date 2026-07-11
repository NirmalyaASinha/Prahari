import React, { useState, useEffect } from 'react';
import { Cpu, Zap, AlertCircle, Globe, Zap as ZapIcon, Target } from 'lucide-react';

/**
 * MetricsBar Component
 * Enhanced metrics display with FPGA cards
 * @param {boolean} threatActive - Whether a threat is currently active
 */
export function MetricsBar({ threatActive = false }) {
  const [metrics, setMetrics] = useState({
    threatsDetected: 247,
    endpointsMonitored: 1200,
    responseTime: 2.4,
    correlationAccuracy: 98.7,
    fpgaLatency: 2.8,
    fpgaThroughput: 850,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        threatsDetected: threatActive ? 247 + Math.floor(Math.random() * 20) : 247 + Math.floor(Math.random() * 5),
        endpointsMonitored: 1200,
        responseTime: threatActive ? 2.4 + Math.random() * 0.5 : 2.4 + (Math.random() - 0.5) * 0.2,
        correlationAccuracy: 98.7 + (Math.random() - 0.5) * 0.3,
        fpgaLatency: 2.8 + (Math.random() - 0.5) * 0.4,
        fpgaThroughput: 850 + (Math.random() - 0.5) * 100,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [threatActive]);

  const getLatencyColor = (value) => {
    if (value < 5) return 'text-emerald-400';
    if (value < 10) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      {/* Metric 1: Threats Detected */}
      <div className="glass-card p-4 bg-slate-900 border border-slate-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="metric-label text-xs">Threats Detected</p>
            <p className="text-3xl font-bold text-slate-100 mt-2">{metrics.threatsDetected}</p>
          </div>
          <AlertCircle className="w-6 h-6 text-rose-400" />
        </div>
        <p className="text-rose-400 text-xs mt-3 font-mono">
          {threatActive ? '+5 in last min' : '+12 in last hour'}
        </p>
      </div>

      {/* Metric 2: Endpoints Monitored */}
      <div className="glass-card p-4 bg-slate-900 border border-slate-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="metric-label text-xs">Endpoints Monitored</p>
            <p className="text-3xl font-bold text-slate-100 mt-2">{(metrics.endpointsMonitored / 1000).toFixed(1)}K</p>
          </div>
          <Globe className="w-6 h-6 text-green-400" />
        </div>
        <p className="text-green-400 text-xs mt-3 font-mono">All systems operational</p>
      </div>

      {/* Metric 3: Response Time */}
      <div className="glass-card p-4 bg-slate-900 border border-slate-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="metric-label text-xs">Response Time</p>
            <p className="text-3xl font-bold text-slate-100 mt-2">{metrics.responseTime.toFixed(1)}s</p>
          </div>
          <ZapIcon className="w-6 h-6 text-blue-400" />
        </div>
        <p className="text-blue-400 text-xs mt-3 font-mono">Within SLA</p>
      </div>

      {/* Metric 4: Correlation Accuracy */}
      <div className="glass-card p-4 bg-slate-900 border border-slate-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="metric-label text-xs">Correlation</p>
            <p className="text-3xl font-bold text-slate-100 mt-2">{metrics.correlationAccuracy.toFixed(1)}%</p>
          </div>
          <Target className="w-6 h-6 text-purple-400" />
        </div>
        <p className="text-purple-400 text-xs mt-3 font-mono">ML Optimized</p>
      </div>

      {/* Metric 5: FPGA Latency */}
      <div className="glass-card p-4 bg-slate-900 border border-slate-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="metric-label text-xs">FPGA Latency</p>
            <p className={`text-3xl font-bold mt-2 ${getLatencyColor(metrics.fpgaLatency)}`}>
              {metrics.fpgaLatency.toFixed(1)}ms
            </p>
          </div>
          <Cpu className="w-6 h-6 text-cyan-400" />
        </div>
        <p className={`text-xs mt-3 font-mono ${getLatencyColor(metrics.fpgaLatency)}`}>Target: 3ms</p>
      </div>

      {/* Metric 6: FPGA Throughput */}
      <div className="glass-card p-4 bg-slate-900 border border-slate-800">
        <div className="flex justify-between items-start">
          <div>
            <p className="metric-label text-xs">FPGA Throughput</p>
            <p className="text-3xl font-bold text-slate-100 mt-2">{(metrics.fpgaThroughput / 1000).toFixed(0)}K</p>
          </div>
          <Zap className="w-6 h-6 text-amber-400" />
        </div>
        <p className="text-slate-400 text-xs mt-3 font-mono">Req/s • 70x faster</p>
      </div>
    </div>
  );
}