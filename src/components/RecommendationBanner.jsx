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
  const accentColor = isLeft ? 'var(--color-left)' : 'var(--color-right)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-4 flex flex-col gap-3"
    >
      {/* Main recommendation */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: `color-mix(in srgb, ${accentColor} 12%, transparent)` }}
        >
          <span className="text-sm font-bold font-[var(--font-mono)]" style={{ color: accentColor }}>
            {displayConfidence}%
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            {isLeft ? <ArrowLeft size={14} style={{ color: accentColor }} /> : <ArrowRight size={14} style={{ color: accentColor }} />}
            <span className="text-base font-semibold text-[var(--color-text)]" style={{ color: accentColor }}>
              Sit {recommendation.winner}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] leading-snug">
            {recommendation.reasoning}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--color-border)]">
        <div className="text-center">
          <div className="text-[10px] text-[var(--color-text-muted)] uppercase">Distance</div>
          <div className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-text)]">
            {recommendation.distanceKm?.toLocaleString()} km
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-[var(--color-text-muted)] uppercase">Duration</div>
          <div className="text-xs font-semibold font-[var(--font-mono)] text-[var(--color-text)]">
            {recommendation.flightDurationHours}h
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-[var(--color-text-muted)] uppercase">Mode</div>
          <div className="text-xs font-semibold text-[var(--color-text)] capitalize">
            {recommendation.preference}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
