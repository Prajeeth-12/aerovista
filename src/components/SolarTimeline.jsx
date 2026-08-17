import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export function SolarTimeline({ recommendation }) {
  if (!recommendation || !recommendation.timeline) {
    return (
      <div className="flex-1 flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <p className="text-[var(--color-text-muted)] text-sm">Analyze a flight to see the solar timeline</p>
      </div>
    );
  }

  const { timeline, flightDurationHours, winner } = recommendation;
  const totalPoints = timeline.length;

  const svgWidth = 800;
  const svgHeight = 180;
  const padding = { top: 24, bottom: 44, left: 36, right: 36 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const elevationPath = useMemo(() => {
    const points = timeline.map((t, i) => {
      const x = padding.left + (i / (totalPoints - 1)) * chartWidth;
      const norm = (t.sun.elevation + 10) / 100;
      const y = padding.top + chartHeight - Math.max(0, norm) * chartHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  }, [timeline, totalPoints, chartWidth, chartHeight]);

  const areaPath = useMemo(() => {
    const baseline = padding.top + chartHeight;
    const points = timeline.map((t, i) => {
      const x = padding.left + (i / (totalPoints - 1)) * chartWidth;
      const norm = (t.sun.elevation + 10) / 100;
      const y = padding.top + chartHeight - Math.max(0, norm) * chartHeight;
      return `${x},${y}`;
    });
    return `M ${padding.left},${baseline} L ${points.join(' L ')} L ${padding.left + chartWidth},${baseline} Z`;
  }, [timeline, totalPoints, chartWidth, chartHeight]);

  const formatHour = (index) => {
    const t = timeline[index]?.time;
    if (!t) return '';
    return `${t.getUTCHours().toString().padStart(2, '0')}:${t.getUTCMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)]">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Sun Elevation</h3>
        <div className="flex items-center gap-3 text-[10px] text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 rounded bg-[var(--color-sun)] inline-block"></span>Elevation</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[var(--color-left)] inline-block"></span>Left</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[var(--color-right)] inline-block"></span>Right</span>
        </div>
      </div>

      <div className="flex-1 p-3">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="elev-fill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-sun)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--color-sun)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizon */}
          <line
            x1={padding.left} y1={padding.top + chartHeight - (10 / 100) * chartHeight}
            x2={padding.left + chartWidth} y2={padding.top + chartHeight - (10 / 100) * chartHeight}
            stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3,3"
          />

          {/* Area */}
          <path d={areaPath} fill="url(#elev-fill)" />

          {/* Line */}
          <motion.path
            d={elevationPath} fill="none" stroke="var(--color-sun)" strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Left/Right band */}
          {timeline.map((t, i) => {
            const x = padding.left + (i / totalPoints) * chartWidth;
            const w = Math.max(chartWidth / totalPoints, 1);
            const color = t.sunSide === 'left' ? 'var(--color-left)' : t.sunSide === 'right' ? 'var(--color-right)' : 'var(--color-border)';
            return <rect key={i} x={x} y={svgHeight - 18} width={w} height={6} fill={color} opacity={0.7} rx={1} />;
          })}

          {/* Labels */}
          <text x={padding.left} y={svgHeight - 4} fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">
            {formatHour(0)}
          </text>
          <text x={padding.left + chartWidth / 2} y={svgHeight - 4} fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">
            {flightDurationHours}h
          </text>
          <text x={padding.left + chartWidth} y={svgHeight - 4} fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">
            {formatHour(totalPoints - 1)}
          </text>
        </svg>
      </div>
    </motion.div>
  );
}
