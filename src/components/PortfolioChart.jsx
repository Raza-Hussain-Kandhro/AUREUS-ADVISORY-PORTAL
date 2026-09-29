import React, { useId, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { smoothPath, toChartPoints } from '../utils/path.js';

const RANGES = ['1M', '3M', '1Y', 'All'];
const CHART_WIDTH = 640;
const CHART_HEIGHT = 220;

/**
 * @param {{ history: { date: string, value: number }[] }} props
 * history is the full available series; we slice it per selected range so
 * the demo works from a single dataset without extra network calls.
 */
export default function PortfolioChart({ history }) {
  const [range, setRange] = useState('1Y');
  const gradientId = useId();

  const series = useMemo(() => {
    if (!history?.length) return [];
    const slices = { '1M': 4, '3M': 8, '1Y': history.length, All: history.length };
    const count = slices[range] ?? history.length;
    return history.slice(-count);
  }, [history, range]);

  const points = useMemo(
    () => toChartPoints(series, CHART_WIDTH, CHART_HEIGHT),
    [series]
  );
  const linePath = useMemo(() => smoothPath(points), [points]);
  const areaPath = useMemo(() => {
    if (!points.length) return '';
    const last = points[points.length - 1];
    const first = points[0];
    return `${smoothPath(points)} L ${last[0]},${CHART_HEIGHT} L ${first[0]},${CHART_HEIGHT} Z`;
  }, [points]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-platinum">Historical performance</h3>

        {/* Haptic-feel toggle: a sliding pill behind the active label */}
        <div className="relative flex rounded-full border border-white/10 bg-white/[0.02] p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="relative z-10 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-300"
              style={{ color: range === r ? '#0B0F19' : '#9CA3AF' }}
            >
              {range === r && (
                <motion.span
                  layoutId="range-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-gold"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-4 h-[220px] w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Fine horizontal guide lines */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1="0"
              x2={CHART_WIDTH}
              y1={CHART_HEIGHT * f}
              y2={CHART_HEIGHT * f}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          ))}

          {/* Gradient fill fades in after the line finishes drawing */}
          <motion.path
            key={`area-${range}`}
            d={areaPath}
            fill={`url(#${gradientId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* The spline itself draws left to right */}
          <motion.path
            key={`line-${range}`}
            d={linePath}
            fill="none"
            stroke="#34D399"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          />

          {points.length > 0 && (
            <motion.circle
              cx={points[points.length - 1][0]}
              cy={points[points.length - 1][1]}
              r="4.5"
              fill="#34D399"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.35, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </svg>
      </div>
    </div>
  );
}
