import React from 'react';
import { Zap } from 'lucide-react';

/**
 * FPGAComparison Component
 * Shows FPGA vs Server performance metrics with visual comparison bars
 */
export function FPGAComparison() {
  const comparisons = [
    {
      metric: 'Latency',
      fpga: 2.8,
      server: 240,
      unit: 'ms',
      improvement: 98.8,
      fpgaColor: 'from-emerald-500 to-green-600',
      serverColor: 'from-slate-500 to-slate-600',
    },
    {
      metric: 'Throughput',
      fpga: 850,
      server: 12,
      unit: 'K req/s',
      improvement: 7008.3,
      fpgaColor: 'from-blue-500 to-cyan-600',
      serverColor: 'from-slate-500 to-slate-600',
    },
    {
      metric: 'Cost/Million',
      fpga: 0.03,
      server: 0.47,
      unit: '$',
      improvement: 93.6,
      fpgaColor: 'from-purple-500 to-pink-600',
      serverColor: 'from-slate-500 to-slate-600',
    },
    {
      metric: 'Power Usage',
      fpga: 35,
      server: 450,
      unit: 'W',
      improvement: 92.2,
      fpgaColor: 'from-yellow-500 to-orange-600',
      serverColor: 'from-slate-500 to-slate-600',
    },
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">FPGA vs Server</h3>
      </div>

      <div className="space-y-6">
        {comparisons.map((comp, idx) => {
          const maxVal = Math.max(comp.fpga, comp.server);
          const fpgaWidth = (comp.fpga / maxVal) * 100;
          const serverWidth = (comp.server / maxVal) * 100;

          return (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">{comp.metric}</span>
                <span className="text-xs font-bold text-emerald-400">
                  {comp.improvement.toFixed(1)}% faster
                </span>
              </div>

              {/* FPGA Bar */}
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-slate-500 w-12">FPGA</span>
                  <div className="flex-1 bg-slate-700 rounded h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${comp.fpgaColor} transition-all`}
                      style={{ width: `${fpgaWidth}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 w-16 text-right">
                    {comp.fpga}{comp.unit}
                  </span>
                </div>
              </div>

              {/* Server Bar */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 w-12">Server</span>
                  <div className="flex-1 bg-slate-700 rounded h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${comp.serverColor}`}
                      style={{ width: `${serverWidth}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 w-16 text-right">
                    {comp.server}{comp.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
