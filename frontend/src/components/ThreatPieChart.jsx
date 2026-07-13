import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

/**
 * ThreatPieChart Component
 * Renders a high-fidelity ECharts Doughnut/Pie chart for telemetry severity.
 * @param {boolean} threatActive - Determines active telemetry load
 */
export function ThreatPieChart({ threatActive = false }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize ECharts
    chartInstance.current = echarts.init(chartRef.current, null, { renderer: 'canvas' });

    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;

    const criticalVal = threatActive ? 42 : 12;
    const highVal = threatActive ? 68 : 34;
    const mediumVal = threatActive ? 95 : 72;
    const nominalVal = threatActive ? 850 : 1240;

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: '#334155',
        borderWidth: 1,
        textStyle: { color: '#f8fafc', fontFamily: 'monospace' },
        formatter: (params) => {
          return `<div style="padding: 4px 8px;">
            <strong style="color: ${params.color}; font-size: 13px;">${params.name}</strong><br/>
            Count: <strong>${params.value}</strong><br/>
            Ratio: <strong>${params.percent}%</strong>
          </div>`;
        }
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          color: '#cbd5e1',
          fontSize: 10,
          fontFamily: 'monospace',
          fontWeight: '500'
        }
      },
      series: [
        {
          name: 'Telemetry Alerts',
          type: 'pie',
          radius: ['45%', '75%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#1e293b',
            borderWidth: 2,
            shadowBlur: 8,
            shadowColor: 'rgba(0, 0, 0, 0.4)'
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 13,
              fontWeight: 'bold',
              color: '#f8fafc',
              formatter: '{b}\n{d}%'
            },
            itemStyle: {
              shadowBlur: 15,
              shadowColor: 'rgba(255, 255, 255, 0.05)'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: criticalVal,
              name: 'CRITICAL',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                  { offset: 0, color: '#f43f5e' },
                  { offset: 1, color: '#be123c' }
                ])
              }
            },
            {
              value: highVal,
              name: 'HIGH',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                  { offset: 0, color: '#f97316' },
                  { offset: 1, color: '#c2410c' }
                ])
              }
            },
            {
              value: mediumVal,
              name: 'MEDIUM',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                  { offset: 0, color: '#eab308' },
                  { offset: 1, color: '#a16207' }
                ])
              }
            },
            {
              value: nominalVal,
              name: 'NOMINAL',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                  { offset: 0, color: '#10b981' },
                  { offset: 1, color: '#047857' }
                ])
              }
            }
          ]
        }
      ]
    };

    chartInstance.current.setOption(option);
  }, [threatActive]);

  return (
    <div className="glass-card p-6 mb-8 overflow-hidden relative">
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-900/10 rounded-full blur-3xl pointer-events-none"></div>
      <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
        Telemetry Event Classification
      </h3>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div ref={chartRef} className="w-full md:w-3/5 h-[160px]" />
        <div className="w-full md:w-2/5 grid grid-cols-2 gap-4 text-xs font-mono text-slate-400">
          <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-700/30">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Severity Status</p>
            <p className={`text-base font-bold mt-1 ${threatActive ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
              {threatActive ? 'WARN // ATO' : 'NOMINAL // SECURE'}
            </p>
          </div>
          <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-700/30">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Alerts</p>
            <p className="text-base font-bold text-slate-200 mt-1 font-sans">
              {threatActive ? 1055 : 1419}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
