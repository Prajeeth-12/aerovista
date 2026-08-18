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
    <header className="relative z-10 flex items-center justify-between px-5 py-2.5 bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)]">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[var(--color-accent)] flex items-center justify-center shadow-[0_2px_8px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]">
            <Plane className="text-white" size={14} strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold font-[var(--font-display)] tracking-tight text-[var(--color-text)]">
            AeroVista
          </span>
        </div>

        {/* Tabs with animated underline */}
        <nav className="flex items-center gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors ${
                  isActive
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="header-tab-underline"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-[var(--color-accent)] rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Theme toggle */}
      <button
        onClick={onToggleTheme}
        className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-[var(--color-bg-inset)] transition-colors"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? <Sun size={15} className="text-[var(--color-text-secondary)]" /> : <Moon size={15} className="text-[var(--color-text-secondary)]" />}
      </button>
    </header>
  );
}
