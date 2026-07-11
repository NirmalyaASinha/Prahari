import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { feature } from 'topojson-client';
import worldCountries from 'world-atlas/countries-110m.json';
import { Cpu } from 'lucide-react';
import { FPGAOverlay } from './FPGAOverlay';
import { FPGAPipeline } from './FPGAPipeline';
import { FPGAComparison } from './FPGAComparison';
import { ITControlPanel } from './ITControlPanel';
import { MetricsBar } from './MetricsBar';
import { LogTicker } from './LogTicker';

export default function PrahariDashboard() {
  const [threatActive, setThreatActive] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [labelPulsePhase, setLabelPulsePhase] = useState(0);
  const [fpgaOverlayOpen, setFpgaOverlayOpen] = useState(false);
  const mapRef = useRef(null);
  const chartRef = useRef(null);
  const [threatLogs, setThreatLogs] = useState([
    { id: 1, timestamp: '14:32:05', type: 'LATERAL_MOVE', severity: 'HIGH', source: '192.168.1.105' },
    { id: 2, timestamp: '14:31:42', type: 'EXFIL_ATTEMPT', severity: 'CRITICAL', source: '10.0.0.42' },
    { id: 3, timestamp: '14:30:18', type: 'PRIVILEGE_ESCALATION', severity: 'HIGH', source: '172.16.0.89' },
    { id: 4, timestamp: '14:28:55', type: 'ANOMALY_DETECTED', severity: 'MEDIUM', source: '192.168.1.201' },
  ]);

  useEffect(() => {
    if (window.location.pathname !== '/dashboard') {
      window.location.replace('/dashboard');
    }
  }, []);

  const handleThreatSimulation = () => {
    setThreatActive(!threatActive);
    if (!threatActive) {
      const newThreat = {
        id: threatLogs.length + 1,
        timestamp: new Date().toLocaleTimeString(),
        type: 'SIMULATED_THREAT',
        severity: 'CRITICAL',
        source: '203.0.113.56',
      };
      setThreatLogs([newThreat, ...threatLogs.slice(0, 3)]);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-950/30';
      case 'HIGH':
        return 'text-orange-400 bg-orange-950/30';
      case 'MEDIUM':
        return 'text-yellow-400 bg-yellow-950/30';
      default:
        return 'text-slate-400 bg-slate-800/30';
    }
  };

  const geoCoordMap = {
    'Washington DC': [-77.0369, 38.9072],
    London: [-0.1276, 51.5072],
    Frankfurt: [8.6821, 50.1109],
    Singapore: [103.8198, 1.3521],
    Tokyo: [139.6917, 35.6895],
    Sydney: [151.2093, -33.8688],
    Mumbai: [72.8777, 19.076],
    'São Paulo': [-46.6333, -23.5505],
  };

  const baseThreatLinks = [
    ['Washington DC', 'London'],
    ['London', 'Frankfurt'],
    ['Frankfurt', 'Singapore'],
    ['Singapore', 'Tokyo'],
    ['Tokyo', 'Sydney'],
    ['Mumbai', 'London'],
    ['São Paulo', 'Washington DC'],
  ];

  const activeThreatLinks = [
    ...baseThreatLinks,
    ['Washington DC', 'Mumbai'],
    ['Frankfurt', 'São Paulo'],
    ['Tokyo', 'Washington DC'],
  ];

  const regionRiskMap = {
    'United States': 'Critical telemetry divergence detected',
    Canada: 'Low-intensity background scanning',
    Brazil: 'Suspicious outbound traffic observed',
    India: 'Privilege escalation activity correlating',
    Australia: 'Isolated anomaly cluster',
    Russia: 'Packet replay signatures detected',
    China: 'Edge sensor noise within tolerance',
    'United Kingdom': 'Active reconnaissance observed',
    France: 'Stable defensive posture',
    Germany: 'Encrypted exfiltration attempt blocked',
    Japan: 'Adaptive threat pivot under watch',
    Singapore: 'Regional command relay confirmed',
  };

  const regionRiskScores = {
    'United States': 96,
    Canada: 58,
    Brazil: 81,
    India: 92,
    Australia: 66,
    Russia: 89,
    China: 73,
    'United Kingdom': 88,
    France: 63,
    Germany: 85,
    Japan: 87,
    Singapore: 90,
  };

  const regionRiskData = Object.entries(regionRiskScores).map(([name, score]) => ({
    name,
    value: score,
  }));

  const baseIncidentLabels = [
    { name: 'United States', value: [-100.0, 38.0, 'Recon sweep'] },
    { name: 'United Kingdom', value: [-2.0, 54.0, 'Credential spray'] },
    { name: 'Germany', value: [10.0, 51.0, 'Encrypted exfiltration'] },
    { name: 'India', value: [78.0, 22.0, 'Privilege escalation'] },
    { name: 'Singapore', value: [104.0, 1.2, 'Command relay'] },
  ];

  const activeIncidentLabels = [
    ...baseIncidentLabels,
    { name: 'Brazil', value: [-52.0, -14.0, 'ATO simulation'] },
    { name: 'Japan', value: [138.0, 36.0, 'Lateral movement'] },
  ];

  const convertArcData = (data) =>
    data
      .map(([from, to]) => {
        if (!geoCoordMap[from] || !geoCoordMap[to]) return null;
        return {
          coords: [geoCoordMap[from], geoCoordMap[to]],
          value: 1,
        };
      })
      .filter(Boolean);

  const buildIncidentSeries = (active) =>
    (active ? activeIncidentLabels : baseIncidentLabels).map((item) => ({
      ...item,
      value: [...item.value],
    }));

  useEffect(() => {
    const pulseDelay = threatActive ? 320 : 520;
    const timer = setInterval(() => {
      setLabelPulsePhase((phase) => (phase + 1) % 4);
    }, pulseDelay);

    return () => clearInterval(timer);
  }, [threatActive]);

  useEffect(() => {
    let chartInstance;
    let isMounted = true;

    const threatNodes = [
      { name: 'Washington DC', value: 98 },
      { name: 'London', value: 82 },
      { name: 'Frankfurt', value: 71 },
      { name: 'Singapore', value: 64 },
      { name: 'Tokyo', value: 77 },
      { name: 'Sydney', value: 49 },
      { name: 'Mumbai', value: 86 },
      { name: 'São Paulo', value: 58 },
    ];

    const initMap = () => {
      try {
        // Wait for DOM to have proper dimensions
        const checkDimensions = () => {
          if (!mapRef.current || mapRef.current.clientWidth === 0 || mapRef.current.clientHeight === 0) {
            requestAnimationFrame(checkDimensions);
            return;
          }

          const worldGeoJson = feature(worldCountries, worldCountries.objects.countries);
          const namedFeatures = {
            ...worldGeoJson,
            features: worldGeoJson.features.map((item, index) => ({
              ...item,
              id: item.id ?? String(index),
              properties: {
                ...(item.properties || {}),
                name: item.properties?.name || item.id || `Region ${index + 1}`,
              },
            })),
          };

          echarts.registerMap('world', namedFeatures);

          if (!isMounted || !mapRef.current) return;

          chartInstance = echarts.init(mapRef.current, null, { renderer: 'canvas' });
          chartRef.current = chartInstance;

        const option = {
          backgroundColor: '#0b0f19',
          animationDuration: 800,
          animationDurationUpdate: 900,
          animationEasing: 'cubicOut',
          animationEasingUpdate: 'cubicOut',
          visualMap: {
            min: 55,
            max: 100,
            calculable: false,
            show: false,
            inRange: {
              color: ['#14080d', '#2a0b13', '#4c0519', '#7f1d1d', '#b91c1c', '#ef4444'],
            },
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(17, 24, 39, 0.98)',
            borderColor: '#7f1d1d',
            borderWidth: 1,
            textStyle: { color: '#e2e8f0', fontFamily: 'sans-serif' },
            formatter: (params) => {
              if (params.seriesType === 'map') {
                const regionName = params.name || 'Unknown Region';
                const score = params.value ?? 0;
                const note = regionRiskMap[regionName] || 'No active anomaly signature';
                return `
                  <div style="padding:6px 2px;min-width:200px;">
                    <div style="color:#f8fafc;font-weight:700;margin-bottom:4px;">${regionName}</div>
                    <div style="color:#fda4af;font-size:12px;line-height:1.35;">Geo-risk score: ${score}/100</div>
                    <div style="color:#fb7185;font-size:12px;line-height:1.35;margin-top:4px;">${note}</div>
                  </div>
                `;
              }
              if (params.componentType === 'geo') {
                const regionName = params.name || 'Unknown Region';
                const note = regionRiskMap[regionName] || 'No active anomaly signature';
                return `
                  <div style="padding:6px 2px;min-width:180px;">
                    <div style="color:#f8fafc;font-weight:700;margin-bottom:4px;">${regionName}</div>
                    <div style="color:#fb7185;font-size:12px;line-height:1.35;">${note}</div>
                  </div>
                `;
              }
              if (params.seriesType === 'scatter') {
                return `
                  <div style="padding:6px 2px;min-width:180px;">
                    <div style="color:#f8fafc;font-weight:700;margin-bottom:4px;">${params.name}</div>
                    <div style="color:#fda4af;font-size:12px;line-height:1.35;">Threat intensity: ${params.value?.[2] ?? 'N/A'}</div>
                  </div>
                `;
              }
              return '';
            },
          },
          geo: {
            map: 'world',
            roam: true,
            zoom: 1.08,
            label: { show: false },
            silent: true,
            itemStyle: {
              areaColor: '#14080d',
              borderColor: '#4c0519',
              borderWidth: 0.9,
              shadowBlur: 12,
              shadowColor: 'rgba(127, 29, 29, 0.35)',
            },
            emphasis: {
              label: { show: false },
              itemStyle: {
                areaColor: '#3f0f18',
                borderColor: '#fb7185',
                shadowBlur: 18,
                shadowColor: 'rgba(251, 113, 133, 0.35)',
              },
            },
            tooltip: {
              show: true,
            },
          },
          series: [
            {
              id: 'geo-risk',
              name: 'Geo Risk',
              type: 'map',
              map: 'world',
              geoIndex: 0,
              zlevel: 0,
              data: regionRiskData,
              emphasis: {
                label: { show: false },
                itemStyle: {
                  areaColor: '#5b1220',
                  borderColor: '#ff7a90',
                  shadowBlur: 20,
                  shadowColor: 'rgba(255, 122, 144, 0.35)',
                },
              },
              itemStyle: {
                borderColor: '#4c0519',
                borderWidth: 0.8,
              },
            },
            {
              id: 'threat-nodes',
              name: 'Threat Nodes',
              type: 'scatter',
              coordinateSystem: 'geo',
              data: threatNodes.map((node) => ({
                name: node.name,
                value: [...geoCoordMap[node.name], node.value],
              })),
              symbolSize: (val) => Math.max(8, val[2] / 7),
              itemStyle: {
                color: '#ef4444',
                shadowBlur: 24,
                shadowColor: 'rgba(239, 68, 68, 0.8)',
              },
            },
            {
              id: 'threat-arcs',
              name: 'Threat Arcs',
              type: 'lines',
              coordinateSystem: 'geo',
              zlevel: 2,
              effect: {
                show: true,
                period: 4,
                trailLength: 0.2,
                symbol: 'arrow',
                symbolSize: 7,
                color: '#fb7185',
              },
              lineStyle: {
                color: '#7f1d1d',
                width: 1.8,
                opacity: 0.9,
                curveness: 0.25,
              },
              data: convertArcData(baseThreatLinks),
            },
            {
              id: 'incident-labels',
              name: 'Incident Labels',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 3,
              rippleEffect: {
                brushType: 'stroke',
                scale: 4,
              },
              data: buildIncidentSeries(false),
              symbolSize: 12,
              itemStyle: {
                color: '#fb7185',
                shadowBlur: 20,
                shadowColor: 'rgba(251, 113, 133, 0.55)',
              },
              label: {
                show: true,
                position: 'right',
                color: '#fecdd3',
                fontSize: 11,
                fontFamily: 'sans-serif',
                formatter: (params) => `${params.name}  ·  ${params.value?.[2] ?? 'Incident'}`,
              },
            },
          ],
        };

          chartInstance.setOption(option);
          setMapReady(true);

          const handleResize = () => chartInstance && chartInstance.resize();
          window.addEventListener('resize', handleResize);

          return () => {
            window.removeEventListener('resize', handleResize);
          };
        };

        checkDimensions();
      } catch (error) {
        console.error('Failed to initialize world map', error);
        setMapReady(false);
      }
    };

    const cleanup = initMap();

    return () => {
      isMounted = false;
      if (typeof cleanup === 'function') cleanup();
      if (chartInstance) {
        chartInstance.dispose();
      }
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const riskBoost = threatActive ? 8 : 0;

    chartRef.current.setOption({
      series: [
        {
          id: 'geo-risk',
          data: regionRiskData.map((region) => ({
            name: region.name,
            value: Math.min(100, region.value + riskBoost),
          })),
        },
        {
          id: 'threat-nodes',
          data: [
            { name: 'Washington DC', value: [...geoCoordMap['Washington DC'], threatActive ? 116 : 98] },
            { name: 'London', value: [...geoCoordMap['London'], threatActive ? 104 : 82] },
            { name: 'Frankfurt', value: [...geoCoordMap['Frankfurt'], threatActive ? 96 : 71] },
            { name: 'Singapore', value: [...geoCoordMap['Singapore'], threatActive ? 88 : 64] },
            { name: 'Tokyo', value: [...geoCoordMap['Tokyo'], threatActive ? 101 : 77] },
            { name: 'Sydney', value: [...geoCoordMap['Sydney'], threatActive ? 72 : 49] },
            { name: 'Mumbai', value: [...geoCoordMap['Mumbai'], threatActive ? 110 : 86] },
            { name: 'São Paulo', value: [...geoCoordMap['São Paulo'], threatActive ? 84 : 58] },
          ],
          itemStyle: {
            color: threatActive ? '#ff4d6d' : '#ef4444',
            shadowBlur: threatActive ? 32 : 24,
            shadowColor: threatActive ? 'rgba(255, 77, 109, 0.85)' : 'rgba(239, 68, 68, 0.8)',
          },
        },
        {
          id: 'threat-arcs',
          data: convertArcData(threatActive ? activeThreatLinks : baseThreatLinks),
          lineStyle: {
            color: threatActive ? '#ff4d6d' : '#7f1d1d',
            width: threatActive ? 3.2 : 1.8,
            opacity: threatActive ? 1 : 0.9,
            curveness: 0.25,
            shadowBlur: threatActive ? 24 : 10,
            shadowColor: threatActive ? 'rgba(255, 77, 109, 0.65)' : 'rgba(127, 29, 29, 0.4)',
          },
          effect: {
            show: true,
            period: threatActive ? 1.1 : 4,
            trailLength: threatActive ? 0.55 : 0.22,
            symbol: 'arrow',
            symbolSize: threatActive ? 11 : 7,
            color: threatActive ? '#ffe4e6' : '#fb7185',
          },
        },
        {
          id: 'incident-labels',
          data: buildIncidentSeries(threatActive).map((item, index) => ({
            ...item,
            value: [...item.value, index],
          })),
          symbolSize: threatActive ? 16 : 12,
          rippleEffect: {
            brushType: 'stroke',
            scale: threatActive ? 6 : 4,
          },
          itemStyle: {
            color: threatActive ? '#ff4d6d' : '#fb7185',
            shadowBlur: threatActive ? 28 : 20,
            shadowColor: threatActive ? 'rgba(255, 77, 109, 0.6)' : 'rgba(251, 113, 133, 0.55)',
          },
          label: {
            show: labelPulsePhase % 2 === 0,
            position: labelPulsePhase % 2 === 0 ? 'right' : 'top',
            distance: labelPulsePhase % 2 === 0 ? 10 : 16,
            color: threatActive ? '#ffe4e6' : '#fecdd3',
            fontSize: threatActive ? 12 : 11,
            fontWeight: threatActive ? 800 : 600,
            fontFamily: 'sans-serif',
            formatter: (params) => {
              const label = params.value?.[2] ?? 'Incident';
              const pulse = labelPulsePhase % 2 === 0 ? '▲' : '△';
              return `${pulse} ${params.name}  ·  ${label}`;
            },
          },
        },
      ],
      visualMap: {
        min: 55,
        max: 100,
        inRange: {
          color: threatActive
            ? ['#16070d', '#2a0b13', '#4c0519', '#7f1d1d', '#b91c1c', '#ff4d6d']
            : ['#14080d', '#2a0b13', '#4c0519', '#7f1d1d', '#b91c1c', '#ef4444'],
        },
      },
      geo: {
        itemStyle: {
          areaColor: threatActive ? '#1f0a12' : '#14080d',
          borderColor: threatActive ? '#fb7185' : '#4c0519',
          borderWidth: 0.9,
          shadowBlur: threatActive ? 18 : 12,
          shadowColor: threatActive ? 'rgba(255, 77, 109, 0.3)' : 'rgba(127, 29, 29, 0.35)',
        },
        emphasis: {
          itemStyle: {
            areaColor: threatActive ? '#5b1220' : '#3f0f18',
            borderColor: '#ff7a90',
            shadowBlur: 24,
            shadowColor: 'rgba(255, 122, 144, 0.4)',
          },
        },
      },
      animationDurationUpdate: threatActive ? 520 : 900,
      animationEasingUpdate: 'cubicOut',
    });
  }, [threatActive, labelPulsePhase]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* XAI Alert Banner */}
      {threatActive && (
        <div className="bg-rose-950 border-b-2 border-rose-900 px-6 py-4 flex items-center space-x-3">
          <div className="w-3 h-3 bg-rose-400 rounded-full animate-pulse"></div>
          <span className="text-rose-400 font-mono text-sm font-semibold">
            ⚠ CRITICAL THREAT DETECTED - XAI ALERT ACTIVE
          </span>
          <span className="text-rose-300 text-xs ml-auto">Multiple anomalies correlating with advanced threat pattern</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 tracking-wider font-sans">
              PRAHARI AI // SECURING TELEMETRY
            </h1>
            <p className="text-slate-400 text-xs mt-2 font-mono">Enterprise Threat Intelligence & FPGA Acceleration Platform</p>
          </div>
          <div className="flex items-center gap-4">
            {/* FPGA Monitor Button */}
            <button
              onClick={() => setFpgaOverlayOpen(!fpgaOverlayOpen)}
              className={`p-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                fpgaOverlayOpen
                  ? 'bg-cyan-900/50 border border-cyan-700 text-cyan-400'
                  : 'bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-600/50'
              }`}
              title="Toggle FPGA Monitor"
            >
              <Cpu className="w-5 h-5" />
              <span className="text-xs font-semibold">FPGA</span>
            </button>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-mono">SYSTEMS OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* Enhanced Metrics Bar with FPGA Cards */}
        <MetricsBar threatActive={threatActive} />

        {/* Main Grid: Map (2/3) + Threat Logs (1/3) */}
        <div className="grid grid-cols-3 gap-6">
          {/* Central Map Area */}
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-4 uppercase tracking-widest">
              Global Threat Map
            </h2>
            <div className="w-full h-96 bg-slate-800/50 rounded border border-slate-700 overflow-hidden relative">
              <div ref={mapRef} className="w-full h-full" />
              {!mapReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center z-10">
                    <p className="text-slate-300 font-mono text-sm">Loading ECharts world map...</p>
                    <p className="text-slate-500 text-xs mt-2">Fetching geo data and initializing threat arcs</p>
                  </div>
                </div>
              )}
            </div>
            {/* Map Legend */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-rose-600 rounded-full"></div>
                <span className="text-slate-400">Active Threats</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-slate-400">Monitoring Zones</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-slate-400">Protected Assets</span>
              </div>
            </div>
          </div>

          {/* Side Column: Live Threat Logs & FPGA Comparison */}
          <div className="space-y-6">
            {/* LogTicker Component */}
            <LogTicker threatLogs={threatLogs} onClearLogs={() => setThreatLogs([])} />

            {/* FPGA Performance Comparison */}
            <FPGAComparison />
          </div>
        </div>

        {/* FPGA Inference Pipeline */}
        <FPGAPipeline threatActive={threatActive} />
        {/* IT Control Panel */}
        <ITControlPanel />

        {/* Threat Simulation Button */}
        {!threatActive && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleThreatSimulation}
              className="py-3 px-6 rounded-lg font-semibold transition duration-300 uppercase tracking-widest text-sm bg-slate-700 text-slate-100 hover:bg-slate-600 border border-slate-600"
            >
              ▶ Run Threat Simulation
            </button>
          </div>
        )}
      </div>

      {/* FPGA Hardware Monitor Overlay */}
      <FPGAOverlay isOpen={fpgaOverlayOpen} onClose={() => setFpgaOverlayOpen(false)} />
      <footer className="mt-8 bg-slate-900 border-t border-slate-800 px-6 py-4">
        <div className="flex justify-between items-center text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="font-mono">AI Correlation Engine Active</span>
          </div>
          <span className="font-mono">Last Updated: {new Date().toLocaleTimeString()}</span>
          <span className="font-mono">Build Version: 2.4.1</span>
        </div>
      </footer>
    </div>
  );
}
