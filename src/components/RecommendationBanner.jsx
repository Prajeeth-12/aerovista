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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-[14px] overflow-hidden border border-[var(--color-border)] shadow-[var(--color-shadow)]"
    >
      {/* Diagonal split background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: isLeft
              ? `linear-gradient(135deg, var(--color-left) 0%, var(--color-left) 48%, var(--color-right) 52%, var(--color-right) 100%)`
              : `linear-gradient(135deg, var(--color-right) 0%, var(--color-right) 48%, var(--color-left) 52%, var(--color-left) 100%)`,
            opacity: 0.08,
          }}
        />
        <div className="absolute inset-0 bg-[var(--color-bg-elevated)] opacity-90" />
      </div>

      {/* Content */}
      <div className="relative p-4 flex flex-col gap-3">
        {/* Main recommendation */}
        <div className="flex items-center gap-3">
          {/* Confidence badge */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border"
            style={{
              borderColor: isLeft ? 'var(--color-left)' : 'var(--color-right)',
              background: `color-mix(in srgb, ${isLeft ? 'var(--color-left)' : 'var(--color-right)'} 8%, transparent)`,
            }}
          >
            <span
              className="text-base font-bold font-[var(--font-mono)]"
              style={{ color: isLeft ? 'var(--color-left)' : 'var(--color-right)' }}
            >
              {displayConfidence}%
            </span>
          </div>

          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              {isLeft ? (
                <ArrowLeft size={16} style={{ color: 'var(--color-left)' }} strokeWidth={2.5} />
              ) : (
                <ArrowRight size={16} style={{ color: 'var(--color-right)' }} strokeWidth={2.5} />
              )}
              <span
                className="text-lg font-bold font-[var(--font-display)] tracking-tight"
                style={{ color: isLeft ? 'var(--color-left)' : 'var(--color-right)' }}
              >
                Sit {recommendation.winner}
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)] leading-snug">
              {recommendation.reasoning}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-[var(--color-border)]">
          <Stat label="Distance" value={`${recommendation.distanceKm?.toLocaleString()} km`} mono />
          <Stat label="Duration" value={`${recommendation.flightDurationHours}h`} mono />
          <Stat label="Mode" value={recommendation.preference} />
        </div>
      </div>

      {/* Accent bar on winning side */}
      <div
        className="absolute top-0 bottom-0 w-[3px]"
        style={{
          [isLeft ? 'left' : 'right']: 0,
          background: isLeft ? 'var(--color-left)' : 'var(--color-right)',
        }}
      />
    </motion.div>
  );
}

function Stat({ label, value, mono }) {
  return (
    <div className="text-center">
      <div className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{label}</div>
      <div className={`text-xs font-semibold text-[var(--color-text)] mt-0.5 capitalize ${mono ? 'font-[var(--font-mono)]' : ''}`}>
        {value}
      </div>
    </div>
  );
}
