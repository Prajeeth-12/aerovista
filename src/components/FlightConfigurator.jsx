import React, { useState } from 'react';
import { ROUTES, AIRPORTS } from '../lib/airports';
import { Clock, Sparkles, Sun, Sunset, CloudOff } from 'lucide-react';

const PREFERENCES = [
  { id: 'scenic', label: 'Scenic', icon: Sparkles },
  { id: 'sunrise', label: 'Sunrise', icon: Sun },
  { id: 'sunset', label: 'Sunset', icon: Sunset },
  { id: 'shade', label: 'Shade', icon: CloudOff },
];

export function FlightConfigurator({ onCalculate }) {
  const [routeId, setRouteId] = useState(ROUTES[0].id);
  const [time, setTime] = useState('06:00');
  const [preference, setPreference] = useState('scenic');

  const handleCalculate = () => {
    const route = ROUTES.find(r => r.id === routeId);
    if (!route) return;
    const origin = AIRPORTS[route.origin];
    const dest = AIRPORTS[route.dest];
    const [hours, mins] = time.split(':');
    const d = new Date();
    d.setUTCHours(parseInt(hours), parseInt(mins), 0, 0);
    onCalculate({ origin, dest, startTime: d, preference });
  };

  const selectedRoute = ROUTES.find(r => r.id === routeId);

  return (
    <div className="card noise flex flex-col">
      {/* Section: Route */}
      <div className="px-4 pt-4 pb-3 flex flex-col gap-1.5">
        <label className="label">Route</label>
        <select
          className="select-input"
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
        >
          {ROUTES.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        {selectedRoute && (
          <span className="text-[11px] text-[var(--color-text-muted)] leading-tight">{selectedRoute.subtitle}</span>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-[var(--color-border)]" />

      {/* Section: Time */}
      <div className="px-4 py-3 flex flex-col gap-1.5">
        <label className="label flex items-center gap-1.5">
          <Clock size={10} className="opacity-60" />
          Departure (UTC)
        </label>
        <input
          type="time"
          className="input font-[var(--font-mono)] text-[13px]"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-[var(--color-border)]" />

      {/* Section: Preference */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <label className="label">View preference</label>
        <div className="grid grid-cols-4 gap-1.5">
          {PREFERENCES.map(pref => {
            const Icon = pref.icon;
            const isActive = preference === pref.id;
            return (
              <button
                key={pref.id}
                onClick={() => setPreference(pref.id)}
                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-semibold cursor-pointer transition-all border ${
                  isActive
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                {pref.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action */}
      <div className="px-4 pb-4 pt-1">
        <button className="btn btn-primary w-full" onClick={handleCalculate}>
          <Sparkles size={14} />
          Analyze Flight
        </button>
      </div>
    </div>
  );
}
