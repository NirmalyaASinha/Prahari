import React, { useState, useEffect } from 'react';
import { ArrowDown, Filter, Brain, AlertTriangle, Shield } from 'lucide-react';

/**
 * FPGAPipeline Component
 * Visualizes FPGA inference pipeline with latency metrics
 * @param {boolean} threatActive - Whether a threat is currently detected
 */
export function FPGAPipeline({ threatActive = false }) {
  const [latencies, setLatencies] = useState([0.2, 1.8, 0.8]);
  const [flowRate, setFlowRate] = useState(2450);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatencies([
        0.15 + Math.random() * 0.1,
        1.7 + Math.random() * 0.3,
        0.75 + Math.random() * 0.2,
      ]);
      setFlowRate(2300 + Math.random() * 300);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const totalLatency = latencies.reduce((a, b) => a + b, 0);

  const nodes = [
    { id: 1, label: 'INCOMING TRAFFIC', icon: ArrowDown, value: `${flowRate.toFixed(0)}/s` },
    { id: 2, label: 'FPGA PRE-PROCESSOR', icon: Filter, value: 'Feature Extract' },
    { id: 3, label: 'AI INFERENCE ENGINE', icon: Brain, value: 'ML Predict' },
    { id: 4, label: 'THREAT VERDICT', icon: threatActive ? AlertTriangle : Shield, value: threatActive ? 'THREAT' : 'NOMINAL' },
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-8">FPGA Inference Pipeline</h3>

      {/* Pipeline Visualization */}
      <div className="relative">
        {/* SVG Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ height: '120px' }}>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <defs>
                <pattern id={`dash-${i}`} patternUnits="userSpaceOnUse" width="8" height="0">
                  <line x1="0" y1="0" x2="4" y2="0" stroke={threatActive ? '#881337' : '#10b981'} strokeWidth="2" />
                </pattern>
              </defs>
              <line
                x1={`${(i + 0.5) * 25}%`}
                y1="60"
                x2={`${(i + 1.5) * 25}%`}
                y2="60"
                stroke={threatActive ? '#881337' : '#10b981'}
                strokeWidth="2"
                strokeDasharray="4,4"
                opacity="0.5"
              />
              <polygon
                points={`${(i + 1.4) * 25}%,60 ${(i + 1.5) * 25}%,55 ${(i + 1.5) * 25}%,65`}
                fill={threatActive ? '#881337' : '#10b981'}
                opacity="0.7"
              />
            </g>
          ))}
        </svg>

        {/* Nodes */}
        <div className="grid grid-cols-4 gap-4 relative z-10">
          {nodes.map((node, idx) => {
            const Icon = node.icon;
            const isVerdictNode = node.id === 4;
            const bgColor = isVerdictNode
              ? threatActive ? 'bg-gradient-to-br from-rose-900/40 to-red-900/40' : 'bg-gradient-to-br from-emerald-900/40 to-green-900/40'
              : 'bg-slate-700/50';
            const borderColor = isVerdictNode
              ? threatActive ? 'border-rose-600/50' : 'border-emerald-600/50'
              : 'border-slate-600/50';

            return (
              <div key={node.id} className="text-center">
                {/* Node Circle */}
                <div className={`
                  flex items-center justify-center w-16 h-16 mx-auto rounded-full mb-3 transition-all
                  ${bgColor} border-2 ${borderColor}
                  ${isVerdictNode && threatActive ? 'threat-glow shadow-lg' : 'shadow'}
                `}>
                  <Icon className="w-7 h-7" style={{
                    color: isVerdictNode
                      ? threatActive ? '#f87171' : '#10b981'
                      : '#60a5fa'
                  }} />
                </div>

                {/* Label */}
                <p className="text-xs font-semibold text-slate-300 mb-1">{node.label}</p>
                <p className="text-xs text-slate-400">{node.value}</p>

                {/* Latency */}
                {idx < 3 && (
                  <p className={`text-xs font-bold mt-2 ${
                    threatActive ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {latencies[idx].toFixed(2)}ms
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Latency Footer */}
      <div className="mt-8 pt-6 border-t border-slate-700 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">End-to-End Latency</span>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${threatActive ? 'text-rose-400' : 'text-emerald-400'}`}>
            {totalLatency.toFixed(2)}
          </span>
          <span className="text-sm text-slate-500">ms</span>
        </div>
      </div>
    </div>
  );
}
