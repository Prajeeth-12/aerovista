import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { FlightConfigurator } from './components/FlightConfigurator';
import { MapVisualizer } from './components/MapVisualizer';
import { SeatMap } from './components/SeatMap';
import { RecommendationBanner } from './components/RecommendationBanner';
import { SolarTimeline } from './components/SolarTimeline';
import { JourneyLogger } from './components/JourneyLogger';
import { generateGreatCircle } from './lib/solar-engine';
import { recommendSeatSide } from './lib/scenic-calculator';
import { ROUTES, AIRPORTS } from './lib/airports';
import './index.css';

function App() {
  const [flightData, setFlightData] = useState(null);
  const [activeTab, setActiveTab] = useState('map');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('aerovista-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('aerovista-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleCalculate = useCallback(({ origin, dest, startTime, preference }) => {
    const waypoints = generateGreatCircle(origin.lat, origin.lng, dest.lat, dest.lng, 100);
    const recommendation = recommendSeatSide(waypoints, startTime, preference);
    setFlightData({ waypoints, recommendation });
  }, []);

  useEffect(() => {
    const defaultRoute = ROUTES[0];
    const origin = AIRPORTS[defaultRoute.origin];
    const dest = AIRPORTS[defaultRoute.dest];
    const d = new Date();
    d.setUTCHours(6, 0, 0, 0);
    handleCalculate({ origin, dest, startTime: d, preference: 'scenic' });
  }, [handleCalculate]);

  return (
    <div className="flex flex-col h-screen bg-[var(--color-bg)]">
      <Header activeTab={activeTab} onTabChange={setActiveTab} isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />

      <div className="flex flex-1 gap-0 min-h-0 app-layout">
        {/* Sidebar */}
        <aside className="w-[310px] flex-shrink-0 flex flex-col gap-2.5 overflow-y-auto p-2.5 border-r border-[var(--color-border)] bg-[var(--color-bg)] app-sidebar">
          <FlightConfigurator onCalculate={handleCalculate} />
          <SeatMap recommendation={flightData?.recommendation} />
          <RecommendationBanner recommendation={flightData?.recommendation} />
        </aside>

        {/* Main stage */}
        <main className="flex-1 flex flex-col min-h-0 p-3">
          <AnimatePresence mode="wait">
            {activeTab === 'map' && (
              <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col min-h-0">
                <MapVisualizer waypoints={flightData?.waypoints} recommendation={flightData?.recommendation} isDark={isDark} />
              </motion.div>
            )}
            {activeTab === 'timeline' && (
              <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col min-h-0">
                <SolarTimeline recommendation={flightData?.recommendation} />
              </motion.div>
            )}
            {activeTab === 'journey' && (
              <motion.div key="journey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col min-h-0">
                <JourneyLogger />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
