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
    <div className="card noise p-5 flex flex-col gap-5">
      {/* Route */}
      <div className="flex flex-col gap-1.5">
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
          <span className="text-[11px] text-[var(--color-text-muted)] mt-0.5 pl-0.5">{selectedRoute.subtitle}</span>
        )}
      </div>

      {/* Departure time */}
      <div className="flex flex-col gap-1.5">
        <label className="label flex items-center gap-1">
          <Clock size={10} />
          Departure (UTC)
        </label>
        <input
          type="time"
          className="input font-[var(--font-mono)] text-sm"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      {/* Preference */}
      <div className="flex flex-col gap-2">
        <label className="label">View preference</label>
        <div className="grid grid-cols-4 gap-1.5">
          {PREFERENCES.map(pref => {
            const Icon = pref.icon;
            const isActive = preference === pref.id;
            return (
              <button
                key={pref.id}
                onClick={() => setPreference(pref.id)}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg text-[11px] font-medium cursor-pointer transition-all border ${
                  isActive
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-inset)]'
                }`}
              >
                <Icon size={15} />
                {pref.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Analyze button */}
      <button className="btn btn-primary w-full" onClick={handleCalculate}>
        <Sparkles size={14} />
        Analyze Flight
      </button>
    </div>
  );
}
