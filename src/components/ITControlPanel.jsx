import React, { useState } from 'react';
import { Wrench, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

/**
 * ITControlPanel Component
 * Collapsible admin control panel for IT operations
 */
export function ITControlPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(null);
  const [selectedModel, setSelectedModel] = useState('ATO Detection v2.4.1');
  const [sensitivity, setSensitivity] = useState(7);
  const [alerts, setAlerts] = useState({
    email: true,
    slack: true,
    pagerduty: false,
    webhook: false,
  });
  const [webhookUrl, setWebhookUrl] = useState('');
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  const models = [
    'ATO Detection v2.4.1',
    'Fraud Detection v1.8',
    'DDoS Protection v3.2',
  ];

  const handleDestructiveAction = (action) => {
    if (action === 'lock') {
      setShowDialog(null);
      alert('✅ Dashboard locked for investigation');
    } else if (action === 'export') {
      setShowDialog(null);
      alert('✅ Logs exported successfully');
    } else if (action === 'reset') {
      setShowDialog(null);
      alert('✅ All threat flags cleared');
    } else if (action === 'maintenance') {
      setShowDialog(null);
      alert('✅ FPGA entered maintenance mode');
    }
  };

  const runDiagnostics = () => {
    setDiagnosticResult('running');
    setTimeout(() => {
      setDiagnosticResult('✅ All systems healthy. No issues detected.');
    }, 3000);
  };

  return (
    <div className="mt-12 bg-slate-800 rounded-lg border border-slate-700">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Wrench className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-slate-100">IT CONTROL PANEL</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {/* Content */}
      {isOpen && (
        <div className="border-t border-slate-700 px-6 py-6 space-y-8">
          {/* Section 1: System Controls */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">System Controls</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setShowDialog('lock')}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm font-medium transition-colors"
              >
                🔒 Lock Dashboard
              </button>
              <button
                onClick={() => setShowDialog('export')}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm font-medium transition-colors"
              >
                📥 Export Logs
              </button>
              <button
                onClick={() => setShowDialog('reset')}
                className="px-4 py-2 rounded-lg bg-rose-900/50 hover:bg-rose-800/50 text-rose-200 text-sm font-medium transition-colors border border-rose-700"
              >
                ⚠️ Reset Threat Flags
              </button>
              <button
                onClick={() => setShowDialog('maintenance')}
                className="px-4 py-2 rounded-lg bg-amber-900/50 hover:bg-amber-800/50 text-amber-200 text-sm font-medium transition-colors border border-amber-700"
              >
                🛠️ Maintenance Mode
              </button>
            </div>
          </div>

          {/* Section 2: FPGA Configuration */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">FPGA Configuration</h4>
            <div className="space-y-4">
              {/* Model Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Detection Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Sensitivity Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-400">Detection Sensitivity</label>
                  <span className="text-sm font-bold text-cyan-400">{sensitivity}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button className="px-3 py-2 rounded-lg bg-emerald-900/50 hover:bg-emerald-800/50 text-emerald-200 text-sm font-medium transition-colors border border-emerald-700">
                  ▶ Push Config
                </button>
                <button className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm font-medium transition-colors">
                  ⮌ Rollback
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Alert Routing */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Alert Routing</h4>
            <div className="space-y-3">
              {Object.entries(alerts).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm text-slate-300 capitalize">{key === 'pagerduty' ? 'PagerDuty' : key === 'webhook' ? 'Webhook' : key}</label>
                  <switch
                    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                    style={{
                      backgroundColor: value ? '#10b981' : '#475569',
                      cursor: key === 'webhook' ? 'not-allowed' : 'pointer'
                    }}
                    onClick={() => {
                      if (key !== 'webhook') {
                        setAlerts(prev => ({ ...prev, [key]: !prev[key] }));
                      }
                    }}
                  >
                    <span
                      className="h-5 w-5 rounded-full bg-white transition-transform"
                      style={{ transform: value ? 'translateX(22px)' : 'translateX(2px)' }}
                    />
                  </switch>
                </div>
              ))}
              {alerts.webhook && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="https://webhook.example.com/alerts"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 4: System Health */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">System Health</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <span className="text-slate-400">Last Health Check</span>
                <span className="text-slate-100">2 min ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <span className="text-slate-400">Next Maintenance</span>
                <span className="text-slate-100">May 15, 2025</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <span className="text-slate-400">Firmware Version</span>
                <span className="text-slate-100 font-mono">v4.2.1</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm font-medium transition-colors">
                  ↻ Check Updates
                </button>
                <button
                  onClick={runDiagnostics}
                  className="px-3 py-2 rounded-lg bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-200 text-sm font-medium transition-colors border border-cyan-700"
                  disabled={diagnosticResult === 'running'}
                >
                  {diagnosticResult === 'running' ? '⏳ Testing...' : '🔧 Diagnostics'}
                </button>
              </div>
              {diagnosticResult && diagnosticResult !== 'running' && (
                <div className="p-3 bg-emerald-900/30 border border-emerald-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-200">{diagnosticResult}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDialog(null)} />
          <div className="relative bg-slate-800 border border-slate-700 rounded-lg p-6 w-96 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-100 mb-2">Confirm Action</h3>
            <p className="text-sm text-slate-400 mb-6">
              {showDialog === 'lock' && 'Lock the dashboard for investigation?'}
              {showDialog === 'export' && 'Export all logs as JSON?'}
              {showDialog === 'reset' && 'Clear all active threat flags?'}
              {showDialog === 'maintenance' && 'Enter FPGA maintenance mode?'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDialog(null)}
                className="flex-1 py-2 px-4 rounded-lg bg-slate-700 text-slate-100 hover:bg-slate-600 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDestructiveAction(showDialog)}
                className="flex-1 py-2 px-4 rounded-lg bg-rose-900 text-rose-100 hover:bg-rose-800 transition-colors font-medium text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
