import React from 'react';
import { motion } from 'framer-motion';

const ROWS = 8;

export function SeatMap({ recommendation }) {
  const winner = recommendation?.winner;

  return (
    <div className="card noise flex flex-col">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <h3 className="text-[12px] font-semibold text-[var(--color-text)] font-[var(--font-display)] uppercase tracking-wide">
          Cabin View
        </h3>
        {winner && (
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest"
            style={{
              color: winner === 'left' ? 'var(--color-left)' : 'var(--color-right)',
              background: `color-mix(in srgb, ${winner === 'left' ? 'var(--color-left)' : 'var(--color-right)'} 12%, transparent)`,
              border: `1px solid color-mix(in srgb, ${winner === 'left' ? 'var(--color-left)' : 'var(--color-right)'} 20%, transparent)`,
            }}
          >
            {winner === 'left' ? 'Port' : 'Starboard'}
          </span>
        )}
      </div>

      {!recommendation ? (
        <div className="flex items-center justify-center py-10 px-4 text-[var(--color-text-muted)] text-[11px]">
          Run analysis to see recommendation
        </div>
      ) : (
        <div className="flex flex-col items-center px-4 pb-4">
          {/* Port / Starboard labels */}
          <div className="flex justify-between w-full max-w-[160px] mb-2 text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.12em]">
            <span className={winner === 'left' ? '!text-[var(--color-left)]' : ''}>
              Port
            </span>
            <span className={winner === 'right' ? '!text-[var(--color-right)]' : ''}>
              Stbd
            </span>
          </div>

          {/* Aircraft */}
          <div className="w-[130px]">
            <svg viewBox="0 0 130 220" className="w-full h-auto">
              {/* Fuselage */}
              <path
                d="M 65 6 C 40 6 27 26 27 42 L 27 190 C 27 202 40 210 65 210 C 90 210 103 202 103 190 L 103 42 C 103 26 90 6 65 6 Z"
                fill="var(--color-bg-inset)"
                stroke="var(--color-border-strong)"
                strokeWidth="1.5"
              />
              {/* Cockpit */}
              <ellipse cx="65" cy="20" rx="11" ry="7" fill="var(--color-bg-elevated)" stroke="var(--color-border-strong)" strokeWidth="1" />
              {/* Aisle */}
              <rect x="60" y="32" width="10" height="168" rx="5" fill="var(--color-bg)" opacity="0.3" />

              {/* Seats */}
              {Array.from({ length: ROWS }).map((_, row) => (
                <g key={row}>
                  {/* Left */}
                  {[0, 1, 2].map((ci) => {
                    const x = 32 + ci * 10;
                    const y = 36 + row * 21;
                    const isWindow = ci === 0;
                    const highlight = winner === 'left' && isWindow;
                    return (
                      <motion.rect
                        key={`l-${row}-${ci}`}
                        x={x} y={y} width={8} height={15} rx={2}
                        fill={highlight ? 'var(--color-left)' : 'var(--color-border-strong)'}
                        opacity={highlight ? 1 : 0.4}
                        className={highlight ? 'seat-recommended' : ''}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: highlight ? 1 : 0.4 }}
                        transition={{ delay: row * 0.03 }}
                      />
                    );
                  })}
                  {/* Right */}
                  {[0, 1, 2].map((ci) => {
                    const x = 80 + ci * 10;
                    const y = 36 + row * 21;
                    const isWindow = ci === 2;
                    const highlight = winner === 'right' && isWindow;
                    return (
                      <motion.rect
                        key={`r-${row}-${ci}`}
                        x={x} y={y} width={8} height={15} rx={2}
                        fill={highlight ? 'var(--color-right)' : 'var(--color-border-strong)'}
                        opacity={highlight ? 1 : 0.4}
                        className={highlight ? 'seat-recommended' : ''}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: highlight ? 1 : 0.4 }}
                        transition={{ delay: row * 0.03 }}
                      />
                    );
                  })}
                  {/* Row number */}
                  <text x="65" y={47 + row * 21} textAnchor="middle" fill="var(--color-text-muted)" fontSize="6" fontFamily="var(--font-mono)" opacity="0.5">
                    {row + 1}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
