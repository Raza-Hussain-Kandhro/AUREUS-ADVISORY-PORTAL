import React from 'react';
import { CheckCircle2, FileText } from 'lucide-react';

/**
 * @param {{ title: string, category: string, date: string, cachedOffline?: boolean }} props
 */
export default function ResearchCard({ title, category, date, cachedOffline }) {
  return (
    <div className="glass-panel glass-panel-hover flex w-64 shrink-0 snap-start flex-col justify-between p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-platinum-muted">
          <FileText className="h-4 w-4" strokeWidth={1.75} />
        </div>
        {cachedOffline && (
          <span
            title="Available offline"
            className="flex items-center gap-1 text-[11px] text-emerald-soft"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-medium text-gold-dim">{category}</p>
        <h4 className="mt-1.5 font-display text-base leading-snug text-platinum">{title}</h4>
        <p className="mt-3 text-xs text-platinum-faint">{date}</p>
      </div>
    </div>
  );
}
