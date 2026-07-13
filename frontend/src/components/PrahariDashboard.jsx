import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { feature } from 'topojson-client';
import worldCountries from 'world-atlas/countries-110m.json';
import { Cpu, Activity, Zap, Thermometer, Database, Clock, Wifi } from 'lucide-react';
import { FPGAPipeline } from './FPGAPipeline';
import { ITControlPanel } from './ITControlPanel';
import { LogTicker } from './LogTicker';
import { ThreatPieChart } from './ThreatPieChart';

export default function PrahariDashboard({ initialThreatActive = false }) {
  const [threatActive, setThreatActive] = useState(initialThreatActive);
  const [mapReady, setMapReady] = useState(false);
  const [labelPulsePhase, setLabelPulsePhase] = useState(0);

  // Tab Navigation State
  const [activeTab, setActiveTab] = useState('soc'); // 'soc' or 'fpga'

  // FPGA Config States
  const [selectedModel, setSelectedModel] = useState('ATO Detection v2.4.1');
  const [sensitivity, setSensitivity] = useState(7);
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  // FPGA Hardware Monitor States
  const [fpgaMetrics, setFpgaMetrics] = useState({
    status: 'ONLINE',
    latency: 2.8,
    throughput: 850,
    temperature: 62,
    memory: 68,
    models: 4,
    uptime: { days: 45, hours: 12 },
    packetLoss: 0.02,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const models = [
    'ATO Detection v2.4.1',
    'Fraud Detection v1.8',
    'DDoS Protection v3.2',
  ];

  // Update hardware metrics in background
  useEffect(() => {
    const interval = setInterval(() => {
      setFpgaMetrics(prev => ({
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
  const mapRef = useRef(null);
  const chartRef = useRef(null);
  const [threatLogs, setThreatLogs] = useState(() => {
    const now = new Date();
    const baseLogs = [
      { id: 1, timestamp: new Date(now.getTime() - 60000), type: 'LATERAL_MOVE', severity: 'HIGH', source: '192.168.1.105' },
      { id: 2, timestamp: new Date(now.getTime() - 120000), type: 'EXFIL_ATTEMPT', severity: 'CRITICAL', source: '10.0.0.42' },
      { id: 3, timestamp: new Date(now.getTime() - 300000), type: 'PRIVILEGE_ESCALATION', severity: 'HIGH', source: '172.16.0.89' },
      { id: 4, timestamp: new Date(now.getTime() - 600000), type: 'ANOMALY_DETECTED', severity: 'MEDIUM', source: '192.168.1.201' },
    ];
    if (initialThreatActive) {
      const simulatedThreat = {
        id: Date.now(),
        timestamp: new Date(),
        type: 'SIMULATED_THREAT',
        severity: 'CRITICAL',
        source: '203.0.113.56',
      };
      return [simulatedThreat, ...baseLogs.slice(0, 3)];
    }
    return baseLogs;
  });

  useEffect(() => {
    if (window.location.pathname !== '/dashboard') {
      window.history.pushState(null, '', '/dashboard');
    }
  }, []);

  const handleThreatSimulation = () => {
    setThreatActive(!threatActive);
    if (!threatActive) {
      const newThreat = {
        id: Date.now(),
        timestamp: new Date(),
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
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-900/50">
      {/* XAI Alert Banner */}
      {threatActive && (
        <div className="relative overflow-hidden bg-rose-950/80 backdrop-blur-md border-b border-rose-500/30 px-6 py-4 flex items-center space-x-3 shadow-[0_0_30px_rgba(225,29,72,0.2)] animate-fade-in-up z-50">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjI1LCAyOSLCA3MiwgMC4xKSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none"></div>
          <div className="w-3 h-3 bg-rose-500 rounded-full animate-[pulse_1s_ease-in-out_infinite] shadow-[0_0_10px_rgba(225,29,72,0.8)]"></div>
          <span className="text-rose-400 font-mono text-sm font-bold tracking-widest uppercase">
            ⚠ Critical Threat Detected // XAI Alert Active
          </span>
          <span className="text-rose-300/80 text-xs ml-auto font-mono tracking-widest uppercase">Multiple anomalies correlating with advanced threat pattern</span>
        </div>
      )}

      {/* Header */}
      <header className="glass-card rounded-none border-t-0 border-l-0 border-r-0 border-b border-white/10 px-8 py-5 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-100 to-slate-400 tracking-wider">
              PRAHARI
            </h1>
            <p className="text-cyan-500/70 text-[10px] mt-1 font-mono uppercase tracking-[0.3em]">Enterprise Threat Intelligence & FPGA Acceleration</p>
          </div>
          <div className="flex items-center gap-6">
            {/* Tab Toggle Button */}
            <button
              onClick={() => setActiveTab(activeTab === 'fpga' ? 'soc' : 'fpga')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 border shadow-lg ${
                activeTab === 'fpga'
                  ? 'bg-cyan-900/30 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600'
              }`}
              title="FPGA Coprocessor Settings"
            >
              <Cpu className={`w-4 h-4 ${activeTab === 'fpga' ? 'animate-pulse' : ''}`} />
              <span className="text-[11px] font-bold tracking-widest uppercase font-mono">FPGA Settings</span>
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

      {/* Tab Navigation Menu */}
      <div className="border-b border-white/5 bg-slate-950 px-8 py-3.5 flex gap-6 z-30 relative">
        <button
          onClick={() => setActiveTab('soc')}
          className={`pb-1 text-xs font-bold tracking-[0.2em] transition-all border-b-2 uppercase font-mono ${
            activeTab === 'soc'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          Security Operations Center
        </button>
        <button
          onClick={() => setActiveTab('fpga')}
          className={`pb-1 text-xs font-bold tracking-[0.2em] transition-all border-b-2 uppercase font-mono ${
            activeTab === 'fpga'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          FPGA Coprocessor Settings
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'soc' ? (
          <>
            {/* Telemetry Severity Pie Chart */}
            <ThreatPieChart threatActive={threatActive} />

            {/* Main Grid: Map (2/3) + Threat Logs (1/3) */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Central Map Area */}
              <div className="xl:col-span-2 glass-card p-6 flex flex-col relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-900/10 rounded-full blur-3xl pointer-events-none"></div>
                <h2 className="text-sm font-semibold text-slate-100 mb-5 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  Global Threat Topography
                </h2>
                <div className="w-full h-[500px] bg-[#030712]/50 rounded-lg border border-white/5 overflow-hidden relative shadow-inner">
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

              {/* Side Column: Live Threat Logs */}
              <div className="space-y-6">
                <LogTicker threatLogs={threatLogs} onClearLogs={() => setThreatLogs([])} />
              </div>
            </div>

            {/* IT Control Panel */}
            <ITControlPanel />

            {/* Threat Simulation Button */}
            {!threatActive && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleThreatSimulation}
                  className="relative overflow-hidden group/sim bg-slate-800/50 border border-slate-700 hover:border-rose-500/50 text-slate-300 rounded-lg transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600/0 via-rose-500/10 to-rose-600/0 opacity-0 group-hover/sim:opacity-100 transition-opacity translate-x-[-100%] group-hover/sim:translate-x-[100%] duration-1000"></div>
                  <div className="relative px-8 py-4 flex items-center justify-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-rose-500 group-hover/sim:animate-pulse"></span>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase font-mono group-hover/sim:text-rose-400 transition-colors">Run Threat Simulation</span>
                  </div>
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* FPGA Inference Pipeline */}
            <FPGAPipeline threatActive={threatActive} />

            {/* FPGA Configurations & Gauges grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* FPGA Hardware Settings */}
              <div className="glass-card p-6 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-900/10 rounded-full blur-3xl pointer-events-none"></div>
                <h3 className="text-sm font-semibold text-slate-100 mb-6 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                  FPGA AI Acceleration Settings
                </h3>

                <div className="space-y-6">
                  {/* Model Selection Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">
                      Detection Model Select
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 font-mono text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 shadow-inner"
                    >
                      {models.map((m) => (
                        <option key={m} value={m} className="bg-slate-950 text-slate-100">{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sensitivity Range Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
                        Detection Sensitivity
                      </label>
                      <span className="text-sm font-bold text-cyan-400 font-mono">{sensitivity}/10</span>
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

                  {/* Push Config */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button
                      onClick={() => {
                        alert(`Deployed ${selectedModel} configuration with sensitivity level ${sensitivity} to FPGA device.`);
                      }}
                      className="px-4 py-3 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 text-xs font-bold tracking-wider uppercase transition-colors border border-emerald-800/50 hover:border-emerald-500/50 font-mono"
                    >
                      ▶ Deploy Config
                    </button>
                    <button
                      onClick={() => {
                        setSelectedModel('ATO Detection v2.4.1');
                        setSensitivity(7);
                        alert('Configuration rolled back to default state.');
                      }}
                      className="px-4 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-xs font-bold tracking-wider uppercase transition-colors border border-slate-700/50 font-mono"
                    >
                      ⮌ Rollback
                    </button>
                  </div>
                </div>

                {/* Diagnostics and Reset */}
                <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">Device Health Checks</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setDiagnosticResult('running');
                        setTimeout(() => {
                          setDiagnosticResult('✅ Diagnostics completed: All FPGA blocks fully healthy.');
                        }, 2000);
                      }}
                      disabled={diagnosticResult === 'running'}
                      className="px-4 py-3 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 text-xs font-bold tracking-wider uppercase transition-colors border border-cyan-800/50 hover:border-cyan-500/50 font-mono"
                    >
                      {diagnosticResult === 'running' ? '⏳ Testing...' : '🔧 Run Diagnostics'}
                    </button>
                    <button
                      onClick={() => setShowResetDialog(true)}
                      className="px-4 py-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 text-xs font-bold tracking-wider uppercase transition-colors border border-rose-800/50 hover:border-rose-500/50 font-mono"
                    >
                      🔄 Reset Appliance
                    </button>
                  </div>

                  {diagnosticResult && diagnosticResult !== 'running' && (
                    <div className="p-3 bg-emerald-950/30 border border-emerald-800/30 rounded-lg text-xs text-emerald-300 font-mono">
                      {diagnosticResult}
                    </div>
                  )}
                </div>
              </div>

              {/* FPGA Hardware Metrics Monitor */}
              <div className="glass-card p-6 relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl pointer-events-none"></div>
                <h3 className="text-sm font-semibold text-slate-100 mb-6 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  Hardware Telemetry Monitor
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="bg-slate-900/40 border border-slate-700/30 p-4 rounded-lg flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Device State</span>
                    <span className="text-base font-bold text-emerald-400 mt-2 font-mono flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      {fpgaMetrics.status}
                    </span>
                  </div>
                  {/* Temperature */}
                  <div className="bg-slate-900/40 border border-slate-700/30 p-4 rounded-lg flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Temperature</span>
                    <span className={`text-base font-bold mt-2 font-mono ${
                      fpgaMetrics.temperature < 75 ? 'text-emerald-400' :
                      fpgaMetrics.temperature < 85 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {fpgaMetrics.temperature.toFixed(1)}°C
                    </span>
                  </div>
                  {/* Latency */}
                  <div className="bg-slate-900/40 border border-slate-700/30 p-4 rounded-lg flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Inference Latency</span>
                    <span className="text-base font-bold text-cyan-400 mt-2 font-mono">
                      {fpgaMetrics.latency.toFixed(2)}ms
                    </span>
                  </div>
                  {/* Throughput */}
                  <div className="bg-slate-900/40 border border-slate-700/30 p-4 rounded-lg flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Throughput</span>
                    <span className="text-base font-bold text-amber-400 mt-2 font-mono">
                      {fpgaMetrics.throughput.toFixed(0)}K req/s
                    </span>
                  </div>
                  {/* BRAM Usage Bar */}
                  <div className="bg-slate-900/40 border border-slate-700/30 p-4 rounded-lg col-span-2 space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                      <span>BRAM Utilization</span>
                      <span className="text-purple-400 font-bold">{fpgaMetrics.memory}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${fpgaMetrics.memory}%` }}
                      />
                    </div>
                  </div>
                  {/* Packet Loss */}
                  <div className="bg-slate-900/40 border border-slate-700/30 p-4 rounded-lg flex justify-between items-center col-span-2 text-xs font-mono">
                    <span className="text-slate-500 uppercase tracking-wider">Packet Loss Ratio</span>
                    <span className="font-bold text-slate-200">{(fpgaMetrics.packetLoss * 100).toFixed(3)}%</span>
                  </div>
                  {/* Uptime */}
                  <div className="bg-slate-900/40 border border-slate-700/30 p-4 rounded-lg flex justify-between items-center col-span-2 text-xs font-mono">
                    <span className="text-slate-500 uppercase tracking-wider">Device Uptime</span>
                    <span className="font-bold text-slate-200">{fpgaMetrics.uptime.days}d {fpgaMetrics.uptime.hours}h</span>
                  </div>
                </div>

                {/* Load simulation controller */}
                <div className="mt-8 pt-4 border-t border-white/5">
                  <button
                    onClick={() => setIsLoading(!isLoading)}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider font-mono transition-all border ${
                      isLoading
                        ? 'bg-rose-950/40 text-rose-300 border-rose-800 hover:bg-rose-900/40 hover:border-rose-600/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                        : 'bg-amber-950/40 text-amber-300 border-amber-800 hover:bg-amber-900/40 hover:border-amber-600/50'
                    }`}
                  >
                    {isLoading ? '⏹ Terminate Load Simulation' : '▶ Initiate FPGA Load Simulation'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
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
                onClick={() => {
                  setFpgaMetrics({
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
                  alert('✅ FPGA Device has been reset successfully.');
                }}
                className="flex-1 py-2 px-4 rounded-lg bg-rose-900 text-rose-100 hover:bg-rose-800 transition-colors font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
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
