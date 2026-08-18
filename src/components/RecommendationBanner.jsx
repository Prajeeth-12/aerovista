import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function RecommendationBanner({ recommendation }) {
  const [displayConfidence, setDisplayConfidence] = useState(0);

  useEffect(() => {
    if (!recommendation) return;
    setDisplayConfidence(0);
    const target = recommendation.confidence;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 800, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayConfidence(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [recommendation]);

  if (!recommendation) return null;

  const isLeft = recommendation.winner === 'left';
  const color = isLeft ? 'var(--color-left)' : 'var(--color-right)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card noise flex flex-col"
    >
      {/* Accent bar */}
      <div className="h-[3px] w-full rounded-t-[14px]" style={{ background: color }} />

      {/* Recommendation */}
      <div className="px-4 pt-3 pb-3 flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1.5px solid color-mix(in srgb, ${color} 25%, transparent)` }}
        >
          <span className="text-[13px] font-bold font-[var(--font-mono)]" style={{ color }}>
            {displayConfidence}%
          </span>
        </div>

        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-1.5">
            {isLeft ? <ArrowLeft size={14} style={{ color }} strokeWidth={2.5} /> : <ArrowRight size={14} style={{ color }} strokeWidth={2.5} />}
            <span className="text-[15px] font-bold font-[var(--font-display)]" style={{ color }}>
              Sit {recommendation.winner}
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
            {recommendation.reasoning}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-[var(--color-border)]" />

      {/* Stats */}
      <div className="px-4 py-2.5 grid grid-cols-3">
        <Stat label="Distance" value={`${recommendation.distanceKm?.toLocaleString()} km`} mono />
        <Stat label="Duration" value={`${recommendation.flightDurationHours}h`} mono />
        <Stat label="Mode" value={recommendation.preference} />
      </div>
    </motion.div>
  );
}

function Stat({ label, value, mono }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[9px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.08em]">{label}</span>
      <span className={`text-[12px] font-semibold text-[var(--color-text)] capitalize ${mono ? 'font-[var(--font-mono)]' : ''}`}>
        {value}
      </span>
    </div>
  );
}
