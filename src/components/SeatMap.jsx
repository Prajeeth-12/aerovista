import React from 'react';
import { motion } from 'framer-motion';

const ROWS = 8;

export function SeatMap({ recommendation }) {
  const winner = recommendation?.winner;

  return (
    <div className="card noise p-4 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-[var(--color-text)]">Cabin View</h3>

      {!recommendation ? (
        <div className="flex items-center justify-center py-6 text-[var(--color-text-muted)] text-xs">
          Run analysis to see recommendation
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="flex justify-between w-full px-6 text-[10px] font-medium text-[var(--color-text-muted)] uppercase tracking-widest">
            <span className={winner === 'left' ? 'text-[var(--color-left)] font-semibold' : ''}>Port</span>
            <span className={winner === 'right' ? 'text-[var(--color-right)] font-semibold' : ''}>Starboard</span>
          </div>

          <div className="w-36">
            <svg viewBox="0 0 140 240" className="w-full h-auto">
              {/* Fuselage */}
              <path
                d="M 70 8 C 40 8 25 35 25 55 L 25 210 C 25 225 40 232 70 232 C 100 232 115 225 115 210 L 115 55 C 115 35 100 8 70 8 Z"
                fill="var(--color-bg-inset)"
                stroke="var(--color-border)"
                strokeWidth="1.5"
              />
              {/* Cockpit */}
              <ellipse cx="70" cy="26" rx="14" ry="8" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="1" />
              {/* Aisle */}
              <rect x="64" y="40" width="12" height="180" rx="6" fill="var(--color-bg)" opacity="0.5" />

              {/* Seats */}
              {Array.from({ length: ROWS }).map((_, row) => (
                <g key={row}>
                  {[0, 1, 2].map((ci) => {
                    const x = 32 + ci * 12;
                    const y = 45 + row * 22;
                    const isWindow = ci === 0;
                    const highlight = winner === 'left' && isWindow;
                    return (
                      <motion.rect
                        key={`l-${row}-${ci}`}
                        x={x} y={y} width={10} height={16} rx={2.5}
                        fill={highlight ? 'var(--color-left)' : 'var(--color-border)'}
                        opacity={highlight ? 1 : 0.5}
                        className={highlight ? 'seat-recommended' : ''}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: highlight ? 1 : 0.5 }}
                        transition={{ delay: row * 0.03 }}
                      />
                    );
                  })}
                  {[0, 1, 2].map((ci) => {
                    const x = 86 + ci * 12;
                    const y = 45 + row * 22;
                    const isWindow = ci === 2;
                    const highlight = winner === 'right' && isWindow;
                    return (
                      <motion.rect
                        key={`r-${row}-${ci}`}
                        x={x} y={y} width={10} height={16} rx={2.5}
                        fill={highlight ? 'var(--color-right)' : 'var(--color-border)'}
                        opacity={highlight ? 1 : 0.5}
                        className={highlight ? 'seat-recommended' : ''}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: highlight ? 1 : 0.5 }}
                        transition={{ delay: row * 0.03 }}
                      />
                    );
                  })}
                  <text x="70" y={56 + row * 22} textAnchor="middle" fill="var(--color-text-muted)" fontSize="7" fontFamily="var(--font-mono)">
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
