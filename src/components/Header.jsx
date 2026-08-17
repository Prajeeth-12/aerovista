import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Map, Clock, BookOpen, Sun, Moon } from 'lucide-react';

const TABS = [
  { id: 'map', label: 'Map', icon: Map },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'journey', label: 'Journey', icon: BookOpen },
];

export function Header({ activeTab, onTabChange, isDark, onToggleTheme }) {
  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)]">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <Plane className="text-white" size={16} strokeWidth={2.5} />
          </div>
          <span className="text-base font-semibold font-[var(--font-display)] tracking-tight text-[var(--color-text)]">
            AeroVista
          </span>
        </div>

        <nav className="flex items-center gap-0.5 ml-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-colors ${
                  isActive
                    ? 'text-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-inset)]'
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <button
        onClick={onToggleTheme}
        className="btn w-8 h-8 !p-0 !border-0 !bg-transparent"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <Sun size={16} className="text-[var(--color-text-secondary)]" /> : <Moon size={16} className="text-[var(--color-text-secondary)]" />}
      </button>
    </header>
  );
}
