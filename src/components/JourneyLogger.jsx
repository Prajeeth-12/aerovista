import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Download, ChevronDown, ChevronRight, Code, Lightbulb, Wrench, Sparkles } from 'lucide-react';
import { JOURNEY_ENTRIES } from '../lib/journey-data';

const PHASE_ICONS = { Architecture: Code, Design: Lightbulb, Implementation: Wrench, Iteration: Sparkles, Polish: Sparkles };

export function JourneyLogger() {
  const [entries] = useState(JOURNEY_ENTRIES);
  const [expandedId, setExpandedId] = useState(null);

  const exportMarkdown = () => {
    let md = '# AeroVista — Development Journey Log\n\n';
    md += `> Generated: ${new Date().toISOString().split('T')[0]}\n\n---\n\n`;
    const phases = [...new Set(entries.map(e => e.phase))];
    phases.forEach(phase => {
      md += `## ${phase}\n\n`;
      entries.filter(e => e.phase === phase).forEach(entry => {
        md += `### ${entry.title}\n*${new Date(entry.timestamp).toLocaleString()}*\n\n${entry.content}\n\n---\n\n`;
      });
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aerovista-journey-log.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)]">
        <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
          <BookOpen size={14} />
          Development Journey
        </h3>
        <button onClick={exportMarkdown} className="btn text-xs !py-1 !px-2.5">
          <Download size={12} />
          Export
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
        {entries.map((entry, index) => {
          const Icon = PHASE_ICONS[entry.phase] || Code;
          const isExpanded = expandedId === entry.id;
          return (
            <div
              key={entry.id}
              className="rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer"
              >
                <Icon size={13} className="text-[var(--color-accent)] flex-shrink-0" />
                <span className="text-sm font-medium text-[var(--color-text)] flex-1 truncate">{entry.title}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--color-bg-inset)] text-[var(--color-text-muted)] uppercase font-medium flex-shrink-0">
                  {entry.phase}
                </span>
                {isExpanded ? <ChevronDown size={13} className="text-[var(--color-text-muted)]" /> : <ChevronRight size={13} className="text-[var(--color-text-muted)]" />}
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-3 pb-2.5 pt-0">
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5 font-[var(--font-mono)]">{new Date(entry.timestamp).toLocaleString()}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
