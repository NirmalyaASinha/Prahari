import React, { useState, useEffect } from 'react';
import { X, Activity, Zap, Thermometer, Database, Cpu, Clock, Wifi } from 'lucide-react';
import * as echarts from 'echarts';

/**
 * FPGAOverlay Component
 * Slide-out drawer for monitoring FPGA hardware appliance metrics
 * @param {boolean} isOpen - Controls overlay visibility
 * @param {function} onClose - Callback to close overlay
 */
export function FPGAOverlay({ isOpen, onClose }) {
  const [metrics, setMetrics] = useState({
    status: 'ONLINE',
    latency: 2.8,
    throughput: 850,
    temperature: 62,
    memory: 68,
    models: 4,
    uptime: { days: 45, hours: 12 },
    packetLoss: 0.02,
  });

  const [latencyHistory, setLatencyHistory] = useState(
    Array(60).fill(0).map(() => 2.8 + Math.random() * 0.5)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Simulate FPGA metrics update
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        latency: isLoading ? 12 + Math.random() * 8 : 2.8 + Math.random() * 0.4,
        throughput: isLoading ? 200 + Math.random() * 300 : 850 + Math.random() * 100,
        temperature: isLoading ? 78 + Math.random() * 15 : 62 + Math.random() * 5,
        memory: isLoading ? 85 + Math.random() * 10 : 68 + Math.random() * 5,
        packetLoss: Math.random() * 0.05,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Update latency history
  useEffect(() => {
    setLatencyHistory(prev => [...prev.slice(1), metrics.latency]);
  }, [metrics.latency]);

  // Initialize chart
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const chartDom = document.getElementById('fpgaLatencyChart');
        if (chartDom) {
          const myChart = echarts.init(chartDom, 'dark');
          const option = {
            grid: { left: 30, right: 10, top: 10, bottom: 20, containLabel: false },
            xAxis: { type: 'category', boundaryGap: false, show: false },
            yAxis: { type: 'value', show: false, min: 0, max: 15 },
            series: [{
              data: latencyHistory,
              type: 'line',
              smooth: true,
              areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                { offset: 1, color: 'rgba(16, 185, 129, 0.01)' }
              ]) },
              itemStyle: { color: '#10b981' },
              symbolSize: 0,
              lineStyle: { color: '#10b981', width: 2 }
            }]
          };
          myChart.setOption(option);
        }
      }, 100);
    }
  }, [isOpen, latencyHistory]);

  const handleSimulateLoad = () => {
    setIsLoading(!isLoading);
  };

  const handleReset = () => {
    setMetrics({
      status: 'ONLINE',
      latency: 2.8,
      throughput: 850,
      temperature: 62,
      memory: 68,
      models: 4,
      uptime: { days: 45, hours: 12 },
      packetLoss: 0.02,
    });
    setShowResetDialog(false);
  };

  const getStatusColor = (value, thresholds) => {
    if (value < thresholds.warning) return 'text-emerald-400';
    if (value < thresholds.critical) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getStatusDot = (value, thresholds) => {
    if (value < thresholds.warning) return 'bg-emerald-400';
    if (value < thresholds.critical) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  return (
    <>
      {/* Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-slate-900 border-l border-slate-700 shadow-2xl transition-transform duration-300 transform z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-800/80 backdrop-blur border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold text-slate-100">FPGA Monitor</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-120px)] px-6 py-4 space-y-4">
          {/* Status */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">FPGA Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  metrics.status === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`} />
                <span className="text-sm font-semibold">{metrics.status}</span>
              </div>
            </div>
          </div>

          {/* Latency */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Inference Latency</span>
              <span className={`text-lg font-bold ${getStatusColor(metrics.latency, { warning: 5, critical: 10 })}`}>
                {metrics.latency.toFixed(2)}ms
              </span>
            </div>
            <div id="fpgaLatencyChart" className="h-12 -mx-4" />
            <p className="text-xs text-slate-400 mt-2">Target: 3ms</p>
          </div>

          {/* Throughput */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-slate-300">Throughput</span>
              </div>
              <span className="text-lg font-bold text-cyan-400">{metrics.throughput.toFixed(0)}K</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((metrics.throughput / 1000) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">Req/s • Server: 12K</p>
          </div>

          {/* Temperature */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                <span className="text-sm font-medium text-slate-300">Temperature</span>
              </div>
              <span className={`text-lg font-bold ${getStatusColor(metrics.temperature, { warning: 75, critical: 85 })}`}>
                {metrics.temperature.toFixed(1)}°C
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  metrics.temperature < 75 ? 'bg-emerald-500' :
                  metrics.temperature < 85 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min((metrics.temperature / 100) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Memory */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-slate-300">BRAM Usage</span>
              </div>
              <span className="text-lg font-bold text-purple-400">{metrics.memory}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                style={{ width: `${metrics.memory}%` }}
              />
            </div>
          </div>

          {/* Active Models */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Active Models</span>
              <span className="text-lg font-bold text-blue-400">{metrics.models}</span>
            </div>
          </div>

          {/* Uptime */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Uptime</span>
              </div>
              <span className="text-sm font-semibold text-slate-200">
                {metrics.uptime.days}d {metrics.uptime.hours}h
              </span>
            </div>
          </div>

          {/* Packet Loss */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">Packet Loss</span>
              </div>
              <span className={`text-sm font-semibold ${
                metrics.packetLoss < 0.01 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {(metrics.packetLoss * 100).toFixed(3)}%
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur border-t border-slate-700 px-6 py-4 space-y-2">
          <button
            onClick={handleSimulateLoad}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all text-sm ${
              isLoading
                ? 'bg-rose-900/50 text-rose-200 border border-rose-700'
                : 'bg-amber-900/50 text-amber-200 border border-amber-700 hover:bg-amber-800/50'
            }`}
          >
            {isLoading ? '⏹ Stop Load Sim' : '▶ Simulate FPGA Load'}
          </button>
          <button
            onClick={() => setShowResetDialog(true)}
            className="w-full py-2 px-4 rounded-lg font-medium text-sm bg-emerald-900/50 text-emerald-200 border border-emerald-700 hover:bg-emerald-800/50 transition-all"
          >
            🔄 Reset FPGA
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowResetDialog(false)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-lg p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Reset FPGA?</h3>
            <p className="text-sm text-slate-400 mb-6">This will restart the FPGA hardware appliance. Continue?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetDialog(false)}
                className="flex-1 py-2 px-4 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 px-4 rounded-lg bg-rose-900 text-rose-100 hover:bg-rose-800 transition-colors font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
