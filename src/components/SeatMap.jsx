import React from 'react';
import { motion } from 'framer-motion';

const ROWS = 8;

export function SeatMap({ recommendation }) {
  const winner = recommendation?.winner;

  return (
    <div className="card noise p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-[var(--color-text)] font-[var(--font-display)]">Cabin View</h3>
        {winner && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider"
            style={{
              color: winner === 'left' ? 'var(--color-left)' : 'var(--color-right)',
              background: `color-mix(in srgb, ${winner === 'left' ? 'var(--color-left)' : 'var(--color-right)'} 10%, transparent)`,
            }}>
            {winner === 'left' ? 'Port' : 'Starboard'}
          </span>
        )}
      </div>

      {!recommendation ? (
        <div className="flex items-center justify-center py-8 text-[var(--color-text-muted)] text-xs">
          Run analysis to see recommendation
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Port / Starboard labels */}
          <div className="flex justify-between w-full px-8 mb-1 text-[9px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.1em]">
            <span className={winner === 'left' ? 'text-[var(--color-left)]' : ''}>Port</span>
            <span className={winner === 'right' ? 'text-[var(--color-right)]' : ''}>Stbd</span>
          </div>

          <div className="w-[140px]">
            <svg viewBox="0 0 140 230" className="w-full h-auto">
              {/* Fuselage */}
              <path
                d="M 70 6 C 42 6 28 30 28 48 L 28 200 C 28 214 42 222 70 222 C 98 222 112 214 112 200 L 112 48 C 112 30 98 6 70 6 Z"
                fill="var(--color-bg-inset)"
                stroke="var(--color-border)"
                strokeWidth="1.5"
              />
              {/* Cockpit */}
              <ellipse cx="70" cy="22" rx="12" ry="7" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="1" />
              {/* Aisle */}
              <rect x="65" y="36" width="10" height="175" rx="5" fill="var(--color-bg)" opacity="0.4" />

              {/* Seats */}
              {Array.from({ length: ROWS }).map((_, row) => (
                <g key={row}>
                  {/* Left 3 seats */}
                  {[0, 1, 2].map((ci) => {
                    const x = 34 + ci * 11;
                    const y = 40 + row * 22;
                    const isWindow = ci === 0;
                    const highlight = winner === 'left' && isWindow;
                    return (
                      <motion.rect
                        key={`l-${row}-${ci}`}
                        x={x} y={y} width={9} height={16} rx={2.5}
                        fill={highlight ? 'var(--color-left)' : 'var(--color-border-strong)'}
                        opacity={highlight ? 1 : 0.45}
                        className={highlight ? 'seat-recommended' : ''}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: highlight ? 1 : 0.45 }}
                        transition={{ delay: row * 0.03 }}
                      />
                    );
                  })}
                  {/* Right 3 seats */}
                  {[0, 1, 2].map((ci) => {
                    const x = 86 + ci * 11;
                    const y = 40 + row * 22;
                    const isWindow = ci === 2;
                    const highlight = winner === 'right' && isWindow;
                    return (
                      <motion.rect
                        key={`r-${row}-${ci}`}
                        x={x} y={y} width={9} height={16} rx={2.5}
                        fill={highlight ? 'var(--color-right)' : 'var(--color-border-strong)'}
                        opacity={highlight ? 1 : 0.45}
                        className={highlight ? 'seat-recommended' : ''}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: highlight ? 1 : 0.45 }}
                        transition={{ delay: row * 0.03 }}
                      />
                    );
                  })}
                  {/* Row number */}
                  <text x="70" y={52 + row * 22} textAnchor="middle" fill="var(--color-text-muted)" fontSize="7" fontFamily="var(--font-mono)" opacity="0.6">
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
